import { put, list } from '@vercel/blob';

// GET
export async function GET() {
  try {
    const { blobs } = await list();
    const cameraBlob = blobs.find(b => b.pathname === 'camera-data.json');
    
    if (cameraBlob) {
      const response = await fetch(cameraBlob.url, { cache: 'no-store' });
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
      addRandomSuffix: false,
      allowOverwrite: true
    });
    
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
