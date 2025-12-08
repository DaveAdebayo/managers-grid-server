// TapTap Game Server - Simple API
Deno.serve(async (req) => {
  const url = new URL(req.url);
  const origin = req.headers.get("origin") || "*";
  
  // CORS headers - ALLOW EVERYTHING for Godot
  const corsHeaders = {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept, Origin, User-Agent",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Max-Age": "86400",
  };
  
  // Handle OPTIONS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { 
      status: 204,
      headers: corsHeaders
    });
  }
  
  // Root endpoint - show server info
  if (url.pathname === "/") {
    return new Response(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>🎮 TapTap Game Server</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
          .success { color: green; }
          .error { color: red; }
          code { background: #f5f5f5; padding: 2px 5px; border-radius: 3px; }
        </style>
      </head>
      <body>
        <h1> TapTap Game Server</h1>
        <p><strong>Status:</strong> <span class="success">ONLINE</span></p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        
        <h2>API Endpoints:</h2>
        <ul>
          <li><code>GET /health</code> - Server status</li>
          <li><code>POST /api/login</code> - User login</li>
          <li><code>POST /api/save</code> - Save game data</li>
          <li><code>POST /api/load</code> - Load game data</li>
          <li><code>POST /api/purchase</code> - Record purchase</li>
        </ul>
        
        <h2>Test API:</h2>
        <button onclick="testLogin()">Test Login</button>
        <button onclick="testHealth()">Test Health</button>
        <div id="result" style="margin-top: 20px; padding: 10px; background: #f5f5f5; border-radius: 5px;"></div>
        
        <script>
          async function testLogin() {
            const res = await fetch('/api/login', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({device_id: 'test_device_' + Date.now()})
            });
            const data = await res.json();
            document.getElementById('result').innerHTML = 
              '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
          }
          
          async function testHealth() {
            const res = await fetch('/health');
            const data = await res.json();
            document.getElementById('result').innerHTML = 
              '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
          }
          
          // Auto-test on load
          testHealth();
        </script>
      </body>
      </html>
    `, {
      headers: { "Content-Type": "text/html; charset=utf-8" }
    });
  }
  
  // Health check endpoint
  if (url.pathname === "/health" && req.method === "GET") {
    return new Response(JSON.stringify({
      status: "online",
      service: "TapTap Game Server",
      timestamp: new Date().toISOString(),
      cors_enabled: true,
      endpoints: [
        "/api/login (POST)",
        "/api/save (POST)",
        "/api/load (POST)", 
        "/api/purchase (POST)"
      ]
    }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  }
  
  // Login endpoint
  if (url.pathname === "/api/login" && req.method === "POST") {
    try {
      const body = await req.json();
      const deviceId = body.device_id || "unknown";
      
      console.log(` Login request from: ${deviceId}`);
      
      // Generate user data
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      const sessionId = `sess_${crypto.randomUUID().replace(/-/g, '')}`;
      
      return new Response(JSON.stringify({
        success: true,
        user_id: userId,
        session_id: sessionId,
        username: `Player_${userId.substring(5, 11)}`,
        game_data: {
          gems: 100,
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
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
      
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }
  }
  
  // Save game endpoint
  if (url.pathname === "/api/save" && req.method === "POST") {
    try {
      const body = await req.json();
      const { session_id, game_data } = body;
      
      console.log(`💾 Save request for session: ${session_id?.substr(0, 15)}...`);
      
      // In production: validate session and save to database
      
      return new Response(JSON.stringify({
        success: true,
        saved_at: new Date().toISOString(),
        message: "Game saved successfully"
      }), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
      
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }
  }
  
  // Load game endpoint
  if (url.pathname === "/api/load" && req.method === "POST") {
    try {
      const body = await req.json();
      const { session_id } = body;
      
      console.log(`📥 Load request for session: ${session_id?.substr(0, 15)}...`);
      
      // In production: validate session and load from database
      
      return new Response(JSON.stringify({
        success: true,
        game_data: {
          gems: 100,
          unlocked_cards: ["ExtraPass", "ExtraMove"],
          premium_user: false,
          total_wins: 5,
          total_losses: 2,
          ai_wins: { easy: 2, normal: 3, challenging: 0, hard: 0 },
          decks: {
            deck1: { name: "Deck 1", cards: ["ExtraPass", "ExtraMove"], is_locked: false },
            deck2: { name: "Deck 2", cards: [], is_locked: false },
            deck3: { name: "Deck 3", cards: [], is_locked: false }
          },
          last_save: new Date().toISOString()
        },
        loaded_at: new Date().toISOString()
      }), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
      
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }
  }
  
  // Purchase endpoint
  if (url.pathname === "/api/purchase" && req.method === "POST") {
    try {
      const body = await req.json();
      const { session_id, product_id, transaction_id } = body;
      
      console.log(`💰 Purchase: ${product_id} for session ${session_id?.substr(0, 15)}...`);
      
      return new Response(JSON.stringify({
        success: true,
        recorded_at: new Date().toISOString(),
        product_id: product_id,
        transaction_id: transaction_id || `txn_${Date.now()}`,
        message: "Purchase recorded"
      }), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
      
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }
  }
  
  // Test endpoint (GET)
  if (url.pathname === "/api/test" && req.method === "GET") {
    return new Response(JSON.stringify({
      success: true,
      message: "API is working!",
      timestamp: new Date().toISOString(),
      cors: "enabled",
      godot_compatible: true
    }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  }
  
  // 404 - Not found
  return new Response(JSON.stringify({
    success: false,
    error: "Endpoint not found",
    path: url.pathname
  }), {
    status: 404,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json"
    }
  });
});

console.log(" TapTap Game Server started!");
console.log(" CORS enabled for Godot");
console.log(" Ready for connections...");
