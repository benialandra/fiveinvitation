import http from "http";

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/admin/themes/elegant-gold',
  method: 'PUT',
  headers: {
    'Content-Type': 'multipart/form-data; boundary=boundary123'
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Body:', data);
  });
});

req.on('error', (e) => {
  console.error(e);
});

req.write('--boundary123\r\n');
req.write('Content-Disposition: form-data; name="config_json"\r\n\r\n');
req.write('{"colors": {"primary": "red"}}\r\n');
req.write('--boundary123--\r\n');
req.end();
