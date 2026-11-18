// Deploy entry used when static assets must go through Workers Sites (KV)
// instead of the Workers static-assets upload API. It serves files from KV
// first (like the assets binding would) and hands every other request to the
// OpenNext worker, with an ASSETS shim backed by the same KV namespace.
import { getAssetFromKV, NotFoundError } from "@cloudflare/kv-asset-handler";
import manifestJSON from "__STATIC_CONTENT_MANIFEST";
import handler from "../.open-next/worker.js";

export * from "../.open-next/worker.js";

const manifest = JSON.parse(manifestJSON);

async function fromKV(request, env, ctx) {
  const url = new URL(request.url);
  // Next.js chunk paths contain [lang] / (site); browsers send them percent-encoded.
  try {
    const decoded = decodeURIComponent(url.pathname);
    if (decoded !== url.pathname) {
      url.pathname = decoded;
      request = new Request(url.toString(), request);
    }
  } catch {}
  const immutable = url.pathname.startsWith("/_next/static/");
  try {
    return await getAssetFromKV(
      { request, waitUntil: (p) => ctx.waitUntil(p) },
      {
        ASSET_NAMESPACE: env.__STATIC_CONTENT,
        ASSET_MANIFEST: manifest,
        mapRequestToAsset: (req) => req, // exact paths only, no index.html guessing
        cacheControl: { browserTTL: immutable ? 31536000 : 3600, edgeTTL: 86400, bypassCache: false },
      },
    );
  } catch (e) {
    if (e instanceof NotFoundError || e?.status === 404 || e?.status === 405) return null;
    console.error("kv asset error", e);
    return null;
  }
}

export default {
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);
    // only real files (with an extension) can be static assets
    const looksLikeFile = /\.[a-z0-9]+$/i.test(pathname) && !pathname.startsWith("/media/") && !pathname.startsWith("/api/");
    if ((request.method === "GET" || request.method === "HEAD") && looksLikeFile) {
      const hit = await fromKV(request, env, ctx);
      if (hit) return hit;
    }
    const ASSETS = {
      fetch: async (input, init) => {
        const req = input instanceof Request ? input : new Request(input, init);
        return (await fromKV(req, env, ctx)) ?? new Response("Not found", { status: 404 });
      },
    };
    return handler.fetch(request, { ...env, ASSETS }, ctx);
  },
};
