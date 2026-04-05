/**
 * HTTPS Development Server for Stripe
 * 
 * Stripe requires HTTPS for automatic payment methods.
 * This server wraps the Next.js dev server with HTTPS.
 * 
 * Usage: node server.js
 * 
 * Before running, generate certificates:
 * 1. Install mkcert: choco install mkcert (Windows) or brew install mkcert (Mac)
 * 2. Generate certs: mkcert localhost 127.0.0.1
 *    This creates localhost+1.pem and localhost+1-key.pem
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { spawn } = require('child_process');

// Check if certificates exist
const keyPath = path.join(__dirname, 'localhost+1-key.pem');
const certPath = path.join(__dirname, 'localhost+1.pem');

if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
  console.error('❌ SSL certificates not found!');
  console.error('\nTo enable HTTPS for Stripe, run these commands:');
  console.error('1. Install mkcert: https://github.com/FiloSottile/mkcert#installation');
  console.error('2. Setup CA: mkcert -install');
  console.error('3. Generate certs: mkcert localhost 127.0.0.1');
  console.error('\nAlternatively, use ngrok (simplest):');
  console.error('1. npm run dev');
  console.error('2. ngrok http 3000');
  process.exit(1);
}

// Start Next.js dev server
const nextProcess = spawn('next', ['dev'], {
  stdio: 'inherit',
  shell: true,
});

// Wait a bit for Next.js to start listening on port 3000
setTimeout(() => {
  const http = require('http');
  
  // Create HTTPS server that proxies to Next.js HTTP server
  const options = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  };

  const server = https.createServer(options, (req, res) => {
    // Proxy requests to the Next.js dev server
    const proxyReq = http.request(
      {
        hostname: 'localhost',
        port: 3000,
        path: req.url,
        method: req.method,
        headers: req.headers,
      },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
      }
    );

    req.pipe(proxyReq);

    proxyReq.on('error', (err) => {
      console.error('Proxy error:', err);
      res.writeHead(502);
      res.end('Bad Gateway');
    });
  });

  server.listen(3443, () => {
    console.log('\n✅ HTTPS Server running at https://localhost:3443');
    console.log('📡 Next.js dev server running at http://localhost:3000');
    console.log('\nOpen https://localhost:3443 in your browser');
    console.log('Stripe automatic payment methods are now enabled! ✓\n');
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error('❌ Port 3443 is already in use');
      console.error('Kill the process or change the port number');
    } else {
      console.error('Server error:', err);
    }
    process.exit(1);
  });
}, 2000);

nextProcess.on('exit', (code) => {
  console.log('\nNext.js dev server stopped');
  process.exit(code);
});

// Handle interruption
process.on('SIGINT', () => {
  console.log('\nShutting down...');
  nextProcess.kill();
  process.exit(0);
});
