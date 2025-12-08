// TapTap Game Server - FINAL WORKING VERSION
const handler = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  
  // Create a response
  let response: Response;
  
  // Handle OPTIONS preflight
  if (req.method === "OPTIONS") {
    response = new Response(null, { status: 204 });
  }
  
  // Health endpoint
  else if (url.pathname === "/health") {
    response = new Response(JSON.stringify({
      status: "online",
      service: "TapTap Game Server",
      timestamp: new Date().toISOString(),
      cors: "enabled"
    }), {
      headers: { "Content-Type": "application/json" }
    });
  }
  
  // Login endpoint
  else if (url.pathname === "/api/login" && req.method === "POST") {
    try {
      const body = await req.json();
      const deviceId = body.device_id || "unknown";
      
      response = new Response(JSON.stringify({
        success: true,
        user_id: `user_${Date.now()}`,
        session_id: `sess_${Date.now()}`,
        game_data: {
          gems: 2000,
          unlocked_cards: ["ExtraPass", "ExtraMove"]
        }
      }), {
        headers: { "Content-Type": "application/json" }
      });
    } catch {
      response = new Response(JSON.stringify({ success: false }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
  
  // Other endpoints...
  else if (url.pathname === "/api/save" && req.method === "POST") {
    response = new Response(JSON.stringify({
      success: true,
      saved_at: new Date().toISOString()
    }), {
      headers: { "Content-Type": "application/json" }
    });
  }
  
  else if (url.pathname === "/api/load" && req.method === "POST") {
    response = new Response(JSON.stringify({
      success: true,
      game_data: {
        gems: 2000,
        unlocked_cards: ["ExtraPass", "ExtraMove"]
      }
    }), {
      headers: { "Content-Type": "application/json" }
    });
  }
  
  else if (url.pathname === "/api/purchase" && req.method === "POST") {
    response = new Response(JSON.stringify({
      success: true,
      recorded_at: new Date().toISOString()
    }), {
      headers: { "Content-Type": "application/json" }
    });
  }
  
  // 404
  else {
    response = new Response(JSON.stringify({
      error: "Not found"
    }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    });
  }
  
  // ========== CRITICAL FIX ==========
  // Clone the response so we can modify headers
  const newResponse = new Response(response.body, response);
  
  // ADD CORS HEADERS
  newResponse.headers.set("Access-Control-Allow-Origin", "*");
  newResponse.headers.set("Access-Control-Allow-Methods", "*");
  newResponse.headers.set("Access-Control-Allow-Headers", "*");
  newResponse.headers.set("Access-Control-Max-Age", "86400");
  
  // REMOVE or OVERRIDE the problematic CSP header
  // Try BOTH methods:
  
  // Method 1: Remove CSP entirely
  newResponse.headers.delete("Content-Security-Policy");
  
  // Method 2: OR set permissive CSP
  // newResponse.headers.set("Content-Security-Policy", "default-src * 'unsafe-inline' 'unsafe-eval';");
  
  return newResponse;
};

// Start server
Deno.serve({ port: 8000 }, handler);

console.log("🚀 Server running on http://localhost:8000");
console.log("✅ CORS enabled for Godot");
