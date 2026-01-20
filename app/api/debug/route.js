import { list } from '@vercel/blob';

export async function GET() {
  try {
    const { blobs } = await list();
    return Response.json({ 
      success: true, 
      count: blobs.length,
      blobs: blobs.map(b => ({ pathname: b.pathname, url: b.url, uploadedAt: b.uploadedAt }))
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
