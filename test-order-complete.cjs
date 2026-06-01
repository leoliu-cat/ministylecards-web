async function run() {
  const regRes = await fetch('https://admin.ministylecards.com/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test_order_complete_' + Date.now() + '@example.com', password: 'password123', name: 'Test User' })
  });
  const t = (await regRes.json()).token;

  await fetch('https://admin.ministylecards.com/api/cart/items', {
      method: 'POST',
      headers: {'Authorization':'Bearer '+t, 'Content-Type':'application/json'},
      body: JSON.stringify({ product_id: 1, quantity: 2, config: { customizations: [{id: 1, name: 'Test'}] } })
  });
  
  const orderRes = await fetch('https://admin.ministylecards.com/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${t}`
    },
    body: JSON.stringify({
      shipping_info: { name: "Test Name", phone: "0912345678", address: "Test Address" },
      payment_method: "tappay",
      coupon_code: ""
    })
  });
  console.log('Order status:', orderRes.status);
  console.log('Order response:', await orderRes.text());
}
run();
