import { put } from '@vercel/blob';

const BLOB_NAME = 'camera-data.json';

async function getData() {
  try {
    const response = await fetch(`${process.env.BLOB_URL}/${BLOB_NAME}`);
    if (response.ok) {
      return await response.json();
    }
  } catch (e) {}
  return { image: null, aiAnalysis: null, timestamp: null };
}

async function saveData(data) {
  await put(BLOB_NAME, JSON.stringify(data), {
    access: 'public',
    addRandomSuffix: false
  });
}

// GET
export async function GET() {
  const data = await getData();
  return Response.json({ success: true, data });
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
    
    await saveData(cameraData);
    
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
