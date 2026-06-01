async function run() {
  const regRes = await fetch('https://admin.ministylecards.com/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test_cart_' + Date.now() + '@example.com', password: 'password123', name: 'Test User' })
  });
  const regData = await regRes.json();
  const token = regData.token;

  // Add to cart
  const cartRes = await fetch('https://admin.ministylecards.com/api/cart', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      product_id: 1,
      quantity: 1,
      variant_id: null,
      customizations: []
    })
  });
  console.log("Cart Add:", cartRes.status, await cartRes.text());
}
run();
