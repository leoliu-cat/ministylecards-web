import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: string; // Use string for unique id generated on add
  productId: number;
  name: string;
  baseQuantity: string;
  eventDate?: string;
  paper?: string;
  size?: string;
  tags: string[];
  price: number;
  quantity: number;
  minQty?: number;
  image: string;
  customizations: {
    id: string;
    name: string;
    desc: string;
    price: number;
  }[];
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  removeCustomization: (itemId: string, customId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('minicart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('minicart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: Omit<CartItem, 'id'>) => {
    setCartItems(prev => {
      // Find existing item with exact same configuration
      const existingItemIndex = prev.findIndex(prevItem => {
         if (prevItem.productId !== item.productId) return false;
         if (prevItem.paper !== item.paper) return false;
         if (prevItem.size !== item.size) return false;
         if (prevItem.baseQuantity !== item.baseQuantity) return false;
         if (prevItem.eventDate !== item.eventDate) return false;
         
         // Customizations must match exactly (ignoring id)
         if (prevItem.customizations.length !== item.customizations.length) return false;
         
         const sortedPrevCustoms = [...prevItem.customizations].sort((a, b) => a.name.localeCompare(b.name));
         const sortedItemCustoms = [...item.customizations].sort((a, b) => a.name.localeCompare(b.name));
         
         const allCustomsMatch = sortedPrevCustoms.every((c, i) => {
            return c.name === sortedItemCustoms[i].name && c.desc === sortedItemCustoms[i].desc && c.price === sortedItemCustoms[i].price;
         });
         
         return allCustomsMatch;
      });

      if (existingItemIndex > -1) {
         // Merge quantity
         const newCart = [...prev];
         newCart[existingItemIndex] = {
            ...newCart[existingItemIndex],
            quantity: newCart[existingItemIndex].quantity + item.quantity
         };
         return newCart;
      }

      return [...prev, { ...item, id: Math.random().toString(36).substring(2, 9) }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const isWeddingInvitation = item.tags && item.tags.includes('喜帖');
        const minQty = item.minQty !== undefined ? item.minQty : (isWeddingInvitation ? 30 : 1);
        return { ...item, quantity: Math.max(minQty, item.quantity + delta) };
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const removeCustomization = (itemId: string, customId: string) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          customizations: item.customizations.filter(c => c.id !== customId)
        };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeItem, removeCustomization, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
