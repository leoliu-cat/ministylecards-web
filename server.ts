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
      if (req.path === '/api/send-email') {
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
