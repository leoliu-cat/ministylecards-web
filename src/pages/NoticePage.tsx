import React from 'react';
import { AlertCircle, FileText, CheckCircle, CreditCard, MessageCircle, Truck } from 'lucide-react';

export function NoticePage() {
  return (
    <div className="pt-28 pb-24 max-w-4xl mx-auto px-4 md:px-8">
      {/* Hero */}
      <section className="text-center mb-16">
        <h1 className="text-4xl font-serif text-gray-900 mb-2">訂購注意事項</h1>
        <h2 className="text-xl font-serif text-[#c98f6a] italic">Our Policy</h2>
      </section>

      {/* 訂購流程 */}
      <section className="mb-20">
        <div className="text-center mb-8">
          <span className="inline-block border border-gray-300 py-1 px-6 text-sm tracking-widest text-[#8b4e36] font-medium bg-[#faf8f5] rounded-full">訂購流程</span>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 max-w-3xl mx-auto">
          <div className="flex flex-col items-center w-24 text-center border border-[#d5a587] rounded-lg p-2 bg-[#faf8f5]/50">
            <div className="w-10 h-10 bg-white border border-[#eee4da] rounded-full flex items-center justify-center mb-2 shadow-sm text-[#8b4e36]">
              <MessageCircle size={18} />
            </div>
            <span className="text-[11px] md:text-xs font-medium text-[#8b4e36]">FBorIG私訊諮詢</span>
          </div>
          <div className="hidden md:flex items-center text-gray-300 w-8 justify-center mb-8">→</div>
          
          <div className="flex flex-col items-center w-24 text-center border border-[#d5a587] rounded-lg p-2 bg-[#faf8f5]/50">
            <div className="w-10 h-10 bg-white border border-[#eee4da] rounded-full flex items-center justify-center mb-2 shadow-sm text-[#8b4e36]">
              <FileText size={18} />
            </div>
            <span className="text-[11px] md:text-xs font-medium text-[#8b4e36]">選定材質樣式</span>
          </div>
          <div className="hidden md:flex items-center text-gray-300 w-8 justify-center mb-8">→</div>

          <div className="flex flex-col items-center w-24 text-center border border-[#d5a587] rounded-lg p-2 bg-[#faf8f5]/50">
            <div className="w-10 h-10 bg-white border border-[#eee4da] rounded-full flex items-center justify-center mb-2 shadow-sm text-[#8b4e36]">
              <CreditCard size={18} />
            </div>
            <span className="text-[11px] md:text-xs font-medium text-[#8b4e36]">完成付款</span>
          </div>
          <div className="hidden md:flex items-center text-gray-300 w-8 justify-center mb-8">→</div>

          <div className="flex flex-col items-center w-24 text-center border border-[#d5a587] rounded-lg p-2 bg-[#faf8f5]/50">
            <div className="w-10 h-10 bg-white border border-[#eee4da] rounded-full flex items-center justify-center mb-2 shadow-sm text-[#8b4e36]">
              <FileText size={18} />
            </div>
            <span className="text-[11px] md:text-xs font-medium text-[#8b4e36]">開始設計</span>
          </div>
          
          <div className="w-full h-2 md:hidden"></div>

          <div className="flex flex-col items-center w-24 text-center border border-[#d5a587] rounded-lg p-2 bg-[#faf8f5]/50 relative mt-4 md:mt-0">
             <div className="absolute -top-3 -right-2 bg-white border border-[#eee4da] text-[9px] text-[#8b4e36] px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap">
                可修改3次
             </div>
            <div className="w-10 h-10 bg-white border border-[#eee4da] rounded-full flex items-center justify-center mb-2 shadow-sm text-[#8b4e36]">
              <CheckCircle size={18} />
            </div>
            <span className="text-[11px] md:text-xs font-medium text-[#8b4e36]">校稿</span>
          </div>
          <div className="hidden md:flex items-center text-gray-300 w-8 justify-center mb-8">→</div>

          <div className="flex flex-col items-center w-24 text-center border border-[#d5a587] rounded-lg p-2 bg-[#faf8f5]/50">
            <div className="w-10 h-10 bg-white border border-[#eee4da] rounded-full flex items-center justify-center mb-2 shadow-sm text-[#8b4e36]">
              <FileText size={18} />
            </div>
            <span className="text-[11px] md:text-xs font-medium text-[#8b4e36]">定稿印刷製作</span>
          </div>
          <div className="hidden md:flex items-center text-gray-300 w-8 justify-center mb-8">→</div>

          <div className="flex flex-col items-center w-24 text-center border border-[#d5a587] rounded-lg p-2 bg-[#faf8f5]/50">
            <div className="w-10 h-10 bg-[#8b4e36] text-white border border-[#8b4e36] rounded-full flex items-center justify-center mb-2 shadow-sm">
              <Truck size={18} />
            </div>
            <span className="text-[11px] md:text-xs font-medium text-[#8b4e36]">收貨愉快</span>
          </div>
        </div>
      </section>

      {/* 退費須知 */}
      <section className="mb-24 bg-[#faf8f5] p-8 md:p-12 rounded-xl text-center border border-[#eee4da] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
           <FileText size={120} />
        </div>
        <div className="mb-6 relative z-10">
          <span className="inline-block text-[15px] tracking-[0.2em] text-[#8b4e36] font-medium">— 退費須知 —</span>
        </div>
        <div className="text-[13px] md:text-[15px] text-gray-700 leading-[2] max-w-lg mx-auto space-y-6 relative z-10 font-medium">
          <p>
            訂購後，若我司已經繳交設計初稿給您確認<br />
            但您想終止服務，將會退款訂單金額 <span className="text-[#c98f6a] font-bold">50%</span> 給您<br />
            且不以任何形式提供已設計之圖檔。
          </p>
          <p>
            若有加購人像插畫者，提供初稿後想終止服務<br />
            我司將先扣除插畫費用再核退 <span className="text-[#c98f6a] font-bold">50%</span> 之訂單金額<br />
            並僅提供插畫檔案給您。
          </p>
        </div>
      </section>

      {/* 工藝限制 */}
      <section className="mb-24">
        <div className="bg-[#fff9f9] text-[#9e2a2b] p-6 md:p-8 rounded-xl flex flex-col items-center text-center mb-12 shadow-[0_2px_10px_rgba(158,42,43,0.05)] border border-[#f4a7b9]/30">
          <AlertCircle size={32} className="mb-4 text-[#9e2a2b]" />
          <p className="text-[15px] md:text-lg font-medium mb-2 tracking-wide">以下現象為製作過程正常產生且無法避免的工藝限制</p>
          <p className="text-[15px] md:text-lg font-medium tracking-wide">視為品質正常，無法因此退貨、退費或免費重印</p>
        </div>

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-12">
          <div className="text-center md:text-left">
            <h3 className="text-[15px] font-medium text-[#8b4e36] mb-4 border-b border-[#eee4da] pb-3 inline-block md:block tracking-widest px-8 md:px-0">｜印刷色差｜</h3>
            <p className="text-[13px] md:text-sm text-gray-600 leading-loose">
              同批印製品與分批印製品皆有10%以內的色差<br />
              且印刷是CMYK，螢幕是RGB<br />
              在螢幕上觀看與實際印刷一定會有些許誤差<br />
              請勿以電腦螢幕作為對色基準<br />
              如對色彩有特別要求者，
              <strong className="text-[#9e2a2b] bg-[#fff9f9] px-2 py-0.5 rounded ml-1 font-bold">請！勿！購！買！</strong>
            </p>
          </div>
          
          <div className="text-center md:text-left">
            <h3 className="text-[15px] font-medium text-[#8b4e36] mb-4 border-b border-[#eee4da] pb-3 inline-block md:block tracking-widest px-8 md:px-0">｜紙材誤差｜</h3>
            <p className="text-[13px] md:text-sm text-gray-600 leading-loose">
              卡片、信封紙材厚度、重量軟硬度皆有<span className="font-mono bg-gray-50 px-1 rounded mx-1">+/-10%</span>以內的誤差
            </p>
          </div>

          <div className="text-center md:text-left">
            <h3 className="text-[15px] font-medium text-[#8b4e36] mb-4 border-b border-[#eee4da] pb-3 inline-block md:block tracking-widest px-8 md:px-0">｜裁切誤差｜</h3>
            <p className="text-[13px] md:text-sm text-gray-600 leading-loose">
              卡片裁切<span className="font-mono bg-gray-50 px-1 rounded mx-1">2mm(含)</span>以內的誤差
            </p>
          </div>

          <div className="text-center md:text-left">
            <h3 className="text-[15px] font-medium text-[#8b4e36] mb-4 border-b border-[#eee4da] pb-3 inline-block md:block tracking-widest px-8 md:px-0">｜印刷髒汙｜</h3>
            <div className="text-[13px] md:text-sm text-gray-600 leading-loose space-y-2">
              <p>直徑<span className="font-mono bg-gray-50 px-1 rounded mx-1">1mm(含)</span>以內汙點包含但不限白點、黑點、圓圈</p>
              <p><span className="font-medium text-gray-800">燙金壓痕：</span>燙金製程壓迫紙張產生的正面壓痕、背面凸痕</p>
              <p><span className="font-medium text-gray-800">燙金斑駁：</span>因紙張上的紙紋，造成燙印不均，略有斑駁現象</p>
              <p><span className="font-medium text-gray-800">燙金誤差：</span>燙金位置1mm(含)以內的位置誤差</p>
            </div>
          </div>
        </div>
      </section>

      {/* 傳統工藝須知 */}
      <section className="mb-24 pt-20 border-t border-gray-200">
        <div className="text-center md:text-left mb-16">
           <h2 className="text-xl md:text-2xl font-medium text-gray-900 mb-6 tracking-wide leading-tight">
              傳統燙金工藝、壓痕、斑駁、<br className="md:hidden" />等小範圍不可避免狀況須知
           </h2>
           <p className="text-gray-600 text-[15px] md:text-base leading-relaxed mb-6 font-medium">
              傳統工藝、每批次製作，壓力不同、紙張裝太不同<br className="hidden md:block" />均會影響些許
           </p>
           <p className="text-[#9e2a2b] bg-[#fff9f9] inline-block px-4 py-2 rounded-lg font-bold tracking-widest text-[15px] border border-[#f4a7b9]/30 shadow-sm">
             要求完美者，請勿下單
           </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 text-center">
            <div className="flex flex-col items-center">
               <div className="w-24 h-24 rounded-full mb-4 flex items-center justify-center ml-auto mr-auto border border-gray-100 overflow-hidden">
                 <img src="https://cdn.ministylecards.com/notice/printing-hot-foil-pressure-mark.png" alt="喜帖燙金壓痕示意｜燙金工藝於厚紙材上的正常壓印效果｜MINIStyleCards" className="w-full h-full object-cover" />
               </div>
               <span className="text-[13px] font-medium text-gray-800 tracking-wide">燙金壓痕</span>
            </div>

            <div className="flex flex-col items-center">
               <div className="w-24 h-24 rounded-full mb-4 flex items-center justify-center ml-auto mr-auto border border-gray-100 overflow-hidden">
                 <img src="https://cdn.ministylecards.com/notice/printing-small-dot-tolerance.png" alt="婚禮喜帖印刷正常容許範圍｜1mm內微小墨點與紙材現象說明｜MINIStyleCards" className="w-full h-full object-cover" />
               </div>
               <span className="text-[13px] font-medium text-gray-800 tracking-wide">直徑1mm(含)以內汙點</span>
            </div>

            <div className="flex flex-col items-center">
               <div className="w-24 h-24 rounded-full mb-4 flex items-center justify-center ml-auto mr-auto border border-gray-100 overflow-hidden">
                 <img src="https://cdn.ministylecards.com/notice/foil-print-texture-variation.png" alt="燙金斑駁與紙材紋理示意｜婚禮喜帖燙金工藝正常效果說明｜MINIStyleCards" className="w-full h-full object-cover" />
               </div>
               <span className="text-[13px] font-medium text-gray-800 tracking-wide">燙金斑駁</span>
            </div>

            <div className="flex flex-col items-center">
               <div className="w-24 h-24 rounded-full mb-4 flex items-center justify-center ml-auto mr-auto border border-gray-100 overflow-hidden">
                 <img src="https://cdn.ministylecards.com/notice/envelope-card-color-difference.png" alt="喜帖信封與卡片色差說明｜信封是紙漿固定顏色卡片是數位印刷只能接近信封顏色但無法完全一致｜MINIStyleCards" className="w-full h-full object-cover" />
               </div>
               <span className="text-[13px] font-medium text-gray-800 tracking-wide">信封&卡片色差</span>
            </div>
        </div>
        
        <div className="mt-12 text-center text-xs text-gray-500 p-5 bg-[#faf8f5] rounded-xl border border-[#eee4da] leading-loose max-w-2xl mx-auto shadow-sm">
          <strong>註*</strong> 信封是紙漿製成，卡片為四色印刷油墨製成 所以會有一定的色差 不會到一模一樣。<br />與螢幕顯色以及實際印刷品色差相同，介意者勿下單
        </div>
      </section>

    </div>
  );
}
