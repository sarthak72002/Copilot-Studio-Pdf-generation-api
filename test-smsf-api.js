// Quick test script for the SMSF Document API
const http = require('http');

const data = JSON.stringify({
  fundName: "Smith Super Fund",
  trusteeType: "Corporate Trustee",
  corporateCompanyName: "Smith Pty Ltd",
  members: ["John Smith", "Jane Smith"],
  state: "NSW"
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/documents/smsf',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log(`\nStatus: ${res.statusCode}`);
    console.log('Response:');
    console.log(JSON.stringify(JSON.parse(body), null, 2));
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
});

req.write(data);
req.end();
