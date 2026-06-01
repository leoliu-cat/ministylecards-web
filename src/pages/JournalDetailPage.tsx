import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { ArrowLeft, Calendar } from 'lucide-react';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

export function JournalDetailPage() {
  const { journalId } = useParams();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch article by slug or ID
    fetch(`/api/posts/${journalId}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setArticle(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching article:', err);
        setLoading(false);
      });
  }, [journalId]);

  if (loading) {
    return (
      <div className="pt-32 pb-20 text-center text-gray-500">
        載入中...
      </div>
    );
  }

  if (!article) {
    return (
      <div className="pt-32 pb-20 text-center">
        <h1 className="text-2xl font-medium mb-4">文章不存在</h1>
        <p className="text-gray-500 mb-8">您尋找的文章可能已經被移除。</p>
        <Link to="/journal" className="inline-flex items-center text-[#c98f6a] hover:underline">
          <ArrowLeft size={16} className="mr-2" /> 返回文章列表
        </Link>
      </div>
    );
  }

  const date = article.published_at 
    ? new Date(article.published_at).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  return (
    <>
      <SEO 
        title={`${article.title} - MINI Style Cards`}
        description={article.excerpt || `${article.title} 的文章內容`}
        image={article.feature_image ? `https://admin.ministylecards.com${article.feature_image}` : undefined}
      />
      
      <main className="pt-32 pb-24 bg-[#FAF9F8] min-h-screen">
        <article className="max-w-3xl mx-auto px-6">
          <Link to="/journal" className="inline-flex items-center text-sm text-gray-500 hover:text-[#c98f6a] transition-colors mb-8">
            <ArrowLeft size={14} className="mr-2" /> 返回文章列表
          </Link>
          
          <header className="mb-12 text-center">
            {article.category && (
              <p className="text-sm font-medium text-[#c98f6a] tracking-wider mb-4">
                {article.category}
              </p>
            )}
            <h1 className="text-3xl md:text-4xl font-medium text-gray-900 leading-snug mb-6">
              {article.title}
            </h1>
            {date && (
              <div className="flex items-center justify-center text-gray-500 text-sm">
                <Calendar size={14} className="mr-2" />
                <time>{date}</time>
              </div>
            )}
          </header>

          {article.feature_image && (
            <div className="mb-12 aspect-[16/9] w-full rounded-lg overflow-hidden bg-gray-100">
              <img 
                src={`https://admin.ministylecards.com${article.feature_image}`} 
                alt={article.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="prose prose-stone prose-lg max-w-none text-gray-700 leading-relaxed font-serif prose-headings:font-sans prose-img:rounded-md markdown-body prose-a:text-[#c98f6a]">
            {/* Some APIs use 'content' for the rich text details */}
            {article.content ? (
              <Markdown rehypePlugins={[rehypeRaw]}>{article.content}</Markdown>
            ) : (
              <p>{article.excerpt || '這篇文章目前沒有內容。'}</p>
            )}
          </div>
        </article>
      </main>
    </>
  );
}
