import fs from 'fs';
fetch('https://admin.ministylecards.com/api/products?limit=5')
  .then(res => res.json())
  .then(data => {
    fs.writeFileSync('products-test.json', JSON.stringify(data, null, 2));
  });
