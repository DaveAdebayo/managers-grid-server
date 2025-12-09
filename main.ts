// main.ts - Enhanced for Web IAPs
Deno.serve(async (req) => {
  const url = new URL(req.url);
  
  // CORS headers for web games
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };
  
  // Handle OPTIONS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers });
  }
  
  try {
    // Health check
    if (url.pathname === "/health") {
      return new Response(JSON.stringify({ 
        status: "online",
        time: new Date().toISOString(),
        server: "Game Server v1.0"
      }), { headers });
    }
    
    // Web login (device-based or account)
    if (url.pathname === "/api/web-login" && req.method === "POST") {
      const body = await req.json();
      const deviceId = body.device_id || "web_" + Date.now();
      const playerName = body.player_name || "Player";
      
      // Generate session
      return new Response(JSON.stringify({
        success: true,
        user_id: "web_user_" + deviceId,
        session_id: "sess_" + Date.now(),
        player_name: playerName
      }), { headers });
    }
    
    // Web purchase (server-side validation)
    if (url.pathname === "/api/web-purchase" && req.method === "POST") {
      const body = await req.json();
      const { session_id, product_id, payment_data } = body;
      
      console.log("Web purchase attempt:", {
        session_id,
        product_id,
        timestamp: new Date().toISOString()
      });
      
      // In production: Validate payment_data here
      // For now, simulate successful payment
      const isValidPayment = true;
      
      if (isValidPayment) {
        return new Response(JSON.stringify({
          success: true,
          transaction_id: "TXN_" + Date.now(),
          product_id: product_id,
          verified: true,
          receipt: {
            server_verified: true,
            timestamp: new Date().toISOString(),
            payment_method: "web"
          }
        }), { headers });
      } else {
        return new Response(JSON.stringify({
          success: false,
          error: "Payment validation failed"
        }), { status: 400, headers });
      }
    }
    
    // Get products for web store
    if (url.pathname === "/api/web-products" && req.method === "GET") {
      const products = [
        {
          id: "gems_50",
          type: "consumable",
          title: "50 Gems",
          description: "Get 50 in-game gems",
          price: "$0.49",
          price_numeric: 0.49,
          currency: "USD",
          gem_amount: 50
        },
        {
          id: "gems_300",
          type: "consumable",
          title: "300 Gems",
          description: "Get 300 in-game gems",
          price: "$1.49",
          price_numeric: 1.49,
          currency: "USD",
          gem_amount: 300
        },
        {
          id: "gems_500",
          type: "consumable",
          title: "500 Gems",
          description: "Get 500 in-game gems",
          price: "$1.99",
          price_numeric: 1.99,
          currency: "USD",
          gem_amount: 500
        },
        {
          id: "premium",
          type: "non_consumable",
          title: "Premium Version",
          description: "Unlock premium features permanently",
          price: "$2.99",
          price_numeric: 2.99,
          currency: "USD",
          is_premium: true
        }
      ];
      
      return new Response(JSON.stringify({
        success: true,
        products: products
      }), { headers });
    }
    
    // Save/load game data (existing)
    if (url.pathname === "/api/save" && req.method === "POST") {
      const body = await req.json();
      console.log("Game saved:", body.session_id);
      return new Response(JSON.stringify({
        success: true,
        saved_at: new Date().toISOString()
      }), { headers });
    }
    
    if (url.pathname === "/api/load" && req.method === "POST") {
      const body = await req.json();
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
    
    // 404
    return new Response(JSON.stringify({ error: "Not found" }), { 
      status: 404, 
      headers 
    });
    
  } catch (error) {
    console.error("Server error:", error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500, 
      headers 
    });
  }
});
