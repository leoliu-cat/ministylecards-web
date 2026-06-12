import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useCart } from '../components/CartContext';

export function OrderSuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="pt-32 pb-24 px-4 md:px-12 max-w-4xl mx-auto text-center min-h-[60vh] flex flex-col items-center justify-center">
      <CheckCircle className="w-16 h-16 text-green-500 mb-6 mx-auto" />
      <h1 className="text-3xl font-serif text-gray-900 mb-4">付款成功！</h1>
      <p className="text-gray-600 mb-2">謝謝您的購買，您的訂單已成功送出。</p>
      <p className="text-gray-600 mb-8">我們已將訂單明細與製作條款 (PDF附檔) 寄送至您的電子信箱。</p>
      
      <div className="bg-[#f4eee8]/50 text-[#3d342e] rounded-xl px-6 py-5 mb-10 text-sm w-full max-w-md mx-auto border border-[#e8dfd5]">
         <p className="font-medium mb-1">小提醒：</p>
         <p className="text-gray-600 leading-relaxed">為加速您的訂單處理進度，建議可至 FB / IG 私訊通知我們，排單會比較快速喔！</p>
      </div>
      
      <div className="flex gap-4 justify-center">
         <Link to="/" className="bg-[#f4eee8] hover:bg-[#e8dfd5] text-[#3d342e] px-8 py-3 rounded text-[14px] tracking-widest transition-colors font-medium">
           回到首頁
         </Link>
         <Link to="/wedding-invitations" className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded text-[14px] tracking-widest transition-colors">
           繼續購物
         </Link>
      </div>
    </div>
  );
}
