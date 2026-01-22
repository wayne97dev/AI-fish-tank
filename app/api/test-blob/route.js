import { put } from '@vercel/blob';

export async function GET() {
  try {
    const testData = { test: true, timestamp: new Date().toISOString() };
    
    const result = await put('test-write.json', JSON.stringify(testData), {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true
    });
    
    return Response.json({ success: true, result });
  } catch (error) {
    return Response.json({ success: false, error: error.message, stack: error.stack }, { status: 500 });
  }
}
