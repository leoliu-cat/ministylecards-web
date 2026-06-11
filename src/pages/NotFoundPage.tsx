import React from 'react';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="pt-32 pb-24 px-4 min-h-[60vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-serif text-[#c98f6a] mb-4">404</h1>
      <h2 className="text-2xl font-medium text-gray-900 mb-6">找不到頁面</h2>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">
        很抱歉，您尋找的頁面不存在。可能是網址輸入錯誤，或該頁面已被移除。
      </p>
      <Link 
        to="/" 
        className="bg-gray-900 text-white px-8 py-3 rounded hover:bg-gray-800 transition-colors tracking-widest text-[14px]"
      >
        返回首頁
      </Link>
    </div>
  );
}
