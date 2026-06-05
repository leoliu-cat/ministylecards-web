import React from 'react';
import { ChevronDown, ShoppingBag, CreditCard, MessageCircle, PenTool, Package, Truck, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const styles = [
  { title: '極簡字母設計款', price: 'NT$ 125', image: 'https://cdn.ministylecards.com/process/minimal-typography-wedding-invitation.jpg', alt: '極簡字母排版婚禮喜帖與現代美式設計｜MINIStyleCards' },
  { title: '白玫瑰花卉款', price: 'NT$ 65', image: 'https://cdn.ministylecards.com/process/sage-green-floral-wedding-invitation.jpg', alt: '白玫瑰花卉婚禮喜帖與鼠尾草綠信封設計｜MINIStyleCards' },
  { title: '藍色花藝款', price: 'NT$ 125', image: 'https://cdn.ministylecards.com/process/dusty-blue-floral-wedding-invitation.jpg', alt: '霧藍花藝婚禮喜帖與法式藍色婚禮設計｜MINIStyleCards' },
  { title: '婚紗照片綠色款', price: 'NT$ 65', image: 'https://cdn.ministylecards.com/process/photo-style-wedding-invitation-green.jpg', alt: '婚紗照片款婚禮喜帖與綠色花卉設計｜MINIStyleCards' },
  { title: '深藍高級感款', price: 'NT$ 85', image: 'https://cdn.ministylecards.com/process/navy-blue-luxury-wedding-invitation.jpg', alt: '深藍色高級感婚禮喜帖與燙金設計｜MINIStyleCards' },
  { title: '粉色浪漫花卉款', price: 'NT$ 95', image: 'https://cdn.ministylecards.com/process/pink-romantic-wedding-invitation.jpg', alt: '粉色浪漫花卉婚禮喜帖與法式婚禮設計｜MINIStyleCards' },
];

const illustrations = [
  { title: '韓風寫實插畫', author: 'Li老師', desc: '檔期需要先確認才下單喔，一般建議約6個月前要確認', image: 'https://cdn.ministylecards.com/process/korean-realistic-wedding-illustration-li.jpg', alt: '韓風寫實婚禮似顏繪插畫｜Li老師客製雙人婚禮插畫設計｜MINIStyleCards' },
  { title: '可愛Q版似顏繪', author: '戴花老師', desc: '檔期約30個工作天左右', image: 'https://cdn.ministylecards.com/process/cute-cartoon-wedding-illustration-daihua.jpg', alt: '可愛Q版婚禮似顏繪插畫與寵物客製設計｜戴花老師插畫風格｜MINIStyleCards' },
  { title: '奶油感唯美插畫', author: 'Pins老師', desc: '檔期需要先確認才下單喔，一個月只接一組插畫繪製', image: 'https://cdn.ministylecards.com/process/soft-romantic-wedding-illustration-pins.jpg', alt: '唯美奶油感婚禮插畫與浪漫婚紗似顏繪設計｜Pins老師插畫風格｜MINIStyleCards' },
  { title: '水彩風插畫', author: 'soi soi老師', desc: '檔期約14個工作天左右', image: 'https://cdn.ministylecards.com/process/watercolor-wedding-illustration-soisoi.jpg', alt: '水彩風婚禮似顏繪插畫與浪漫新人手繪設計｜Soi Soi老師插畫風格｜MINIStyleCards' },
  { title: '色塊風情侶插畫', author: '小著老師', desc: '檔期約20-30個工作天左右', image: 'https://cdn.ministylecards.com/process/color-block-couple-illustration-xiaozhu.jpg', alt: '色塊風情侶插畫與日常穿搭似顏繪設計｜小著老師插畫風格｜MINIStyleCards' },
  { title: '豆豆風插畫', author: 'SuSu老師', desc: '檔期約20-30個工作天左右', image: 'https://cdn.ministylecards.com/process/dodoo-style-wedding-illustration-susu.jpg', alt: '豆豆風婚禮似顏繪插畫與極簡可愛新人設計｜SuSu老師插畫風格｜MINIStyleCards' },
  { title: '蠟筆風插畫', author: 'Kay老師', desc: '檔期約20-30個工作天左右', image: 'https://cdn.ministylecards.com/process/crayon-style-wedding-illustration-kay.jpg', alt: '蠟筆手繪婚禮插畫與溫柔系似顏繪設計｜Kay老師插畫風格｜MINIStyleCards' },
];

const accessories = [
  { id: 1, name: '信封：(套餐包含)', desc: '信封最多可以選擇2款顏色' },
  { id: 2, name: '信封燙金：(套餐包含)', desc: '套餐有包含信封單面燙金設計，可以正面中式或是背面西式二選一\n下單後會有樣式可以選擇，專屬設計師會協助您確認排版\n若想要雙面都燙金，只需+6元即可\n燙金都是未滿100份按100份計算' },
  { id: 3, name: '信封內襯：(加購項目)', desc: '基本上會延伸您喜帖設計，讓您收到的喜帖更有系列感\n如有特殊需求可以再與我們討論即可' },
  { id: 4, name: '卡片形式：(套餐包含)', desc: '默認設定是單卡式雙面印刷\n若要改成對折式四面印刷+10元即可' },
  { id: 5, name: '卡片材質：(套餐包含)', desc: '默認設定是300um象牙卡\n若選擇雙開門、對折式會用300um雙面霧卡\n若想要升級更厚磅的紙卡/請參考『訂購注意事項』' },
  { id: 6, name: '卡片燙金：(加購項目)', desc: '燙金可以把文字，簡單線條改成燙金方式呈現，讓畫面更繽紛更佳隆重\n燙金傳統手工工藝說明請參考『訂購注意事項』\n燙金都是未滿100份按100份計算' },
  { id: 7, name: '信封貼紙：(套餐包含)', desc: '套餐都有包含燙金貼紙\n若想要升級蜂蠟貼紙+10/個即可' },
];

export function ProcessPage() {
  return (
    <div className="pt-28 pb-24 max-w-5xl mx-auto px-4 md:px-8">
      
      {/* 01 */}
      <section className="text-center mb-20 space-y-4 pt-10">
        <h2 className="text-2xl font-medium tracking-widest mb-8">01 選擇款式風格</h2>
        <div className="text-sm text-gray-600 leading-relaxed max-w-2xl mx-auto space-y-10">
          <div>
            <p>喜帖系列款式都可以做組合式的搭配，各樣式都可以選擇互相搭配。</p>
            <p className="mt-1">客製化的加購項目，可以搭配喜帖做半客製化的設計。</p>
          </div>
          
          <div className="bg-[#faf8f5] border border-[#eee4da] rounded-xl p-6 md:p-8 relative mt-10 shadow-sm">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 py-1 flex items-center text-[#c98f6a] text-[11px] font-bold tracking-widest border border-[#eee4da] rounded-full shadow-sm">
               PACKAGE INFO
            </div>
            <p className="font-medium text-gray-900 text-[15px] mb-6 tracking-wide">各樣式默認：<br className="md:hidden" /><span className="text-[#8b4e36] mx-1">300um象牙卡單卡式套餐</span>包含</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[13px] text-gray-700 font-medium tracking-wide">
               <div className="flex flex-col items-center justify-center py-4 px-2 bg-white rounded-lg shadow-sm border border-gray-100/50">
                  <span className="text-[#d5a587] mb-2 font-serif text-sm">#1</span>
                  <span>卡片雙面印刷</span>
               </div>
               <div className="flex flex-col items-center justify-center py-4 px-2 bg-white rounded-lg shadow-sm border border-gray-100/50">
                  <span className="text-[#d5a587] mb-2 font-serif text-sm">#2</span>
                  <span>美式信封</span>
               </div>
               <div className="flex flex-col items-center justify-center py-4 px-2 bg-white rounded-lg shadow-sm border border-gray-100/50">
                  <span className="text-[#d5a587] mb-2 font-serif text-sm">#3</span>
                  <span>信封單面燙金設計</span>
               </div>
               <div className="flex flex-col items-center justify-center py-4 px-2 bg-white rounded-lg shadow-sm border border-gray-100/50">
                  <span className="text-[#d5a587] mb-2 font-serif text-sm">#4</span>
                  <span>金屬燙金貼紙</span>
               </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 bg-[#eee4da]/20 p-4 md:p-12 rounded-xl">
          {styles.map((style, idx) => (
            <div key={idx} className="text-left">
              <div className="bg-white shadow-[0_2px_10px_rgba(0,0,0,0.03)] aspect-[4/5] overflow-hidden mb-4 rounded">
                <img loading="lazy" src={style.image} alt={style.alt} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-[15px] font-medium tracking-wider mb-2 text-center md:text-left">{style.title}</h3>
              <p className="text-sm text-gray-500 tracking-wider text-center md:text-left">{style.price}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-center text-gray-300 my-16">
        <ChevronDown size={32} strokeWidth={1} />
      </div>

      {/* 02 */}
      <section className="text-center mb-20">
        <h2 className="text-2xl font-medium tracking-widest mb-12">02 選則是否加購雙人插畫繪製</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16">
          {illustrations.map((ill, idx) => (
            <div key={idx}>
              <div className="aspect-[4/5] bg-gray-50 rounded mb-6 overflow-hidden shadow-sm">
                 <img loading="lazy" src={ill.image} alt={ill.alt} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-medium tracking-wider mb-2">{ill.title}</h3>
              <p className="text-xs text-gray-500 mb-2">{ill.author}</p>
              {ill.desc && <p className="text-[11px] text-gray-400 max-w-[200px] mx-auto">{ill.desc}</p>}
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-center text-gray-300 my-16">
        <ChevronDown size={32} strokeWidth={1} />
      </div>

      {/* 03 */}
      <section className="mb-20">
        <h2 className="text-2xl font-medium tracking-widest mb-12 text-center">03 選則配件與加購項目</h2>
        <div className="border-t border-gray-200 text-center md:text-left">
          <div className="hidden md:flex px-4 py-4 border-b border-gray-200 text-sm font-medium bg-gray-50/50">
            <div className="w-12 text-center">#</div>
            <div className="w-1/4">項目</div>
            <div className="flex-1 text-center">說明</div>
          </div>
          {accessories.map((acc, idx) => (
            <div key={acc.id} className={`flex flex-col md:flex-row px-4 py-8 border-b border-gray-100 text-sm ${idx % 2 === 1 ? 'bg-gray-50/30' : ''}`}>
              <div className="hidden md:block w-12 font-medium text-gray-400 text-center">{acc.id}</div>
              <div className="w-full md:w-1/4 font-medium mb-4 md:mb-0 text-center md:text-left text-base md:text-sm">
                <span className="md:hidden text-gray-400 mr-2">{acc.id}.</span> 
                {acc.name}
              </div>
              <div className="flex-1 text-gray-600 leading-relaxed text-center whitespace-pre-line">
                {acc.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-center text-gray-300 my-16">
        <ChevronDown size={32} strokeWidth={1} />
      </div>

      {/* 04 */}
      <section className="text-center mb-20">
        <h2 className="text-2xl font-medium tracking-widest mb-4">04 加入購物車</h2>
        <p className="text-xl italic font-serif text-gray-700 mb-6">Add to Cart & Place Your Order</p>
        <p className="font-medium tracking-wider text-sm md:text-base">婚期若低於 1.5 個月者，須先聯繫我們確認是否來得及喔</p>
      </section>

      <div className="flex justify-center text-gray-300 my-16">
        <ChevronDown size={32} strokeWidth={1} />
      </div>

      {/* 05 */}
      <section className="text-center mb-20">
        <h2 className="text-2xl font-medium tracking-widest mb-4">05 訂購交付流程</h2>
        <p className="font-serif italic text-xl text-gray-700 mb-16">Ordering Process</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-16 gap-x-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center">
             <div className="w-16 h-16 flex items-center justify-center mb-4">
                <ShoppingBag size={34} strokeWidth={1.5} className="text-gray-800" />
             </div>
             <h3 className="font-medium tracking-widest mb-3">1. 網站選購</h3>
             <p className="text-sm text-gray-600 mb-2">選擇喜帖系列風格與加購配件</p>
             <p className="text-[11px] text-gray-400">婚期若低於1.5個月者，須先聯繫<br className="hidden md:block" />我們確認是否來得及喔</p>
          </div>

          <div className="flex flex-col items-center">
             <div className="w-16 h-16 flex items-center justify-center mb-4">
                <CreditCard size={34} strokeWidth={1.5} className="text-gray-800" />
             </div>
             <h3 className="font-medium tracking-widest mb-3">2. 加入購物車並完成支付</h3>
             <p className="text-sm text-gray-600 mb-2">完成支付後開使排單給設計師</p>
             <p className="text-[11px] text-gray-400">若3天內沒有收到email聯繫，<br className="hidden md:block" />請主動聯繫我們</p>
          </div>

          <div className="flex flex-col items-center">
             <div className="w-16 h-16 flex items-center justify-center mb-4">
                <Instagram size={34} strokeWidth={1.5} className="text-gray-800" />
             </div>
             <h3 className="font-medium tracking-widest mb-3">3. 聯繫我們</h3>
             <p className="text-sm text-gray-600 mb-2">IG/FB平台說明訂單編號後會有<br className="hidden md:block" />專屬設計師與您對接</p>
             <p className="text-[11px] text-gray-400">訂單確認後會提供問卷表單給您填寫</p>
          </div>

          <div className="flex flex-col items-center">
             <div className="w-16 h-16 flex items-center justify-center mb-4">
                <PenTool size={34} strokeWidth={1.5} className="text-gray-800" />
             </div>
             <h3 className="font-medium tracking-widest mb-3">4. 插畫繪製與/設計校稿</h3>
             <p className="text-sm text-gray-600 mb-2">約4-5週</p>
             <p className="text-[11px] text-gray-400 leading-relaxed">若有加購插畫會提供mail給您傳照片給老師繪製<br/>若有加購插畫需加上老師的檔期時間<br/>插畫完成後進行排版設計<br/>插畫、設計修改以2次為限</p>
          </div>

          <div className="flex flex-col items-center">
             <div className="w-16 h-16 flex items-center justify-center mb-4">
                <Package size={34} strokeWidth={1.5} className="text-gray-800" />
             </div>
             <h3 className="font-medium tracking-widest mb-3">5. 印刷包裝</h3>
             <p className="text-sm text-gray-600 mb-2">約10-15個工作天</p>
             <p className="text-[11px] text-gray-400 leading-relaxed">收到定稿確認後開始計算<br/>不同材質、工藝不同工作天數增加5-7個工作天不等</p>
          </div>

          <div className="flex flex-col items-center">
             <div className="w-16 h-16 flex items-center justify-center mb-4">
                <Truck size={34} strokeWidth={1.5} className="text-gray-800" />
             </div>
             <h3 className="font-medium tracking-widest mb-3">6. 宅配到府</h3>
             <p className="text-sm text-gray-600 mb-2">我們一律以順豐快遞包裹寄件</p>
             <p className="text-[11px] text-gray-400">出貨不另行通知，<br className="hidden md:block" />以順豐快遞簡訊或電話通知為準</p>
          </div>
        </div>
      </section>

    </div>
  );
}
