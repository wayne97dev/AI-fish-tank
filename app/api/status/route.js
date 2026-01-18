let tankData = {
  devices: {
    light: { status: 'off' },
    heater: { status: 'off' },
    feeder: { status: 'off' },
    filter: { status: 'on' },
    camera: { status: 'off' },
    airPump: { status: 'on' }
  },
  ai: {
    lastComment: "Waiting for connection...",
    lastAction: "",
    timestamp: null,
    history: []
  },
  health: {
    score: 85,
    status: "Healthy"
  },
  sensors: {
    temperature: 25,
    ph: 7.2,
    oxygen: 8.1,
    ammonia: 0
  },
  token: {
    marketCap: null,
    holders: null,
    athMarketCap: null,
    volume24h: null
  }
};

export async function GET() {
  return Response.json({ success: true, data: tankData });
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Update devices
    if (data.devices) {
      Object.keys(data.devices).forEach(key => {
        const value = data.devices[key];
        tankData.devices[key] = { 
          status: value === true || value === 'on' ? 'on' : 'off' 
        };
      });
    }
    
    // Update AI
    if (data.ai) {
      tankData.ai.lastComment = data.ai.comment || tankData.ai.lastComment;
      tankData.ai.lastAction = data.ai.action || tankData.ai.lastAction;
      tankData.ai.timestamp = new Date().toISOString();
    }
    
    // Add to history/log
    if (data.log) {
      tankData.ai.history.unshift({
        message: data.log,
        timestamp: new Date().toISOString()
      });
      tankData.ai.history = tankData.ai.history.slice(0, 50);
    }
    
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
