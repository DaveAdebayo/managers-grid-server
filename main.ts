// TapTap Game Server - CSP FIXED
const handler = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  
  // Create a response object first
  let response: Response;
  
  // Handle preflight OPTIONS
  if (req.method === "OPTIONS") {
    response = new Response(null, { status: 204 });
  }
  
  // Home page
  else if (url.pathname === "/") {
    response = new Response(`
      <!DOCTYPE html>
      <html>
      <head>
        <title> TapTap Game Server</title>
        <meta http-equiv="Content-Security-Policy" content="default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;">
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          .success { color: green; font-weight: bold; }
          button { padding: 10px 20px; margin: 5px; font-size: 16px; }
          pre { background: #f5f5f5; padding: 15px; border-radius: 5px; }
        </style>
      </head>
      <body>
        <h1> TapTap Game Server</h1>
        <p class="success">Status: ONLINE</p>
        <p>Server Time: ${new Date().toLocaleString()}</p>
        
        <h3>Test Endpoints:</h3>
        <button onclick="testHealth()">Test /health</button>
        <button onclick="testLogin()">Test /api/login</button>
        
        <div id="result" style="margin-top: 20px;"></div>
        
        <script>
          async function testHealth() {
            const res = await fetch('/health');
            const data = await res.json();
            document.getElementById('result').innerHTML = 
              '<h4>Health Check Result:</h4><pre>' + JSON.stringify(data, null, 2) + '</pre>';
          }
          
          async function testLogin() {
            const res = await fetch('/api/login', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({device_id: 'test_device_' + Date.now()})
            });
            const data = await res.json();
            document.getElementById('result').innerHTML = 
              '<h4>Login Result:</h4><pre>' + JSON.stringify(data, null, 2) + '</pre>';
          }
          
          // Auto-test on load
          testHealth();
        </script>
      </body>
      </html>
    `, {
      headers: new Headers({
        "Content-Type": "text/html; charset=utf-8",
      })
    });
  }
  
  // Health endpoint
  else if (url.pathname === "/health" && req.method === "GET") {
    response = new Response(JSON.stringify({
      status: "online",
      service: "TapTap Game Server",
      timestamp: new Date().toISOString(),
      csp_fixed: true,
      cors_enabled: true
    }), {
      headers: new Headers({
        "Content-Type": "application/json",
      })
    });
  }
  
  // Login endpoint
  else if (url.pathname === "/api/login" && req.method === "POST") {
    try {
      const body = await req.json();
      const deviceId = body.device_id || "unknown";
      
      response = new Response(JSON.stringify({
        success: true,
        user_id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        session_id: `sess_${crypto.randomUUID().replace(/-/g, '')}`,
        username: `Player_${Date.now().toString().substr(8, 4)}`,
        game_data: {
          gems: 100,
          unlocked_cards: ["ExtraPass", "ExtraMove"],
          premium_user: false,
          last_save: new Date().toISOString()
        },
        message: "Login successful - CSP FIXED"
      }), {
        headers: new Headers({
          "Content-Type": "application/json",
        })
      });
    } catch (error) {
      response = new Response(JSON.stringify({
        success: false,
        error: error.message
      }), {
        status: 400,
        headers: new Headers({
          "Content-Type": "application/json",
        })
      });
    }
  }
  
  // Save endpoint
  else if (url.pathname === "/api/save" && req.method === "POST") {
    response = new Response(JSON.stringify({
      success: true,
      saved_at: new Date().toISOString(),
      message: "Game saved"
    }), {
      headers: new Headers({
        "Content-Type": "application/json",
      })
    });
  }
  
  // Load endpoint
  else if (url.pathname === "/api/load" && req.method === "POST") {
    response = new Response(JSON.stringify({
      success: true,
      game_data: {
        gems: 100,
        unlocked_cards: ["ExtraPass", "ExtraMove"],
        last_save: new Date().toISOString()
      }
    }), {
      headers: new Headers({
        "Content-Type": "application/json",
      })
    });
  }
  
  // Purchase endpoint
  else if (url.pathname === "/api/purchase" && req.method === "POST") {
    response = new Response(JSON.stringify({
      success: true,
      recorded_at: new Date().toISOString(),
      message: "Purchase recorded"
    }), {
      headers: new Headers({
        "Content-Type": "application/json",
      })
    });
  }
  
  // 404
  else {
    response = new Response(JSON.stringify({
      error: "Not found",
      path: url.pathname
    }), {
      status: 404,
      headers: new Headers({
        "Content-Type": "application/json",
      })
    });
  }
  
  // ========== CRITICAL: ADD CORS HEADERS ==========
  const headers = new Headers(response.headers);
  
  // ALLOW EVERYTHING - This overrides Deno's restrictive CSP
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept, Origin, User-Agent, X-Requested-With");
  headers.set("Access-Control-Allow-Credentials", "true");
  headers.set("Access-Control-Max-Age", "86400");
  
  // OVERRIDE the problematic CSP header
  headers.set("Content-Security-Policy", "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;");
  
  // Return response with fixed headers
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: headers
  });
};

// Start server
Deno.serve(handler);

console.log(" Server started with CSP fix");
console.log(" CORS enabled for Godot");
console.log(" No restrictive CSP headers");
