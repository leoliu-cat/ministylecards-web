import { API_BASE_URL } from '../config';
import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Search, Heart, ShoppingCart, Menu, User, X, Instagram, Facebook } from 'lucide-react';
import { useCart } from './CartContext';
import { useAuth } from './AuthContext';
import { useFavorites } from './FavoritesContext';

const PinterestIcon = ({ size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2C6.5 2 2 6.5 2 12c0 4.3 2.7 8 6.5 9.5-.1-1-.2-2.5 0-3.6.2-.9 1.4-6.1 1.4-6.1s-.4-.7-.4-1.8c0-1.7 1-2.9 2.2-2.9 1 0 1.5.8 1.5 1.7 0 1-1.3 2.6-2 4.1-.6 1.2.6 2.2 1.8 2.2 2.1 0 3.8-2.2 3.8-5.5 0-2.9-2.1-4.9-5-4.9-3.4 0-5.4 2.5-5.4 5.2 0 1 .4 2.1.9 2.7.1.1.1.2.1.3-.1.4-.3 1.2-.4 1.4-.1.3-.2.3-.5.2-1.9-.9-3.1-3.7-3.1-6 0-4.9 3.6-9.4 10.3-9.4 5.3 0 9.5 3.8 9.5 8.9 0 5.3-3.3 9.6-8 9.6-1.5 0-3-.8-3.5-1.7 0 0-.8 3-1 3.7-.3 1.3-1.1 2.9-1.6 3.9A10 10 0 0 0 12 22c5.5 0 10-4.5 10-10S17.5 2 12 2z"></path>
  </svg>
);

export function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { cartItems, clearCart } = useCart();
  const { user, logout } = useAuth();
  const { favoritesCount } = useFavorites();
  
  const cartCount = cartItems.length;

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/categories?limit=1000`)
      .then(r => r.json())
      .then(data => {
        setCategories(data);
      })
      .catch(err => console.warn('Could not fetch categories::', err.message || err));
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(() => {
      setIsSearching(true);
      fetch(`${API_BASE_URL}/api/products?limit=1000`)
        .then(res => res.json())
        .then(data => {
          const results = data.filter((item: any) => 
            item.title.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setSearchResults(results);
          setIsSearching(false);
        })
        .catch(err => {
          console.error('Error searching products:', err);
          setIsSearching(false);
        });
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Map API slug to frontend routes to maintain compatibility with App.tsx
  const getRoute = (slug: string) => {
    if (slug === 'essential-desig') return '/essential-design';
    return `/${slug}`;
  };

  return (
    <>
      <header className="siteHeader">
        <Link to="/" className="logo" aria-label="MINIStyleCards 首頁" onClick={closeMobileMenu}>
          MINIStyleCards
        </Link>

        <nav className="nav" aria-label="主選單">
          {categories.length > 0 ? categories.map(cat => (
            <Link key={cat.id} to={getRoute(cat.slug)}>
              {cat.name}
            </Link>
          )) : (
            <>
              <Link to="/wedding-invitations">喜帖</Link>
              <Link to="/marriage-certificate">結婚書約</Link>
              <Link to="/wedding-favors">婚禮小物</Link>
              <Link to="/essential-design">必備設計</Link>
              <Link to="/illustration">插畫繪製</Link>
              <Link to="/wedding-website">婚禮網站</Link>
              <Link to="/journal">文章分享</Link>
              <Link to="/collections">精選系列</Link>
            </>
          )}
        </nav>

        <div className="headerIcons" aria-label="功能選單">
          <button className="desktopOnly" aria-label="搜尋" onClick={() => setIsSearchOpen(true)}>
            <Search size={20} />
          </button>
          <button className="md:hidden" aria-label="搜尋" onClick={() => { setIsSearchOpen(true); closeMobileMenu(); }}>
            <Search size={20} />
          </button>
          {user ? (
            <div className="relative group flex items-center justify-center cursor-pointer">
              {(user as any).photoURL ? (
                <img loading="lazy" src={(user as any).photoURL} alt={(user as any).displayName || "使用者"} className="w-6 h-6 rounded-full object-cover" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-[#f4eee8] text-[#7a6052] flex items-center justify-center text-xs font-bold uppercase">{user.email?.charAt(0)}</div>
              )}
              {/* Dropdown for logout */}
              <div className="absolute top-full right-0 pt-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-50">
                 <div className="bg-white border border-gray-100 shadow-sm rounded w-32 overflow-hidden">
                    <button onClick={logout} className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                       登出
                    </button>
                 </div>
              </div>
            </div>
          ) : (
            <Link to="/login" aria-label="會員登入">
              <User size={20} />
            </Link>
          )}
          <Link to="/favorites" aria-label="收藏" className="relative">
            <Heart size={20} />
            {favoritesCount > 0 && <span className="absolute -top-1.5 -right-2 bg-[#c98f6a] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium font-sans">{favoritesCount}</span>}
          </Link>
          <Link to="/cart" aria-label="購物車" className="relative">
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="absolute -top-1.5 -right-2 bg-[#c98f6a] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-medium font-sans">{cartCount}</span>}
          </Link>
          <button className="menuIcon" type="button" aria-label={isMobileMenuOpen ? "關閉選單" : "開啟選單"} onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Search Overlay Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm pt-24 px-8 pb-8 overflow-y-auto w-full h-full flex flex-col items-center">
          <button 
            className="absolute top-8 right-8 text-gray-500 hover:text-gray-900 transition-colors"
            onClick={() => {
              setIsSearchOpen(false);
              setSearchQuery('');
              setSearchResults([]);
            }}
          >
            <X size={28} />
          </button>
          
          <div className="w-full max-w-2xl mx-auto mt-8">
            <div className="relative border-b-2 border-[#8b4e36] pb-2 flex items-center">
              <Search size={24} className="text-gray-400 mr-4" />
              <input 
                type="text" 
                autoFocus
                placeholder="搜尋商品..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xl md:text-2xl bg-transparent border-none outline-none text-gray-800 placeholder-gray-300"
              />
            </div>
            
            <div className="mt-8">
              {isSearching ? (
                <div className="text-center text-gray-500 py-8">搜尋中...</div>
              ) : searchQuery.trim() && searchResults.length === 0 ? (
                <div className="text-center text-gray-500 py-8">找不到符合「{searchQuery}」的商品</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {searchResults.map(result => {
                    const cleanSlug = (result.slug || result.id).toString().split('/').pop();
                    return (
                    <Link 
                      to={`/product/${cleanSlug}`}  
                      key={result.id} 
                      className="group flex gap-4 items-center bg-gray-50 hover:bg-gray-100 p-3 rounded-lg transition-colors"
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery('');
                        setSearchResults([]);
                      }}
                    >
                      <div className="w-20 h-20 bg-gray-200 rounded shrink-0 overflow-hidden">
                        <img loading="lazy" 
                          src={result.images && result.images.length > 0 ? `https://admin.ministylecards.com${result.images[0]}` : 'https://images.unsplash.com/photo-1544534728-662d55e09062?auto=format&fit=crop&w=300&q=80'} 
                          alt={result.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                        />
                      </div>
                      <div className="flex flex-col">
                        <h4 className="font-medium text-gray-900 line-clamp-2">{result.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">NT$ {result.base_price}</p>
                      </div>
                    </Link>
                  )})}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#fffdf9] pt-24 px-8 pb-8 overflow-y-auto flex flex-col md:hidden">
          <nav className="flex flex-col gap-8 text-[16px] font-sans text-gray-800 tracking-wider">
            {categories.length > 0 ? categories.map(cat => (
              <Link key={cat.id} to={getRoute(cat.slug)} onClick={closeMobileMenu} className="border-b border-gray-100 pb-4">
                {cat.name}
              </Link>
            )) : (
              <>
                <Link to="/wedding-invitations" onClick={closeMobileMenu} className="border-b border-gray-100 pb-4">喜帖</Link>
                <Link to="/marriage-certificate" onClick={closeMobileMenu} className="border-b border-gray-100 pb-4">結婚書約</Link>
                <Link to="/wedding-favors" onClick={closeMobileMenu} className="border-b border-gray-100 pb-4">婚禮小物</Link>
                <Link to="/essential-design" onClick={closeMobileMenu} className="border-b border-gray-100 pb-4">必備設計</Link>
                <Link to="/illustration" onClick={closeMobileMenu} className="border-b border-gray-100 pb-4">插畫繪製</Link>
                <Link to="/wedding-website" onClick={closeMobileMenu} className="border-b border-gray-100 pb-4">婚禮網站</Link>
                <Link to="/journal" onClick={closeMobileMenu} className="border-b border-gray-100 pb-4">文章分享</Link>
                <Link to="/collections" onClick={closeMobileMenu} className="border-b border-gray-100 pb-4">精選系列</Link>
              </>
            )}
          </nav>
        </div>
      )}

      <main>
        <Outlet />
      </main>

      <footer className="siteFooter">
        <div className="footerInner">
          <div className="footerBrand">
            <div className="footerLogo">MINIStyleCards</div>
            <p>Studio in Zhongli, Taoyuan</p>
            <div className="socials">
              <a href="https://www.instagram.com/ministylecards/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={20} /></a>
              <a href="https://www.pinterest.com/ministylecards/" target="_blank" rel="noopener noreferrer" aria-label="Pinterest"><PinterestIcon size={20} /></a>
              <a href="https://www.facebook.com/ministylecards/?locale=zh_TW" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Facebook size={20} /></a>
            </div>
          </div>

          <div className="footerCol">
            <h4>Shop</h4>
            {categories.length > 0 ? categories.slice(0, 6).map(cat => (
              <Link key={cat.id} to={getRoute(cat.slug)}>
                {cat.name}
              </Link>
             )) : (
              <>
                <Link to="/wedding-invitations">喜帖</Link>
                <Link to="/marriage-certificate">結婚書約</Link>
                <Link to="/wedding-favors">婚禮小物</Link>
                <Link to="/essential-design">必備設計</Link>
                <Link to="/illustration">插畫繪製</Link>
                <Link to="/wedding-website">婚禮網站</Link>
              </>
            )}
          </div>

          <div className="footerCol">
            <h4>Studio</h4>
            <Link to="/about">關於我們</Link>
            <Link to="/contact">聯絡我們</Link>
          </div>

          <div className="footerCol">
            <h4>Support</h4>
            <Link to="/process">喜帖訂製流程</Link>
            <Link to="/notice">訂購注意事項</Link>
            <Link to="/journal">婚禮文章分享</Link>
          </div>
        </div>

        <div className="footerBottom">
          <span>© 2026 MINIStyleCards All rights reserved.</span>
          <div className="footerLinks">
            <Link to="/privacy">隱私政策</Link>
            <Link to="/terms">服務條款</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
