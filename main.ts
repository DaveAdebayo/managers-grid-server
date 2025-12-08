// TapTap Game Server - FINAL
Deno.serve(async (req) => {
  const url = new URL(req.url);
  
  // CORS headers
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  };
  
  // OPTIONS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers });
  }
  
  try {
    // Health
    if (url.pathname === "/health") {
      return new Response(JSON.stringify({ 
        status: "online",
        time: new Date().toISOString() 
      }), { headers });
    }
    
    // Login
    if (url.pathname === "/api/login" && req.method === "POST") {
      const body = await req.json();
      return new Response(JSON.stringify({
        success: true,
        user_id: "user_" + Date.now(),
        session_id: "sess_" + Date.now()
      }), { headers });
    }
    
    // Save
    if (url.pathname === "/api/save" && req.method === "POST") {
      await req.json(); // Parse but don't use
      return new Response(JSON.stringify({
        success: true,
        saved_at: new Date().toISOString()
      }), { headers });
    }
    
    // Load
    if (url.pathname === "/api/load" && req.method === "POST") {
      await req.json();
      return new Response(JSON.stringify({
        success: true,
        game_data: { gems: 2000 }
      }), { headers });
    }
    
    // Purchase
    if (url.pathname === "/api/purchase" && req.method === "POST") {
      const body = await req.json();
      return new Response(JSON.stringify({
        success: true,
        recorded_at: new Date().toISOString(),
        product_id: body.product_id
      }), { headers });
    }
    
    // 404
    return new Response(JSON.stringify({ error: "Not found" }), { 
      status: 404, 
      headers 
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 400, 
      headers 
    });
  }
});

console.log("Server running");
