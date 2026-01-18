// Store per l'immagine della camera
let cameraData = {
  image: null,           // Base64 dell'immagine
  aiAnalysis: null,      // Analisi AI dell'immagine
  timestamp: null        // Quando è stata catturata
};

// GET - Il sito legge l'immagine
export async function GET() {
  return Response.json({ 
    success: true, 
    data: cameraData 
  });
}

// POST - Il Raspberry Pi invia l'immagine
export async function POST(request) {
  try {
    const data = await request.json();
    
    if (data.image) {
      cameraData.image = data.image;
    }
    
    if (data.aiAnalysis) {
      cameraData.aiAnalysis = data.aiAnalysis;
    }
    
    cameraData.timestamp = new Date().toISOString();
    
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
