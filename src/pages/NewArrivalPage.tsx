import { API_BASE_URL } from '../config';
import React, { useEffect, useState } from 'react';
import { CategoryLayout, Product } from '../components/CategoryLayout';
import { SEO } from '../components/SEO';

export function NewArrivalPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        // Sort by created_at or id descending
        const sortedData = data.sort((a: any, b: any) => {
          const dateA = new Date(a.created_at || 0).getTime();
          const dateB = new Date(b.created_at || 0).getTime();
          if (dateA !== dateB) {
            return dateB - dateA;
          }
          return b.id - a.id;
        });

        const formattedProducts = sortedData
          .slice(0, 16) // Top 16
          .map((item: any) => ({
          id: item.id,
          title: item.title,
          price: item.base_price,
          slug: item.slug,
          collection_id: item.collection_id,
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
        title="最新商品 | Mini Style Cards"
        description="Mini Style Cards 最新商品上架，快來看看我們為您準備的最新客製化婚禮設計與周邊商品。"
        url="https://ministylecards.com/new-arrivals"
      />
      <CategoryLayout 
        title="最新商品" 
        subtitle="New Arrivals"
        breadcrumbs={[{ label: '首頁', to: '/' }, { label: '最新商品' }]}
        products={products}
        hideCollections={true}
      />
    </>
  );
}
