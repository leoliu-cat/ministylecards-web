import React, { useState } from 'react';
import { X, Minus, Plus, ChevronDown, ChevronUp, ArrowRight, ArrowLeft, ShieldCheck, HeartHandshake, Phone } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../components/CartContext';
import { useAuth } from '../components/AuthContext';

export function CartPage() {
  const { cartItems, updateQuantity, setItemQuantity, removeItem, removeCustomization } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  // Calculations
  const productsSubtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const customizationsSubtotal = cartItems.reduce((sum, item) => {
    const itemCustomTotal = item.customizations.reduce((cSum, c) => cSum + c.price, 0);
    return sum + itemCustomTotal; // assuming customizations added once for the whole configuration
  }, 0);
  const shippingFee = cartItems.reduce((sum, item) => sum + (item.shippingFee !== undefined && item.shippingFee !== null ? item.shippingFee : 120), 0);
  const totalPrice = productsSubtotal + customizationsSubtotal + shippingFee;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', minimumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="pt-24 pb-24 px-4 md:px-12 max-w-5xl mx-auto bg-[#faf8f5] min-h-screen">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-serif mb-3 text-gray-900">Shopping Cart</h1>
        <h2 className="text-xl font-medium tracking-wide mb-4">購物車 <span className="text-gray-400">({cartItems.length})</span></h2>
        <p className="text-[14px] text-gray-500">確認您的商品與加購內容，完成後即可進入下一步。</p>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 mb-6">您的購物車是空的</p>
          <Link to="/" className="inline-block border border-[#d2c5b8] bg-[#faf8f5] text-gray-700 hover:bg-white hover:border-[#c98f6a] hover:text-[#c98f6a] px-10 py-3.5 rounded-full text-[13px] tracking-widest transition-all shadow-sm">
            去逛逛商品
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          {/* Main Cart Items */}
          <div className="w-full lg:flex-1 flex flex-col gap-6">
          
          {/* Desktop Table Header */}
          <div className="hidden md:flex border-b border-gray-200 pb-4 text-[13px] tracking-widest text-gray-500 px-6">
            <div className="flex-1">商品與加購內容</div>
            <div className="w-24 text-center">單價</div>
            <div className="w-32 text-center">數量</div>
            <div className="w-24 text-right">小計</div>
          </div>

          {/* Items */}
          {cartItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden p-6">
              
              {/* Product Row */}
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 relative">
                
                {/* Remove button (mobile absolute right, desktop relative) */}
                <button 
                  onClick={() => removeItem(item.id)}
                  className="absolute top-0 right-0 p-2 text-gray-400 hover:text-gray-800 md:hidden"
                >
                  <X size={18} />
                </button>

                <div className="w-24 h-32 md:w-28 md:h-36 shrink-0 bg-gray-50 rounded overflow-hidden">
                  <img loading="lazy" src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-[16px] font-medium tracking-wide mb-1 text-gray-900">{item.name}</h3>
                  <p className="text-[13px] text-gray-500 mb-2">{item.baseQuantity}</p>
                  
                  <div className="text-[13px] text-gray-500 space-y-1 mb-3">
                    {item.eventDate && <p className="text-[#c98f6a] font-medium text-[14px]">宴客 / 活動日期：{item.eventDate}</p>}
                    {item.paper && <p>紙材：{item.paper}</p>}
                    {item.size && <p>尺寸：{item.size}</p>}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
                    {item.tags.map(tag => (
                      <span key={tag} className="border border-gray-200 text-gray-500 text-[11px] px-3 py-1 rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>

                {/* Price & Quantity & Subtotal (Desktop Row, Mobile Stacked) */}
                <div className="flex flex-row md:flex-row items-center justify-between w-full md:w-auto gap-4 md:gap-8 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                  <div className="md:w-24 text-left md:text-center text-[15px] font-serif text-gray-700 hidden md:block">
                    {formatPrice(item.price)}
                  </div>
                  
                  <div className="flex items-center border border-gray-200 rounded">
                    <button onClick={() => updateQuantity(item.id, item.tags && item.tags.includes('喜帖') ? -10 : -1)} className="px-3 py-1.5 text-gray-500 hover:bg-gray-50 transition-colors"><Minus size={14} /></button>
                    <input 
                      type="number"
                      className="w-10 text-center text-[13px] font-medium border-x border-gray-200 py-1.5 focus:outline-none hide-number-spinners"
                      value={item.quantity || ''}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        setItemQuantity(item.id, isNaN(val) ? 0 : val);
                      }}
                      onBlur={(e) => {
                        let val = parseInt(e.target.value, 10);
                        const isWeddingInvitation = item.tags && item.tags.includes('喜帖');
                        const minQty = item.minQty !== undefined ? item.minQty : (isWeddingInvitation ? 30 : 1);
                        if (isNaN(val) || val < minQty) val = minQty;
                        setItemQuantity(item.id, val);
                      }}
                    />
                    <button onClick={() => updateQuantity(item.id, item.tags && item.tags.includes('喜帖') ? 10 : 1)} className="px-3 py-1.5 text-gray-500 hover:bg-gray-50 transition-colors"><Plus size={14} /></button>
                  </div>
                  
                  <div className="md:w-24 text-right text-[15px] font-serif font-medium text-gray-900">
                    {formatPrice(item.price * item.quantity)}
                  </div>

                  <button 
                    onClick={() => removeItem(item.id)}
                    className="hidden md:block p-2 text-gray-400 hover:text-gray-800 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Customizations Accordion */}
              {item.customizations.length > 0 && (
                <div className="mt-6 border border-gray-100 rounded-lg overflow-hidden bg-[#faf8f5]/50">
                  <button 
                    onClick={() => toggleExpand(item.id)}
                    className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors text-sm"
                  >
                    <span className="flex items-center gap-2 text-gray-700 font-medium tracking-widest">
                      <div className="grid grid-cols-2 gap-0.5 opacity-40">
                         <div className="w-1.5 h-1.5 border border-current rounded-sm"></div>
                         <div className="w-1.5 h-1.5 border border-current rounded-sm"></div>
                         <div className="w-1.5 h-1.5 border border-current rounded-sm"></div>
                         <div className="w-1.5 h-1.5 border border-current rounded-sm"></div>
                      </div>
                      查看加購內容 (已選 {item.customizations.length} 項)
                    </span>
                    {expandedItem === item.id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                  </button>
                  
                  {expandedItem === item.id && (
                    <div className="p-6 bg-white border-t border-gray-100">
                      <h4 className="text-[13px] font-medium tracking-widest text-gray-900 mb-6 font-sans">加購內容摘要</h4>
                      
                      <div className="space-y-6">
                        {item.customizations.map((custom: any, customIdx: number) => (
                          <div key={`${custom.id || custom.name}-${customIdx}`} className="flex gap-4 group">
                            <div className="w-10 h-10 rounded-full bg-[#faf8f5] border border-gray-100 flex items-center justify-center shrink-0 text-[#c98f6a]">
                              {/* Simple abstract icons to mimic design */}
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                            </div>
                            <div className="flex-1">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
                                    <div>
                                        <p className="text-[14px] font-medium text-gray-800 mb-1">
                                            {custom.name.includes('|') || custom.name.includes('(') ? (
                                                <span dangerouslySetInnerHTML={{__html: custom.name.replace(' (', ' <span class="text-gray-400 font-normal text-[13px]">(').replace(')', ')</span>')}} />
                                            ) : custom.name}
                                        </p>
                                        <p className="text-[13px] text-gray-500 leading-relaxed whitespace-pre-line">
                                            {custom.desc}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between md:justify-end gap-6 mt-1 md:mt-0">
                                        <span className="text-[14px] font-serif text-gray-700">{formatPrice(custom.price)}</span>
                                        <button 
                                            onClick={() => removeCustomization(item.id, custom.id)}
                                            className="text-gray-300 hover:text-gray-600 transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-8">
                        <Link to={`/product/${item.productId}?edit=${item.id}`} state={{ category: item.tags[0], product: { id: item.productId, title: item.name.split(' | ')[1], price: item.price, images: [item.image] } }} className="w-full flex items-center justify-center border border-gray-200 text-gray-600 py-3 rounded text-[13px] tracking-widest hover:bg-gray-50 transition-colors font-medium">
                          編輯加購內容
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Summary Box */}
          <div className="mt-8 border-t border-gray-200 pt-8">
            <div className="flex flex-col items-end w-full">
              <div className="w-full md:w-1/2 space-y-4 text-[14px] text-gray-600 mb-6 border-b border-gray-200/50 pb-6">
                <div className="flex justify-between items-center w-full">
                  <span>商品小計</span>
                  <span className="font-serif text-[15px]">{formatPrice(productsSubtotal)}</span>
                </div>
                <div className="flex justify-between items-center w-full">
                  <span>加購內容小計</span>
                  <span className="font-serif text-[15px]">{formatPrice(customizationsSubtotal)}</span>
                </div>
                <div className="flex justify-between items-center w-full">
                  <span>運費</span>
                  <span className="font-serif text-[15px]">{formatPrice(shippingFee)}</span>
                </div>
              </div>
              
              <div className="w-full md:w-1/2 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <span className="text-[18px] font-medium tracking-widest text-gray-900">總金額</span>
                <span className="text-[28px] font-serif font-medium text-[#c98f6a]">{formatPrice(totalPrice)}</span>
              </div>
              
              <div className="w-full md:w-1/2 text-left mb-12">
                <p className="text-[12px] text-gray-500 tracking-wide text-left">
                  將依實際選擇之數量與內容調整金額，結帳前可再次確認。
                </p>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 pt-8 border-t border-gray-200/50">
              <div className="flex items-start gap-5">
                 <div className="w-12 h-12 rounded-full bg-[#faf8f5] flex items-center justify-center shrink-0 border border-gray-200 text-[#c98f6a]">
                    <HeartHandshake size={20} strokeWidth={1.5} />
                 </div>
                 <div>
                    <h5 className="text-[14px] font-medium tracking-widest mb-1.5 text-gray-800">安心製作</h5>
                    <p className="text-[13px] text-gray-500 leading-relaxed">每一份設計，<br/>我們都用心對待。</p>
                 </div>
              </div>
              <div className="flex items-start gap-5 border-t border-gray-200/50 md:border-t-0 md:border-l md:pl-8 pt-6 md:pt-0">
                 <div className="w-12 h-12 rounded-full bg-[#faf8f5] flex items-center justify-center shrink-0 border border-gray-200 text-[#c98f6a]">
                    <Phone size={20} strokeWidth={1.5} />
                 </div>
                 <div>
                    <h5 className="text-[14px] font-medium tracking-widest mb-1.5 text-gray-800">專屬服務</h5>
                    <p className="text-[13px] text-gray-500 leading-relaxed">如有任何問題，<br/>歡迎與我們聯繫。</p>
                 </div>
              </div>
              <div className="flex items-start gap-5 border-t border-gray-200/50 md:border-t-0 md:border-l md:pl-8 pt-6 md:pt-0">
                 <div className="w-12 h-12 rounded-full bg-[#faf8f5] flex items-center justify-center shrink-0 border border-gray-200 text-[#c98f6a]">
                    <ShieldCheck size={20} strokeWidth={1.5} />
                 </div>
                 <div>
                    <h5 className="text-[14px] font-medium tracking-widest mb-1.5 text-gray-800">安全結帳</h5>
                    <p className="text-[13px] text-gray-500 leading-relaxed">我們提供安全的結帳流程，<br/>保護您的資料。</p>
                 </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col items-center gap-4">
              <button 
                onClick={() => {
                  if (user) {
                    navigate('/checkout');
                  } else {
                    navigate('/login', { state: { from: '/checkout' } });
                  }
                }}
                className="w-full md:w-80 bg-[#3d342e] hover:bg-[#2b2520] text-white py-4 rounded text-[14px] tracking-widest flex items-center justify-center gap-3 transition-colors shadow-sm">
                前往填寫資料 <ArrowRight size={16} />
              </button>
              <Link to="/" className="text-gray-500 py-2 rounded text-[13px] tracking-widest flex items-center justify-center gap-2 hover:text-gray-900 transition-colors">
                 繼續購物 <ArrowLeft size={14} className="order-first" />
              </Link>
            </div>
          </div>
        </div>
        </div>
      )}
    </div>
  );
}
