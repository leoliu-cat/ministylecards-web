import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { Heart, MoveRight } from 'lucide-react';
import { useFavorites } from '../components/FavoritesContext';

export function EssentialDesignPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toggleFavorite, isFavorited } = useFavorites();

  useEffect(() => {
    Promise.all([
      fetch('/api/collections').then(r => r.json()),
      fetch('/api/products').then(r => r.json())
    ])
    .then(([collectionsData, productsData]) => {
      const essentialProducts = Array.isArray(productsData)
        ? productsData.filter((p: any) => p.category_id === 4)
        : [];
      
      const collectionsMap = new Map();
      if (Array.isArray(collectionsData)) {
         collectionsData.forEach(c => collectionsMap.set(c.id, c));
      }

      const displayItems: any[] = [];
      const addedCollections = new Set();

      essentialProducts.forEach(p => {
         if (p.collection_id) {
            if (!addedCollections.has(p.collection_id)) {
               addedCollections.add(p.collection_id);
               const col = collectionsMap.get(p.collection_id);
               if (col) {
                  displayItems.push({
                     type: 'collection',
                     id: col.id,
                     title: col.title,
                     slug: col.slug,
                     image: col.cover_image 
                        ? `https://admin.ministylecards.com${col.cover_image}`
                        : 'https://images.unsplash.com/photo-1544534728-662d55e09062?auto=format&fit=crop&w=600&q=80',
                     priceDisplay: '查看所有款式'
                  });
               }
            }
         } else {
            // Standalone product
            displayItems.push({
               type: 'product',
               id: p.id,
               title: p.title,
               slug: p.slug,
               price: p.base_price,
               image: p.images && p.images.length > 0
                  ? `https://admin.ministylecards.com${p.images[0]}`
                  : 'https://images.unsplash.com/photo-1544534728-662d55e09062?auto=format&fit=crop&w=600&q=80',
               priceDisplay: `NT$ ${p.base_price}`
            });
         }
      });

      setItems(displayItems);
      setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching essential design data:', error);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <SEO 
        title="必備設計 | Mini Style Cards"
        description="打造您婚禮專屬的禮金簿、簽名軸與實用樣本，多款式自由挑選。"
      />
      <div className="pt-28 pb-20 px-4 md:px-12 max-w-7xl mx-auto">
        <div className="mb-8 border-b border-gray-200 pb-8">
          <h1 className="text-3xl md:text-4xl font-normal tracking-tight mb-3 flex items-baseline gap-3">
            必備設計 <span className="text-sm md:text-base text-gray-400 font-serif italic">Essential Design</span>
          </h1>
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <Link to="/" className="hover:text-gray-800">首頁</Link>
            <span>/</span>
            <span className="text-gray-800">必備設計</span>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-500">載入中...</div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-12">
            {items.map((item, idx) => {
               const isCollection = item.type === 'collection';
               const linkUrl = isCollection ? `/collections/${item.slug || item.id}` : `/product/${item.slug || item.id}`;
               const favId = item.id;
               const isFav = !isCollection && isFavorited(favId);

               return (
                 <Link to={linkUrl} state={!isCollection ? { category: '必備設計', product: item } : {}} key={`${item.type}-${item.id}-${idx}`} className="group cursor-pointer block flex flex-col h-full">
                   <div className="relative overflow-hidden mb-5 rounded-md aspect-[4/5] bg-gray-100 flex-shrink-0">
                     <img 
                       src={item.image} 
                       alt={item.title}
                       className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                     />
                     {!isCollection && (
                        <button className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur text-gray-500 hover:text-[#a43725] hover:bg-white transition-colors" onClick={(e) => { 
                          e.preventDefault(); 
                          e.stopPropagation();
                          toggleFavorite({ id: favId, slug: item.slug || String(item.id), name: item.title, price: item.price, image: item.image });
                        }}>
                          <Heart size={16} fill={isFav ? "#a43725" : "none"} className={isFav ? "text-[#a43725]" : ""} />
                        </button>
                     )}
                     {isCollection && (
                        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/50 to-transparent flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                           <span className="bg-white/90 text-gray-800 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium shadow-sm backdrop-blur-sm">
                              查看系列 <MoveRight size={12} />
                           </span>
                        </div>
                     )}
                   </div>
                   <div className="flex flex-col flex-1">
                     <h3 className="text-[15px] font-medium mb-1.5 text-gray-900 group-hover:text-[#c98f6a] transition-colors line-clamp-2 leading-snug">{item.title}</h3>
                     <p className={`text-[13px] mt-auto font-medium ${isCollection ? 'text-[#c98f6a]' : 'text-gray-600 font-serif'}`}>{item.priceDisplay}</p>
                   </div>
                 </Link>
               );
            })}
          </div>
        )}
      </div>
    </>
  );
}

