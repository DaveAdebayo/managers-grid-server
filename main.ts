// TapTap Game Server - SIMPLE VERSION
Deno.serve(async (req) => {
  const url = new URL(req.url);
  
  // Create headers
  const headers = new Headers({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Headers": "*"
  });
  
  // Handle OPTIONS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers, status: 204 });
  }
  
  // Health check
  if (url.pathname === "/health") {
    return new Response(JSON.stringify({
      status: "online",
      time: new Date().toISOString()
    }), { headers });
  }
  
  // Login
  if (url.pathname === "/api/login" && req.method === "POST") {
    try {
      const body = await req.json();
      const deviceId = body.device_id || "unknown";
      
      return new Response(JSON.stringify({
        success: true,
        user_id: `user_${Date.now()}`,
        session_id: `sess_${Date.now()}`,
        game_data: {
          gems: 2000,
          unlocked_cards: ["ExtraPass", "ExtraMove"]
        }
      }), { headers });
    } catch {
      return new Response(JSON.stringify({ success: false }), { 
        headers, 
        status: 400 
      });
    }
  }
  
  // Save
  if (url.pathname === "/api/save" && req.method === "POST") {
    return new Response(JSON.stringify({
      success: true,
      saved_at: new Date().toISOString()
    }), { headers });
  }
  
  // Load
  if (url.pathname === "/api/load" && req.method === "POST") {
    return new Response(JSON.stringify({
      success: true,
      game_data: {
        gems: 2000,
        unlocked_cards: ["ExtraPass", "ExtraMove"]
      }
    }), { headers });
  }
  
  // Purchase
  if (url.pathname === "/api/purchase" && req.method === "POST") {
    try {
      const body = await req.json();
      
      return new Response(JSON.stringify({
        success: true,
        recorded_at: new Date().toISOString(),
        product_id: body.product_id || "unknown"
      }), { headers });
    } catch {
      return new Response(JSON.stringify({ success: false }), { 
        headers, 
        status: 400 
      });
    }
  }
  
  // 404
  return new Response(JSON.stringify({ error: "Not found" }), { 
    headers, 
    status: 404 
  });
});

console.log("Server running");
