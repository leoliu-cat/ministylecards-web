import { API_BASE_URL } from '../config';
import React, { useState } from 'react';
import { Mail, MessageCircle, Instagram, MapPin, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Check form fields
    const form = e.target as HTMLFormElement;
    const name = (form.elements[0] as HTMLInputElement).value;
    const email = (form.elements[1] as HTMLInputElement).value;
    const phone = (form.elements[2] as HTMLInputElement).value;
    const subject = (form.elements[3] as HTMLSelectElement).value;
    const message = (form.elements[4] as HTMLTextAreaElement).value;

    try {
      const response = await fetch(`${API_BASE_URL}/api/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, phone, subject, message }),
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        alert("發送失敗，請稍後再試。");
      }
    } catch (error) {
      console.error(error);
      alert("系統錯誤，請稍後再試。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-[72px]">
      {/* Hero Section */}
      <section className="flex flex-col md:block md:relative md:h-[480px] lg:h-[540px] overflow-hidden bg-[#e4e9ef]">
        <div className="w-full h-[320px] relative md:h-auto md:absolute md:inset-0 md:z-0 md:w-[85%] lg:w-[80%]">
           <img loading="lazy" 
             src="https://cdn.ministylecards.com/contact/luxury-wedding-stationery-contact.jpg" 
             alt="聯絡 MINIStyleCards 客製化婚禮喜帖與婚禮設計服務" 
             className="absolute inset-0 w-full h-full object-cover object-center md:object-left"
             style={{ WebkitMaskImage: 'linear-gradient(to right, white 60%, transparent 100%)', maskImage: 'linear-gradient(to right, white 60%, transparent 100%)' }}
           />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-6 py-12 md:h-full md:flex-row md:items-center md:justify-end md:px-12 lg:px-24 md:py-0 w-full">
          <div className="w-full md:w-auto md:max-w-md lg:max-w-xl flex flex-col items-start bg-white/60 md:bg-transparent p-6 md:p-0 rounded-lg md:rounded-none">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal leading-tight mb-4 font-serif text-gray-900">
            Contact Us
          </h1>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-serif italic text-gray-700 mb-6 lg:mb-8">
            We'd love to hear from you.
          </h2>
          <p className="text-gray-700 text-sm md:text-[15px] leading-relaxed">
            有任何需求或問題，歡迎與我們聯繫，<br />
            我們會盡快回覆您。
          </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 px-4 md:px-12 max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 mb-24">
          {/* Form */}
          <div className="w-full lg:w-1/2">
            <h3 className="text-xl font-medium tracking-widest mb-2">聯絡表單</h3>
            <p className="text-[13px] text-gray-500 mb-8">請填寫以下資訊，我們將盡快與您聯繫。</p>
            
            {isSuccess ? (
               <div className="bg-[#faf8f5] border border-[#eabfa3] rounded-lg p-8 text-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 text-[#c98f6a] shadow-sm">
                     <CheckCircle size={32} />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">訊息已成功送出！</h4>
                  <p className="text-[14px] text-gray-600 leading-relaxed mb-6">
                     我們已經收到您的訊息，<br />
                     專屬設計師將會在 1-2 個工作天內聯繫您。
                  </p>
                  <button 
                     onClick={() => setIsSuccess(false)}
                     className="text-[#c98f6a] hover:text-[#b47a55] underline text-sm tracking-widest font-medium"
                  >
                     再送出一則訊息
                  </button>
               </div>
            ) : (
               <form onSubmit={handleSubmit} className="space-y-6">
               <div className="flex flex-col md:flex-row gap-6">
                 <input type="text" placeholder="您的姓名 *" className="w-full border border-gray-200 rounded px-4 py-3 text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400" required />
                 <input type="email" placeholder="電子郵件 *" className="w-full border border-gray-200 rounded px-4 py-3 text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400" required />
               </div>
               <input type="tel" placeholder="聯絡電話" className="w-full border border-gray-200 rounded px-4 py-3 text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400" />
               <select className="w-full border border-gray-200 rounded px-4 py-3 text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 bg-white text-gray-600" required>
                 <option value="">選擇主題 *</option>
                 <option value="wedding-invitation">喜帖訂做</option>
                 <option value="illustration">插畫繪製</option>
                 <option value="other">其他合作</option>
               </select>
               <textarea placeholder="您的訊息 *" rows={5} className="w-full border border-gray-200 rounded px-4 py-3 text-sm focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 resize-none" required></textarea>
               <button type="submit" disabled={isSubmitting} className="bg-[#211915] text-white px-8 py-3 rounded text-sm hover:bg-[#3d342e] transition-colors tracking-widest flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                 {isSubmitting ? '處理中...' : (
                    <>送出訊息 <span>→</span></>
                 )}
               </button>
               </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="w-full lg:w-1/2">
             <h3 className="text-xl font-medium tracking-widest mb-8">聯絡方式</h3>
             <div className="space-y-8">
                <div className="flex items-start gap-4">
                   <div className="w-12 h-12 bg-[#faf8f5] rounded-full flex items-center justify-center shrink-0">
                      <Mail className="text-[#c98f6a]" size={20} />
                   </div>
                   <div>
                      <p className="text-sm font-medium mb-1">info@ministylecards.com</p>
                      <p className="text-[13px] text-gray-500">我們會在 1-2 個工作天內回覆</p>
                   </div>
                </div>
                <div className="flex items-start gap-4">
                   <div className="w-12 h-12 bg-[#faf8f5] rounded-full flex items-center justify-center shrink-0">
                      <Instagram className="text-[#c98f6a]" size={20} />
                   </div>
                   <div>
                      <p className="text-sm font-medium mb-1">Instagram</p>
                      <a href="https://www.instagram.com/ministylecards/" target="_blank" rel="noopener noreferrer" className="text-[13px] text-[#c98f6a] hover:text-[#b47a55] mb-1 inline-block">@ministylecards</a>
                      <p className="text-[13px] text-gray-500">歡迎私訊與我們聊聊</p>
                   </div>
                </div>
                <div className="flex items-start gap-4">
                   <div className="w-12 h-12 bg-[#faf8f5] rounded-full flex items-center justify-center shrink-0">
                      <MapPin className="text-[#c98f6a]" size={20} />
                   </div>
                   <div>
                      <p className="text-sm font-medium mb-1">工作室位置</p>
                      <p className="text-[13px] text-gray-500 mb-1">桃園市平鎮區新富五街168號4樓</p>
                      <p className="text-[13px] text-gray-500">採預約制，歡迎提前預約</p>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="w-full h-64 md:h-[400px] bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative mb-24">
          <iframe 
            src="https://maps.google.com/maps?q=桃園市平鎮區新富五街168號4樓&t=&z=15&ie=UTF8&iwloc=&output=embed" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={false} 
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0"
            title="工作室位置"
          ></iframe>
        </div>

        {/* FAQ Section */}
        <div className="text-center mb-20">
          <h2 className="text-2xl font-serif mb-12">常見問題</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 text-left">
             <div className="border border-gray-100 p-6 rounded hover:shadow-sm transition-shadow">
                <div className="w-6 h-6 rounded-full bg-[#faf8f5] flex items-center justify-center text-[#c98f6a] text-[11px] font-bold mb-4">Q</div>
                <h4 className="font-medium text-sm mb-3">喜帖製作需要多久時間？</h4>
                <p className="text-[13px] text-gray-500 leading-relaxed">一般為 4-6 週。若有急件需求請提前與我們聯繫。</p>
             </div>
             <div className="border border-gray-100 p-6 rounded hover:shadow-sm transition-shadow">
                <div className="w-6 h-6 rounded-full bg-[#faf8f5] flex items-center justify-center text-[#c98f6a] text-[11px] font-bold mb-4">Q</div>
                <h4 className="font-medium text-sm mb-3">可以客製化設計嗎？</h4>
                <p className="text-[13px] text-gray-500 leading-relaxed">可以的！我們提供客製化排版設計服務，風格樣式挑選、紙材到細節都能依需求調整。</p>
             </div>
             <div className="border border-gray-100 p-6 rounded hover:shadow-sm transition-shadow">
                <div className="w-6 h-6 rounded-full bg-[#faf8f5] flex items-center justify-center text-[#c98f6a] text-[11px] font-bold mb-4">Q</div>
                <h4 className="font-medium text-sm mb-3">如何下單？</h4>
                <p className="text-[13px] text-gray-500 leading-relaxed">可以透過官網、IG、FB聯繫我們，將由專人為您服務。</p>
             </div>
             <div className="border border-gray-100 p-6 rounded hover:shadow-sm transition-shadow">
                <div className="w-6 h-6 rounded-full bg-[#faf8f5] flex items-center justify-center text-[#c98f6a] text-[11px] font-bold mb-4">Q</div>
                <h4 className="font-medium text-sm mb-3">有提供海外寄送嗎？</h4>
                <p className="text-[13px] text-gray-500 leading-relaxed">有的！我們提供國際寄送服務，詳細運費請與我們聯繫。<br />香港地區順風快遞貨到付運即可</p>
             </div>
          </div>
          <button className="border border-gray-200 py-3 px-8 text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 mx-auto rounded">
            查看所有常見問題 <span>→</span>
          </button>
        </div>
      </section>

      {/* Instagram Feed */}
      <section className="bg-[#faf8f5] py-24 text-center">
         <h2 className="text-3xl font-serif mb-2">Follow us on Instagram</h2>
         <a href="https://www.instagram.com/ministylecards/" target="_blank" rel="noopener noreferrer" className="text-sm text-[#c98f6a] hover:text-[#b47a55] mb-12 inline-block">@ministylecards</a>
         <div className="flex flex-wrap md:flex-nowrap justify-center px-4 max-w-7xl mx-auto mb-12 gap-2 md:gap-4 overflow-hidden">
            <div className="w-1/2 md:w-1/5 aspect-square"><img loading="lazy" src="https://cdn.ministylecards.com/contact/interactive-save-the-date-wedding-invitation.jpg" alt="抽拉式 Save the Date 婚禮喜帖與互動婚禮設計｜MINIStyleCards" className="w-full h-full object-cover rounded" /></div>
            <div className="w-1/2 md:w-1/5 aspect-square"><img loading="lazy" src="https://cdn.ministylecards.com/contact/minimal-black-white-wedding-invitation.jpg" alt="極簡黑白美式婚禮喜帖與現代排版設計｜MINIStyleCards" className="w-full h-full object-cover rounded" /></div>
            <div className="hidden md:block w-1/5 aspect-square"><img loading="lazy" src="https://cdn.ministylecards.com/contact/newspaper-style-wedding-invitation.jpg" alt="報紙風婚禮喜帖與復古編輯感婚禮設計｜MINIStyleCards" className="w-full h-full object-cover rounded" /></div>
            <div className="hidden md:block w-1/5 aspect-square"><img loading="lazy" src="https://cdn.ministylecards.com/contact/photo-wedding-invitation-design.jpg" alt="婚紗照片款婚禮喜帖與浪漫花卉設計｜MINIStyleCards" className="w-full h-full object-cover rounded" /></div>
            <div className="hidden md:block w-1/5 aspect-square"><img loading="lazy" src="https://cdn.ministylecards.com/contact/passport-ticket-wedding-invitation.jpg" alt="機票護照造型婚禮喜帖與旅行主題婚禮設計｜MINIStyleCards" className="w-full h-full object-cover rounded" /></div>
         </div>
         <a href="https://www.instagram.com/ministylecards/" target="_blank" rel="noopener noreferrer" className="border border-gray-300 bg-white py-3 px-8 text-sm hover:bg-gray-50 transition-colors inline-flex items-center gap-2 mx-auto rounded">
            前往 Instagram <span>→</span>
         </a>
      </section>

    </div>
  );
}
