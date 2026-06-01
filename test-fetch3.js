import https from 'https';
const endpoints = ['posts', 'journal', 'journals', 'articles', 'news'];
endpoints.forEach(ep => {
  https.get(`https://admin.ministylecards.com/api/${ep}`, (res) => {
    console.log(`Endpoint /api/${ep}: ${res.statusCode} ${res.headers['content-type']}`);
  }).on('error', () => {});
});
