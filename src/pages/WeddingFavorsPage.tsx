import { API_BASE_URL } from '../config';
import React, { useEffect, useState } from 'react';
import { CategoryLayout, Product } from '../components/CategoryLayout';

export function WeddingFavorsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        const formattedProducts = data
          .filter((item: any) => item.category_id === 3)
          .map((item: any) => ({
            id: item.id,
            title: item.title,
            price: item.base_price,
            slug: item.slug,
            collection_id: item.collection_id,
            image: item.images && item.images.length > 0
              ? `https://admin.ministylecards.com${item.images[0]}`
              : 'https://images.unsplash.com/photo-1602874801007-bd4582f3fb8f?auto=format&fit=crop&w=600&q=80'
          }));
        setProducts(formattedProducts);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  }, []);

  return (
    <CategoryLayout 
      title="婚禮小物" 
      subtitle="Wedding Favors"
      breadcrumbs={[{ label: '首頁', to: '/' }, { label: '婚禮小物' }]}
      products={products}
    />
  );
}
