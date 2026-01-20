export const dynamic = "force-dynamic";
export const revalidate = 0;

import { put } from '@vercel/blob';

const BLOB_URL = 'https://pbrf2lbsymd1vwdw.public.blob.vercel-storage.com/camera-v2.json';

// GET
export async function GET() {
  try {
    const response = await fetch(BLOB_URL + '?t=' + Date.now(), { cache: 'no-store' });
    if (response.ok) {
      const data = await response.json();
      return Response.json({ success: true, data }, { 
        headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } 
      });
    }
  } catch (e) {
    console.error('Camera getData error:', e);
  }
  return Response.json({ success: true, data: { image: null, aiAnalysis: null, timestamp: null } }, { 
    headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } 
  });
}

// POST
export async function POST(request) {
  try {
    const newData = await request.json();
    
    const cameraData = {
      image: newData.image || null,
      aiAnalysis: newData.aiAnalysis || null,
      timestamp: new Date().toISOString()
    };
    
    await put('camera-v2.json', JSON.stringify(cameraData), {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true
    });
    
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
