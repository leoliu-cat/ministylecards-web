import React, { useState, useEffect } from 'react';
import { Heart, Monitor, Headphones, MessageCircle, ArrowRight } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginWithGoogle, auth } from '../lib/firebase';
import { useAuth } from '../components/AuthContext';
import { RecaptchaVerifier } from 'firebase/auth';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [errorText, setErrorText] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user, loginWithEmailOtp } = useAuth();
  
  const from = location.state?.from || '/';

  useEffect(() => {
     if (user) {
        navigate(from, { replace: true });
     }
  }, [user, navigate, from]);

  const handleGoogleLogin = async () => {
    try {
      setErrorText("");
      await loginWithGoogle();
      navigate(from, { replace: true });
    } catch (e: any) {
      if (e.message) {
         setErrorText(e.message);
      } else {
         setErrorText("登入發生錯誤，請稍後再試。");
      }
    }
  };

  const handleGetCode = async () => {
     if (!inputValue.trim() || !inputValue.includes('@')) {
        setErrorText("請輸入有效的 Email 信箱");
        return;
     }

     setIsLoading(true);
     setErrorText("");

     try {
         const res = await fetch('https://admin.ministylecards.com/api/auth/send-verification-code', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ email: inputValue })
         });
         
         const data = await res.json().catch(() => ({}));

         if (!res.ok || !data.success) {
             throw new Error(data.error || "發送失敗");
         }
         
         setEmailSent(true);
     } catch (e: any) {
         console.error(e);
         setErrorText(e.message || "發送失敗，請稍後再試。");
     } finally {
         setIsLoading(false);
     }
  };

  const handleVerifyCode = async () => {
      if (!otpCode || otpCode.length < 6) return;
      setIsLoading(true);
      setErrorText("");
      
      try {
         const res = await fetch('https://admin.ministylecards.com/api/auth/verify-code', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ email: inputValue, code: otpCode })
         });
         
         const data = await res.json().catch(() => ({}));

         if (!res.ok || !data.success) {
             throw new Error(data.error || "驗證碼錯誤");
         }

         if (data.token) {
             localStorage.setItem('website_token', data.token);
         }

         loginWithEmailOtp(inputValue);
         navigate(from, { replace: true });
         
      } catch (e: any) {
          setErrorText(e.message || "系統發生錯誤。");
      } finally {
          setIsLoading(false);
      }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex">
      {/* Left Column: Image & Overlay */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
         <img 
            src="https://cdn.ministylecards.com/login/login-wedding-invitation-illustration.jpg" 
            alt="MINIStyleCards 客製婚禮喜帖與燙金插畫設計｜登入頁品牌形象圖" 
            className="absolute inset-0 w-full h-full object-cover blur-sm scale-110"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"></div>
         <div className="relative z-10 hidden mt-auto p-16 text-white">
             {/* Note: In the design the text is dark over a light background, let's adjust */}
         </div>
      </div>
      
      {/* We can use a floating card layout to match the design more closely if it's not a full split */}
      <div className="absolute inset-0 p-4 lg:p-12 overflow-y-auto flex py-20 lg:py-12">
         <div className="bg-white rounded-xl shadow-2xl flex flex-col lg:flex-row w-full max-w-[1400px] lg:min-h-[800px] overflow-hidden m-auto mt-0 lg:m-auto">
            
            {/* Left side of card - Image */}
            <div className="w-full lg:w-5/12 relative hidden md:block shrink-0">
               <img 
                  src="https://cdn.ministylecards.com/login/login-wedding-invitation-illustration.jpg" 
                  alt="MINIStyleCards 客製婚禮喜帖與燙金插畫設計｜登入頁品牌形象圖" 
                  className="w-full h-full object-cover"
               />
               <div className="absolute bottom-0 left-0 p-12 w-full bg-gradient-to-t from-gray-900/60 to-transparent text-white">
                  <h1 className="text-4xl md:text-5xl font-serif mb-4 leading-tight">
                     Every detail,<br />
                     a memory to keep.
                  </h1>
                  <p className="text-sm tracking-widest font-light">用設計收藏愛的每一刻</p>
               </div>
               <div className="absolute top-12 left-12">
                 <Link to="/" className="text-gray-800 text-xl font-serif">MINIStyleCards<br/><span className="text-[10px] uppercase font-sans tracking-[0.2em]">Wedding Stationery</span></Link>
               </div>
            </div>

            {/* Right side of card - Login content */}
            <div className="w-full lg:w-7/12 flex flex-col h-full bg-white relative">
               
               {/* Top link */}
               <div className="flex justify-end p-8 border-b border-gray-50/0">
                  <Link to="/" className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-2 transition-colors">
                     回到首頁 <ArrowRight size={16} />
                  </Link>
               </div>

               {/* Login Form Section */}
               <div className="flex-grow flex flex-col justify-center py-10 md:py-0 px-6 md:px-24">
                  <div className="max-w-md w-full mx-auto">
                     <div className="text-center mb-10">
                        <h2 className="text-4xl font-serif mb-4 flex items-center justify-center gap-3">
                           Welcome back <Heart className="text-[#d8b5a3]" strokeWidth={1} />
                        </h2>
                        <p className="text-[15px] text-gray-500">登入您的帳號，繼續打造專屬於你的婚禮時刻</p>
                     </div>

                     <div className="space-y-4 mb-8">
                        <button onClick={handleGoogleLogin} className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 py-3.5 rounded flex items-center justify-center gap-3 transition-colors shadow-sm">
                           <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                           <span className="text-[15px] font-medium tracking-wide">使用 Google 帳號登入</span>
                        </button>
                     </div>

                     {errorText && (
                        <p className="text-red-500 text-sm mb-4 text-center">{errorText}</p>
                     )}

                     {!emailSent ? (
                         <>
                            <div className="relative flex items-center justify-center mb-8">
                               <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                               <span className="relative bg-white px-4 text-xs text-gray-400">或</span>
                            </div>

                            <div className="space-y-4 mb-3">
                               <input 
                                  type="email" 
                                  value={inputValue}
                                  onChange={(e) => setInputValue(e.target.value)}
                                  placeholder="Email 信箱" 
                                  className="w-full border border-gray-300 rounded px-4 py-3.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                                  disabled={isLoading}
                               />
                               <button 
                                  onClick={handleGetCode}
                                  disabled={isLoading}
                                  className="w-full bg-[#f4eee8] hover:bg-[#ebdccc] disabled:opacity-50 text-[#7a6052] font-medium py-3.5 rounded transition-colors tracking-wide text-sm">
                                  {isLoading ? '發送中...' : '使用 Email 登入/註冊'}
                               </button>
                            </div>
                            <p className="text-center text-xs text-gray-400 tracking-wide mb-12">
                               若想串接 Resend 寄送驗證信，我們需要準備客製化後端
                            </p>
                         </>
                     ) : (
                         <>
                            <div className="relative flex items-center justify-center mb-8">
                               <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                               <span className="relative bg-white px-4 text-xs text-gray-400">驗證身份</span>
                            </div>

                            <p className="text-center text-sm text-gray-600 mb-6">
                               已寄送驗證碼至 <span className="font-medium text-gray-900">{inputValue}</span>
                            </p>

                            <div className="space-y-4 mb-3">
                               <input 
                                  type="text" 
                                  value={otpCode}
                                  onChange={(e) => setOtpCode(e.target.value)}
                                  placeholder="請輸入 Email 收到 6 位數驗證碼" 
                                  maxLength={6}
                                  className="w-full tracking-widest text-center border border-gray-300 rounded px-4 py-3.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#c98f6a] focus:border-[#c98f6a]"
                                  disabled={isLoading}
                               />
                               <button 
                                  onClick={handleVerifyCode}
                                  disabled={isLoading || otpCode.length < 6}
                                  className="w-full bg-[#3d342e] hover:bg-[#2b2520] disabled:opacity-50 text-white font-medium py-3.5 rounded transition-colors tracking-wide text-sm">
                                  {isLoading ? '驗證中...' : '登入'}
                               </button>
                               <button 
                                  onClick={() => { setEmailSent(false); setOtpCode(""); }}
                                  className="w-full text-center text-xs text-gray-500 hover:text-gray-900 mt-4 underline underline-offset-2">
                                  重新輸入 Email
                               </button>
                            </div>
                         </>
                     )}
                  </div>
               </div>

               {/* Features Section */}
               <div className="border-t border-gray-100 bg-[#faf8f5]/50 px-6 md:px-16 py-10 md:py-12 mt-auto">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                     <div className="text-center">
                        <Heart className="mx-auto text-[#c98f6a] mb-4" strokeWidth={1} size={28} />
                        <h4 className="font-medium text-[15px] mb-2">收藏喜愛設計</h4>
                        <p className="text-[13px] text-gray-500 leading-relaxed">將喜歡的喜帖、書約<br />加入收藏清單</p>
                     </div>
                     <div className="text-center">
                        <MessageCircle className="mx-auto text-[#c98f6a] mb-4" strokeWidth={1} size={28} />
                        <h4 className="font-medium text-[15px] mb-2">專門設計師對接</h4>
                        <p className="text-[13px] text-gray-500 leading-relaxed">提供一對一專屬服務<br />順暢溝通設計需求</p>
                     </div>
                     <div className="text-center">
                        <Monitor className="mx-auto text-[#c98f6a] mb-4" strokeWidth={1} size={28} />
                        <h4 className="font-medium text-[15px] mb-2">管理婚禮網站</h4>
                        <p className="text-[13px] text-gray-500 leading-relaxed">編輯婚禮網站內容<br />與 RSVP 回覆</p>
                     </div>
                  </div>
               </div>

               {/* Footer block */}
               <div className="border-t border-gray-100 p-8 md:px-16 flex flex-col md:flex-row items-center justify-between gap-6 bg-white shrink-0">
                  <div className="flex items-center gap-4">
                     <Headphones className="text-gray-400" strokeWidth={1.5} size={32} />
                     <div>
                        <p className="font-medium text-[15px] mb-1">需要協助嗎？</p>
                        <p className="text-[13px] text-gray-500">我們會很樂意為您服務</p>
                     </div>
                  </div>
                  <div className="hidden md:block w-px h-10 bg-gray-200"></div>
                  <div className="text-center md:text-left">
                     <p className="text-sm font-medium mb-1">info@ministylecards.com</p>
                     <p className="text-[13px] text-gray-500">週一至週五 10:00 - 18:00</p>
                  </div>
                  <button className="flex items-center gap-2 border border-gray-200 rounded px-5 py-2.5 hover:bg-gray-50 transition-colors text-sm font-medium">
                     聯繫我們 <MessageCircle size={16} className="text-gray-500" />
                  </button>
               </div>

            </div>
         </div>
      </div>
    </div>
  );
}
