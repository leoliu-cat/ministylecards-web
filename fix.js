const fs = require('fs');

const mappings = {
  'src/components/CategoryLayout.tsx': [ { search: "fetch(``)", replace: "fetch(`${API_BASE_URL}/api/collections`)" } ],
  'src/components/Layout.tsx': [ 
    { search: "fetch(``)", replace: "fetch(`${API_BASE_URL}/api/categories`)", instance: 0 },
    { search: "fetch(``)", replace: "fetch(`${API_BASE_URL}/api/products`)", instance: 1 }
  ],
  'src/pages/ContactPage.tsx': [ { search: "fetch(``, {", replace: "fetch(`${API_BASE_URL}/api/send-email`, {" } ],
  'src/pages/CollectionDetailPage.tsx': [
    { search: "fetch(``).then", replace: "fetch(`${API_BASE_URL}/api/collections`).then", instance: 0 },
    { search: "fetch(``).then", replace: "fetch(`${API_BASE_URL}/api/products`).then", instance: 1 }
  ],
  'src/pages/HomePage.tsx': [ { search: "fetch(``)", replace: "fetch(`${API_BASE_URL}/api/collections`)" } ],
  'src/pages/CategoryPage.tsx': [ { search: "fetch(``)", replace: "fetch(`${API_BASE_URL}/api/products`)" } ],
  'src/pages/MarriageCertificatePage.tsx': [ { search: "fetch(``)", replace: "fetch(`${API_BASE_URL}/api/products`)" } ],
  'src/pages/CollectionsPage.tsx': [ { search: "fetch(``)", replace: "fetch(`${API_BASE_URL}/api/collections`)" } ],
  'src/pages/WeddingFavorsPage.tsx': [ { search: "fetch(``)", replace: "fetch(`${API_BASE_URL}/api/products`)" } ],
  'src/pages/JournalPage.tsx': [ 
    { search: "fetch(``)", replace: "fetch(`${API_BASE_URL}/api/posts`)" },
    { search: "fetch(``)", replace: "fetch(`${API_BASE_URL}/api/posts/${post.slug}`)" }
  ],
  'src/pages/IllustrationPage.tsx': [
    { search: "fetch(``).then", replace: "fetch(`${API_BASE_URL}/api/collections`).then", instance: 0 },
    { search: "fetch(``).then", replace: "fetch(`${API_BASE_URL}/api/products`).then", instance: 1 }
  ],
  'src/pages/EssentialDesignPage.tsx': [
    { search: "fetch(``).then", replace: "fetch(`${API_BASE_URL}/api/collections`).then", instance: 0 },
    { search: "fetch(``).then", replace: "fetch(`${API_BASE_URL}/api/products`).then", instance: 1 }
  ],
  'src/pages/ProductDetailPage.tsx': [
    { search: "fetch(``).then", replace: "fetch(`${API_BASE_URL}/api/products`).then", instance: 0 },
    { search: "fetch(``).then", replace: "fetch(`${API_BASE_URL}/api/collections`).then", instance: 1 },
    { search: "fetch(``)", replace: "fetch(`${API_BASE_URL}/api/addon_groups`)", instance: 2 },
    { search: "fetch(``)", replace: "fetch(`${API_BASE_URL}/api/admin/website/pricing_rules`)", instance: 3 }
  ],
  'src/pages/CheckoutPage.tsx': [ { search: "fetch(``, {", replace: "fetch(`${API_BASE_URL}/api/pay`, {" } ],
  'src/pages/JournalDetailPage.tsx': [ { search: "fetch(``)", replace: "fetch(`${API_BASE_URL}/api/posts/${journalId}`)" } ]
};

for (const [file, ops] of Object.entries(mappings)) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    let idxMap = {};
    
    // We will do replacements sequentially
    for (const op of ops) {
      if (op.instance !== undefined) {
        // Find the nth occurrence
        let pos = -1;
        for (let i = 0; i <= op.instance; i++) {
          pos = content.indexOf(op.search, pos + 1);
          if (pos === -1) break;
        }
        if (pos !== -1) {
          content = content.substring(0, pos) + op.replace + content.substring(pos + op.search.length);
        }
      } else {
        content = content.replace(op.search, op.replace);
      }
    }
    fs.writeFileSync(file, content);
    console.log('Fixed', file);
  }
}
