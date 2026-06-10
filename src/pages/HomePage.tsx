import { API_BASE_URL } from '../config';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

const categories = [
  { title: '喜帖', desc: '最美麗的邀請函', icon: '♡', href: '/wedding-invitations' },
  { title: '結婚書約', desc: '超越更有儀式感', icon: '▦', href: '/marriage-certificate' },
  { title: '婚禮小物', desc: '傳遞感謝的小心意', icon: '□', href: '/wedding-favors' },
  { title: '必備設計', desc: '迎賓牌、席次表、菜單等', icon: '♧', href: '/essential-design' },
  { title: '插畫繪製', desc: '客製插畫，讓設計更有溫度', icon: '✎', href: '/illustration' },
  { title: '婚禮網站', desc: '專屬你的婚禮網站', icon: '⌘', href: '/wedding-website' },
];

const collections = [
  {
    title: '簡約時尚',
    subtitle: 'Minimal & Modern',
    href: '/collections/minimal-modern',
    className: 'large',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80',
    alt: '簡約時尚婚禮喜帖設計',
  },
  {
    title: '浪漫花卉',
    subtitle: 'Romantic Floral',
    href: '/collections/romantic-floral',
    image: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=900&q=80',
    alt: '浪漫花卉婚禮喜帖設計',
  },
  {
    title: '婚紗照片',
    subtitle: 'Wedding Photo',
    href: '/collections/wedding-photo',
    className: 'tall',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80',
    alt: '婚紗照片喜帖設計',
  },
  {
    title: '似顏繪',
    subtitle: 'Portrait Illustration',
    href: '/collections/portrait-illustration',
    image: 'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=900&q=80',
    alt: '似顏繪插畫喜帖設計',
  },
  {
    title: '現代中式',
    subtitle: 'Modern Chinese',
    href: '/collections/modern-chinese',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80',
    alt: '現代中式婚禮喜帖設計',
  },
];

