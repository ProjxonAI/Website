import fs from 'fs';

async function testQuote() {
  const formData = new FormData();
  formData.append('name', 'Prod Tester');
  formData.append('email', 'test@example.com');
  formData.append('company', 'Vercel Edge Test');
  formData.append('purpose', 'Validating that the Edge streaming heartbeat bypasses the 25s timeout limit.');
  
  const blob = new Blob(['Test file content'], { type: 'text/plain' });
  formData.append('data_examples', blob, 'examples.txt');

  console.log('Sending multipart/form-data to https://www.projxon.ai/api/quote...');
  console.log('Waiting for the 2-minute LLM execution...');
  
  try {
    let res = await fetch('https://www.projxon.ai/api/quote', {
      method: 'POST',
      body: formData
    });

    console.log('Status:', res.status);
    const text = await res.text();
    try {
      const json = JSON.parse(text);
      console.log('SUCCESS! Parsed JSON Success from Production:', JSON.stringify(json, null, 2));
    } catch (e) {
      console.log('Parse Failed - Raw Text:', text);
    }
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

testQuote();
