import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  canonicalUrl?: string;
  jsonLd?: Record<string, any>;
}

export function SEO({
  title = "Mini Style Cards | 打造專屬妳的婚禮時刻",
  description = "Mini Style Cards 提供高質感的客製化喜帖、婚禮邀請卡與謝卡。快速設計與印刷，讓每一個珍貴時刻完美呈現。",
  keywords = "喜帖, 婚禮邀請卡, 謝卡, 印刷, 客製化喜帖",
  image = "/og-image.jpg", // Replace with an actual OG image
  url,
  canonicalUrl,
  jsonLd,
}: SEOProps) {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  const isBeta = hostname.includes('beta') || hostname.includes('run.app') || hostname.includes('localhost');
  const path = typeof window !== 'undefined' ? window.location.pathname : '';
  
  const autoUrl = `https://www.ministylecards.com${path}`;
  const finalUrl = url || autoUrl;
  const finalCanonicalUrl = canonicalUrl || autoUrl;

  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Conditional Robots Meta */}
      {isBeta && <meta name="robots" content="noindex,nofollow" />}

      {/* Canonical URL */}
      <link rel="canonical" href={finalCanonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={finalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data / JSON-LD */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}

