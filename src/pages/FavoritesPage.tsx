import React, { useState } from 'react';
import { Heart, LayoutGrid, List, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../components/FavoritesContext';

export function FavoritesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortMethod, setSortMethod] = useState<string>('最新加入');
  const { favorites, toggleFavorite, isFavorited } = useFavorites();

  const sortedFavorites = [...favorites].reverse();
  
  if (sortMethod === '價格由低到高') {
    sortedFavorites.sort((a, b) => {
       const pa = typeof a.price === 'number' ? a.price : parseFloat(a.price.toString().replace(/[^0-9.]/g, ''));
       const pb = typeof b.price === 'number' ? b.price : parseFloat(b.price.toString().replace(/[^0-9.]/g, ''));
       return pa - pb;
    });
  } else if (sortMethod === '價格由高到低') {
    sortedFavorites.sort((a, b) => {
       const pa = typeof a.price === 'number' ? a.price : parseFloat(a.price.toString().replace(/[^0-9.]/g, ''));
       const pb = typeof b.price === 'number' ? b.price : parseFloat(b.price.toString().replace(/[^0-9.]/g, ''));
       return pb - pa;
    });
  }

  return (
    <div className="pt-[72px]">
      {/* Hero Section */}
      <section className="flex flex-col md:block md:relative md:h-[400px] overflow-hidden bg-[#faf8f5]">
        <div className="w-full h-[280px] relative md:h-auto md:absolute md:inset-0 md:z-0">
           <img loading="lazy" 
              src="https://cdn.ministylecards.com/favorites/favorites-wedding-invitation-banner.jpg" 
              alt="MINIStyleCards 收藏清單頁面橫幅｜客製婚禮喜帖與似顏繪設計展示" 
              className="absolute inset-0 w-full h-full object-cover object-[25%_center] md:object-center"
           />
           <div className="absolute inset-0 bg-black/5 md:bg-black/10"></div>
        </div>
        <div className="relative z-10 flex flex-col md:h-full md:flex-row md:items-center pb-12 pt-0 px-4 md:px-12 lg:pr-[10%] xl:pr-[15%] md:justify-end w-full max-w-7xl mx-auto md:py-0">
          <div className="w-full md:w-auto flex flex-col items-start md:items-end bg-[#faf8f5] shadow-lg md:shadow-none md:bg-transparent p-8 md:p-0 rounded-xl md:rounded-none z-10 relative mt-[-40px] md:mt-0">
            <h1 className="text-3xl md:text-5xl font-serif mb-2 md:mb-4 flex items-center gap-2 md:gap-3 text-gray-900 justify-start md:justify-end w-full">
              My Favorites <Heart className="text-[#c98f6a]" strokeWidth={1} size={28} />
            </h1>
            <h2 className="text-lg md:text-xl font-medium tracking-wide mb-3 md:mb-4 w-full text-left md:text-right text-gray-900">我的收藏</h2>
            <p className="text-[14px] md:text-[15px] text-gray-800 tracking-wide w-full mb-6 font-medium text-left md:text-right leading-relaxed">
              收藏你喜歡的設計，<br className="block md:hidden" />方便日後查看與比較。
            </p>
            <Link to="/" className="text-[#4a423e] border border-[#4a423e] px-6 py-2.5 rounded text-[13px] md:text-sm hover:bg-[#4a423e]/5 transition-colors tracking-widest flex items-center justify-center gap-2 whitespace-nowrap w-fit md:w-auto">
              繼續探索更多設計 <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 md:px-12 max-w-7xl mx-auto">
        
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div className="text-[15px] font-medium text-gray-700">
             全部收藏 <span className="text-[#c98f6a] font-serif pr-1">{favorites.length}</span> 件
          </div>
          
          <div className="flex items-center gap-4 border-b md:border-b-0 border-gray-100 pb-4 md:pb-0 w-full md:w-auto">
            <select 
              className="border border-gray-200 rounded px-3 py-1.5 text-sm bg-transparent focus:outline-none focus:border-gray-400 text-gray-600"
              value={sortMethod}
              onChange={(e) => setSortMethod(e.target.value)}
            >
              <option>最新加入</option>
              <option>價格由低到高</option>
              <option>價格由高到低</option>
            </select>
            
            <div className="flex items-center bg-[#faf8f5] rounded p-1 gap-1">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <LayoutGrid size={16} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Product Grid/List */}
        {favorites.length === 0 ? (
           <div className="text-center py-20 text-gray-500">目前沒有收藏的商品。</div>
        ) : (
          <div className={`grid gap-x-6 gap-y-12 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4' : 'grid-cols-1'}`}>
          {sortedFavorites.map((item) => (
            <div key={item.id} className={`group flex ${viewMode === 'grid' ? 'flex-col' : 'flex-row gap-8 items-center border-b border-gray-100 pb-8'}`}>
              <div className={`relative bg-[#faf8f5] rounded overflow-hidden mb-4 ${viewMode === 'grid' ? 'aspect-square w-full' : 'w-48 h-48 shrink-0'}`}>
                <Link to={`/product/${item.slug}`}>
                  <img loading="lazy"  
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                </Link>
                <button 
                  onClick={() => toggleFavorite({id: item.id, slug: item.slug, name: item.name, price: item.price, image: item.image})}
                  className="absolute p-2 bg-white rounded-full top-3 right-3 shadow-sm hover:scale-110 transition-transform"
                >
                  <Heart 
                    size={16} 
                    className={isFavorited(item.id) ? "text-[#a43725]" : "text-gray-400"} 
                    fill={isFavorited(item.id) ? "#a43725" : "none"} 
                  />
                </button>
              </div>
              <div className={viewMode === 'list' ? 'flex-grow' : ''}>
                <Link to={`/product/${item.slug}`}>
                  <h3 className="text-[15px] font-medium tracking-wide mb-2 text-gray-800 group-hover:text-[#c98f6a] transition-colors">{item.name}</h3>
                  <p className="text-[13px] font-serif text-gray-600">{typeof item.price === 'number' ? `NT$ ${item.price}` : item.price}</p>
                </Link>
                {viewMode === 'list' && (
                  <Link to={`/product/${item.slug}`} className="mt-4 border border-gray-300 px-6 py-2 text-[13px] hover:bg-gray-50 transition-colors rounded inline-block">
                    查看詳情
                  </Link>
                )}
              </div>
            </div>
          ))}
          </div>
        )}

        {/* CTA Banner */}
        <div className="mt-24 bg-[#faf8f5] rounded-lg p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="relative z-10 text-center md:text-left">
            <h3 className="text-xl font-medium tracking-wide mb-2">還在猶豫嗎？</h3>
            <p className="text-[14px] text-gray-500">將喜歡的設計加入收藏，方便日後比較與決定。</p>
          </div>
          
          <a href="https://www.instagram.com/ministylecards/" target="_blank" rel="noopener noreferrer" className="relative z-10 shrink-0 text-[#4a423e] border border-[#4a423e] hover:bg-[#4a423e]/5 px-8 py-3 rounded text-[14px] tracking-widest transition-colors flex items-center gap-2">
            立即諮詢設計師 <ArrowRight size={14} />
          </a>
        </div>

      </section>
    </div>
  );
}
