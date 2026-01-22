export const dynamic = "force-dynamic";
export const revalidate = 0;

import { put } from '@vercel/blob';

const BLOB_URL = 'https://pbrf2lbsymd1vwdw.public.blob.vercel-storage.com/status-v2.json';

async function getData() {
  try {
    const response = await fetch(BLOB_URL + '?t=' + Date.now(), { cache: 'no-store' });
    if (response.ok) {
      return await response.json();
    }
  } catch (e) {
    console.error('getData error:', e);
  }
  return null;
}

export async function POST(request) {
  try {
    const newData = await request.json();
    let tankData = await getData();
    
    if (!tankData) {
      return Response.json({ success: false, error: 'Could not read existing data' }, { status: 500 });
    }
    
    if (newData.devices) {
      tankData.devices = tankData.devices || {};
      Object.keys(newData.devices).forEach(key => {
        const value = newData.devices[key];
        tankData.devices[key] = { 
          status: value === true || value === 'on' ? 'on' : 'off' 
        };
      });
    }
    
    if (newData.sensors) {
      tankData.sensors = { ...tankData.sensors, ...newData.sensors };
    }
    
    if (newData.ai) {
      tankData.ai = tankData.ai || { history: [] };
      tankData.ai.lastComment = newData.ai.comment || tankData.ai.lastComment;
      tankData.ai.shortSummary = newData.ai.shortSummary || tankData.ai.shortSummary;
      tankData.ai.timestamp = new Date().toISOString();
    }
    
    if (newData.health) {
      tankData.health = newData.health;
    }

    if (newData.log) {
      tankData.ai = tankData.ai || { history: [] };
      tankData.ai.history = tankData.ai.history || [];
      tankData.ai.history.unshift({
        message: newData.log,
        timestamp: new Date().toISOString()
      });
      tankData.ai.history = tankData.ai.history.slice(0, 50);
    }
    
    const result = await put('status-v2.json', JSON.stringify(tankData), {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true
    });
    
    return Response.json({ success: true, blobUrl: result.url, timestamp: tankData.ai?.timestamp });
  } catch (error) {
    return Response.json({ success: false, error: error.message, stack: error.stack }, { status: 500 });
  }
}
