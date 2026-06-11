import { API_BASE_URL } from '../config';
import React, { useState, useEffect } from 'react';
import { useCart } from '../components/CartContext';
import { useAuth } from '../components/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';

import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const TapPayFields = React.memo(() => (
  <div className="pt-6 border-t border-gray-100">
     <h3 className="text-xl font-medium tracking-widest mb-6">信用卡付款資訊</h3>
     <div className="space-y-4">
        <div className="space-y-2">
           <label className="text-sm text-gray-700 font-medium block">信用卡號 <span className="text-red-500">*</span></label>
           <div className="w-full border border-gray-300 rounded px-3 py-2 bg-white h-[46px] block" id="card-number"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-2">
              <label className="text-sm text-gray-700 font-medium block">到期日 <span className="text-red-500">*</span></label>
              <div className="w-full border border-gray-300 rounded px-3 py-2 bg-white h-[46px] block" id="card-expiration-date"></div>
           </div>
           <div className="space-y-2">
              <label className="text-sm text-gray-700 font-medium block">安全碼 (CVV) <span className="text-red-500">*</span></label>
              <div className="w-full border border-gray-300 rounded px-3 py-2 bg-white h-[46px] block" id="card-ccv"></div>
           </div>
        </div>
     </div>
  </div>
));

export function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: user?.email || '',
    address: '',
    notes: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const isTapPaySetup = React.useRef(false);

  const generatePDF = async (): Promise<string | null> => {
    const el = document.getElementById('receipt-pdf-content');
    const termsEl = document.getElementById('receipt-pdf-terms');
    if (!el || !termsEl) return null;
    try {
       const pdf = new jsPDF('p', 'mm', 'a4');
       const pdfWidth = pdf.internal.pageSize.getWidth();
       const pageHeight = pdf.internal.pageSize.getHeight();
       let isFirstPage = true;

       // 1. Order details
       const canvas = await html2canvas(el, { scale: 2, useCORS: true });
       const imgData = canvas.toDataURL('image/jpeg', 1.0);
       const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
       
       let heightLeft = pdfHeight;
       let position = 0;
       
       pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
       heightLeft -= pageHeight;
       
       while (heightLeft > 0) {
           position = heightLeft - pdfHeight;
           pdf.addPage();
           pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
           heightLeft -= pageHeight;
       }

       // 2. Terms & conditions
       pdf.addPage();
       const termsCanvas = await html2canvas(termsEl, { scale: 2, useCORS: true });
       const termsImgData = termsCanvas.toDataURL('image/jpeg', 1.0);
       const termsPdfHeight = (termsCanvas.height * pdfWidth) / termsCanvas.width;
       
       let termsHeightLeft = termsPdfHeight;
       let termsPosition = 0;

       pdf.addImage(termsImgData, 'JPEG', 0, termsPosition, pdfWidth, termsPdfHeight);
       termsHeightLeft -= pageHeight;
       
       while (termsHeightLeft > 0) {
           termsPosition = termsHeightLeft - termsPdfHeight;
           pdf.addPage();
           pdf.addImage(termsImgData, 'JPEG', 0, termsPosition, pdfWidth, termsPdfHeight);
           termsHeightLeft -= pageHeight;
       }

       const result = pdf.output('datauristring').split(',')[1];
       return result;
    } catch(err: any) {
       console.error("PDF generation failed", err);
       return null;
    }
  };

  useEffect(() => {
    // Check if TPDirect is loaded and elements are in DOM
    if (typeof (window as any).TPDirect !== 'undefined' && !isTapPaySetup.current && document.getElementById('card-number')) {
      isTapPaySetup.current = true;
      const TPDirect = (window as any).TPDirect;
      
      const appIdStr = import.meta.env.VITE_TAPPAY_APP_ID;
      const appKeyStr = import.meta.env.VITE_TAPPAY_APP_KEY;
      
      const appId = parseInt(appIdStr as string) || 168436;
      const appKey = appKeyStr || 'app_TLACx7X82OheYUFEndKqV6bzQZjUQep1BVfQdX4JGYY8Gs37pfQnO5sMtPOR';
      
      const tappayEnv = import.meta.env.VITE_TAPPAY_ENV || 'sandbox';

      if (tappayEnv === 'production' && appKey.includes('TLACx7X82Ohe')) {
         console.error('【錯誤】你宣告了正式環境 (production)，但使用的是測試環境的 APP_KEY。請更新你的 VITE_TAPPAY_APP_ID 與 VITE_TAPPAY_APP_KEY 為正式環境金鑰。');
      }

      if (!appIdStr || !appKeyStr) {
         console.warn('TapPay 測試參數缺失，將使用預設佔位符，可能會導致 App name mismatch 錯誤。請在環境變數設定 VITE_TAPPAY_APP_ID 與 VITE_TAPPAY_APP_KEY。');
      }

      TPDirect.setupSDK(appId, appKey, tappayEnv);
      
      TPDirect.card.setup({
        fields: {
            number: {
                element: '#card-number',
                placeholder: '**** **** **** ****'
            },
            expirationDate: {
                element: '#card-expiration-date',
                placeholder: 'MM / YY'
            },
            ccv: {
                element: '#card-ccv',
                placeholder: 'CVV'
            }
        },
        styles: {
            'input': {
                'color': 'gray'
            },
            'input.ccv': {
                'font-size': '16px'
            },
            'input.expiration-date': {
                'font-size': '16px'
            },
            'input.card-number': {
                'font-size': '16px'
            },
            ':focus': {
                'color': 'black'
            },
            '.valid': {
                'color': 'green'
            },
            '.invalid': {
                'color': 'red'
            }
        },
        isMaskCreditCardNumber: true,
        maskCreditCardNumberRange: {
            beginIndex: 6,
            endIndex: 11
        }
      });
    }
  }, [loading, user, cartItems.length]);

  if (loading) {
     return <div className="min-h-screen pt-32 pb-20 text-center">Loading...</div>;
  }

  if (!user) {
     return <Navigate to="/login" replace state={{ from: '/checkout' }} />;
  }

  if (cartItems.length === 0 && !paymentSuccess) {
     return <Navigate to="/cart" replace />;
  }

  const productsSubtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const customizationsSubtotal = cartItems.reduce((sum, item) => {
    const itemCustomTotal = item.customizations.reduce((cSum, c) => cSum + c.price, 0);
    return sum + itemCustomTotal;
  }, 0);
  const shippingFee = 120;
  const totalPrice = productsSubtotal + customizationsSubtotal + shippingFee;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', minimumFractionDigits: 0 }).format(price);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError('');

    const TPDirect = (window as any).TPDirect;
    if (!TPDirect) {
      setPaymentError('金流系統載入失敗，請重新整理頁面');
      return;
    }

    const tappayStatus = TPDirect.card.getTappayFieldsStatus();
    
    if (tappayStatus.canGetPrime === false) {
      setPaymentError('信用卡資訊填寫錯誤或不完整');
      return;
    }

    let token = localStorage.getItem('website_token');
    // Require the user to be logged in before checking out per user instructions
    if (!token) {
      setPaymentError('結帳需請您先登入，請點擊右上方圖示登入會員。');
      return;
    }

    setIsSubmitting(true);

    TPDirect.card.getPrime(async (result: any) => {
      if (result.status !== 0) {
        if (result.msg?.includes('App name mismatch') || result.status === 10000 || result.msg?.includes('failed to get prime')) {
            setPaymentError(`TapPay 授權失敗 (${result.status}: ${result.msg})。\n\n原因可能是：\n1. 尚未填寫完整信用卡資訊\n2. 測試網域（例如：${window.location.hostname}）未加入 TapPay 後台白名單。\n\n解法：請前往 TapPay 管理後台 (Portal)，將「網站網址 (Website URLs)」加入白名單。`);
        } else {
            setPaymentError(`取得交易授權碼失敗 (${result.status}): ` + result.msg);
        }
        setIsSubmitting(false);
        return;
      }
      
      const prime = result.card.prime;
      
      try {
        // 1. Create order on backend directly (Server handles items calculation)
        const orderRes = await fetch(`${API_BASE_URL}/api/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                shipping_info: {
                    name: formData.name,
                    phone: formData.phone,
                    address: formData.address,
                    notes: formData.notes
                },
                payment_method: 'tappay',
                coupon_code: '',
                total_amount: totalPrice,
                items: cartItems.map(i => {
                    const itemConfig: Record<string, any> = {};
                    if (i.image) itemConfig["image"] = i.image.startsWith('http') ? i.image : `https://admin.ministylecards.com${i.image}`;
                    if (i.paper) itemConfig["款式"] = i.paper;
                    if (i.eventDate) itemConfig["Event Date"] = i.eventDate;
                    if (i.baseQuantity) itemConfig["Base Quantity"] = i.baseQuantity;
                    
                    if (i.customizations) {
                        i.customizations.forEach((c: any) => {
                            itemConfig[c.name] = c.desc;
                        });
                    }
                    
                    return {
                        product_id: i.productId,
                        quantity: i.quantity,
                        price: i.price,
                        config: itemConfig
                    };
                })
            })
        });
        
        const orderData = await orderRes.json();
        
        if (!orderRes.ok || !orderData.orderId) {
           if (orderRes.status === 401 || orderRes.status === 403 || orderData.error === 'Invalid token' || orderData.error === 'Missing token') {
              localStorage.removeItem('website_token');
              setPaymentError('登入狀態失效，請重新登入以繼續結帳。');
           } else {
              setPaymentError('建立訂單失敗：' + (orderData.error || orderData.message || '未知錯誤'));
           }
           setIsSubmitting(false);
           return;
        }

        // 確保先生成 PDF
        let receiptPdfBase64 = null;
        try {
            receiptPdfBase64 = await generatePDF();
        } catch (pdfErr) {
            console.error("Failed to generate PDF", pdfErr);
        }

        // 2. 呼叫 Node.js 後端 API 處理 TapPay 金流與 Resend 發信
        // 注意：/api/pay 是在我們的 server.ts 中實作的，不是在 Laravel 後端。
        const payRes = await fetch(`${API_BASE_URL}/api/pay`, {
            method: 'POST',
            headers: { 
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                prime: prime,
                orderId: orderData.orderId,
                amount: totalPrice,
                cardholder: {
                   phone_number: formData.phone,
                   name: formData.name,
                   email: formData.email
                },
                receiptPdf: receiptPdfBase64,
                orderDetails: {
                   items: cartItems
                }
            })
        });

        if (payRes.status === 403) {
            setPaymentError('瀏覽器安全性限制（預設阻擋第三方 Cookie）導致結帳金流無法在預覽視窗內完成。請點擊右上角「在新分頁開啟 (View app in new tab)」按鈕，在獨立視窗中進行測試。');
            setIsSubmitting(false);
            return;
        }

        const payData = await payRes.json().catch(() => ({ error: '無效的伺服器回應' }));

        if (!payRes.ok || (payData.error && payData.error !== '')) {
            setPaymentError('付款失敗: ' + (payData.error || payData.message || '無法完成付款'));
            setIsSubmitting(false);
            return;
        }

        setPaymentSuccess(true);
        clearCart();
        navigate('/order/success');

      } catch (err) {
        console.error(err);
        setPaymentError('伺服器連線錯誤，請稍後再試');
        setIsSubmitting(false);
      }    });
  };

  return (
    <div className="pt-24 pb-24 px-4 md:px-12 max-w-6xl mx-auto bg-[#faf8f5] min-h-screen">
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-serif mb-3 text-gray-900">Checkout</h1>
        <h2 className="text-lg font-medium tracking-wide mb-4">結帳填寫資料</h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
         {/* Form Section */}
         <div className="w-full lg:w-2/3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
               <h3 className="text-xl font-medium tracking-widest mb-6">訂購人資訊</h3>
               
               <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-sm text-gray-700 font-medium">姓名 <span className="text-red-500">*</span></label>
                        <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full border border-gray-300 rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#c98f6a] focus:border-[#c98f6a]" placeholder="王小明" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-sm text-gray-700 font-medium">手機號碼 <span className="text-red-500">*</span></label>
                        <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full border border-gray-300 rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#c98f6a] focus:border-[#c98f6a]" placeholder="0912345678" />
                     </div>
                  </div>
                  
                  <div className="space-y-2">
                     <label className="text-sm text-gray-700 font-medium">Email <span className="text-red-500">*</span></label>
                     <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full border border-gray-300 rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#c98f6a] focus:border-[#c98f6a]" placeholder="your@email.com" />
                  </div>
                  
                  <div className="space-y-2">
                     <label className="text-sm text-gray-700 font-medium">收件地址</label>
                     <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full border border-gray-300 rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#c98f6a] focus:border-[#c98f6a]" placeholder="若有實體商品請填寫配送地址" />
                  </div>

                  <div className="space-y-2">
                     <label className="text-sm text-gray-700 font-medium block">備註說明</label>
                     <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows={3} className="w-full border border-gray-300 rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#c98f6a] focus:border-[#c98f6a]" placeholder="有任何想告訴我們的訊息，例如特殊排版需求... 也可以請留下IG/FB帳號方便即時聯絡討論喔" />
                  </div>
                  
                  <TapPayFields />

                  {paymentError && (
                     <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
                           <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                              <span className="text-red-500 font-bold text-xl">!</span>
                           </div>
                           <h3 className="text-xl font-medium text-center mb-2">付款失敗</h3>
                           <p className="text-gray-600 text-center mb-6 whitespace-pre-wrap">{paymentError}</p>
                           <button 
                              type="button"
                              onClick={() => setPaymentError('')} 
                              className="w-full bg-[#3d342e] hover:bg-[#2b2520] text-white py-3 rounded tracking-widest text-sm"
                           >
                              確定並重新嘗試
                           </button>
                        </div>
                     </div>
                  )}

                  <div className="pt-6 border-t border-gray-100 flex justify-end">
                     <button type="submit" disabled={isSubmitting} className="w-full md:w-auto bg-[#3d342e] hover:bg-[#2b2520] disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-12 py-3.5 rounded text-[14px] tracking-widest transition-colors shadow-sm">
                        {isSubmitting ? '處理中...' : '確認送出訂單並付款'}
                     </button>
                  </div>
               </form>
            </div>
         </div>

         {/* Summary Section */}
         <div className="w-full lg:w-1/3">
            <div className="bg-[#f4eee8]/50 rounded-xl p-8 sticky top-24" id="order-summary-pdf">
               <h3 className="text-lg font-medium tracking-widest mb-6">訂單摘要</h3>
               
               <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                     <div key={item.id} className="flex gap-4 border-b border-gray-200/50 pb-4">
                        <div className="w-16 h-20 bg-white rounded flex-shrink-0 overflow-hidden"><img loading="lazy" src={item.image} alt={item.name} className="w-full h-full object-cover" /></div>
                        <div className="flex-1 text-sm">
                           <p className="font-medium text-gray-900 mb-1">{item.name}</p>
                           <p className="text-gray-500 mb-1">{item.baseQuantity} × {item.quantity}</p>
                           {item.eventDate && <p className="text-[#c98f6a] font-medium text-[13px] mb-1">宴客 / 活動日期：{item.eventDate}</p>}
                           {item.customizations && item.customizations.map((custom: any, customIdx: number) => (
                             <p key={`${custom.id || custom.name}-${customIdx}`} className="text-gray-500 text-xs">
                               + {custom.name}{custom.desc && custom.desc !== custom.name && custom.desc !== '數量未滿 100 份酌收基本上機費' ? ` - ${custom.desc}` : ''} {custom.price > 0 ? `(+${formatPrice(custom.price)})` : ''}
                             </p>
                           ))}
                           <p className="text-gray-900 mt-2">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                     </div>
                  ))}
               </div>

               <div className="space-y-3 text-sm text-gray-600 mb-6 border-b border-gray-200/50 pb-6">
                 <div className="flex justify-between items-center w-full">
                   <span>小計</span>
                   <span>{formatPrice(productsSubtotal)}</span>
                 </div>
                 <div className="flex justify-between items-center w-full">
                   <span>加購內容</span>
                   <span>{formatPrice(customizationsSubtotal)}</span>
                 </div>
                 <div className="flex justify-between items-center w-full">
                   <span>運費</span>
                   <span>{formatPrice(shippingFee)}</span>
                 </div>
               </div>

               <div className="flex justify-between items-center font-medium text-lg">
                  <span>總金額</span>
                  <span className="text-[#c98f6a] font-serif">{formatPrice(totalPrice)}</span>
               </div>
            </div>
         </div>
      </div>

      {/* Hidden Receipt Template for PDF Generation */}
      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
        <div 
          id="receipt-pdf-content" 
          className="p-12 relative w-[800px]"
          style={{ fontFamily: "Inter, sans-serif", backgroundColor: "#ffffff", color: "#111827" }}
        >
          <div className="pb-8 mb-8 text-center" style={{ borderBottom: "1px solid #e5e7eb" }}>
            <h1 className="text-3xl tracking-widest font-serif mb-2">Mini Style Cards</h1>
            <h2 className="text-xl tracking-widest font-light" style={{ color: "#6b7280" }}>訂購明細與條款 (Order Receipt)</h2>
        </div>
        
        <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: "#f9fafb" }}>
           <div className="grid grid-cols-2 gap-8">
             <div>
               <h3 className="text-lg font-medium tracking-widest mb-4">訂購人資訊</h3>
               <div className="grid gap-2 text-sm" style={{ color: "#374151" }}>
                 <div><span style={{ color: "#6b7280" }}>姓名：</span>{formData.name}</div>
                 <div><span style={{ color: "#6b7280" }}>手機號碼：</span>{formData.phone}</div>
                 <div><span style={{ color: "#6b7280" }}>Email：</span>{formData.email}</div>
                 <div><span style={{ color: "#6b7280" }}>地址：</span>{formData.address}</div>
                 {formData.notes && <div><span style={{ color: "#6b7280" }}>備註：</span>{formData.notes}</div>}
               </div>
             </div>
             <div>
               <h3 className="text-lg font-medium tracking-widest mb-4">公司資訊</h3>
               <div className="grid gap-2 text-sm" style={{ color: "#374151" }}>
                 <div><span style={{ color: "#6b7280" }}>公司名稱：</span>樂卡科技有限公司</div>
                 <div><span style={{ color: "#6b7280" }}>統一編號：</span>8 3 3 1 3 8 1 7</div>
                 <div><span style={{ color: "#6b7280" }}>聯絡人：</span>L e o</div>
                 <div><span style={{ color: "#6b7280" }}>電話：</span>0 3 - 4 6 8 7 5 3 0</div>
                 <div><span style={{ color: "#6b7280" }}>Email：</span>info@ministylecards.com</div>
                 <div><span style={{ color: "#6b7280" }}>訂單日期：</span>2026-05-28</div>
               </div>
             </div>
           </div>
        </div>

        <div className="mb-12">
            <h3 className="text-lg font-medium tracking-widest mb-4 pb-2" style={{ borderBottom: "1px solid #e5e7eb" }}>購買內容</h3>
            <div className="space-y-6">
                {cartItems.map(item => (
                    <div key={item.id} className="flex flex-col pb-4" style={{ borderBottom: "1px solid #f3f4f6" }}>
                        <div className="flex justify-between items-center mb-2">
                           <span className="font-medium text-base">{item.name}</span>
                           <span>{formatPrice(item.price * item.quantity)}</span>
                        </div>
                        <div className="text-sm mb-2" style={{ color: "#6b7280" }}>數量: {item.baseQuantity} × {item.quantity}</div>
                        {item.eventDate && <div className="text-sm mb-2" style={{ color: "#c98f6a" }}>宴客 / 活動日期: {item.eventDate}</div>}
                        {item.customizations && item.customizations.length > 0 && (
                           <div className="pl-4 border-l-2" style={{ borderColor: 'rgba(201, 143, 106, 0.3)' }}>
                              {item.customizations.map((custom: any, customIdx: number) => (
                                 <div key={`${custom.id || custom.name}-${customIdx}`} className="flex justify-between text-sm my-1" style={{ color: "#6b7280" }}>
                                    <span>+ {custom.name}{custom.desc && custom.desc !== custom.name && custom.desc !== '數量未滿 100 份酌收基本上機費' ? ` - ${custom.desc}` : ''}</span>
                                    <span>{custom.price > 0 ? `+${formatPrice(custom.price)}` : '免費'}</span>
                                 </div>
                              ))}
                           </div>
                        )}
                    </div>
                ))}
            </div>
            
            <div className="mt-8 flex flex-col items-end gap-2 text-sm" style={{ color: "#4b5563" }}>
                <div className="flex justify-between w-64"><span>小計：</span><span>{formatPrice(productsSubtotal)}</span></div>
                <div className="flex justify-between w-64"><span>加購內容：</span><span>{formatPrice(customizationsSubtotal)}</span></div>
                <div className="flex justify-between w-64 pb-4" style={{ borderBottom: "1px solid #e5e7eb" }}><span>運費：</span><span>{formatPrice(shippingFee)}</span></div>
                <div className="flex justify-between w-64 text-lg font-medium pt-2" style={{ color: "#111827" }}><span>總金額：</span><span>{formatPrice(totalPrice)}</span></div>
            </div>
        </div>
      </div>

      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
        <div 
          id="receipt-pdf-terms" 
          className="p-12 relative w-[800px]"
          style={{ fontFamily: "Inter, sans-serif", backgroundColor: "#ffffff", color: "#111827" }}
        >
            <h4 className="font-medium mb-3 text-sm tracking-widest" style={{ color: "#111827", fontSize: '1.25rem', marginBottom: '1.5rem' }}>注意事項：</h4>
            <div className="space-y-4" style={{ fontSize: '0.95rem', lineHeight: '1.8' }}>
                 <p>＊各電腦螢幕會有色彩差異，請勿以電腦螢幕作為信封或圖稿顏色之對色基準，若對顏色有嚴格要求者，請勿下訂。</p>
                 <p>＊設計、插畫修改僅限3次。</p>
                 <p>＊不論信封或是卡片正反面會依圖案狀況有不同程度之燙金壓力痕跡或是些許斑駁掉箔等正常現象，在非影響閱讀之情況下，資訊呈現些微斑駁掉箔等狀況，不屬於瑕疵將不提供退換貨服務。</p>
                 <p>＊信封、卡片燙金皆為傳統手工對位，會有3-5mm合理尺寸誤差偏移，若自備檔案有特殊要求者，請標記尺寸，未標記尺寸者將不得以此誤差作為退換貨理由。</p>
                 <p>＊信封或是卡片等紙製品成品尺寸，皆會有3-5 mm合理尺寸誤差，請知悉。</p>
                 <p>＊收到匯款後執行設計，插畫完稿時間需依諮詢時插畫師之檔期為主，婚卡設計皆以收到完整資料（婚宴資訊、照片繪製完成圖）開始計算10-14個工作天進行排版，確認圖稿後製作需2-3週，若有特殊交件日期要求請提前告知。</p>
                 <p>＊非活動贈送雙人插畫繪製提供300dpi高解析PNG檔案供留底紀念使用。</p>
                 <p>＊活動贈送雙人插畫繪製一律不提供插畫檔案、可另行加購或公開分享獲得。</p>
                 <p>＊一律不提供任何設計原始檔案, 確認印刷後僅提供確認搞jpg圖片檔(僅適合通訊軟體使用)當作電子喜帖使用。</p>
                 <p>＊商品完成後寄出不另行通知, 請留意快遞公司簡訊或電話通知。</p>
                 <p>＊完成插畫繪製，未設計婚卡前若退訂，須另支付插畫費用；若已完成婚卡設計者，未印刷前退訂，須支付訂單金額50%。</p>
                 <p>＊其他項目若已提供設計圖檔後退訂，皆僅退50％費用並且不以任何形式提供檔案。</p>
                 <p>＊開立電子發票寄至提供的Email地址, 若需要開立統編請成立訂單的2個工作日內要主動提供。</p>
                 <p>＊透過 Ministylecards 購買的所有商品設計，我們保留分享和展示的權利。</p>
                 <p>＊如果您希望保留設計的隱私，請提前告知，我們將尊重您的需求並不公開分享。</p>
            </div>
        </div>
      </div>
     </div>
    </div>
  );
}
