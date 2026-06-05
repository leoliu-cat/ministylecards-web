import React from 'react';
import { BookOpen, Monitor, Globe, PenTool, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

const whatWeDo = [
  { img: 'https://cdn.ministylecards.com/about/custom-wedding-invitations-ministylecards.jpg', alt: 'MINIStyleCards 客製化婚禮喜帖設計與美式婚禮邀請卡', en: 'Wedding Invitations', tw: '客製化婚禮喜帖', to: '/wedding-invitations' },
  { img: 'https://cdn.ministylecards.com/about/modern-marriage-certificate-design.jpg', alt: '現代結婚書約設計與客製化婚禮證書｜MINIStyleCards', en: 'Marriage Certificates', tw: '結婚書約', to: '/marriage-certificate' },
  { img: 'https://cdn.ministylecards.com/about/wedding-favors-and-gift-design.jpg', alt: '婚禮小物與婚禮送客禮設計靈感｜MINIStyleCards', en: 'Wedding Favors', tw: '婚禮小物', to: '/wedding-favors' },
  { img: 'https://cdn.ministylecards.com/about/custom-wedding-illustration-design.jpg', alt: '客製化婚禮插畫與似顏繪喜帖設計｜MINIStyleCards', en: 'Illustration', tw: '插畫設計', to: '/illustration' },
  { img: 'https://cdn.ministylecards.com/about/wedding-website-rsvp-design.jpg', alt: '婚禮網站與 RSVP 線上回覆設計｜MINIStyleCards', en: 'Wedding Website', tw: '婚禮網站與 RSVP', to: '/wedding-website' },
];

const journalPosts = [
  { img: 'https://cdn.ministylecards.com/about/wedding-invitation-wording-ideas.jpg', alt: '婚禮喜帖文案靈感與 RSVP wording 設計範例｜MINIStyleCards', tw: '喜帖文案靈感大全', en: 'Wording Ideas', to: '/journal/wording' },
  { img: 'https://cdn.ministylecards.com/about/2025-wedding-invitation-trends.jpg', alt: '2025 婚禮喜帖設計流行趨勢與婚禮佈置靈感｜MINIStyleCards', tw: '2025 喜帖流行趨勢', en: 'Trends', to: '/journal/trends' },
  { img: 'https://cdn.ministylecards.com/about/wedding-color-palette-inspiration.jpg', alt: '婚禮色系搭配與奶茶色喜帖設計靈感｜MINIStyleCards', tw: '婚禮色系搭配指南', en: 'Color Inspiration', to: '/journal/color' },
];

export function AboutPage() {
  return (
    <>
      <SEO 
        title="關於我們 About Us | Mini Style Cards"
        description="從客製化喜帖到婚禮網站，Mini Style Cards 為現代愛情設計專屬的紀念品，創造讓賓客想永遠珍藏的細節。"
        url="https://ministylecards.com/about"
        canonicalUrl="https://ministylecards.com/about"
      />
      <div className="pt-[72px]">
        {/* Hero Section */}
      <section className="relative h-[600px] flex items-center px-4 md:px-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img loading="lazy" 
            src="https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1600&q=80" 
            alt="Wedding invitation aesthetics" 
            className="w-full h-full object-cover object-right"
          />
          <div className="absolute inset-0 bg-white/40 md:bg-transparent md:bg-gradient-to-r md:from-white/90 md:via-white/70 md:to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-6 font-sans">Our Story</p>
          <h1 className="text-5xl md:text-6xl font-normal leading-tight mb-6">
            We design keepsakes<br />
            <em className="font-serif italic font-light">for</em> modern love.
          </h1>
          <p className="text-gray-700 text-lg max-w-md">
            From wedding invitations to digital experiences,<br className="hidden md:block" />
            we create details people want to keep forever.
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 px-4 md:px-12 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
        <div className="w-full md:w-1/2">
          <div className="relative">
            <img loading="lazy" 
              src="https://cdn.ministylecards.com/about/wedding-invitation-brand-story-ministylecards.png" 
              alt="MINIStyleCards 品牌理念｜客製化喜帖與婚禮設計體驗" 
              className="w-full h-auto object-contain scale-110 md:scale-125 hover:scale-105 transition-transform duration-700 ease-in-out"
            />
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl md:text-4xl leading-tight mb-8">
            We believe invitations<br />
            are more than paper.
          </h2>
          <div className="space-y-6 text-gray-600 text-[15px] leading-relaxed">
            <p>
              在這個訊息快速消失的時代，<br />
              我們仍然相信：有些時刻，值得被真正保存下來。<br />
              一張喜帖、一份書約、一個婚禮網站、甚至一段聲音。<br />
              它們不只是資訊，而是人生故事的第一頁。
            </p>
            <p>
              MINIStyleCards 誕生於台灣，<br />
              我們將紙材、插畫、設計與互動體驗結合，<br />
              為每一對新人打造真正屬於自己的婚禮記憶。
            </p>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-24 bg-[#faf8f5] px-4 md:px-12 text-center">
        <h2 className="text-3xl mb-16 font-serif">What we do</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {whatWeDo.map((item, idx) => (
            <Link to={item.to} key={idx} className="group block">
              <div className="aspect-[4/3] rounded overflow-hidden mb-4 shadow-sm bg-white">
                <img loading="lazy" src={item.img} alt={item.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h3 className="font-serif text-sm mb-1">{item.en}</h3>
              <p className="text-xs text-gray-500 tracking-wider mb-3">{item.tw}</p>
              <ArrowRight size={14} className="mx-auto text-gray-300 group-hover:text-gray-800 transition-colors" />
            </Link>
          ))}
        </div>
      </section>

      {/* Why Us */}
      <section className="py-24 px-4 md:px-12 max-w-6xl mx-auto text-center border-b border-gray-200">
        <h2 className="text-3xl mb-20 font-serif">Why MINIStyleCards</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-l border-gray-100">
          <div className="relative border-r border-gray-100 flex flex-col items-center">
             <div className="absolute top-0 right-0 h-10 w-[1px] bg-gray-200" />
             <div className="absolute top-0 left-0 h-10 w-[1px] bg-gray-200" />
             <BookOpen strokeWidth={1} size={36} className="text-gray-800 mb-6" />
             <h3 className="font-serif text-[15px] mb-3">Designed as a collection</h3>
             <p className="text-[13px] text-gray-500 w-3/4 mx-auto leading-relaxed">我們相信婚禮不只是單一張喜帖，而是整套風格體驗。</p>
          </div>
          <div className="relative border-r border-gray-100 flex flex-col items-center">
             <Monitor strokeWidth={1} size={36} className="text-gray-800 mb-6" />
             <h3 className="font-serif text-[15px] mb-3">Physical + Digital</h3>
             <p className="text-[13px] text-gray-500 w-3/4 mx-auto leading-relaxed">從紙本到婚禮網站，讓視覺與互動保持一致。</p>
          </div>
          <div className="relative border-r border-gray-100 flex flex-col items-center">
             <Globe strokeWidth={1} size={36} className="text-gray-800 mb-6" />
             <h3 className="font-serif text-[15px] mb-3">Bilingual & International</h3>
             <p className="text-[13px] text-gray-500 w-3/4 mx-auto leading-relaxed">服務台灣、香港、澳洲與海外華人。</p>
          </div>
          <div className="relative border-r border-gray-100 flex flex-col items-center md:border-r-0">
             <div className="hidden md:block absolute top-0 right-0 h-10 w-[1px] bg-gray-200" />
             <PenTool strokeWidth={1} size={36} className="text-gray-800 mb-6" />
             <h3 className="font-serif text-[15px] mb-3">Illustration-driven aesthetics</h3>
             <p className="text-[13px] text-gray-500 w-3/4 mx-auto leading-relaxed">擅長插畫為主視覺與收藏感設計。</p>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="bg-[#f0ece5] flex flex-col lg:flex-row relative">
        <div className="w-full lg:w-1/2 aspect-[4/3] lg:aspect-auto h-[400px] lg:h-auto">
          <img loading="lazy" 
            src="https://cdn.ministylecards.com/about/wedding-design-founders-ministylecards.jpg.png" 
            alt="MINIStyleCards 婚禮喜帖與婚禮設計品牌創辦人 Joanne & Leo" 
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="w-full lg:w-1/2 p-12 md:p-24 flex items-center justify-center bg-gradient-to-r from-transparent to-white/50">
          <div className="bg-white p-12 shadow-sm max-w-sm w-full mx-auto relative lg:-ml-20 border border-gray-100">
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-4 font-sans">Founded by</p>
            <h3 className="text-3xl font-serif mb-6">Joanne & Leo.</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-10">
              Designers, storytellers, and believers in meaningful details.
            </p>
            <p className="font-serif italic text-gray-400">Joanne & Leo</p>
          </div>
        </div>
      </section>

      {/* Journal */}
      <section className="py-24 px-4 md:px-12 max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
        <div className="w-full lg:w-1/3 text-center lg:text-left">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-4 font-sans">Journal</p>
          <h2 className="text-3xl md:text-4xl mb-6 font-serif">Explore the Journal</h2>
          <p className="text-[13px] text-gray-500 mb-8 leading-relaxed">靈感、趨勢與實用指南，陪伴你的婚禮每一步。</p>
          <Link to="/journal" className="inline-block border border-gray-300 py-3 px-8 text-sm hover:bg-gray-50 transition-colors">
            前往閱讀 →
          </Link>
        </div>
        <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {journalPosts.map((post, idx) => (
             <Link to={post.to} key={idx} className="group block">
                <div className="aspect-[3/4] overflow-hidden mb-4 rounded-sm">
                   <img loading="lazy" src={post.img} alt={post.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h3 className="text-sm font-medium mb-1">{post.tw}</h3>
                <p className="font-serif text-[13px] text-gray-500">{post.en}</p>
             </Link>
          ))}
        </div>
      </section>
    </div>
    </>
  );
}
