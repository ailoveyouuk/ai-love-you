const http = require('http');
http.get('http://localhost:8000/script.js', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log(data.includes('typeof window.initMobileEditionNav'));
  });
});
