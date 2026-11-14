/** Used by kubernetes liveness and readiness probes. */
export function GET(): Response {
	return Response.json({ status: "ok" }, { headers: { "cache-control": "no-store" } });
}
