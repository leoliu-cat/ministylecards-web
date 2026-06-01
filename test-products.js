import https from 'https';

https.get('https://admin.ministylecards.com/api/products', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => { 
    try {
      const json = JSON.parse(data);
      json.forEach(j => console.log(j.id, j.slug, j.title));
    } catch(e) {
      console.log(e);
    }
  });
}).on('error', (err) => { console.log("Error: " + err.message); });
