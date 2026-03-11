import fs from 'fs';

async function testQuote() {
  const formData = new FormData();
  formData.append('name', 'Hudson Gouge');
  formData.append('email', 'hudson@example.com');
  formData.append('company', 'Acme Corp');
  formData.append('entity_type', 'business');
  formData.append('entity_size', '100-500');
  formData.append('purpose', 'We need a system to parse our internal Notion and Google Drive docs to answer employee HR queries.');
  formData.append('latency', 'Real-time');
  formData.append('deployment', 'Private Cloud');
  formData.append('data_status', 'partial');
  formData.append('data_scale', '10,000 documents');
  formData.append('verifiable', 'no');
  formData.append('dpo_willingness', 'yes');
  formData.append('rag_format', 'PDFs and Confluence');
  formData.append('automation_tools', 'Zapier and Salesforce');
  formData.append('email_copy', 'yes');
  formData.append('current_workflow', 'Support team manually reads through thousands of emails to route them.');
  formData.append('success_metrics', '99% classification accuracy, sub-1s latency');
  formData.append('data_freshness', 'realtime');
  formData.append('compliance_security', 'GDPR compliant, no PII retention');
  
  // Fake file upload
  const blob = new Blob(['Test file content'], { type: 'text/plain' });
  formData.append('data_examples', blob, 'examples.txt');

  console.log('Sending multipart/form-data to http://localhost:3000/api/quote...');
  
  try {
    let res = await fetch('http://localhost:3000/api/quote', {
      method: 'POST',
      body: formData
    });
    
    // If it 404s, try 3001 (where Vercel dev might be running instead of serve)
    if (res.status === 404) {
      console.log('Got 404 on port 3000, trying port 3001 (Vercel Dev)...');
      res = await fetch('http://localhost:3001/api/quote', {
        method: 'POST',
        body: formData
      });
    }

    console.log('Status:', res.status);
    const text = await res.text();
    try {
      const json = JSON.parse(text);
      console.log('Parsed JSON Success:', JSON.stringify(json, null, 2));
    } catch (e) {
      console.log('Raw Text:', text);
    }
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

testQuote();
