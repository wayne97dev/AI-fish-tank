export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = 'force-no-store';

import { put } from '@vercel/blob';

const BLOB_URL = 'https://pbrf2lbsymd1vwdw.public.blob.vercel-storage.com/status-v2.json';

const defaultData = {
  devices: {
    light: { status: 'off' },
    heater: { status: 'off' },
    feeder: { status: 'off' },
    filter: { status: 'on' },
    camera: { status: 'on' },
    airPump: { status: 'on' }
  },
  ai: {
    lastComment: "Waiting for connection...",
    timestamp: null,
    history: []
  },
  health: { score: 80, status: "good" },
  sensors: {
    temperature: 25,
    ph: 7.2,
    oxygen: 8.1,
    ammonia: 0
  }
};

async function getData() {
  try {
    const response = await fetch(BLOB_URL + '?v=' + Date.now() + '-' + Math.random(), { 
      cache: 'no-store',
      next: { revalidate: 0 },
      headers: { 
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
    if (response.ok) {
      const text = await response.text();
      if (text && text.startsWith('{')) {
        return JSON.parse(text);
      }
    }
  } catch (e) {
    console.error('getData error:', e);
  }
  return null;
}

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0",
  "CDN-Cache-Control": "no-store",
  "Vercel-CDN-Cache-Control": "no-store",
  "Pragma": "no-cache",
  "Expires": "0",
  "Surrogate-Control": "no-store"
};

// GET
export async function GET() {
  const data = await getData();
  return Response.json({ success: true, data: data || defaultData }, { 
    headers: NO_CACHE_HEADERS
  });
}

// POST
export async function POST(request) {
  try {
    const newData = await request.json();
    let tankData = await getData();
    
    if (!tankData) {
      console.error('Could not read blob data, skipping write to prevent data loss');
      return Response.json({ success: false, error: 'Could not read existing data' }, { status: 500, headers: NO_CACHE_HEADERS });
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
    
    await put('status-v2.json', JSON.stringify(tankData), {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true
    });
    
    return Response.json({ success: true }, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}
