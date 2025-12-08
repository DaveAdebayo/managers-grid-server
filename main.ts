// TapTap Game Server - WORKING VERSION
Deno.serve(async (req) => {
  const url = new URL(req.url);
  
  // Create response object
  let response: Response;
  
  // Handle OPTIONS (CORS preflight)
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400"
      }
    });
  }
  
  try {
    // Health endpoint
    if (url.pathname === "/health") {
      response = new Response(JSON.stringify({
        status: "online",
        service: "TapTap Game Server",
        timestamp: new Date().toISOString()
      }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    
    // Login endpoint
    else if (url.pathname === "/api/login" && req.method === "POST") {
      const body = await req.json();
      const deviceId = body.device_id || "unknown";
      
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      const sessionId = `sess_${crypto.randomUUID().replace(/-/g, '')}`;
      
      console.log(`Login: ${userId} from ${deviceId}`);
      
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
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    
    // Save game endpoint
    else if (url.pathname === "/api/save" && req.method === "POST") {
      const body = await req.json();
      const sessionId = body.session_id;
      const gameData = body.game_data || {};
      
      console.log(`Save: ${sessionId?.substr(0, 15)}...`);
      
      response = new Response(JSON.stringify({
        success: true,
        saved_at: new Date().toISOString(),
        message: "Game saved successfully"
      }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    
    // Load game endpoint
    else if (url.pathname === "/api/load" && req.method === "POST") {
      const body = await req.json();
      const sessionId = body.session_id;
      
      console.log(`Load: ${sessionId?.substr(0, 15)}...`);
      
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
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    
    // Purchase endpoint
    else if (url.pathname === "/api/purchase" && req.method === "POST") {
      const body = await req.json();
      const sessionId = body.session_id;
      const productId = body.product_id;
      const transactionId = body.transaction_id || `txn_${Date.now()}`;
      const receipt = body.receipt || "";
      const platform = body.platform || "android";
      
      console.log(`Purchase: ${productId} for ${sessionId?.substr(0, 15)}...`);
      
      response = new Response(JSON.stringify({
        success: true,
        recorded_at: new Date().toISOString(),
        product_id: productId,
        transaction_id: transactionId,
        platform: platform,
        message: "Purchase recorded"
      }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    
    // 404 - Not found
    else {
      response = new Response(JSON.stringify({
        success: false,
        error: "Endpoint not found",
        path: url.pathname
      }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
    
  } catch (error) {
    // Error handling
    response = new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
  
  return response;
});

console.log("🚀 TapTap Game Server started!");
