import { API_BASE_URL } from '../config';
import React, { useEffect, useState } from 'react';
import { CategoryLayout, Product } from '../components/CategoryLayout';
import { SEO } from '../components/SEO';

export function CategoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products?limit=1000`)
      .then(res => res.json())
      .then(data => {
        const formattedProducts = data
          .filter((item: any) => item.category_id === 1)
          .map((item: any) => ({
          id: item.id,
          title: item.title,
          price: item.base_price,
          slug: item.slug,
          collection_id: item.collection_id,
          // Use the first image if available, else a placeholder
          image: item.images && item.images.length > 0 
            ? `https://admin.ministylecards.com${item.images[0]}`
            : 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80'
        }));
        setProducts(formattedProducts);
        setLoading(false);
      })
      .catch(error => {
        console.warn('Could not fetch products::', error.message || error);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <SEO 
        title="客製化喜帖 | Mini Style Cards"
        description="Mini Style Cards 提供高質感的客製化喜帖設計，多種款式任您挑選，為您的婚禮增添獨特風格與心意。"
        url="https://ministylecards.com/wedding-invitations"
        canonicalUrl="https://ministylecards.com/wedding-invitations"
      />
      <CategoryLayout 
        title="喜帖" 
        subtitle="Invitations"
        breadcrumbs={[{ label: '首頁', to: '/' }, { label: '喜帖' }]}
        products={products}
        hideCollections={false}
      />
    </>
  );
}
