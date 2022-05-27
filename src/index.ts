/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
  FIRMWARE_BUCKET: R2Bucket;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);
    const key = url.pathname.slice(1);
    switch (request.method) {
      case "GET":
        const object = await env.FIRMWARE_BUCKET.get(key);
        if (!object) {
          return new Response("Object Not Found", { status: 404 });
        }
        return new Response(object.body);
      default:
        return new Response("Method Not Allowed", { status: 405 });
    }
  }
};
