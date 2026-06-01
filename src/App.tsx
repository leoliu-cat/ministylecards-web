/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { ProcessPage } from './pages/ProcessPage';
import { MarriageCertificatePage } from './pages/MarriageCertificatePage';
import { WeddingFavorsPage } from './pages/WeddingFavorsPage';
import { EssentialDesignPage } from './pages/EssentialDesignPage';
import { IllustrationPage } from './pages/IllustrationPage';
import { WeddingWebsitePage } from './pages/WeddingWebsitePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { NoticePage } from './pages/NoticePage';
import { LoginPage } from './pages/LoginPage';
import { JournalPage } from './pages/JournalPage';
import { JournalDetailPage } from './pages/JournalDetailPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { CartPage } from './pages/CartPage';
import { NewArrivalPage } from './pages/NewArrivalPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { CollectionDetailPage } from './pages/CollectionDetailPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';

import { CartProvider } from './components/CartContext';
import { AuthProvider } from './components/AuthContext';
import { FavoritesProvider } from './components/FavoritesContext';
import { SEO } from './components/SEO';
import { useParams } from 'react-router-dom';

const ProductDetailRoute = () => {
    const { productId } = useParams<{ productId: string }>();
    return <ProductDetailPage key={productId} />;
};

export default function App() {
  return (
    <AuthProvider>
      <SEO />
      <FavoritesProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="wedding-invitations" element={<CategoryPage />} />
              <Route path="marriage-certificate" element={<MarriageCertificatePage />} />
              <Route path="wedding-favors" element={<WeddingFavorsPage />} />
              <Route path="essential-design" element={<EssentialDesignPage />} />
              <Route path="illustration" element={<IllustrationPage />} />
              <Route path="wedding-website" element={<WeddingWebsitePage />} />
              <Route path="process" element={<ProcessPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="terms" element={<TermsPage />} />
              <Route path="privacy" element={<PrivacyPage />} />
              <Route path="notice" element={<NoticePage />} />
              <Route path="journal" element={<JournalPage />} />
              <Route path="journal/:journalId" element={<JournalDetailPage />} />
              <Route path="favorites" element={<FavoritesPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="order/success" element={<OrderSuccessPage />} />
              <Route path="collections" element={<CollectionsPage />} />
              <Route path="collections/:collectionId" element={<CollectionDetailPage />} />
              <Route path="product/:productId" element={<ProductDetailRoute />} />
              <Route path="collections/new-arrival" element={<NewArrivalPage />} />
              <Route path="new-arrival" element={<NewArrivalPage />} />
              <Route path="*" element={<div className="p-20 text-center"><h1 className="text-2xl mb-4">Under Construction</h1><p>We are building this page...</p></div>} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}

