import { makeRouteHandler } from "@keystatic/next/route-handler";

import config from "#/keystatic.config.tsx";
import { rewriteUrl } from "#/lib/keystatic/rewrite-url.ts";

const { GET: _GET, POST: _POST } = makeRouteHandler({ config });

export function GET(request: Request) {
	return _GET(rewriteUrl(request));
}

export function POST(request: Request) {
	return _POST(rewriteUrl(request));
}
