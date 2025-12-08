import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const handler = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  
  // Create response
  let response: Response;
  
  if (url.pathname === "/health") {
    response = new Response(JSON.stringify({ status: "ok" }), {
      headers: { "Content-Type": "application/json" }
    });
  }
  else if (url.pathname === "/api/login" && req.method === "POST") {
    response = new Response(JSON.stringify({
      success: true,
      user_id: "user_" + Date.now()
    }), {
      headers: { "Content-Type": "application/json" }
    });
  }
  else {
    response = new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    });
  }
  
  // Clone response to modify headers
  const newResponse = new Response(response.body, response);
  
  // Add CORS headers
  newResponse.headers.set("Access-Control-Allow-Origin", "*");
  newResponse.headers.set("Access-Control-Allow-Methods", "*");
  newResponse.headers.set("Access-Control-Allow-Headers", "*");
  
  // Remove any CSP header Deno adds
  newResponse.headers.delete("Content-Security-Policy");
  
  return newResponse;
};

serve(handler, { port: 8000 });
