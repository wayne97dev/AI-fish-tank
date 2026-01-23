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

export async function GET() {
  try {
    const data = await kv.get('tank-status');
    return Response.json({ success: true, data: data || defaultData });
  } catch (e) {
    console.error('KV GET error:', e);
    return Response.json({ success: true, data: defaultData });
  }
}

export async function POST() {
  return Response.json({ 
    success: false, 
    error: 'Use /api/status-update for POST requests' 
  }, { status: 400 });
}
