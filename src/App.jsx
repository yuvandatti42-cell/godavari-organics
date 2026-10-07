import React from 'react';
import { CartProvider, useCart } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import QuickViewModal from './components/QuickViewModal';
import AuthModal from './components/AuthModal';
import SearchModal from './components/SearchModal';
import { Leaf, CheckCircle, Info } from 'lucide-react';

function MainLayout() {
  const { currentPage, notification, quickViewProduct, authModalOpen, searchModalOpen } = useCart();

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'shop':
        return <Shop />;
      case 'product':
        return <ProductDetails />;
      case 'cart':
        return <Cart />;
      case 'checkout':
        return <Checkout />;
      case 'order-success':
        return <OrderConfirmation />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-[#faf5ea] text-[#1d271c] font-sans antialiased flex flex-col selection:bg-[#18542a] selection:text-white">
      {/* Top Header */}
      <Header />

      {/* Floating Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#1d271c] text-white text-xs font-semibold px-5 py-3 rounded-xl shadow-2xl border border-[#abbd4c]/40 flex items-center space-x-3 transition-all duration-300 animate-pulse-subtle">
          <div className="w-7 h-7 rounded-full bg-[#abbd4c]/20 flex items-center justify-center text-[#abbd4c]">
            <Leaf className="w-4 h-4" />
          </div>
          <span className="font-medium tracking-wide">{notification}</span>
        </div>
      )}

      {/* Main Page Content */}
      <main className="flex-1 w-full">
        {renderPage()}
      </main>

      {/* Modals */}
      {quickViewProduct && <QuickViewModal />}
      {authModalOpen && <AuthModal />}
      {searchModalOpen && <SearchModal />}

      {/* Main Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <MainLayout />
    </CartProvider>
  );
}

