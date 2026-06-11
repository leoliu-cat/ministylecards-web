import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { Resend } from "resend";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";
import compression from "compression";

dotenv.config();

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const apiCache = new Map<string, { data: any; expiresAt: number }>();

async function fetchWithCache(url: string, res: express.Response) {
  const now = Date.now();
  const cacheKey = url;
  const cached = apiCache.get(cacheKey);

  // Return cached data if valid
  if (cached && cached.expiresAt > now) {
    return res.json(cached.data);
  }

  try {
    const targetUrl = `https://admin.ministylecards.com${url}`;
    const response = await fetch(targetUrl);
    
    if (!response.ok) {
      throw new Error(`Upstream API error: ${response.status}`);
    }
    
    const data = await response.json();
    apiCache.set(cacheKey, { data, expiresAt: now + CACHE_TTL });
    res.json(data);
  } catch (err) {
    console.error(`Cache fetch error for ${url}:`, err);
    // Serve stale cache if available
    if (cached) {
      return res.json(cached.data);
    }
    res.status(500).json({ error: "Failed to fetch from backend" });
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // App-level compression
  app.use(compression());

  const apiProxy = createProxyMiddleware({
    target: "https://admin.ministylecards.com",
    changeOrigin: true,
  });

  app.use((req, res, next) => {
    // Intercept cacheable GET endpoints before they hit proxy
    if (req.method === 'GET' && (req.path === '/api/products' || req.path === '/api/collections' || req.path === '/api/categories')) {
      // reconstruct url to pass query params exactly (like ?limit=1000)
      return fetchWithCache(req.originalUrl, res);
    }

    if (req.path.startsWith('/api/') || req.path === '/api') {
      if (req.path === '/api/send-email' || req.path === '/api/pay') {
        return next();
      }
      return apiProxy(req, res, next);
    }
    return next();
  });

  // Middleware to parse JSON bodies for our own custom routes
  app.use(express.json({ limit: '10mb' }));

  // API Route for sending email
  app.post("/api/send-email", async (req, res) => {
    try {
      const { name, email, phone, subject, message } = req.body;
      const resendKey = process.env.RESEND_API_KEY;

      if (!resendKey) {
        return res.status(500).json({ error: "RESEND_API_KEY environment variable is not set." });
      }

      const resend = new Resend(resendKey);

      let subjectText = "聯絡表單";
      if (subject === "wedding-invitation") subjectText = "喜帖訂做";
      if (subject === "illustration") subjectText = "插畫繪製";
      if (subject === "other") subjectText = "其他合作";

      const htmlContent = `
        <h3>新的聯絡表單訊息</h3>
        <p><strong>姓名：</strong> ${name}</p>
        <p><strong>Email：</strong> ${email}</p>
        <p><strong>電話：</strong> ${phone || "未提供"}</p>
        <p><strong>主題：</strong> ${subjectText}</p>
        <p><strong>訊息：</strong></p>
        <p>${message}</p>
      `;

      const { data, error } = await resend.emails.send({
        from: "MINIStyleCards <info@ministylecards.com>",
        to: ["info@ministylecards.com"],
        subject: `MINIStyleCards 聯絡表單 - ${subjectText} - ${name}`,
        html: htmlContent,
      });

      if (error) {
        console.error("Resend Error:", error);
        return res.status(400).json({ error });
      }

      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ error: "Failed to send email." });
    }
  });

  // TapPay Pay By Prime API
  app.post("/api/pay", async (req, res) => {
    try {
      const { prime, amount, cardholder } = req.body;
      
      const partnerKey = (process.env.TAPPAY_PARTNER_KEY || "partner_ZaOrjOXKW8tatPaQsx2LDH3HOEF1FKgWp1jLVBFBYElX6vbyz0EHOorY").trim();
      const merchantId = (process.env.TAPPAY_MERCHANT_ID || "ministyle_CTBC").trim();
      
      if (!process.env.TAPPAY_PARTNER_KEY || !process.env.TAPPAY_MERCHANT_ID) {
         console.warn('TapPay 測試參數缺失，將使用預設佔位符，可能導致 API 認證失敗。請在環境變數設定 TAPPAY_PARTNER_KEY 與 TAPPAY_MERCHANT_ID。');
      }

      const tapPayEnv = process.env.TAPPAY_ENV || 'sandbox';
      const tapPayUrl = tapPayEnv === 'production' 
        ? 'https://prod.tappaysdk.com/tpc/payment/pay-by-prime'
        : 'https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime';

      console.log('TapPay API Request Debug:');
      console.log('- Environment:', tapPayEnv);
      console.log('- Merchant ID used:', merchantId);
      console.log('- Partner Key prefix:', partnerKey.substring(0, 15) + '...');
      console.log('- TapPay URL:', tapPayUrl);

      const response = await fetch(tapPayUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": partnerKey,
        },
        body: JSON.stringify({
          prime: prime,
          partner_key: partnerKey,
          merchant_id: merchantId,
          details: "Mini Style Cards Order",
          amount: amount,
          cardholder: cardholder,
          remember: false,
        }),
      });

      const data = await response.json();
      if (data.status !== 0) {
        console.error("TapPay Error:", data);
        return res.status(400).json({ 
          error: data.msg || "Payment failed", 
          details: data,
          debug: { merchantId, partnerKeyLength: partnerKey.length } 
        });
      }

      // Send email with Receipt via Resend
      const { receiptPdf, orderDetails } = req.body;
      console.log("receiptPdf length:", receiptPdf ? receiptPdf.length : 0);
      if (receiptPdf) {
         console.log("receiptPdf start:", receiptPdf.substring(0, 50));
      }
      const resendKey = process.env.RESEND_API_KEY;
      if (resendKey) {
        try {
          const resend = new Resend(resendKey);
          const emailHtml = `
            <h2>感謝您的訂購！這是您的 Mini Style Cards 訂單明細</h2>
            <p>親愛的 ${cardholder.name} 您好：</p>
            <p>我們已收到您的付款（訂單處理中）。</p>
            <br/>
            <h3>訂單摘要：</h3>
            <ul>
              ${orderDetails?.items?.map((item: any) => `
                <li>${item.name} x ${item.quantity} - $${item.price * item.quantity}
                  ${item.eventDate ? `<br/><span style="color: #c98f6a">宴客 / 活動日期: ${item.eventDate}</span>` : ''}
                  ${item.customizations?.length > 0 ? `<ul>${item.customizations.map((c: any) => `<li>+ ${c.name}${c.desc && c.desc !== c.name && c.desc !== '數量未滿 100 份酌收基本上機費' ? ` - ${c.desc}` : ''} ${c.price > 0 ? '(+NT$ ' + c.price.toLocaleString('zh-TW') + ')' : ''}</li>`).join('')}</ul>` : ''}
                </li>
              `).join('')}
            </ul>
            <p>總金額：NT$ ${Number(amount).toLocaleString('zh-TW')}</p>
            <p>這封郵件包含了您的訂單詳細內容與製作條款的 PDF 附檔，請查收。</p>
            <br/>
            <p style="color: #666; font-size: 0.9em; margin-bottom: 20px;">這封郵件是系統自動發出，請不要直接回覆。如有任何問題請隨時與我們聯繫：<br/>
            info@ministylecards.com / 03-4687530</p>
            <p>Mini Style Cards 團隊敬上</p>
          `;

          const attachments = receiptPdf ? [
            {
              filename: 'receipt.pdf',
              content: receiptPdf, // base64 string
              contentType: 'application/pdf',
            }
          ] : [];

          const emailRes = await resend.emails.send({
            from: "Mini Style Cards <info@ministylecards.com>",
            to: [cardholder.email, "info@ministylecards.com"],
            subject: "Mini Style Cards - 訂單成功通知與明細",
            html: emailHtml,
            attachments
          });
          
          if (emailRes.error) {
             console.error("Resend API returned error:", emailRes.error);
          } else {
             console.log("Email sent successfully to", cardholder.email);
          }
        } catch (emailErr) {
          console.error("Failed to send order email:", emailErr);
          // Don't fail the payment if email fails
        }
      }

      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error("Payment Error:", error);
      res.status(500).json({ error: "Server payment error." });
    }
  });

  // Sitemap
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const BASE_URL = "https://www.ministylecards.com";
      const [productsRes, collectionsRes, journalsRes] = await Promise.all([
        fetch('https://admin.ministylecards.com/api/products?limit=1000').then(r => r.json()),
        fetch('https://admin.ministylecards.com/api/collections?limit=1000').then(r => r.json()),
        fetch('https://admin.ministylecards.com/api/journals?limit=1000').then(r => r.json()).catch(() => []) 
      ]).catch(() => [[], [], []]); // fallback

      const urls = [
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

      if (Array.isArray(productsRes)) {
        productsRes.forEach((p: any) => {
           if (p.slug) urls.push(`${BASE_URL}/product/${p.slug}`);
        });
      }
      if (Array.isArray(collectionsRes)) {
        collectionsRes.forEach((c: any) => {
           if (c.slug) urls.push(`${BASE_URL}/collections/${c.slug}`);
        });
      }
      if (Array.isArray(journalsRes)) {
        journalsRes.forEach((j: any) => {
           if (j.id) urls.push(`${BASE_URL}/journal/${j.id}`);
        });
      }

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Array.from(new Set(urls)).map(url => `  <url>\n    <loc>${url}</loc>\n  </url>`).join('\n')}
</urlset>`;

      res.header('Content-Type', 'application/xml');
      res.send(sitemap);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error generating sitemap');
    }
  });

  // Robots.txt
  app.get("/robots.txt", (req, res) => {
    const host = req.hostname || req.get('host') || '';
    if (host.includes('beta.ministylecards.com') || host.includes('run.app') || host.includes('localhost')) {
      return res.type('text/plain').send("User-agent: *\nDisallow: /\n");
    }
    const robots = "User-agent: *\nDisallow:\nSitemap: https://www.ministylecards.com/sitemap.xml\n";
    res.type('text/plain').send(robots);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    
    // We must use vite middlewares AFTER our custom API routes
    // But remember we have proxy setup in vite.config.ts!
    // The vite proxy will still intercept other /api calls and forward them to admin.ministylecards.com.
    app.use(vite.middlewares);
  } else {
    // Production setup
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