export function HomePage() {
  const [apiCollections, setApiCollections] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/collections?limit=1000`)
      .then(res => res.json())
      .then(data => {
        const collectionsData = Array.isArray(data) ? data : data?.docs || [];
        // Filter out illustrator collections so they don't appear in Featured Collections
        // The user can keep them "Visible" in the admin panel so they show up on the Illustration page.
        const featuredCollections = collectionsData.filter((c: any) => !c.slug.includes('illustrator') && !c.title.includes('老師'));
        setApiCollections(featuredCollections.slice(0, 5));
      })
      .catch(err => console.warn('Could not fetch collections (possibly dev server restart):', err.message));
  }, []);

  // Use the fetched collections if available, otherwise fallback to hardcoded
  const displayCollections = apiCollections.length > 0 
    ? apiCollections.map((c, index) => ({
        title: c.title,
        subtitle: c.description || '',
        href: `/collections/${c.slug}`,
        className: index === 0 ? 'large' : (index === 2 ? 'tall' : ''),
        image: c.cover_image ? `https://admin.ministylecards.com${c.cover_image}` : 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80',
        alt: c.cover_image_alt || c.title
      }))
    : collections;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Mini Style Cards",
    "url": "https://ministylecards.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://ministylecards.com/collections?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <SEO 
        title="Mini Style Cards | 打造專屬妳的婚禮時刻"
        description="Mini Style Cards 提供高質感的客製化喜帖、婚禮邀請卡與謝卡。首頁嚴選推薦商品，讓每一個珍貴時刻完美呈現。"
        url="https://ministylecards.com"
        canonicalUrl="https://ministylecards.com"
        jsonLd={jsonLd}
      />
      <section className="flex flex-col md:block md:relative md:h-[600px] overflow-hidden bg-[#f3ede8]">
        <div className="w-full h-[360px] relative md:h-auto md:absolute md:inset-0 md:z-0 md:w-[85%] lg:w-[80%]">
          <img
            src="https://cdn.ministylecards.com/hero/custom-wedding-rings-and-invitation.jpg"
            alt="MINIStyleCards 客製化婚禮喜帖、信封與戒指情境照"
            className="absolute inset-0 w-full h-full object-cover object-center md:object-left md:mask-image-[linear-gradient(to_right,white_70%,transparent_100%)]"
            style={{ WebkitMaskImage: 'linear-gradient(to right, white 60%, transparent 100%)', maskImage: 'linear-gradient(to right, white 60%, transparent 100%)' }}
          />
        </div>
        
        <div className="relative z-10 flex flex-col md:h-full md:flex-row md:items-center md:justify-end px-6 py-12 md:px-12 lg:px-24 md:py-0 w-full">
          <div className="w-full md:w-auto md:max-w-md lg:max-w-xl md:mr-0 flex flex-col items-start bg-white/60 md:bg-transparent p-6 md:p-0 rounded-lg md:rounded-none">
            <div className="text-[10px] md:text-xs tracking-[0.18em] text-[#7d736b] uppercase mb-4 font-sans">
            Spring ’25 Collection
          </div>
          <h1 className="text-4xl md:text-5xl font-normal leading-tight mb-2 md:mb-4 font-serif text-gray-900">
            Make It Beautiful
          </h1>
          <h2 className="text-xl md:text-2xl lg:text-[28px] font-serif italic text-gray-700 mb-6 md:mb-8">
            Make your own wedding card.
          </h2>
          <p className="text-gray-700 text-sm md:text-[15px] leading-relaxed mb-6 md:mb-8 max-w-[360px] md:max-w-[400px]">
            打造專屬於你們的婚禮喜帖。<br />
            從美式喜帖、結婚書約到婚禮小物與婚禮網站，MINIStyleCards 將客製設計、插畫與印刷工藝結合，為每一場婚禮留下值得收藏的細節。
          </p>
          <Link className="border border-gray-900 bg-transparent text-gray-900 hover:bg-gray-900 hover:text-white transition-colors duration-300 py-2.5 px-6 md:py-3 md:px-8 text-xs md:text-sm tracking-wider inline-flex items-center gap-2" to="/collections/new-arrival">
            探索新品 <span className="text-base md:text-lg leading-none mt-[-2px]">→</span>
          </Link>
          </div>
        </div>
      </section>

      <section className="section collection" aria-labelledby="collection-title">
        <div className="collectionHead">
          <span id="collection-title">Collection / 精選系列</span>
          <Link to="/collections">View all →</Link>
        </div>

        <div className="collectionGrid">
          {displayCollections.map((item) => (
            <Link to={item.href} className={`collectionCard ${item.className || ''}`} key={item.title}>
              <img loading="lazy" src={item.image} alt={item.alt} />
              <div className="collectionInfo">
                <h3>{item.title}</h3>
                <p>{item.subtitle}</p>
                <small>探索系列 →</small>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section making" aria-labelledby="making-title">
        <div className="sectionTitle">
          <h2 id="making-title">What are we making?</h2>
          <p>我們為您打造每一個重要時刻</p>
        </div>

        <div className="categoryGrid">
          {categories.map((item) => (
            <Link className="categoryCard" to={item.href} key={item.title}>
              <div className="categoryIcon" aria-hidden="true">{item.icon}</div>
              <div>
                <h3>{item.title}</h3>
                <span>{item.desc}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section process" aria-labelledby="process-title">
        <div className="sectionTitle">
          <h2 id="process-title">How it works</h2>
          <p>製作流程</p>
        </div>

        <div className="processGrid">
          <div className="processItem">
            <div className="processNumber">01</div>
            <h3>Choose</h3>
            <strong>挑選設計</strong>
            <p>瀏覽喜歡的設計，收藏比較，找到最適合你們的風格。</p>
            <div className="processIcon" aria-hidden="true">◇</div>
          </div>

          <div className="processItem">
            <div className="processNumber">02</div>
            <h3>Customize</h3>
            <strong>客製細節</strong>
            <p>調整文字、日期、顏色與細節，校稿設計。</p>
            <div className="processIcon" aria-hidden="true">▧</div>
          </div>

          <div className="processItem">
            <div className="processNumber">03</div>
            <h3>Print & Deliver</h3>
            <strong>印刷出貨</strong>
            <p>高品質印刷，安心包裝，送到你的手中。</p>
            <div className="processIcon" aria-hidden="true">▱</div>
          </div>
        </div>
      </section>
    </>
  );
}
