// main.ts - Updated with better purchase handling
Deno.serve(async (req) => {
  const url = new URL(req.url);
  
  // CORS headers
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
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
        time: new Date().toISOString(),
        server: "TapTap Game Server v1.0"
      }), { headers });
    }
    
    // Login
    if (url.pathname === "/api/login" && req.method === "POST") {
      const body = await req.json();
      const device_id = body.device_id || "unknown";
      
      // Generate user ID based on device ID
      const userId = "user_" + Date.now() + "_" + device_id.substring(0, 8);
      
      return new Response(JSON.stringify({
        success: true,
        user_id: userId,
        session_id: "sess_" + Date.now(),
        server_time: new Date().toISOString()
      }), { headers });
    }
    
    // Save
    if (url.pathname === "/api/save" && req.method === "POST") {
      const body = await req.json();
      console.log("Game saved for user:", body.session_id);
      
      return new Response(JSON.stringify({
        success: true,
        saved_at: new Date().toISOString(),
        message: "Game data saved successfully"
      }), { headers });
    }
    
    // Load
    if (url.pathname === "/api/load" && req.method === "POST") {
      const body = await req.json();
      
      // Return dummy game data
      return new Response(JSON.stringify({
        success: true,
        game_data: { 
          gems: 2000,
          unlocked_cards: ["ExtraPass", "ExtraMove"],
          premium: false,
          last_sync: new Date().toISOString()
        }
      }), { headers });
    }
    
    // Purchase
    if (url.pathname === "/api/purchase" && req.method === "POST") {
      const body = await req.json();
      console.log("Purchase recorded:", body);
      
      return new Response(JSON.stringify({
        success: true,
        recorded_at: new Date().toISOString(),
        product_id: body.product_id,
        transaction_id: body.transaction_id || "no_transaction_id",
        server_receipt: "server_verified_" + Date.now()
      }), { headers });
    }
    
    // Get products (new endpoint)
    if (url.pathname === "/api/products" && req.method === "GET") {
      const products = [
        {
          id: "com.managersgrid.gems_50",
          type: "consumable",
          title: "50 Gems",
          description: "Get 50 in-game gems",
          price: "0.49",
          price_locale: "USD",
          gem_amount: 50
        },
        {
          id: "com.managersgrid.gems_300",
          type: "consumable",
          title: "300 Gems",
          description: "Get 300 in-game gems",
          price: "1.49",
          price_locale: "USD",
          gem_amount: 300
        },
        {
          id: "com.managersgrid.gems_500",
          type: "consumable",
          title: "500 Gems",
          description: "Get 500 in-game gems",
          price: "1.99",
          price_locale: "USD",
          gem_amount: 500
        },
        {
          id: "com.managersgrid.premium",
          type: "non_consumable",
          title: "Premium Version",
          description: "Unlock premium features permanently",
          price: "1.99",
          price_locale: "USD",
          is_premium: true
        }
      ];
      
      return new Response(JSON.stringify({
        success: true,
        products: products
      }), { headers });
    }
    
    // 404
    return new Response(JSON.stringify({ 
      error: "Endpoint not found",
      path: url.pathname 
    }), { 
      status: 404, 
      headers 
    });
    
  } catch (error) {
    console.error("Server error:", error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: "Internal server error" 
    }), { 
      status: 500, 
      headers 
    });
  }
});

console.log("Server running on port 8000");
