// Store per i recap giornalieri
let recapData = {
  currentDay: 0,
  startDate: null,
  recaps: [],
  todayEvents: []
};

// GET - Leggi recap
export async function GET() {
  return Response.json({ 
    success: true, 
    data: recapData 
  });
}

// POST - Aggiungi evento o recap
export async function POST(request) {
  try {
    const data = await request.json();
    
    // Set start date
    if (data.startDate) {
      recapData.startDate = data.startDate;
      recapData.currentDay = 1;
    }
    
    // Aggiungi evento di oggi
    if (data.event) {
      recapData.todayEvents.push({
        time: new Date().toISOString(),
        message: data.event
      });
    }
    
    // Salva recap giornaliero
    if (data.dailyRecap) {
      recapData.recaps.push({
        day: recapData.currentDay,
        date: new Date().toISOString().split('T')[0],
        recap: data.dailyRecap
      });
      recapData.currentDay++;
      recapData.todayEvents = [];
    }
    
    return Response.json({ success: true, data: recapData });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
