async function run() {
  const loginRes = await fetch('https://admin.ministylecards.com/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'happyapplelee@gmail.com', password: 'password123' })
  });
  console.log('login', loginRes.status, await loginRes.text());
  
  const regRes = await fetch('https://admin.ministylecards.com/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test_order_' + Date.now() + '@example.com', password: 'password123', name: 'Test User' })
  });
  console.log('register', regRes.status, await regRes.text());
}
run();
