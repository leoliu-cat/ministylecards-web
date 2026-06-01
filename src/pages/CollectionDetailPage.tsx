import React, { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { CategoryLayout, Product } from '../components/CategoryLayout';
import { SEO } from '../components/SEO';

export function CollectionDetailPage() {
  const { collectionId } = useParams();
  const [collection, setCollection] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [macroCategory, setMacroCategory] = useState({ name: '精選系列', to: '/collections' });

  useEffect(() => {
    Promise.all([
      fetch('/api/collections').then(r => r.json()),
      fetch('/api/products').then(r => r.json())
    ]).then(([collectionsData, productsData]) => {
      // Find the collection matching the slug or ID
      const col = Array.isArray(collectionsData) ? collectionsData.find(c => c.slug === collectionId || String(c.id) === collectionId) : null;
      
      if (col) {
        setCollection(col);
        const colProducts = Array.isArray(productsData) ? productsData.filter(p => p.collection_id === col.id) : [];
        if (colProducts.length > 0) {
           const categoryId = colProducts[0].category_id;
           
           const getCategoryName = (id: number) => {
             switch(id) {
               case 1: return '喜帖';
               case 2: return '結婚書約';
               case 3: return '婚禮小物';
               case 4: return '必備設計';
               case 5: return '插畫繪製';
               case 6: return '婚禮網站';
               default: return '精選系列';
             }
           };

           const getCategoryLink = (id: number) => {
             switch(id) {
               case 1: return '/wedding-invitations';
               case 2: return '/marriage-certificate';
               case 3: return '/wedding-favors';
               case 4: return '/essential-design';
               case 5: return '/illustration';
               case 6: return '/wedding-website';
               default: return '/collections';
             }
           };

           setMacroCategory({ name: getCategoryName(categoryId), to: getCategoryLink(categoryId) });
        }
        
        setProducts(colProducts.map(p => ({
          id: p.id,
          slug: p.slug,
          title: p.title,
          price: p.base_price || 0,
          image: p.images && p.images.length > 0 ? `https://admin.ministylecards.com${p.images[0]}` : 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80'
        })));
      }
      setLoading(false);
    }).catch(err => {
      console.error('Error fetching collection detail:', err);
      setLoading(false);
    });
  }, [collectionId]);

  if (loading) {
    return <div className="pt-32 pb-20 text-center text-gray-500">載入中...</div>;
  }

  if (!collection) {
    return (
      <div className="pt-32 pb-20 text-center">
        <h1 className="text-2xl mb-4">系列不存在</h1>
        <p className="text-gray-500 mb-8">您尋找的系列可能已經被移除。</p>
        <Link to="/collections" className="text-[#c98f6a] hover:underline">返回所有系列</Link>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={`${collection.title} | ${macroCategory.name}`}
        description={collection.description || `${collection.title} 的所有商品`}
        image={collection.cover_image ? `https://admin.ministylecards.com${collection.cover_image}` : undefined}
      />
      <CategoryLayout 
        title={collection.title} 
        subtitle={collection.slug}
        breadcrumbs={[
          { label: '首頁', to: '/' }, 
          { label: macroCategory.name, to: macroCategory.to },
          { label: collection.title }
        ]}
        products={products}
        hideCollections={true}
      />
    </>
  );
}

