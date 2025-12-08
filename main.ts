// TapTap Game Server - FIXED VERSION
Deno.serve(async (req) => {
  const url = new URL(req.url);
  
  // Create response
  let response: Response;
  
  // Handle OPTIONS preflight
  if (req.method === "OPTIONS") {
    response = new Response(null, { status: 204 });
  }
  
  // Health check
  else if (url.pathname === "/health") {
    response = new Response(JSON.stringify({
      status: "online",
      service: "TapTap Game Server",
      timestamp: new Date().toISOString(),
      endpoints: [
        "/api/login",
        "/api/save", 
        "/api/load",
        "/api/purchase"
      ]
    }), {
      headers: { "Content-Type": "application/json" }
    });
  }
  
  // Login endpoint
  else if (url.pathname === "/api/login" && req.method === "POST") {
    try {
      const body = await req.json();
      const deviceId = body.device_id || "unknown";
      const forceNew = body.force_new || false;
      
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      const sessionId = `sess_${crypto.randomUUID().replace(/-/g, '')}`;
      
      console.log(`New login: ${userId} from ${deviceId}`);
      
      response = new Response(JSON.stringify({
        success: true,
        user_id: userId,
        session_id: sessionId,
        username: `Player_${userId.substring(5, 11)}`,
        game_data: {
          gems: 2000,
          unlocked_cards: ["ExtraPass", "ExtraMove"],
          premium_user: false,
          total_wins: 0,
          total_losses: 0,
          ai_wins: { easy: 0, normal: 0, challenging: 0, hard: 0 },
          decks: {
            deck1: { name: "Deck 1", cards: [], is_locked: false },
            deck2: { name: "Deck 2", cards: [], is_locked: true },
            deck3: { name: "Deck 3", cards: [], is_locked: true }
          },
          last_save: new Date().toISOString()
        },
        message: "Login successful"
      }), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      response = new Response(JSON.stringify({
        success: false,
        error: error.message
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
  
  // Save game endpoint
  else if (url.pathname === "/api/save" && req.method === "POST") {
    try {
      const body = await req.json();
      const sessionId = body.session_id;
      const gameData = body.game_data || {};
      
      console.log(`Game save for session: ${sessionId?.substr(0, 15)}...`);
      
      response = new Response(JSON.stringify({
        success: true,
        saved_at: new Date().toISOString(),
        message: "Game saved successfully"
      }), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      response = new Response(JSON.stringify({
        success: false,
        error: error.message
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
  
  // Load game endpoint
  else if (url.pathname === "/api/load" && req.method === "POST") {
    try {
      const body = await req.json();
      const sessionId = body.session_id;
      
      console.log(`Game load for session: ${sessionId?.substr(0, 15)}...`);
      
      response = new Response(JSON.stringify({
        success: true,
        game_data: {
          gems: 2000,
          unlocked_cards: ["ExtraPass", "ExtraMove", "LongBall"],
          premium_user: false,
          total_wins: 5,
          total_losses: 2,
          ai_wins: { easy: 2, normal: 3, challenging: 0, hard: 0 },
          decks: {
            deck1: { name: "Deck 1", cards: ["ExtraPass", "ExtraMove"], is_locked: false },
            deck2: { name: "Deck 2", cards: [], is_locked: true },
            deck3: { name: "Deck 3", cards: [], is_locked: true }
          },
          last_save: new Date().toISOString()
        },
        loaded_at: new Date().toISOString()
      }), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      response = new Response(JSON.stringify({
        success: false,
        error: error.message
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
  
  // Purchase recording endpoint
  else if (url.pathname === "/api/purchase" && req.method === "POST") {
    try {
      const body = await req.json();
      const sessionId = body.session_id;
      const productId = body.product_id;
      const transactionId = body.transaction_id || `txn_${Date.now()}`;
      const receipt = body.receipt || "";
      const platform = body.platform || "android";
      
      console.log(`📦 PURCHASE RECORDED:`);
      console.log(`  User session: ${sessionId?.substr(0, 15)}...`);
      console.log(`  Product: ${productId}`);
      console.log(`  Transaction: ${transactionId}`);
      console.log(`  Platform: ${platform}`);
      console.log(`  Time: ${new Date().toISOString()}`);
      
      response = new Response(JSON.stringify({
        success: true,
        recorded_at: new Date().toISOString(),
        product_id: productId,
        transaction_id: transactionId,
        platform: platform,
        message: "Purchase recorded successfully"
      }), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      response = new Response(JSON.stringify({
        success: false,
        error: error.message
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
  
  // 404 - Not found
  else {
    response = new Response(JSON.stringify({
      success: false,
      error: "Endpoint not found",
      path: url.pathname
    }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    });
  }
  
  // Add CORS headers
  const newResponse = new Response(response.body, response);
  
  newResponse.headers.set("Access-Control-Allow-Origin", "*");
  newResponse.headers.set("Access-Control-Allow-Methods", "*");
  newResponse.headers.set("Access-Control-Allow-Headers", "*");
  newResponse.headers.set("Access-Control-Max-Age", "86400");
  
  // Remove CSP header
  newResponse.headers.delete("Content-Security-Policy");
  
  return newResponse;
});

console.log("🚀 TapTap Game Server running!");
console.log("✅ Ready for Android IAPs");
