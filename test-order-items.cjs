async function run() {
  const regRes = await fetch('https://admin.ministylecards.com/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test_order_items_' + Date.now() + '@example.com', password: 'password123', name: 'Test User' })
  });
  const regData = await regRes.json();
  const token = regData.token;

  const orderRes = await fetch('https://admin.ministylecards.com/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      shipping_info: {
        name: "Test Name",
        phone: "0912345678",
        address: "Test Address"
      },
      payment_method: "tappay",
      coupon_code: "",
      items: [
        {
          product_id: 1,
          quantity: 1
        }
      ]
    })
  });
  console.log(orderRes.status);
  console.log(await orderRes.text());
}
run();
