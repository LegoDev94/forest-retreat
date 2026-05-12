// Vercel Cron handler — runs every 15 minutes per vercel.json.
// Vercel attaches `Authorization: Bearer ${CRON_SECRET}` automatically
// when CRON_SECRET is set in the project env vars.
import { runLodgifyInboundSync } from '../../../../lib/lodgify-sync';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

export async function GET(req) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get('authorization') || '';
    if (auth !== `Bearer ${secret}`) {
      return new Response('unauthorized', { status: 401 });
    }
  }

  const started = Date.now();
  const result = await runLodgifyInboundSync();
  return Response.json({
    ...result,
    ms: Date.now() - started,
    at: new Date().toISOString(),
  });
}
