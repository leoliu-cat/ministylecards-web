import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateSitemap() {
  const BASE_URL = "https://www.ministylecards.com";
  let urls = [
    `${BASE_URL}/`,
    `${BASE_URL}/wedding-invitations`,
    `${BASE_URL}/marriage-certificate`,
    `${BASE_URL}/wedding-favors`,
    `${BASE_URL}/essential-design`,
    `${BASE_URL}/illustration`,
    `${BASE_URL}/wedding-website`,
    `${BASE_URL}/process`,
    `${BASE_URL}/about`,
    `${BASE_URL}/contact`,
    `${BASE_URL}/collections/new-arrival`,
    `${BASE_URL}/collections`,
    `${BASE_URL}/journal`,
  ];

  try {
    console.log('Fetching products, collections, and journals for sitemap...');
    const [productsRes, collectionsRes, journalsRes] = await Promise.all([
      fetch('https://admin.ministylecards.com/api/products?limit=1000').then(r => r.json()).catch(() => []),
      fetch('https://admin.ministylecards.com/api/collections?limit=1000').then(r => r.json()).catch(() => []),
      fetch('https://admin.ministylecards.com/api/journals?limit=1000').then(r => r.json()).catch(() => []) 
    ]);

    const productsData = Array.isArray(productsRes) ? productsRes : productsRes?.docs || [];
    const collectionsData = Array.isArray(collectionsRes) ? collectionsRes : collectionsRes?.docs || [];
    const journalsData = Array.isArray(journalsRes) ? journalsRes : journalsRes?.docs || [];

    productsData.forEach(p => {
       if (p.slug) urls.push(`${BASE_URL}/product/${p.slug}`);
    });

    collectionsData.forEach(c => {
       if (c.slug) urls.push(`${BASE_URL}/collections/${c.slug}`);
    });

    journalsData.forEach(j => {
       if (j.id) urls.push(`${BASE_URL}/journal/${j.id}`);
    });

    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>${url === BASE_URL + '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

    const publicDir = path.join(__dirname, 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir);
    }
    
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapContent);
    console.log(`Generated sitemap.xml with ${urls.length} URLs`);

    const robotsContent = `User-agent: *
Allow: /
Sitemap: ${BASE_URL}/sitemap.xml
`;
    fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsContent);
    console.log(`Generated robots.txt`);
  } catch (err) {
    console.error('Error generating sitemap:', err);
  }
}

generateSitemap();
