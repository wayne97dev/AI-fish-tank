let tankData = {
  devices: {
    light: false,
    heater: false,
    feeder: false,
    filter: true,
    camera: false,
    airpump: true
  },
  ai: {
    lastComment: "Waiting for connection...",
    lastAction: "",
    timestamp: null
  },
  log: []
};

export async function GET() {
  return Response.json(tankData);
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    if (data.devices) {
      tankData.devices = { ...tankData.devices, ...data.devices };
    }
    
    if (data.ai) {
      tankData.ai = {
        lastComment: data.ai.comment || tankData.ai.lastComment,
        lastAction: data.ai.action || tankData.ai.lastAction,
        timestamp: new Date().toISOString()
      };
    }
    
    if (data.log) {
      tankData.log.unshift({
        message: data.log,
        timestamp: new Date().toISOString()
      });
      tankData.log = tankData.log.slice(0, 50);
    }
    
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
