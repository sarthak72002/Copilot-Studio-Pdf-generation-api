const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ============================================
// Trust Document Generation Endpoint
// ============================================
app.post('/documents/trust', (req, res) => {
  console.log('\n📥 Received Trust Document Request:');
  console.log(JSON.stringify(req.body, null, 2));

  const { trustName, trustType, trustee, beneficiaries, state, initialAssets, distributionType } = req.body;

  // Validation - check required fields
  const missingFields = [];
  if (!trustName) missingFields.push('trustName');
  if (!trustee) missingFields.push('trustee');
  if (!beneficiaries || !Array.isArray(beneficiaries) || beneficiaries.length === 0) {
    missingFields.push('beneficiaries');
  }

  if (missingFields.length > 0) {
    console.log('❌ Validation failed:', missingFields);
    return res.status(400).json({
      error: `Missing required fields: ${missingFields.join(', ')}`,
      code: 'VALIDATION_ERROR'
    });
  }

  // Generate document ID
  const documentId = `doc_${uuidv4().split('-')[0]}`;

  // Calculate price based on trust type
  let basePrice = 299;
  if (trustType === 'Discretionary Family Trust') basePrice = 341;
  else if (trustType === 'Unit Trust') basePrice = 389;
  else if (trustType === 'Hybrid Trust') basePrice = 429;
  else if (trustType === 'Testamentary Trust') basePrice = 499;

  // Build document name
  const docState = state || 'NSW';
  const docType = trustType || 'Discretionary Family Trust';
  const shortType = docType.includes('Discretionary') ? 'Discretionary Trust Deed'
    : docType.includes('Unit') ? 'Unit Trust Deed'
    : docType.includes('Hybrid') ? 'Hybrid Trust Deed'
    : docType.includes('Testamentary') ? 'Testamentary Trust Deed'
    : 'Trust Deed';

  const documentName = `${shortType} (${docState})`;

  // Build the response
  const response = {
    documentId: documentId,
    documentName: documentName,
    status: 'LOCKED',
    pdfUrl: `${req.protocol}://${req.get('host')}/documents/${documentId}/download`,
    paymentUrl: `${req.protocol}://${req.get('host')}/pay/${documentId}`,
    price: basePrice,
    includedServices: [
      '12 months of ongoing legal support',
      'Legal review by qualified lawyer',
      'Trustee Resolutions',
      'Complete Trust Deed (professionally drafted)'
    ]
  };

  console.log('\n✅ Generated Trust Document:');
  console.log(JSON.stringify(response, null, 2));

  return res.status(200).json(response);
});

// ============================================
// PDF Download Endpoint (mock - returns locked message)
// ============================================
app.get('/documents/:documentId/download', (req, res) => {
  return res.status(403).json({
    error: 'Document is locked. Please complete payment first.',
    code: 'DOCUMENT_LOCKED',
    paymentUrl: `${req.protocol}://${req.get('host')}/pay/${req.params.documentId}`
  });
});

// ============================================
// Payment Page (mock - returns payment info)
// ============================================
app.get('/pay/:documentId', (req, res) => {
  return res.status(200).json({
    documentId: req.params.documentId,
    status: 'PENDING_PAYMENT',
    message: 'Please use the Tax Compass payment portal to complete your purchase.',
    paymentMethods: ['Credit Card', 'PayPal', 'Bank Transfer']
  });
});

// ============================================
// Health Check
// ============================================
app.get('/', (req, res) => {
  res.json({
    service: 'Compass AI Trust Document API',
    status: 'running',
    version: '1.0.0',
    endpoints: {
      generateTrust: 'POST /documents/trust',
      downloadPdf: 'GET /documents/:id/download',
      payment: 'GET /pay/:id'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Trust Document API running on http://localhost:${PORT}`);
  console.log(`\n📋 Available endpoints:`);
  console.log(`   POST http://localhost:${PORT}/documents/trust`);
  console.log(`   GET  http://localhost:${PORT}/documents/:id/download`);
  console.log(`   GET  http://localhost:${PORT}/pay/:id`);
  console.log(`   GET  http://localhost:${PORT}/  (health check)\n`);
});
