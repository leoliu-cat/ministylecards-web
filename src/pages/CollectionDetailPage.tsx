import { API_BASE_URL } from '../config';
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
      fetch(`${API_BASE_URL}/api/collections?limit=1000`).then(r => r.json()),
      fetch(`${API_BASE_URL}/api/products?limit=1000`).then(r => r.json())
    ]).then(([collectionsResponse, productsResponse]) => {
      const collectionsData = Array.isArray(collectionsResponse) ? collectionsResponse : collectionsResponse?.docs || [];
      const productsData = Array.isArray(productsResponse) ? productsResponse : productsResponse?.docs || [];

      // Find the collection matching the slug or ID
      let col = collectionsData.find((c: any) => c.slug === collectionId || String(c.id) === collectionId);
      
      let colProducts: any[] = [];
      if (!col) {
         // Create a faux collection from products
         const fauxProducts = productsData.filter((p: any) => String(p.collection_id) === collectionId);
         if (fauxProducts.length > 0) {
            colProducts = fauxProducts;
            const p = fauxProducts[0];
            let fauxTitle = "系列商品";
            if (p.category_id === 5 && p.title.includes("｜")) {
                fauxTitle = p.title.split("｜")[1].split(" ")[0];
            } else if (p.category_id === 5) {
                fauxTitle = "特約插畫師";
            } else if (p.title.includes("禮金簿")) {
                fauxTitle = "禮金簿系列";
            } else if (p.title.includes("簽名")) {
                fauxTitle = "簽名軸系列";
            } else if (p.title.includes("封蠟")) {
                fauxTitle = "封蠟系列";
            } else if (p.title.includes("特調水彩")) {
                fauxTitle = "特調水彩系列";
            }
            col = {
               id: p.collection_id,
               title: fauxTitle,
               slug: String(p.collection_id),
               cover_image: p.images && p.images.length > 0 ? p.images[0] : null,
               description: "精選系列商品"
            };
         }
      } else {
         colProducts = productsData.filter((p: any) => p.collection_id === col.id);
      }

      if (col) {
        setCollection(col);
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
      console.warn('Could not fetch collection detail::', err.message || err);
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
        title={macroCategory.name} 
        subtitle={collection.title}
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

