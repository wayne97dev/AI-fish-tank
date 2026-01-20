import { put, del, list } from '@vercel/blob';

export async function GET() {
  try {
    const { blobs } = await list();
    for (const blob of blobs) {
      if (blob.pathname === 'status-data.json') {
        await del(blob.url);
      }
    }
    
    const freshData = {
      devices: {
        light: { status: 'off' },
        heater: { status: 'on' },
        feeder: { status: 'off' },
        filter: { status: 'on' },
        camera: { status: 'on' },
        airPump: { status: 'on' }
      },
      ai: {
        lastComment: "System reset - waiting for AI...",
        timestamp: new Date().toISOString(),
        history: []
      },
      health: { score: 80, status: "good" },
      sensors: { temperature: 25, ph: 7.2, oxygen: 8.1, ammonia: 0 }
    };
    
    await put('status-data.json', JSON.stringify(freshData), {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true
    });
    
    return Response.json({ success: true, message: 'Data reset', data: freshData });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
