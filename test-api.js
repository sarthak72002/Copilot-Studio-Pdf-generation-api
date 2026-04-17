// Quick test script for the Trust Document API
const http = require('http');

const data = JSON.stringify({
  trustName: "Smith Family Trust",
  trustType: "Discretionary Family Trust",
  trustee: "John Smith",
  beneficiaries: ["Sarah Smith", "Emma Smith", "Michael Smith"],
  state: "NSW",
  initialAssets: [
    { assetType: "Property", estimatedValue: 850000 },
    { assetType: "Shares", estimatedValue: 250000 },
    { assetType: "Cash", estimatedValue: 100000 }
  ],
  distributionType: "Discretionary (tax-effective distributions)"
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/documents/trust',
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
