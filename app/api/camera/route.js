import { put, list } from '@vercel/blob';

// GET
export async function GET() {
  try {
    const { blobs } = await list({ prefix: 'camera-' });
    
    if (blobs.length > 0) {
      const latestBlob = blobs[blobs.length - 1];
      const response = await fetch(latestBlob.url);
      const data = await response.json();
      return Response.json({ success: true, data });
    }
    
    return Response.json({ success: true, data: { image: null, aiAnalysis: null, timestamp: null } });
  } catch (error) {
    return Response.json({ success: true, data: { image: null, aiAnalysis: null, timestamp: null } });
  }
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
    
    await put('camera-data.json', JSON.stringify(cameraData), {
      access: 'public',
      addRandomSuffix: false
    });
    
    return Response.json({ success: true });
  } catch (error) {
    console.error('Camera API error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
