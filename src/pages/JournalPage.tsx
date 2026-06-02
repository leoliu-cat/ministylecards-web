import { API_BASE_URL } from '../config';
import React, { useState } from 'react';
import { Search, Instagram, Facebook, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

export function JournalPage() {
  const [activeCategory, setActiveCategory] = useState('全部文章');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('最新發布');
  const [apiArticles, setApiArticles] = useState<any[]>([]);

  React.useEffect(() => {
    fetch(`${API_BASE_URL}/api/posts`)
      .then(res => res.json())
      .then(async data => {
        if (Array.isArray(data)) {
          // 為了拿到 tags，我們需要 fetch 每篇文章的 details
          const fullPosts = await Promise.all(
            data.map(async (post) => {
              try {
                const detailRes = await fetch(`${API_BASE_URL}/api/posts/${post.slug}`);
                if (detailRes.ok) {
                  return await detailRes.json();
                }
              } catch (e) {
                console.error("Error fetching detail for post:", post.slug);
              }
              return post; // fallback to basic info
            })
          );
          setApiArticles(fullPosts);
        }
      })
      .catch(err => console.warn('Could not fetch articles::', err.message || err));
  }, []);

  const displayArticles = apiArticles.map(a => {
    let category = '未分類';
    if (a.tags) {
      try {
        const parsedTags = JSON.parse(a.tags);
        if (Array.isArray(parsedTags) && parsedTags.length > 0) {
          category = parsedTags[0];
        }
      } catch (e) {
        if (typeof a.tags === 'string') {
          // just in case it's comma separated
          category = a.tags.split(',')[0];
        } else if (Array.isArray(a.tags) && a.tags.length > 0) {
          category = a.tags[0];
        }
      }
    } else if (a.category) {
      category = a.category;
    }

    return {
      id: a.id,
      slug: a.slug,
      title: a.title,
      category,
      date: a.published_at ? new Date(a.published_at).toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.') : '2025.05.10',
      summary: a.excerpt || '',
      image: a.feature_image ? `https://admin.ministylecards.com${a.feature_image}` : 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
    };
  });

  const dynamicCategories = ['全部文章', ...new Set(displayArticles.map(a => a.category).filter(Boolean))];

  const filteredArticles = displayArticles.filter(article => {
    const matchesCategory = activeCategory === '全部文章' || article.category === activeCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedArticles = [...filteredArticles].sort((a, b) => {
    if (sortOption === '最新發布') {
      return new Date(b.date.replace(/\./g, '/')).getTime() - new Date(a.date.replace(/\./g, '/')).getTime();
    } else if (sortOption === '熱門文章') {
      // 假設簡單模擬熱門文章排序，可以根據 ID 倒序或其他條件
      // 若有真實 view count，可換成 view count
      return a.id - b.id;
    }
    return 0;
  });

  const popularArticlesList = displayArticles.slice(0, 5);

  return (
    <>
      <SEO 
        title="婚禮日誌 Journal | Mini Style Cards"
        description="Mini Style Cards 婚禮日誌分享最新的喜帖設計、婚禮趨勢與實用的籌備建議，陪伴你打造專屬的美好日子。"
        url="https://ministylecards.com/journal"
        canonicalUrl="https://ministylecards.com/journal"
      />
      <div className="pt-24 pb-24 px-4 md:px-12 max-w-[1400px] mx-auto">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

        
        {/* Main Content */}
        <div className="w-full lg:w-3/4">
          
          {/* Hero Section */}
          <div className="flex flex-col md:flex-row bg-[#faf8f5] rounded-xl overflow-hidden mb-12">
            <div className="w-full md:w-5/12 p-8 md:p-12 flex flex-col justify-center">
              <h1 className="text-4xl md:text-5xl font-serif mb-4 text-gray-900">Journal</h1>
              <h2 className="text-xl font-medium tracking-wide mb-6">婚禮靈感・設計日誌</h2>
              <p className="text-[15px] text-gray-600 leading-relaxed max-w-[280px]">
                分享最新的喜帖設計、婚禮趨勢與實用建議，陪伴每一對新人打造專屬於自己的美好日子。
              </p>
            </div>
            <div className="w-full md:w-7/12 aspect-[4/3] md:aspect-auto">
              <img 
                src="https://cdn.ministylecards.com/hero/wedding-invitation-design-journal-ministylecards.jpg" 
                alt="婚禮戒指與喜帖設計靈感情境照｜MINIStyleCards Journal" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-3 mb-8">
            {dynamicCategories.map((category) => (
              <button
                key={category as string}
                onClick={() => setActiveCategory(category as string)}
                className={`px-5 py-2 rounded-full text-[13px] tracking-wide transition-colors ${
                  activeCategory === category 
                    ? 'bg-[#4a423e] text-white' 
                    : 'bg-[#faf8f5] text-gray-600 hover:bg-gray-100'
                }`}
              >
                {category as string}
              </button>
            ))}
          </div>

          {/* Sort Info */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
            <p className="text-sm text-gray-500">
              全部文章，共 {filteredArticles.length} 篇
            </p>
            <select 
              className="bg-transparent border border-gray-200 text-sm text-gray-600 py-1.5 px-3 rounded focus:outline-none focus:border-gray-400"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="最新發布">最新發布</option>
              <option value="熱門文章">熱門文章</option>
            </select>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 gap-y-12">
            {sortedArticles.map((article: any) => (
              <Link to={`/journal/${article.slug || article.id}`} key={article.id} className="group block">
                <div className="aspect-[4/3] overflow-hidden rounded mb-4">
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
                <p className="text-xs text-[#c98f6a] font-medium tracking-wider mb-2">{article.category}</p>
                <h3 className="text-[17px] font-medium leading-snug mb-3 group-hover:text-[#c98f6a] transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-[13.5px] text-gray-500 leading-relaxed mb-4 line-clamp-2">
                  {article.summary}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <p className="text-xs text-gray-400 font-sans tracking-wider">{article.date}</p>
                  <span className="text-[13px] text-gray-900 flex items-center gap-1 group-hover:text-[#c98f6a] transition-colors">
                    閱讀更多 <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
          
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-1/4 flex flex-col gap-12">
          
          {/* Search */}
          <div className="relative">
            <input 
              type="text" 
              placeholder="搜尋文章..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-200 rounded px-4 py-3 pl-10 text-sm focus:outline-none focus:border-gray-400"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          </div>

          {/* Popular Articles */}
          <div>
            <h3 className="text-lg font-medium tracking-wide mb-6">熱門文章</h3>
            <div className="flex flex-col gap-5">
              {popularArticlesList.map((article: any, idx: number) => (
                <Link to={`/journal/${article.slug || article.id}`} key={idx} className="flex gap-4 group">
                  <div className="w-20 h-20 shrink-0 overflow-hidden rounded">
                    <img 
                      src={article.image} 
                      alt={article.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h4 className="text-[13.5px] font-medium leading-snug mb-1.5 group-hover:text-[#c98f6a] transition-colors line-clamp-2">
                      {article.title}
                    </h4>
                    <p className="text-[11px] text-gray-400 font-sans tracking-wide">{article.date}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-medium tracking-wide mb-4">追蹤我們</h3>
            <div className="flex gap-3">
              <a href="https://www.instagram.com/ministylecards/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#faf8f5] flex items-center justify-center hover:bg-[#f0ece5] transition-colors">
                <Instagram size={18} className="text-gray-700" />
              </a>
              <a href="https://www.facebook.com/ministylecards/?locale=zh_TW" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#faf8f5] flex items-center justify-center hover:bg-[#f0ece5] transition-colors">
                <Facebook size={18} className="text-gray-700" />
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
    </>
  );
}
