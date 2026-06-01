import React from 'react';
import { Link } from 'react-router-dom';

export function WeddingWebsitePage() {
  return (
    <div className="pt-28 pb-20 px-4 md:px-12 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-3xl md:text-4xl font-normal tracking-tight mb-4 text-gray-900">婚禮網站</h1>
      <p className="text-sm md:text-base text-gray-500 font-serif italic mb-8">Wedding Website</p>
      
      <div className="bg-gray-50 border border-gray-100 rounded-lg p-12 max-w-lg w-full flex flex-col items-center">
        <h2 className="text-xl font-medium text-gray-800 mb-3 tracking-wide">Coming Soon</h2>
        <p className="text-sm text-gray-600 mb-8 leading-relaxed">
          全新的婚禮網站客製服務正在籌備中。<br />
          敬請期待，我們將與您一起打造專屬的線上婚禮體驗。
        </p>
        <Link 
          to="/" 
          className="inline-block bg-[#8b4e36] text-white px-8 py-3 rounded text-sm font-medium hover:bg-[#7a422d] transition-colors"
        >
          返回首頁
        </Link>
      </div>
    </div>
  );
}
