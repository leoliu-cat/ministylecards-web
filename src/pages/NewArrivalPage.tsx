import React from 'react';
import { CategoryLayout, Product } from '../components/CategoryLayout';

const products: Product[] = [
  { id: 1, title: '春日煦風 | 喜帖套組', price: 95, image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80' },
  { id: 2, title: '夏夜星空 | 信封組合', price: 110, image: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=600&q=80' },
  { id: 3, title: '秋日私語 | 邀請函', price: 85, image: 'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=600&q=80' },
  { id: 4, title: '晨光微露 | 燙金款式', price: 120, image: 'https://images.unsplash.com/photo-1623000674215-dc34091a1d95?auto=format&fit=crop&w=600&q=80' },
  { id: 5, title: '繁花似錦 | 似顏繪版', price: 140, image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80' },
  { id: 6, title: '極簡都會 | 摩登系列', price: 90, image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=600&q=80' },
];

export function NewArrivalPage() {
  return (
    <CategoryLayout 
      title="最新商品" 
      subtitle="New Arrivals"
      breadcrumbs={[{ label: '首頁', to: '/' }, { label: '最新商品' }]}
      products={products}
    />
  );
}
