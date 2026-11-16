export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(
    { service: "web", status: "ok", timestamp: new Date().toISOString() },
    { headers: { "Cache-Control": "no-store" } }
  );
}
