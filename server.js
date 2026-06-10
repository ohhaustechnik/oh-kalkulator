const http = require('http');
const https = require('https');

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/api/kalk') {
    let body = '';
    req.on('data', d => body += d);
    req.on('end', () => {
      const key = req.headers['x-api-key'];
      const pr = https.request({
        hostname: 'api.anthropic.com',
        path: '/v1/messages',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
          'Content-Length': Buffer.byteLength(body)
        }
      }, r => {
        let d = '';
        r.on('data', c => d += c);
        r.on('end', () => {
          res.writeHead(200, {'Content-Type':'application/json','Access-Control-Allow-Origin':'*'});
          res.end(d);
        });
      });
      pr.write(body);
      pr.end();
    });
  } else {
    res.writeHead(200, {'Content-Type':'text/plain'});
    res.end('OK');
  }
});

server.listen(process.env.PORT || 3000, '0.0.0.0');
