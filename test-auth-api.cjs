async function run() {
  const email = "happyapplelee@gmail.com";
  const res1 = await fetch('https://admin.ministylecards.com/api/auth/send-verification-code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  console.log("send", await res1.json());
}
run();
