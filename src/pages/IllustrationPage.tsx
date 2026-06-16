import { API_BASE_URL } from "../config";
import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { SEO } from "../components/SEO";

export function IllustrationPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products?limit=1000`)
      .then((r) => r.json())
      .then((productsResponse) => {
        const productsData = Array.isArray(productsResponse)
          ? productsResponse
          : productsResponse?.docs || [];

        // Find illustrator products (category_id 5)
        const illustrationProducts = productsData.filter(
          (p: any) => p.category_id === 5,
        );

        const illustratorMap = new Map();

        illustrationProducts.forEach((p: any) => {
          let authorName = p.title;

          // Extract the part containing "老師" if available, else first part
          if (p.title && p.title.includes("｜")) {
            const parts = p.title.split("｜");
            const teacherPart = parts.find((part: string) =>
              part.includes("老師"),
            );
            if (teacherPart) {
              authorName = teacherPart.trim();
            } else {
              authorName = parts[0].trim();
            }
          }

          let productWorks = p.images ? p.images.length : 0;
          const loopLenStr =
            p.image_loop_count || p.markdown_loop_length || p.loop_length;
          const loopLen = parseInt(loopLenStr || "0", 10);
          if (loopLen > 0) productWorks += loopLen;
          if (productWorks === 0) productWorks = 1;

          if (!illustratorMap.has(authorName)) {
            illustratorMap.set(authorName, {
              id: p.id,
              name: authorName,
              slug: p.slug,
              works: productWorks,
              firstProductId: p.slug || p.id,
              image:
                p.images && p.images.length > 0
                  ? `https://admin.ministylecards.com${p.images[0]}`
                  : "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=300&q=80",
            });
          } else {
            illustratorMap.get(authorName).works += productWorks;
          }
        });

        const formatted = Array.from(illustratorMap.values());

        setProducts(formatted);
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Could not fetch illustrators:", err.message || err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <SEO
        title="插畫繪製 | Mini Style Cards"
        description="Mini Style Cards 合作多位風格獨特的人氣插畫師，為您的喜帖及婚禮周邊打造專屬的似顏繪與插畫作品。"
        url="https://ministylecards.com/illustration"
      />
      <div className="pt-28 pb-20 px-4 md:px-12 max-w-7xl mx-auto">
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-normal tracking-tight mb-3 flex flex-col md:flex-row items-center md:items-baseline gap-3">
            插畫繪製{" "}
            <span className="text-sm md:text-base text-gray-400 font-serif italic">
              Illustration
            </span>
          </h1>
          <div className="text-xs text-gray-500 flex justify-center md:justify-start items-center gap-2">
            <Link to="/" className="hover:text-gray-800">
              首頁
            </Link>
            <span>/</span>
            <span className="text-gray-800">插畫繪製</span>
          </div>
        </div>

        {/* Grid of Illustrators */}
        {loading ? (
          <div className="py-20 text-center text-gray-500">載入中...</div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 md:gap-8">
            {products.map((artist) => (
              <Link
                to={
                  artist.firstProductId
                    ? `/product/${artist.firstProductId}`
                    : `/collections/${artist.slug || artist.id}`
                }
                key={artist.id}
                className="group flex flex-col items-center hover:-translate-y-1 transition-all block"
              >
                <div className="w-32 h-32 md:w-40 md:h-40 xl:w-48 xl:h-48 mb-4 md:mb-5 lg:mb-6 rounded-full overflow-hidden bg-gray-50 flex-shrink-0 border-2 border-transparent group-hover:border-[#EAD9CA] transition-colors shadow-sm">
                  <img
                    loading="lazy"
                    src={artist.image}
                    alt={artist.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-[17px] font-serif mb-2 text-center text-gray-800">
                  {artist.name}
                </h3>
                <p className="text-[14px] text-gray-400 tracking-wider">
                  作品數 {artist.works}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-gray-500">
            目前還沒有插畫商品。
          </div>
        )}
      </div>
    </>
  );
}
