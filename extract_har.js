// extract_har.js
const fs = require('fs');
const path = require('path');

if (process.argv.length < 4) {
  console.error('Usage: node extract_har.js <har-file> <match-text>');
  process.exit(2);
}

const harPath = process.argv[2];
const match = process.argv[3];

const raw = fs.readFileSync(harPath, 'utf8');
const har = JSON.parse(raw);
const entries = (har.log && har.log.entries) || [];

const matched = entries.filter(e => {
  try {
    const url = e.request?.url || '';
    return url.includes(match) || JSON.stringify(e.request || '').includes(match) || JSON.stringify(e.response || '').includes(match);
  } catch (err) { return false; }
});

if (matched.length === 0) {
  console.log('No matching entries found for:', match);
  process.exit(0);
}

matched.forEach((e, i) => {
  console.log('--- ENTRY', i+1, '---');
  console.log('Request URL:', e.request?.url);
  console.log('Method:', e.request?.method);
  console.log('Status:', e.response?.status);
  console.log('Request headers:', JSON.stringify((e.request && e.request.headers) || [], null, 2));
  if (e.request.postData && e.request.postData.text) {
    console.log('Request body:', e.request.postData.text);
  } else {
    console.log('Request body: <empty>');
  }
  if (e.response.content && e.response.content.text) {
    try {
      const txt = e.response.content.text;
      // HAR may store encoded text; try to output plain
      console.log('Response body:', txt);
    } catch (err) {
      console.log('Response body: <unreadable>');
    }
  } else {
    console.log('Response body: <empty>');
  }
  console.log('');
});