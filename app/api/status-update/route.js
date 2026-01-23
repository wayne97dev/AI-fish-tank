export const dynamic = "force-dynamic";

import { kv } from '@vercel/kv';

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

export async function POST(request) {
  try {
    const newData = await request.json();
    let tankData = await kv.get('tank-status') || defaultData;
    
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
    
    await kv.set('tank-status', tankData);
    
    return Response.json({ success: true, timestamp: tankData.ai?.timestamp });
  } catch (error) {
    console.error('KV POST error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
