import { API_BASE_URL } from '../config';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export function CollectionsPage() {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/collections`)
      .then(res => res.json())
      .then(data => {
        setCollections(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching collections:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="pt-32 pb-24 px-4 md:px-12 max-w-6xl mx-auto min-h-screen">
      <div className="mb-8 border-b border-gray-200 pb-4">
        <h1 className="text-[13px] font-medium tracking-widest text-gray-500 uppercase">
          COLLECTION / 精選系列
        </h1>
      </div>

      {/* Grid container */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">載入中...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 md:gap-6 md:h-[500px] lg:h-[600px]">
          {collections.map((collection, index) => {
            let className = 'md:col-span-1 md:row-span-1 h-[250px] md:h-auto';
            if (index === 0) className = 'md:col-span-2 md:row-span-1 h-[250px] md:h-auto';
            if (index === 2) className = 'md:col-span-1 md:row-span-2 h-[350px] md:h-auto';
            if (index === 3) className = 'md:col-span-2 md:row-span-1 h-[250px] md:h-auto';
            
            const image = collection.cover_image ? `https://admin.ministylecards.com${collection.cover_image}` : 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80';

            return (
              <Link
                key={collection.slug}
                to={`/collections/${collection.slug}`}
                className={`group relative rounded-xl overflow-hidden block ${className}`}
              >
                <div className="absolute inset-0 bg-gray-100">
                  <img 
                    src={image} 
                    alt={collection.cover_image_alt || collection.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                
                {/* Gradient overlay to make text readable */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white/90 via-white/40 to-transparent pointer-events-none"></div>
                
                {/* Text content */}
                <div className="absolute bottom-0 left-0 p-6 md:p-8 z-10 w-full">
                  <h2 className="text-2xl font-serif text-gray-900 mb-1 italic">
                    {collection.title}
                  </h2>
                  {collection.description && (
                    <p className="text-[14px] text-gray-500 mb-4 font-sans tracking-wide">
                      {collection.description}
                    </p>
                  )}
                  <div className="text-[13px] text-[#8b4e36] font-medium tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                    探索系列 <span>→</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
