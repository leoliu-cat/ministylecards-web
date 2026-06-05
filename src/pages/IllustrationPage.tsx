import { API_BASE_URL } from '../config';
import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

export function IllustrationPage() {
  const [illustrators, setIllustrators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE_URL}/api/collections?limit=1000`).then(r => r.json()),
      fetch(`${API_BASE_URL}/api/products?limit=1000`).then(r => r.json())
    ]).then(([collectionsData, productsData]) => {
      // Find illustrator collections based on title or slug
      const illustratorCollections = Array.isArray(collectionsData) 
        ? collectionsData.filter(c => c.slug.includes('illustrator') || c.title.includes('老師') || c.title.includes('插畫師') || c.title.includes('插畫繪製'))
        : [];
      
      const mappedIllustrators = illustratorCollections.map(c => {
         // Find products associated with this collection
         const worksCount = Array.isArray(productsData) ? productsData.filter(p => p.collection_id === c.id).length : 0;
         
         let authorName = c.title;
         if (c.title && c.title.includes("｜")) {
            authorName = c.title.split("｜")[0].trim(); // Extract name before '｜'
         }

         return {
            id: c.id,
            name: authorName,
            slug: c.slug,
            works: worksCount,
            image: c.cover_image 
                ? `https://admin.ministylecards.com${c.cover_image}` 
                : 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=300&q=80'
         };
      });

      setIllustrators(mappedIllustrators);
      setLoading(false);
    }).catch(err => {
      console.warn('Could not fetch illustrators::', err.message || err);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <SEO 
        title="插畫繪製 | Mini Style Cards"
        description="Mini Style Cards 合作多位風格獨特的人氣插畫師，為您的喜帖及婚禮周邊打造專屬的似顏繪與插畫作品。"
        url="https://ministylecards.com/illustration"
      />
      <div className="pt-28 pb-20 px-4 md:px-12 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-normal tracking-tight mb-3 flex items-baseline gap-3">
            插畫繪製 <span className="text-sm md:text-base text-gray-400 font-serif italic">Illustration</span>
          </h1>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <Link to="/" className="hover:text-gray-800">首頁</Link>
            <span>/</span>
            <span className="text-gray-800">插畫繪製</span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
          <div className="text-sm text-gray-600">
            全部插畫師 | <span className="font-medium text-gray-900">{loading ? '...' : illustrators.length} 位插畫師</span>
          </div>
          
          {/* Desktop Sort */}
          <div className="flex items-center gap-2 text-sm">
            <span className="hidden md:inline text-gray-500">排序方式：</span>
            <select className="border-none bg-transparent font-medium focus:ring-0 cursor-pointer">
              <option>最新加入</option>
              <option>作品數最多</option>
            </select>
          </div>
        </div>

        {/* Grid of Illustrators */}
        {loading ? (
          <div className="py-20 text-center text-gray-500">載入中...</div>
        ) : illustrators.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {illustrators.map((artist) => (
              <Link to={`/collections/${artist.slug || artist.id}`} key={artist.id} className="group border border-gray-100 rounded-xl p-6 flex flex-col items-center hover:shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all block">
                <div className="w-24 h-24 mb-4 rounded-full overflow-hidden bg-gray-50 flex-shrink-0 border-2 border-transparent group-hover:border-[#EAD9CA] transition-colors">
                  <img loading="lazy" 
                    src={artist.image} 
                    alt={artist.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-sm font-medium mb-1 text-center">{artist.name}</h3>
                <p className="text-[11px] text-gray-400 tracking-wider">作品數 {artist.works}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-gray-500">目前還沒有插畫師資料。</div>
        )}

      </div>
    </>
  );
}
