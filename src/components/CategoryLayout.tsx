import { API_BASE_URL } from '../config';
import React from 'react';
import { Heart, ChevronRight, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFavorites } from './FavoritesContext';

export interface Product {
  id: number;
  title: string;
  price: string | number;
  image: string;
}

interface CategoryLayoutProps {
  title: string;
  subtitle: string;
  breadcrumbs: { label: string; to?: string }[];
  products: Product[];
  hideCollections?: boolean;
}

export function CategoryLayout({ title, subtitle, breadcrumbs, products, hideCollections = true }: CategoryLayoutProps) {
  const [collections, setCollections] = React.useState<any[]>([]);
  const [selectedCollection, setSelectedCollection] = React.useState<number | null>(null);
  const [sortMethod, setSortMethod] = React.useState<string>('熱門商品');
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 12;

  const { toggleFavorite, isFavorited } = useFavorites();

  React.useEffect(() => {
    fetch(`${API_BASE_URL}/api/collections`)
      .then(res => res.json())
      .then(data => {
        setCollections(Array.isArray(data) ? data.slice(0, 5) : data);
      })
      .catch(err => console.warn('Could not fetch collections (possibly dev server restart):', err.message));
  }, []);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [products, selectedCollection, sortMethod]);

  const filteredProducts = React.useMemo(() => {
    let result = products;
    if (selectedCollection) {
      result = result.filter((p: any) => p.collection_id === selectedCollection);
    }
    return [...result].sort((a: any, b: any) => {
      const priceA = typeof a.price === 'number' ? a.price : parseInt(String(a.price).replace(/[^0-9]/g, ''), 10) || 0;
      const priceB = typeof b.price === 'number' ? b.price : parseInt(String(b.price).replace(/[^0-9]/g, ''), 10) || 0;
      
      switch (sortMethod) {
        case '價格由低到高':
          return priceA - priceB;
        case '價格由高到低':
          return priceB - priceA;
        case '最新商品':
          return b.id - a.id;
        case '熱門商品':
        default:
          return 0;
      }
    });
  }, [products, selectedCollection, sortMethod]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="pt-28 pb-20 px-4 md:px-12 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-normal tracking-tight mb-3 flex items-baseline gap-3">
          {title} <span className="text-sm md:text-base text-gray-400 font-serif italic">{subtitle}</span>
        </h1>
        <div className="text-xs text-gray-500 flex items-center gap-2">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span>/</span>}
              {crumb.to ? (
                <Link to={crumb.to} className="hover:text-gray-800">{crumb.label}</Link>
              ) : (
                <span className="text-gray-800">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-gray-200 pb-4">
        <div className="text-sm text-gray-600">全部商品 | <span className="font-medium text-gray-900">{filteredProducts.length} 款商品</span></div>
        
        {/* Mobile & Desktop Sort */}
        <div className="flex w-full md:w-auto items-center gap-2 text-sm justify-between md:justify-end">
          <span className="text-gray-500 hidden md:inline">排序方式：</span>
          <div className="relative w-full md:w-auto">
            <select 
              value={sortMethod}
              onChange={(e) => setSortMethod(e.target.value)}
              className="appearance-none border border-gray-200 md:border-none md:bg-transparent rounded bg-white py-2 pl-4 pr-10 w-full md:w-auto font-medium focus:ring-0 focus:outline-none cursor-pointer"
            >
              <option>熱門商品</option>
              <option>價格由低到高</option>
              <option>價格由高到低</option>
              <option>最新商品</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronDown size={14} className="text-gray-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Series Categories (Horizontal) */}
      {!hideCollections && (
        <div className="flex flex-wrap gap-2 md:gap-4 mb-8">
          <button 
            onClick={() => setSelectedCollection(null)}
            className={`px-4 py-1.5 text-sm rounded-full font-medium transition-colors ${
              selectedCollection === null 
                ? 'bg-[#f4ede6] text-[#8b4e36]' 
                : 'border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            全部
          </button>
          {collections.map(collection => (
            <button 
              key={collection.id}
              onClick={() => setSelectedCollection(collection.id)}
              className={`px-4 py-1.5 text-sm rounded-full transition-colors ${
                selectedCollection === collection.id
                  ? 'bg-[#f4ede6] text-[#8b4e36] font-medium'
                  : 'border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {collection.title}
            </button>
          ))}
        </div>
      )}

      <div className="w-full">
        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
          {paginatedProducts.map((product) => {
            const rawSlug = (product as any).slug || product.id;
            const cleanSlug = rawSlug.toString().replace(/^\/products?\//, '');
            const favId = product.id;
            const isFav = isFavorited(favId);
            return (
            <Link to={`/product/${cleanSlug}`} state={{ category: title, product }} key={product.id} className="group cursor-pointer block">
              <div className="relative overflow-hidden mb-4 rounded-md aspect-[500/647] bg-gray-100">
                <img 
                  src={product.image} 
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <button className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur text-gray-500 hover:text-[#a43725] hover:bg-white transition-colors" onClick={(e) => { 
                  e.preventDefault(); 
                  toggleFavorite({ id: favId, slug: cleanSlug, name: product.title, price: product.price, image: product.image });
                }}>
                  <Heart size={16} fill={isFav ? "#a43725" : "none"} className={isFav ? "text-[#a43725]" : ""} />
                </button>
              </div>
              <h3 className="text-sm font-medium mb-1 line-clamp-1">{product.title}</h3>
              <p className="text-sm text-gray-600">NT$ {product.price}</p>
            </Link>
          )})}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-16 flex justify-center items-center gap-2 font-serif text-sm">
            <button 
              className={`w-8 h-8 flex items-center justify-center rounded ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-gray-900'}`}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronRight size={16} className="rotate-180" />
            </button>
            {getPageNumbers().map((page, idx) => (
              page === '...' ? (
                <span key={`ellipsis-${idx}`} className="w-8 h-8 flex items-center justify-center text-gray-400">...</span>
              ) : (
                <button 
                  key={page}
                  className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
                    currentPage === page 
                      ? 'border border-[#d5a587] text-[#8b4e36]' 
                      : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setCurrentPage(page as number)}
                >
                  {page}
                </button>
              )
            ))}
            <button 
              className={`w-8 h-8 flex items-center justify-center rounded ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-gray-900'}`}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
