import https from 'https';
const endpoints = ['posts', 'journal-articles', 'blogs', 'blog-posts'];
endpoints.forEach(ep => {
  https.get(`https://admin.ministylecards.com/api/${ep}`, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => console.log(`Endpoint /api/${ep}: ${res.statusCode} ${res.headers['content-type']}`));
  }).on('error', () => {});
});
