import { API_BASE_URL } from '../config';
import React, { useEffect, useState } from 'react';
import { CategoryLayout, Product } from '../components/CategoryLayout';

export function MarriageCertificatePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products?limit=1000`)
      .then(res => res.json())
      .then(data => {
        const productsData = Array.isArray(data) ? data : data?.docs || [];
        const formattedProducts = productsData
          .filter((item: any) => item.category_id === 2)
          .map((item: any) => ({
            id: item.id,
            title: item.title,
            price: item.base_price,
            slug: item.slug,
            collection_id: item.collection_id,
            // Use the first image if available, else a placeholder
            image: item.images && item.images.length > 0
              ? `https://admin.ministylecards.com${item.images[0]}`
              : 'https://images.unsplash.com/photo-1544534728-662d55e09062?auto=format&fit=crop&w=600&q=80'
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
    <CategoryLayout 
      title="婚禮書約" 
      subtitle="Marriage Certificate"
      breadcrumbs={[{ label: '首頁', to: '/' }, { label: '婚禮書約' }]}
      products={products}
    />
  );
}
