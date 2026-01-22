export const runtime = 'edge';

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

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  "CDN-Cache-Control": "no-store",
  "Vercel-CDN-Cache-Control": "no-store"
};

// GET
export async function GET() {
  try {
    const response = await fetch(BLOB_URL + '?t=' + Date.now(), { 
      cache: 'no-store'
    });
    
    if (response.ok) {
      const data = await response.json();
      return Response.json({ success: true, data }, { headers: NO_CACHE_HEADERS });
    }
  } catch (e) {
    console.error('GET error:', e);
  }
  
  return Response.json({ success: true, data: defaultData }, { headers: NO_CACHE_HEADERS });
}

// POST - Edge non supporta @vercel/blob, redirect al blob direttamente
export async function POST(request) {
  // Per POST usiamo una route separata
  return Response.json({ 
    success: false, 
    error: 'Use /api/status-update for POST requests' 
  }, { status: 400, headers: NO_CACHE_HEADERS });
}
