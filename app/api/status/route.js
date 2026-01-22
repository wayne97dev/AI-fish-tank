export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

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
  "Cache-Control": "private, no-store, no-cache, must-revalidate, max-age=0",
  "CDN-Cache-Control": "no-store",
  "Vercel-CDN-Cache-Control": "no-store",
  "Pragma": "no-cache",
  "Expires": "0"
};

// GET
export async function GET(request) {
  const url = new URL(request.url);
  const bustCache = url.searchParams.get('t') || Date.now();
  
  try {
    const fetchUrl = `${BLOB_URL}?t=${bustCache}&r=${Math.random()}`;
    const response = await fetch(fetchUrl, { 
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      return new Response(JSON.stringify({ success: true, data }), { 
        headers: {
          ...NO_CACHE_HEADERS,
          "Content-Type": "application/json"
        }
      });
    }
  } catch (e) {
    console.error('GET error:', e);
  }
  
  return new Response(JSON.stringify({ success: true, data: defaultData }), { 
    headers: {
      ...NO_CACHE_HEADERS,
      "Content-Type": "application/json"
    }
  });
}

// POST
export async function POST(request) {
  return new Response(JSON.stringify({ 
    success: false, 
    error: 'Use /api/status-update for POST requests' 
  }), { 
    status: 400, 
    headers: {
      ...NO_CACHE_HEADERS,
      "Content-Type": "application/json"
    }
  });
}
