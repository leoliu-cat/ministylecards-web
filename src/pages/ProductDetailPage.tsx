import { API_BASE_URL } from '../config';
import React, { useState } from 'react';
import { 
  Heart, ChevronRight, Check, Package, Clock, MapPin, 
  ShieldCheck, HeartHandshake, X, Minus, Plus, 
  LayoutTemplate, Mail, Sparkles, Stamp, ShoppingCart, ChevronDown, Phone, Calendar
} from 'lucide-react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../components/CartContext';
import { useFavorites } from '../components/FavoritesContext';
import { SEO } from '../components/SEO';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

export function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart, cartItems, removeItem } = useCart();
  const { toggleFavorite, isFavorited } = useFavorites();
  const getCategoryName = (categoryId: number) => {
    switch(categoryId) {
      case 1: return '喜帖';
      case 2: return '結婚書約';
      case 3: return '婚禮小物';
      case 4: return '必備設計';
      case 5: return '插畫繪製';
      case 6: return '婚禮網站';
      default: return '商品';
    }
  };

  const queryParams = new URLSearchParams(location.search);
  const editItemId = queryParams.get('edit');
  const editItem = editItemId ? cartItems.find(item => item.id === editItemId) : null;
  
  const initialProductData = location.state?.product || {
    id: productId || 1,
    title: '載入中...',
    price: 0,
    image: '',
    images: [] as string[],
    description: '',
    category_id: 1, // default loosely, will be replaced
    inclusions: '[]',
    variants: { items: [], addon_group_ids: [] }
  };

  const [productData, setProductData] = useState<any>(initialProductData);
  
  const getCategoryLink = (categoryId: number) => {
    switch(categoryId) {
      case 1: return '/wedding-invitations';
      case 2: return '/marriage-certificate';
      case 3: return '/wedding-favors';
      case 4: return '/essential-design';
      case 5: return '/illustration';
      case 6: return '/wedding-website';
      default: return '/collections';
    }
  };
  const categoryLink = productData.category_id ? getCategoryLink(productData.category_id) : '/collections';

  const category = getCategoryName(productData.category_id);
  const isWeddingInvitation = category.includes('喜帖');
  const isMarriageCertificate = category.includes('書約');
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [addonGroups, setAddonGroups] = useState<any[]>([]);
  const [pricingRules, setPricingRules] = useState<any[]>([]);
  const [collection, setCollection] = useState<any>(null);

  // State to hold selected addons: group_id -> chosen option name (for select) or boolean (for checkbox)
  const [selectedAddons, setSelectedAddons] = useState<Record<number, any>>({});
  const [selectedFormatName, setSelectedFormatName] = useState<string | null>(null);
  const [waxSealColor, setWaxSealColor] = useState<string>('霧金');

  React.useEffect(() => {
    setLoading(true);
    
    Promise.all([
      fetch(`${API_BASE_URL}/api/products?limit=1000`).then(r => r.json()),
      fetch(`${API_BASE_URL}/api/collections?limit=1000`).then(r => r.json())
    ])
      .then(([productsData, collectionsData]) => {
        const foundParam = productsData.find((p: any) => {
          const s1 = p.slug ? p.slug.toString().split('/').pop() : '';
          const s2 = productId ? productId.split('/').pop() : '';
          if (s1 && s2 && s1 === s2) return true;
          return p.id == productId;
        });
        const found = foundParam || (initialProductData.id && initialProductData.id !== productId ? productsData.find((p: any) => p.id == initialProductData.id) : productsData[0]) || productsData[0];
        if (found) {
            setProductData({
                ...found,
                id: found.id,
                title: found.title,
                price: found.base_price,
                image: found.images && found.images.length > 0 ? `https://admin.ministylecards.com${found.images[0]}` : initialProductData.image,
                images: found.images ? found.images.map((img: string) => `https://admin.ministylecards.com${img}`) : [],
                description: found.description || initialProductData.description,
                inclusions: found.inclusions || '[]',
                variants: found.variants || { items: [] }
            });
            if (found.collection_id) {
                const colData = Array.isArray(collectionsData) ? collectionsData : collectionsData?.docs || [];
                const foundCol = colData.find((c: any) => c.id === found.collection_id);
                if (foundCol) {
                    setCollection(foundCol);
                }
            }
            if (found.images && found.images.length > 0) {
              setSelectedImage(`https://admin.ministylecards.com${found.images[0]}`);
            }
            if (found.variants && found.variants.items && found.variants.items.length > 0) {
                const defaultVariant = found.variants.items.find((v: any) => v.is_default) || found.variants.items[0];
                setSelectedFormatName(defaultVariant.name);
            }
            if (!editItem) {
               setQuantity(found.category_id === 1 ? 100 : 1);
            }
            setEventDate('');
        }
        setLoading(false);
      })
      .catch(error => {
        console.warn('Could not fetch product data:', error.message);
        setLoading(false);
      });

    // Fetch add-ons
    fetch(`${API_BASE_URL}/api/addon_groups`).then(res => res.json())
      .then(data => {
         setAddonGroups(data);
/* defaults moved */
      })
      .catch(e => console.warn('Fetch error:', e.message));

    // Fetch pricing rules
    // Mock instead of fetch admin API to prevent 401 error
         setPricingRules([
           {
             "id": 1,
             "name": "杯墊階梯報價",
             "rule_type": "volume",
             "notes": "1. 一箱運費120(100pcs)\n2. 300pcs 以上贈送雙人插畫\n（豆豆風/蠟筆風/水彩風三選一）\n3. 客製內容設計費用1000",
             "tiers": [
               { "min_qty": 1, "max_qty": 9, "unit_price": 90 },
               { "min_qty": 10, "max_qty": 49, "unit_price": 70 },
               { "min_qty": 50, "max_qty": 299, "unit_price": 60 },
               { "min_qty": 300, "max_qty": 499, "unit_price": 55 },
               { "min_qty": 500, "max_qty": null, "unit_price": 53 }
             ]
           },
           {
             "id": 2,
             "name": "禮金簿組合報價",
             "rule_type": "bundle",
             "notes": "",
             "tiers": [
               { "qty": 1, "total_price": 980 },
               { "qty": 2, "total_price": 1680 }
             ]
           },
           {
             "id": 3,
             "name": "咖啡包階梯報價",
             "rule_type": "volume",
             "notes": "200包起訂, 滿300包贈送雙人插畫",
             "tiers": [
               { "min_qty": 200, "max_qty": null, "unit_price": 40 }
             ]
           }
         ]);

  }, [productId]);


  const hasInitializedDefaults = React.useRef(false);
  React.useEffect(() => {
    hasInitializedDefaults.current = false;
  }, [productId]);

  React.useEffect(() => {
    if (loading || editItem || hasInitializedDefaults.current || addonGroups.length === 0 || !productData) return;
    const isIdMatch = productData.id && productData.id.toString() === productId;
    const s1 = productData.slug ? productData.slug.toString().split('/').pop() : '';
    const s2 = productId ? productId.split('/').pop() : '';
    const isSlugMatch = s1 && s2 && s1 === s2;
    if (productId && !isIdMatch && !isSlugMatch) return;
    hasInitializedDefaults.current = true;

    const defaults: Record<number, any> = {};
    
    const productDefaults = productData.variants?.addon_group_defaults || {};

    addonGroups.forEach((group: any) => {
       if (Object.prototype.hasOwnProperty.call(productDefaults, group.id.toString())) {
           const pDefault = productDefaults[group.id.toString()];
           if (group.input_type === 'checkbox') {
               defaults[group.id] = pDefault === true || pDefault === 'true' || (Array.isArray(pDefault) && pDefault.length > 0);
           } else if (group.title !== "信封選擇") {
               if (Array.isArray(pDefault) && pDefault.length > 0) {
                   defaults[group.id] = pDefault[0];
               } else if (typeof pDefault === 'string' && pDefault) {
                   defaults[group.id] = pDefault;
               } else if (group.options && group.options.length > 0) {
                   const globalDefault = group.options.find((o: any) => o.is_default);
                   defaults[group.id] = globalDefault ? globalDefault.name : group.options[0].name;
               }
           }
       } else {
           if (group.input_type === 'select' && group.options && group.options.length > 0) {
              const globalDefault = group.options.find((o: any) => o.is_default);
              defaults[group.id] = globalDefault ? globalDefault.name : group.options[0].name;
           } else if (group.input_type === 'checkbox') {
              defaults[group.id] = false;
           }
       }
    });
    setSelectedAddons(defaults);

    const envGroup = addonGroups.find((g: any) => g.display_group === '喜帖-信封區' || g.title === '信封選擇');
    if (envGroup) {
        let finalEnvelopes = [];
        if (Object.prototype.hasOwnProperty.call(productDefaults, envGroup.id.toString())) {
             const pEnvDefaults = productDefaults[envGroup.id.toString()];
             if (Array.isArray(pEnvDefaults) && pEnvDefaults.length > 0) {
                 finalEnvelopes = pEnvDefaults;
             } else if (typeof pEnvDefaults === 'string' && pEnvDefaults) {
                 finalEnvelopes = [pEnvDefaults];
             }
        }
        
        if (finalEnvelopes.length === 0 && envGroup.options) {
             const defaultEnvelopes = envGroup.options.filter((o: any) => o.is_default).map((o: any) => o.name);
             if (defaultEnvelopes.length > 0) {
                 finalEnvelopes = defaultEnvelopes;
             } else if (envGroup.options.length > 0) {
                 finalEnvelopes = [envGroup.options[0].name];
             }
        }
        
        setSelectedEnvelopes(finalEnvelopes);
    }
  }, [productData, addonGroups, editItem, productId, loading]);

  const [quantity, setQuantity] = useState(isWeddingInvitation ? 100 : 1);
  const [eventDate, setEventDate] = useState('');
  const [selectedEnvelopes, setSelectedEnvelopes] = useState<string[]>([]);
  
  React.useEffect(() => {
    if (editItem && addonGroups.length > 0) {
      setQuantity(editItem.quantity);
      if (editItem.eventDate) setEventDate(editItem.eventDate);
      
      const newSelectedAddons: Record<number, any> = {};
      let envelopes: string[] = [];
      let formatName = editItem.paper;
      
      editItem.customizations.forEach(custom => {
          if (custom.name === '信封選擇') {
              envelopes = custom.desc.split('、');
          } else {
             // Find matching group
             const groupMatch = addonGroups.find(g => custom.name.startsWith(g.title));
             if (groupMatch) {
               if (groupMatch.input_type === 'checkbox') {
                 newSelectedAddons[groupMatch.id] = true;
               } else {
                  // For selects we check desc, but it might have price appended or wax color
                  const optionMatch = groupMatch.options.find((opt: any) => custom.desc.includes(opt.name));
                  if (optionMatch) {
                     newSelectedAddons[groupMatch.id] = optionMatch.name;
                     if (groupMatch.title === '封蠟章貼紙') {
                        const waxMatch = custom.desc.match(/\((.*?)\)/);
                        if (waxMatch) setWaxSealColor(waxMatch[1]);
                     }
                  }
               }
             }
          }
      });
      setSelectedEnvelopes(envelopes);
      if (Object.keys(newSelectedAddons).length > 0) {
         setSelectedAddons(prev => ({ ...prev, ...newSelectedAddons }));
      }
      if (formatName) setSelectedFormatName(formatName);
    }
  }, [editItem, addonGroups]);
  
  const handleQuantityChange = (newQty: number, incrementAmount?: number) => {
    let targetQty = newQty;
    if (incrementAmount && !isWeddingInvitation) {
       targetQty = quantity + incrementAmount; // step by 1 instead of 10 for products
    }
    const minQty = isWeddingInvitation ? 30 : 1;
    const qty = Math.max(minQty, targetQty);
    setQuantity(qty);
  };

  const handleEnvelopeToggle = (color: string) => {
    if (selectedEnvelopes.includes(color)) {
      setSelectedEnvelopes(selectedEnvelopes.filter(c => c !== color));
    } else {
      if (selectedEnvelopes.length < 2) {
        setSelectedEnvelopes([...selectedEnvelopes, color]);
      } else {
        setSelectedEnvelopes([selectedEnvelopes[0], color]);
      }
    }
  };

  const handleAddonChange = (groupId: number, value: any) => {
     setSelectedAddons(prev => ({
        ...prev,
        [groupId]: value
     }));
  };

  let parsedInclusions: string[] = [];
  try {
     parsedInclusions = typeof productData.inclusions === 'string' ? JSON.parse(productData.inclusions) : (productData.inclusions || []);
  } catch(e) {}

  const variants = productData.variants?.items || [];
  const selectedVariant = variants.find((v: any) => v.name === selectedFormatName) || variants[0];
  
  const envelopeGroup = isWeddingInvitation ? addonGroups.find(g => g.display_group === '喜帖-信封區' || g.title === '信封選擇') : null;
  let allowedDisplayGroups: string[] = [];
  if (isWeddingInvitation || productData.category_id === 1) {
    allowedDisplayGroups = ['喜帖-加購區'];
  } else if (productData.category_id === 2) {
    allowedDisplayGroups = ['結婚書約-加購區'];
  } else if (productData.category_id === 3) {
    allowedDisplayGroups = ['婚禮小物-加購區'];
  } else if (productData.category_id === 4) {
    allowedDisplayGroups = ['必備設計-加購區'];
  } else if (productData.category_id === 5) {
    allowedDisplayGroups = ['插畫繪製-加購區'];
  } else if (productData.category_id === 6) {
    allowedDisplayGroups = ['婚禮網站-加購區'];
  }
  
  const enabledGroupIds = productData.variants?.addon_group_ids || [];
  const productDefaultsForFilter = productData.variants?.addon_group_defaults || {};

  const addOnDisplayGroups = addonGroups.filter(g => {
    // 1. Check if it fits the display_group for the category
    if (!allowedDisplayGroups.includes(g.display_group) || g.display_group === '喜帖-信封區' || g.title === '信封選擇') {
        return false;
    }
    // 2. Check if explicitly enabled in Payload CMS for this product
    if (enabledGroupIds.length > 0 && !enabledGroupIds.includes(g.id)) {
        return false;
    }
    return true;
  });

  let addonTotal = 0;
  
  const chargeQty = Math.max(100, quantity); // 燙金都是未滿100份按100份計算
  
  addOnDisplayGroups.forEach(group => {
     const selection = selectedAddons[group.id];
     if (group.input_type === 'checkbox' && selection) {
         const option = group.options[0];
         if (option) {
             if (option.price_type === 'min_100_per_item' || option.name.includes('未滿100份')) {
                 addonTotal += option.price * chargeQty;
             } else if (option.price_type === 'per_item') {
                 addonTotal += option.price * quantity;
             } else if (option.price_type === 'flat') {
                 addonTotal += option.price;
             } else { // fallback
                 addonTotal += option.price * quantity;
             }
         }
     } else if (group.input_type === 'select' && selection) {
         const option = group.options.find((o: any) => o.name === selection);
         if (option && option.price > 0) {
             if (option.price_type === 'min_100_per_item' || option.name.includes('未滿100份') || group.title.includes('燙金')) { // Simple rule matching from old code
                 addonTotal += option.price * chargeQty;
             } else if (option.price_type === 'per_item') {
                 addonTotal += option.price * quantity;
             } else if (option.price_type === 'flat') {
                 addonTotal += option.price;
             } else { // fallback
                 addonTotal += option.price * quantity;
             }
         }
     }
  });

  let setupFee = 0;
  let setupFeeThreshold = 100;
  let invitationDiscountRate = 1;
  let baseUnitPrice = (isWeddingInvitation || isMarriageCertificate) && selectedVariant ? selectedVariant.price : Number(productData.price);
  let formatTotal = baseUnitPrice * quantity;
  
  // Find applied pricing rule
  let appliedRule: any = null;
  if (productData.pricing_rule_id) {
     appliedRule = pricingRules.find(r => r.id === productData.pricing_rule_id);
     if (appliedRule) {
        if (appliedRule.rule_type === 'volume') {
           const tier = appliedRule.tiers.find((t: any) => 
              quantity >= t.min_qty && (t.max_qty === null || quantity <= t.max_qty)
           );
           if (tier) {
              baseUnitPrice = tier.unit_price;
              formatTotal = baseUnitPrice * quantity;
           }
        } else if (appliedRule.rule_type === 'bundle') {
           // For bundle, find the exact matching qty or max qty that applies
           let tier = appliedRule.tiers.find((t: any) => t.qty === quantity);
           if (!tier) {
              // Default to the largest applicable tier or just the max available tier
              const validTiers = appliedRule.tiers.filter((t: any) => t.qty && t.qty <= quantity).sort((a: any, b: any) => b.qty - a.qty);
              tier = validTiers.length > 0 ? validTiers[0] : appliedRule.tiers[0];
           }
           if (tier && tier.total_price !== undefined) {
              formatTotal = tier.total_price;
              baseUnitPrice = formatTotal / quantity;
           }
        }
     }
  }

  if (isWeddingInvitation) {
      const isAcrylic = selectedVariant && selectedVariant.name.includes('壓克力');
      
      if (isAcrylic) {
          setupFeeThreshold = 50;
          if (quantity < 50) setupFee = 2000;
          else setupFee = 0;
      } else {
          setupFeeThreshold = 100;
          if (quantity >= 30 && quantity <= 50) setupFee = 2000;
          else if (quantity >= 51 && quantity <= 79) setupFee = 1500;
          else if (quantity >= 80 && quantity <= 99) setupFee = 1000;
      }

      if (quantity >= 500) invitationDiscountRate = 0.7;
      else if (quantity >= 400) invitationDiscountRate = 0.8;
      else if (quantity >= 300) invitationDiscountRate = 0.85;
      else if (quantity >= 200) invitationDiscountRate = 0.9;
  }

  const discountAmount = formatTotal * (1 - invitationDiscountRate);
  const discountedFormatTotal = formatTotal - discountAmount;
  const grandTotal = discountedFormatTotal + addonTotal + setupFee;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('zh-TW').format(price);
  };

  const handleAddToCart = () => {
    const customizations = [];
    if (Object.keys(selectedAddons).length > 0) {
      Object.entries(selectedAddons).forEach(([groupId, value]) => {
         if (!value) return;
         const group = addOnDisplayGroups.find(g => g.id.toString() === groupId);
         if (!group) return;
         let addonName = '';
         let price = 0;
         
         if (group.input_type === 'checkbox' || group.display_group === '喜帖-信封區' || group.title === '信封選擇') {
             if (group.display_group === '喜帖-信封區' || group.title === '信封選擇') return; // Skip envelope from selectedAddons, handled separately
             const opt = group.options[0];
             if (!opt) return;
             addonName = opt.name;
             if (opt.price_type === 'min_100_per_item' || opt.name.includes('未滿100份')) {
                 price = opt.price * chargeQty;
             } else if (opt.price_type === 'flat') {
                 price = opt.price;
             } else {
                 price = opt.price * quantity;
             }
         } else {
             const opt = group.options.find((o: any) => o.name === value);
             if (!opt || opt.price === 0) return;
             addonName = opt.name;
             if (group.title === '封蠟章貼紙' && opt.price > 0) {
                addonName += ` (${waxSealColor})`;
             }
             if (opt.price_type === 'min_100_per_item' || opt.name.includes('未滿100份') || group.title.includes('燙金')) {
                 price = opt.price * chargeQty;
             } else if (opt.price_type === 'flat') {
                 price = opt.price;
             } else {
                 price = opt.price * quantity;
             }
         }
         
         if (price > 0 || addonName !== '') {
            customizations.push({
               id: Math.random().toString(36).substring(2, 9),
               name: group.title + (addonName && group.title !== addonName && !addonName.includes(group.title) ? ` - ${addonName}` : ''),
               desc: addonName,
               price
            });
         }
      });
    }

    if (isWeddingInvitation && selectedEnvelopes.length > 0) {
      customizations.push({
         id: Math.random().toString(36).substring(2, 9),
         name: '信封選擇',
         desc: selectedEnvelopes.join('、'),
         price: 0
      });
    }

    if (setupFee > 0) {
      customizations.push({
         id: Math.random().toString(36).substring(2, 9),
         name: '基本上機費',
         desc: `數量未滿 ${setupFeeThreshold} 份酌收基本上機費`,
         price: setupFee
      });
    }

    const cartItem = {
      productId: productData.id,
      name: `${category} | ${productData.title}`,
      baseQuantity: isWeddingInvitation ? `${quantity} 份` : (isMarriageCertificate ? `${quantity} 組` : `${quantity} 個`),
      eventDate,
      paper: selectedVariant ? selectedVariant.name : undefined,
      size: undefined,
      tags: [category],
      price: discountedFormatTotal / quantity, // Store single item base price conceptually (or total format price per qty) taking discount into account
      quantity: editItem ? editItem.quantity : quantity, // keep quantity the same if we're just editing customizations, but actually we let them edit quantity too.
      image: selectedImage || (productData.images && productData.images.length > 0 ? productData.images[0] : ''),
      customizations
    };

    if (editItemId) {
      removeItem(editItemId);
    }
    
    addToCart(cartItem);
    navigate('/cart');
  };

  const productJsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": productData.title,
    "image": productData.images || [productData.image],
    "description": productData.description || `${productData.title} 客製化設計`,
    "offers": {
      "@type": "Offer",
      "url": `https://ministylecards.com/product/${productData.id}`,
      "priceCurrency": "TWD",
      "price": baseUnitPrice,
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Mini Style Cards"
      }
    }
  };

  if (loading) {
    return (
      <div className="pt-32 pb-24 text-center min-h-screen bg-[#faf8f5]">
        <div className="text-gray-500">載入中...</div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={productData.seo_title || `${productData.title} | Mini Style Cards`}
        description={productData.seo_description || productData.description || `Mini Style Cards ${productData.title}，打造最完美的客製化婚禮設計。`}
        url={`https://ministylecards.com/product/${productData.id}`}
        image={productData.image}
        jsonLd={productJsonLd}
      />
      <div className="pt-24 pb-24 px-4 md:px-12 max-w-[1400px] mx-auto min-h-screen bg-[#faf8f5]">
      
      {/* Breadcrumbs */}
      <div className="text-[13px] text-gray-500 mb-8 flex flex-wrap items-center gap-2 tracking-wide font-medium">
        <Link to="/" className="hover:text-gray-900 transition-colors">首頁</Link>
        <ChevronRight size={14} className="text-gray-300" />
        <Link to={categoryLink} className="hover:text-gray-900 transition-colors">{category}</Link>
        <ChevronRight size={14} className="text-gray-300" />
        {collection && productData.category_id === 4 && (
          <>
            <Link to={`/collections/${collection.slug || collection.id}`} className="hover:text-gray-900 transition-colors">{collection.title}</Link>
            <ChevronRight size={14} className="text-gray-300" />
          </>
        )}
        <span className="text-gray-900 line-clamp-1">{productData.title}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 xl:gap-16 relative">
         
         {/* Main Content (Left) */}
         <div className="w-full lg:w-[65%] xl:w-[70%]">
            
            {/* Top Section: Images & Intro */}
            <div className="flex flex-col lg:flex-row gap-8 xl:gap-12 mb-16">
               {/* Gallery */}
               <div className="w-full lg:w-[60%] flex flex-col-reverse sm:flex-row gap-3 xl:gap-4">
                  <div className="flex sm:flex-col gap-2 sm:gap-3 shrink-0 overflow-x-auto sm:w-16 xl:w-20 pb-2 sm:pb-0 hide-scrollbar">
                     {productData.images && productData.images.length > 0 ? productData.images.map((img: string, idx: number) => (
                        <img loading="lazy" 
                           key={idx} 
                           src={img} 
                           onClick={() => setSelectedImage(img)}
                           className={`w-[60px] sm:w-full aspect-[500/647] object-cover rounded cursor-pointer transition-all border shrink-0 ${selectedImage === img ? 'border-[#c98f6a]' : 'border-transparent hover:border-gray-300 opacity-80 hover:opacity-100'}`} 
                           alt={`Thumbnail ${idx + 1}`}
                        />
                     )) : 
                        [1, 2, 3, 4].map(n => (
                            <img loading="lazy" 
                               key={n} 
                               src={productData.image} 
                               className={`w-[60px] sm:w-full aspect-[500/647] object-cover rounded cursor-pointer transition-all border shrink-0 ${n === 1 ? 'border-[#c98f6a]' : 'border-transparent hover:border-gray-300 opacity-80 hover:opacity-100'}`} 
                               alt="Thumbnail"
                            />
                         ))
                     }
                  </div>
                  <div className="flex-1">
                     <img loading="lazy" src={selectedImage || productData.image} className="w-full aspect-[500/647] object-cover rounded-lg shadow-sm" alt={productData.title} />
                  </div>
               </div>

               {/* Intro */}
               <div className="w-full lg:w-[40%] flex flex-col pt-2">
                  <div className="border border-[#c98f6a] text-[#c98f6a] text-[11px] px-3 py-1 rounded w-fit mb-4 font-medium tracking-widest">{category}</div>
                  <div className="flex justify-between items-start mb-4">
                     <h1 className="text-4xl font-serif text-gray-900 tracking-wide">{productData.title}</h1>
                     <button 
                        onClick={() => toggleFavorite({id: productData.id, slug: productId || productData.id.toString(), name: productData.title, price: baseUnitPrice, image: productData.image})}
                        className="transition-colors hover:scale-110"
                     >
                        <Heart size={28} strokeWidth={1.5} fill={isFavorited(productData.id) ? "#a43725" : "none"} className={isFavorited(productData.id) ? "text-[#a43725]" : "text-gray-400"} />
                     </button>
                  </div>
                  <div className="flex items-baseline gap-2 mb-6 text-gray-900">
                     <span className="text-[14px]">NT$</span>
                     <span className="text-3xl font-serif">{formatPrice(baseUnitPrice)}</span>
                     <span className="text-[14px] text-gray-500 font-sans tracking-wide">/ {isWeddingInvitation ? '份起' : (appliedRule && appliedRule.rule_type === 'bundle' ? '組' : '個')}</span>
                  </div>
                  
                  <div className="text-[14px] text-gray-600 leading-relaxed mb-8 tracking-wide markdown-body prose prose-sm prose-gray max-w-none">
                     <Markdown rehypePlugins={[rehypeRaw]}>{productData.description}</Markdown>
                  </div>

                  {appliedRule && appliedRule.notes && (
                     <div className="bg-[#faf8f5] border border-[#c98f6a]/20 rounded-xl p-5 mb-8 shadow-sm">
                        <h4 className="flex items-center gap-2 text-[#c98f6a] font-medium text-[14px] mb-3 tracking-wide">
                           <Sparkles size={16} />
                           活動說明與備註
                        </h4>
                        <div className="text-[13px] text-gray-600 leading-relaxed whitespace-pre-line tracking-wide font-medium">
                           {appliedRule.notes}
                        </div>
                     </div>
                  )}

                  <div className="flex flex-wrap gap-x-6 gap-y-3 text-[13px] text-gray-700 mb-8 pb-8 border-b border-gray-200/60 font-medium tracking-wide">
                     <div className="flex items-center gap-2"><Package size={16} className="text-[#c98f6a] stroke-[1.5]" /> {isWeddingInvitation ? '30份起訂' : (isMarriageCertificate ? '1組起訂' : '1個/本起訂')}</div>
                     {isWeddingInvitation && <div className="flex items-center gap-2"><Package size={16} className="text-[#c98f6a] stroke-[1.5]" /> 滿{setupFeeThreshold}份免基本機費</div>}
                     <div className="flex items-center gap-2"><MapPin size={16} className="text-[#c98f6a] stroke-[1.5]" /> 台灣印製</div>
                  </div>

                  {isWeddingInvitation && parsedInclusions.length > 0 && (
                     <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                        <p className="text-[14px] font-medium tracking-widest mb-6 text-center text-gray-800">所有套餐皆包含以下內容</p>
                        <div className="flex justify-between items-start text-center gap-2 px-2 flex-wrap">
                           {parsedInclusions.map((name, idx) => {
                              let Icon = Check;
                              if (name.includes('排版')) Icon = LayoutTemplate;
                              else if (name.includes('燙金') && name.includes('信封')) Icon = Sparkles;
                              else if (name.includes('信封')) Icon = Mail;
                              else if (name.includes('貼紙')) Icon = Stamp;
                              return (
                                 <div key={idx} className="flex flex-col items-center min-w-[70px] flex-1 mb-4">
                                    <div className="w-12 h-12 bg-[#faf8f5] rounded-full flex items-center justify-center mb-3 text-[#c98f6a] border border-[#f0ece5]">
                                       <Icon size={20} strokeWidth={1.5} />
                                    </div>
                                    <p className="text-[12px] text-gray-600 whitespace-pre-line tracking-wide leading-relaxed">{name.replace('排版設計', '\n排版設計')}</p>
                                 </div>
                              );
                           })}
                        </div>
                     </div>
                  )}
               </div>
            </div>

            {/* Step 1: Formats */}
            {(isWeddingInvitation || isMarriageCertificate) && variants && variants.length > 0 && (
               <div className="mb-14">
                  <h3 className="text-xl font-medium mb-6 font-serif">{isMarriageCertificate ? '選擇書約套餐' : '選擇喜帖形式'}</h3>
                  <p className="text-[13px] text-gray-500 mb-6 tracking-wide">{isMarriageCertificate ? '依據需求選購不同套餐組合，創造專屬的珍藏記憶！' : '不同形式的喜帖，創造不同的體驗與驚喜感！'}</p>
               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {variants.map((f: any, index: number) => (
                     <div 
                        key={index}
                        onClick={() => setSelectedFormatName(f.name)}
                        className={`relative border rounded-xl p-3 cursor-pointer transition-all bg-white hover:shadow-sm ${selectedFormatName === f.name ? 'border-[#c98f6a] shadow-sm bg-[#faf8f5]/30' : 'border-gray-200 hover:border-gray-300'}`}
                     >
                        {selectedFormatName === f.name && (
                           <div className="absolute -top-2 -left-2 w-5 h-5 bg-[#c98f6a] text-white rounded-full flex items-center justify-center text-[10px] shadow-sm z-10">
                              <Check size={12} strokeWidth={3} />
                           </div>
                        )}
                        <div className="flex items-center gap-3 h-full">
                           <div className="w-20 lg:w-24 shrink-0 aspect-[4/3] bg-[#faf8f5] rounded-lg overflow-hidden relative">
                              <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-white/80 text-[#c98f6a] rounded-full flex items-center justify-center text-[9px] font-bold z-10 backdrop-blur-sm">{index + 1}</div>
                              <img loading="lazy" src={`https://admin.ministylecards.com${f.image}`} className="w-full h-full object-cover opacity-90" alt={f.image_alt || f.name} />
                           </div>
                           <div className="flex flex-col flex-1 py-0.5 h-full justify-between">
                              <div>
                                 <h4 className="text-[14px] font-medium text-gray-900 mb-0.5 tracking-wide">{f.name}</h4>
                                 <p className="text-[11px] text-gray-500 leading-snug line-clamp-2">{f.description}</p>
                              </div>
                              <div className="mt-1.5 text-[13px] text-[#8b4e36] font-medium tracking-wide">
                                 NT$ {f.price} <span className="text-[10px] text-gray-400 font-normal">/ {isWeddingInvitation ? '份' : '組'}</span>
                              </div>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
            )}

               {isWeddingInvitation && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
                  {/* Step 2: Paper */}
                  <div>
                     <h3 className="text-xl font-medium mb-6 font-serif">選擇紙材</h3>
                     <div className="border border-[#c98f6a] rounded-xl p-5 flex items-center gap-4 bg-white shadow-sm overflow-hidden relative">
                        <div className="w-5 h-5 rounded-full bg-[#c98f6a] text-white flex items-center justify-center shrink-0 z-10"><Check size={12} strokeWidth={3} /></div>
                        <div className="flex-1 z-10">
                           <h4 className="font-medium text-gray-900 text-[15px] tracking-wide mb-1">300um 象牙卡</h4>
                           <p className="text-[12px] text-gray-500 leading-relaxed">雙面細緻，厚實有質感 <br/> (雙開門或對折才會用兩面霜材質)</p>
                        </div>
                        <div className="absolute right-0 top-0 bottom-0 w-24 bg-[url('https://images.unsplash.com/photo-1601662528567-526cd06f6582?auto=format&fit=crop&w=200&q=80')] bg-cover bg-center opacity-60 mix-blend-multiply"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent"></div>
                     </div>
                  </div>
               </div>
               )}

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
                  {/* Step 3: Quantity */}
                  <div>
                     <h3 className="text-xl font-medium mb-6 font-serif">選擇數量</h3>
                     <div className="border border-gray-200 rounded-xl p-5 bg-white h-[98px] flex flex-col justify-center gap-3">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                              <button onClick={() => handleQuantityChange(quantity - 10, -1)} className="px-3.5 py-1.5 text-gray-500 hover:bg-gray-50 transition-colors"><Minus size={14}/></button>
                              <div className="w-14 text-center text-[15px] font-medium tracking-wide">{quantity}</div>
                              <button onClick={() => handleQuantityChange(quantity + 10, 1)} className="px-3.5 py-1.5 text-gray-500 hover:bg-gray-50 transition-colors"><Plus size={14}/></button>
                           </div>
                           {isWeddingInvitation && <p className="text-[13px] text-gray-600 tracking-wide font-medium">滿{setupFeeThreshold}份免基本機費</p>}
                        </div>
                        <p className="text-[12px] text-gray-400 tracking-wide">{isWeddingInvitation ? '30份起訂' : (isMarriageCertificate ? '1組起訂' : '1個/本起訂')}</p>
                     </div>
                  </div>

                  {/* Step 5: Event Date */}
                  <div>
                     <h3 className="text-xl font-medium mb-6 font-serif">宴客 / 活動日期</h3>
                     <div className="border border-gray-200 rounded-xl p-5 bg-white flex flex-col justify-center min-h-[98px] shadow-sm">
                        <div className="flex items-center gap-3 border border-gray-300 rounded px-4 py-2.5 w-full focus-within:border-[#c98f6a] transition-colors relative">
                           <Calendar size={18} className="text-gray-400 absolute left-4" />
                           <input 
                              type="date" 
                              className="w-full text-[15px] outline-none text-gray-700 bg-transparent pl-8"
                              value={eventDate}
                              onChange={e => setEventDate(e.target.value)}
                              required
                           />
                        </div>
                     </div>
                  </div>
               </div>

               {envelopeGroup && (
                  <div className="mb-14">
                     {/* Step 4: Envelope */}
                     <div>
                        <h3 className="text-xl font-medium mb-6 font-serif flex items-baseline gap-2">選擇信封顏色 <span className="text-[13px] text-[#c98f6a] font-normal tracking-wider">(最多選兩色)</span></h3>
                        <div className="border border-gray-200 rounded-xl p-5 bg-white flex flex-col gap-4 shadow-sm min-h-[98px]">
                           <div className="flex flex-wrap gap-2">
                              {envelopeGroup.options.map((env: any) => (
                                 <button 
                                    key={env.name}
                                    onClick={() => handleEnvelopeToggle(env.name)}
                                    className={`px-3 py-1.5 rounded border text-[13px] transition-colors flex items-center gap-1 ${selectedEnvelopes.includes(env.name) ? 'bg-[#c98f6a] text-white border-[#c98f6a]' : 'border-gray-200 text-gray-600 hover:border-[#c98f6a]'}`}
                                 >
                                    {env.name}
                                    {env.is_default && <span className={`text-[10px] ${selectedEnvelopes.includes(env.name) ? 'text-white/80' : 'text-[#c98f6a]'}`}>(預設推薦)</span>}
                                 </button>
                              ))}
                           </div>
                           {selectedEnvelopes.length > 0 && (
                              <div className="flex gap-3 pt-3 border-t border-gray-100">
                                 {selectedEnvelopes.map(colorName => {
                                    const envColorObj = envelopeGroup.options.find((e: any) => e.name === colorName);
                                    const envImage = envColorObj?.image;
                                    return (
                                       <div key={colorName} className="flex flex-col items-center gap-2 relative group cursor-pointer">
                                          {envImage ? (
                                             <>
                                                <img loading="lazy" src={`https://admin.ministylecards.com${envImage}`} alt={envColorObj?.image_alt || colorName} className="w-20 h-14 object-cover rounded-sm shadow-sm border border-gray-200" />
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 z-50 bg-white p-1.5 rounded-xl border border-gray-200 shadow-xl opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all origin-bottom duration-200">
                                                   <img loading="lazy" src={`https://admin.ministylecards.com${envImage}`} alt={envColorObj?.image_alt || colorName} className="w-full h-auto object-cover rounded-lg" />
                                                </div>
                                             </>
                                          ) : (
                                             <div 
                                                className="w-16 h-12 shadow-inner border border-black/5 rounded-sm relative overflow-hidden bg-gray-200"
                                             >
                                                {/* Simulate envelope flap */}
                                                <div className="absolute top-0 left-0 right-0 border-t-[20px] border-l-[32px] border-r-[32px] border-b-0 border-solid border-t-white/10 border-x-transparent"></div>
                                             </div>
                                          )}
                                          <span className="text-[11px] text-gray-500 tracking-wider w-full text-center truncate">{colorName}</span>
                                       </div>
                                    );
                                 })}
                              </div>
                           )}
                           {selectedEnvelopes.length === 2 && <p className="w-full text-[12px] text-[#8b4e36] font-medium tracking-wide">已選兩色，數量將各半分配。</p>}
                        </div>
                     </div>
                  </div>
               )}

            {/* Step 6: Add-ons */}
            {addOnDisplayGroups.length > 0 && (
            <div className="mb-14">
               <h3 className="text-xl font-medium mb-6 font-serif flex items-baseline gap-2">加購項目 <span className="text-[13px] text-gray-400 font-normal tracking-wider">(依需求選擇)</span></h3>
               <div className="border border-gray-200 rounded-xl divide-y divide-gray-100 bg-white overflow-hidden shadow-sm p-6 space-y-6">
                  
                  {addOnDisplayGroups.map((group, idx) => {
                     const isFirst = idx === 0;
                     return (
                        <div key={group.id} className={`${!isFirst ? 'pt-6' : ''} flex flex-col gap-2`}>
                            {group.input_type === 'select' ? (
                               <>
                                   <label className="text-[14px] font-medium text-gray-800 tracking-wide">{group.title}:</label>
                                   <div className="relative">
                                      <select 
                                         value={selectedAddons[group.id] || ''} 
                                         onChange={e => handleAddonChange(group.id, e.target.value)}
                                         className="w-full appearance-none border border-gray-300 rounded px-4 py-2.5 text-[14px] text-gray-700 bg-[#faf8f5]/50 focus:border-[#c98f6a] focus:outline-none transition-colors pr-10 cursor-pointer"
                                      >
                                         {group.options.map((opt: any, i: number) => (
                                           <option key={`${opt.name}-${i}`} value={opt.name}>
                                               {opt.name} {opt.price > 0 && !opt.name.includes(opt.price.toString()) ? `[+$${opt.price}]` : ''}
                                            </option>
                                         ))}
                                      </select>
                                      <ChevronDown size={16} className="absolute right-4 top-3 text-gray-400 pointer-events-none" />
                                   </div>
                                   {/* If option has image, display it */}
                                   {(() => {
                                      const selOpt = group.options.find((o: any) => o.name === selectedAddons[group.id]);
                                      
                                      return (
                                         <>
                                            {group.title === '封蠟章貼紙' && selOpt && selOpt.price > 0 && (
                                               <div className="mt-3 p-4 bg-[#faf8f5] rounded border border-gray-100 flex flex-col gap-3">
                                                  <p className="text-[13px] text-gray-700 font-medium tracking-wide">✨ 選擇顏色</p>
                                                  <div className="flex flex-wrap gap-x-5 gap-y-3">
                                                     {['霧金', '紅銅金', '古銅金', '咖啡金', '復古金', '珍珠白'].map(color => (
                                                        <label key={color} className="flex items-center gap-2 cursor-pointer group/seal">
                                                           <div className={`w-4 h-4 rounded-full border ${waxSealColor === color ? 'border-[#c98f6a] border-[4px]' : 'border-gray-300 group-hover/seal:border-gray-400'} transition-all`}></div>
                                                           <input type="radio" className="hidden" name="waxSeal" checked={waxSealColor === color} onChange={() => setWaxSealColor(color)} />
                                                           <span className="text-[13px] text-gray-700">{color}</span>
                                                        </label>
                                                     ))}
                                                  </div>
                                               </div>
                                            )}
                                            {selOpt && selOpt.image && (
                                               <div className="mt-3 rounded-lg overflow-hidden border border-gray-100 bg-[#faf8f5] flex justify-center">
                                                  <img loading="lazy" src={`https://admin.ministylecards.com${selOpt.image}`} alt={selOpt.image_alt || selOpt.name} className="max-h-48 w-auto object-contain mix-blend-multiply rounded" />
                                               </div>
                                            )}
                                         </>
                                      );
                                   })()}
                               </>
                            ) : group.input_type === 'checkbox' ? (
                               <label className="flex items-center gap-3 cursor-pointer group">
                                  <div className="relative flex items-center justify-center">
                                     <input 
                                        type="checkbox" 
                                        checked={!!selectedAddons[group.id]} 
                                        onChange={e => handleAddonChange(group.id, e.target.checked)} 
                                        className="peer appearance-none w-5 h-5 border border-gray-300 rounded checked:bg-[#c98f6a] checked:border-[#c98f6a] transition-colors cursor-pointer" 
                                     />
                                     <Check size={14} strokeWidth={3} className="absolute text-white pointer-events-none opacity-0 peer-checked:opacity-100" />
                                  </div>
                                  {group.options[0] && (
                                     <span className="text-[14px] text-gray-800 tracking-wide group-hover:text-[#c98f6a] transition-colors">
                                        {group.options[0].name}
                                     </span>
                                  )}
                               </label>
                            ) : null}
                        </div>
                     );
                  })}
               </div>
            </div>
            )}
         </div>

         {/* Sticky Summary (Right) */}
         <div className="w-full lg:w-[35%] xl:w-[30%]">
            <div className="sticky top-24">
               <div className="border border-gray-200/60 rounded-2xl bg-white shadow-sm overflow-hidden">
                  <div className="p-6 xl:p-8 bg-gradient-to-b from-[#faf8f5]/50 to-white">
                     <h3 className="text-[15px] font-medium mb-6 font-serif">{isWeddingInvitation ? '已選擇的喜帖' : (isMarriageCertificate ? '已選擇的書約' : '已選擇的商品')}</h3>
                     
                     {/* Selected Format */}
                     <div className="flex gap-4 items-center mb-6">
                        <div className="w-14 aspect-[500/647] rounded-md overflow-hidden shrink-0 shadow-sm">
                           <img loading="lazy" src={(isWeddingInvitation || isMarriageCertificate) && selectedVariant ? `https://admin.ministylecards.com${selectedVariant.image}` : productData.image} alt={productData.title} className="w-full h-full object-cover bg-gray-100" />
                        </div>
                        <div className="flex-1">
                           <h4 className="text-[14px] font-medium text-gray-900 mb-1 tracking-wide">{productData.title}</h4>
                           {(isWeddingInvitation || isMarriageCertificate) && selectedVariant && <p className="text-[13px] text-gray-500 mb-2">{selectedVariant.name}</p>}
                           <p className="text-[14px] font-medium font-serif">NT$ {formatPrice(baseUnitPrice)} <span className="text-[11px] font-sans font-normal text-gray-400">/ {isWeddingInvitation ? '份' : (isMarriageCertificate ? '組' : (appliedRule && appliedRule.rule_type === 'bundle' ? '組' : '個'))}</span></p>
                        </div>
                     </div>

                     <div className="border-b border-gray-100 pb-6 mb-6">
                        <h3 className="text-[13px] text-gray-600 mb-3 tracking-wide">數量</h3>
                        <div className="flex items-center justify-between">
                           <div className="flex items-center border border-gray-200 rounded overflow-hidden bg-white">
                              <button onClick={() => handleQuantityChange(quantity - 10, -1)} className="px-3 py-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"><Minus size={14}/></button>
                              <div className="w-12 text-center text-[14px] font-medium">{quantity}</div>
                              <button onClick={() => handleQuantityChange(quantity + 10, 1)} className="px-3 py-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"><Plus size={14}/></button>
                           </div>
                           {isWeddingInvitation && <span className="text-[12px] text-[#c98f6a] bg-[#faf8f5] px-2 py-1 rounded tracking-wide">滿{setupFeeThreshold}份免基本機費</span>}
                        </div>
                     </div>

                     {isWeddingInvitation && (
                        <>
                           {/* Selected Add-ons */}
                           <div className="mb-4 flex justify-between items-end">
                              <h3 className="text-[14px] font-medium tracking-wide">已選加購項目</h3>
                           </div>
                           
                           <div className="space-y-4 border-b border-gray-100 pb-6 mb-6 min-h-[4rem]">
                              {addonTotal === 0 && selectedEnvelopes.length === 0 ? (
                                 <p className="text-[13px] text-gray-400 pt-2">尚未選擇加購項目</p>
                              ) : (
                                 <div className="text-[13px] text-gray-600 flex flex-col gap-3 relative group">
                                      {isWeddingInvitation && selectedEnvelopes.length > 0 && (
                                          <div className="flex justify-between items-start text-gray-800">
                                              <span className="tracking-wide leading-tight max-w-[70%]">
                                                  <Check size={10} strokeWidth={3} className="inline mr-1 text-[#c98f6a]"/> 
                                                  信封選擇: {selectedEnvelopes.join('、')}
                                              </span>
                                              <span className="font-medium text-gray-800">NT$ 0</span>
                                          </div>
                                      )}
                                      {Object.entries(selectedAddons).map(([groupId, value]) => {
                                         if (!value) return null;
                                         
                                         const group = addonGroups.find(g => g.id.toString() === groupId);
                                         if (!group) return null;
                                         if (group.display_group === "喜帖-信封區" || group.title === "信封選擇") return null;

                                         let priceStr = "";
                                         let addonName = '';
                                         if (group.input_type === 'checkbox') {
                                             const opt = group.options[0];
                                             if (!opt) return null;
                                             addonName = opt.name;
                                             let p = 0;
                                             if (opt.price_type === 'min_100_per_item' || opt.name.includes('未滿100份')) {
                                                 p = opt.price * chargeQty;
                                             } else if (opt.price_type === 'flat') {
                                                 p = opt.price;
                                             } else {
                                                 p = opt.price * quantity;
                                             }
                                             priceStr = `NT$ ${formatPrice(p)}`;
                                         } else {
                                             const opt = group.options.find((o: any) => o.name === value);
                                             if (!opt || opt.price === 0) return null;
                                             addonName = opt.name;
                                             if (group.title === '封蠟章貼紙' && opt.price > 0) {
                                                addonName += ` (${waxSealColor})`;
                                             }
                                             let p = 0;
                                             if (opt.price_type === 'min_100_per_item' || opt.name.includes('未滿100份') || group.title.includes('燙金')) {
                                                 p = opt.price * chargeQty;
                                             } else if (opt.price_type === 'flat') {
                                                 p = opt.price;
                                             } else {
                                                 p = opt.price * quantity;
                                             }
                                             priceStr = `NT$ ${formatPrice(p)}`;
                                         }

                                         return (
                                            <div key={groupId} className="flex justify-between items-start text-gray-800">
                                               <span className="tracking-wide leading-tight max-w-[70%]">
                                                  <Check size={10} strokeWidth={3} className="inline mr-1 text-[#c98f6a]"/> 
                                                  {addonName}
                                               </span>
                                               <span className="font-medium text-gray-800">{priceStr}</span>
                                            </div>
                                         );
                                      })}
                                 </div>
                              )}
                           </div>
                        </>
                     )}

                     {/* Totals */}
                     <div className="space-y-4 text-[13px] text-gray-600 mb-8">
                        <div className="flex justify-between items-start">
                           <span>{isWeddingInvitation ? '喜帖' : (isMarriageCertificate ? '書約' : '商品')}小計 <br/><span className="text-[11px] text-gray-400 block mt-0.5">(NT$ {formatPrice(baseUnitPrice)} x {quantity} {isWeddingInvitation ? '份' : (isMarriageCertificate ? '組' : '個')})</span></span>
                           <span className="font-medium text-[15px] text-gray-800">NT$ {formatPrice(formatTotal)}</span>
                        </div>
                        {discountAmount > 0 && (
                           <div className="flex justify-between items-center text-[#c98f6a]">
                              <span>數量折扣 ({invitationDiscountRate * 10} 折)</span>
                              <span className="font-medium text-[15px]">-NT$ {formatPrice(discountAmount)}</span>
                           </div>
                        )}
                        {setupFee > 0 && (
                           <div className="flex justify-between items-center text-gray-600">
                              <span>基本上機費用 <br/><span className="text-[11px] text-[#c98f6a] block mt-0.5">(未滿{setupFeeThreshold}份酌收)</span></span>
                              <span className="font-medium text-[15px] text-gray-800">NT$ {formatPrice(setupFee)}</span>
                           </div>
                        )}
                        {isWeddingInvitation && (
                           <div className="flex justify-between items-center border-b border-gray-100 pb-6">
                              <span>加購小計</span>
                              <span className="font-medium text-[15px] text-gray-800">NT$ {formatPrice(addonTotal)}</span>
                           </div>
                        )}
                        <div className="flex justify-between items-end pt-2">
                           <span className="text-[16px] font-medium text-gray-900 tracking-widest">總金額</span>
                           <span className="font-serif text-3xl font-medium text-[#c98f6a]">NT$ {formatPrice(grandTotal)}</span>
                        </div>
                     </div>

                     <div className="flex flex-col gap-3">
                        <button onClick={handleAddToCart} className="w-full bg-[#3d342e] hover:bg-[#2b2520] text-white py-4 rounded-lg flex items-center justify-center gap-2 tracking-widest text-[14px] transition-all shadow-sm hover:shadow">
                           <ShoppingCart size={16} /> {editItemId ? '更新客製內容' : '加入購物車'}
                        </button>
                        <button className="w-full border border-gray-200 text-gray-600 hover:bg-[#faf8f5] hover:border-gray-300 py-3.5 rounded-lg flex items-center justify-center gap-2 tracking-widest text-[14px] transition-all">
                           <Heart size={16} /> 加入我的收藏
                        </button>
                     </div>
                  </div>
               </div>

               {/* Trust Badges */}
               <div className="mt-8 space-y-6 px-2">
                  <div className="flex items-start gap-4">
                     <div className="w-10 h-10 rounded-full bg-[#faf8f5] flex items-center justify-center shrink-0 border border-gray-100 text-[#c98f6a]">
                        <HeartHandshake size={18} strokeWidth={1.5} />
                     </div>
                     <div>
                        <h5 className="text-[13px] font-medium tracking-widest mb-1 text-gray-800">安心製作</h5>
                        <p className="text-[12px] text-gray-500 leading-relaxed tracking-wide">每一份設計，我們都用心對待。</p>
                     </div>
                  </div>
                  <div className="flex items-start gap-4">
                     <div className="w-10 h-10 rounded-full bg-[#faf8f5] flex items-center justify-center shrink-0 border border-gray-100 text-[#c98f6a]">
                        <Phone size={18} strokeWidth={1.5} />
                     </div>
                     <div>
                        <h5 className="text-[13px] font-medium tracking-widest mb-1 text-gray-800">專屬服務</h5>
                        <p className="text-[12px] text-gray-500 leading-relaxed tracking-wide">如有任何問題，歡迎與我們聯繫。</p>
                     </div>
                  </div>
                  <div className="flex items-start gap-4">
                     <div className="w-10 h-10 rounded-full bg-[#faf8f5] flex items-center justify-center shrink-0 border border-gray-100 text-[#c98f6a]">
                        <ShieldCheck size={18} strokeWidth={1.5} />
                     </div>
                     <div>
                        <h5 className="text-[13px] font-medium tracking-widest mb-1 text-gray-800">安全結帳</h5>
                        <p className="text-[12px] text-gray-500 leading-relaxed tracking-wide">我們提供安全的結帳流程，保護您的資料。</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>

      </div>
    </div>
    </>
  );
}
