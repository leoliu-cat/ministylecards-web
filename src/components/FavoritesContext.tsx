import React, { createContext, useContext, useEffect, useState } from 'react';

export interface FavoriteItem {
  id: number | string;
  slug: string;
  name: string;
  price: string | number;
  image: string;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  toggleFavorite: (item: FavoriteItem) => void;
  isFavorited: (id: number | string) => boolean;
  favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    try {
      const stored = localStorage.getItem('ministyle-favorites');
      if (stored) return JSON.parse(stored);
    } catch(e) {}
    return [];
  });

  useEffect(() => {
    localStorage.setItem('ministyle-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (item: FavoriteItem) => {
    setFavorites(prev => {
      const exists = prev.some(fav => fav.id === item.id);
      if (exists) {
        return prev.filter(fav => fav.id !== item.id);
      }
      return [...prev, item];
    });
  };

  const isFavorited = (id: number | string) => favorites.some(fav => fav.id === id);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorited, favoritesCount: favorites.length }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
