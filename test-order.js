const fetch = require('node-fetch');
async function run() {
  const res = await fetch('https://admin.ministylecards.com/api/orders', { method: 'POST', body: '{}', headers: { 'Content-Type': 'application/json' } });
  console.log(res.status);
  console.log(await res.text());
}
run();
