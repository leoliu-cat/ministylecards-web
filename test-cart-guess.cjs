async function run() {
  const urls = ['cart_items', 'carts', 'website/cart', 'website/cart_items', 'user/cart', 'me/cart'];
  
  const regRes = await fetch('https://admin.ministylecards.com/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test_cart_guess_' + Date.now() + '@example.com', password: 'password123', name: 'Test User' })
  });
  const regData = await regRes.json();
  const token = regData.token;

  for (const url of urls) {
      const res = await fetch(`https://admin.ministylecards.com/api/${url}`, {
          method: 'POST',
          headers: {
             'Content-Type': 'application/json',
             'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ product_id: 1, quantity: 1 })
      });
      console.log(`POST /api/${url}`, res.status);
  }
}
run();
