import React, { useState, useEffect } from 'react';
import { DRONES } from './data/products';
import { session } from './services/api';
import { Navbar } from './Components/layout/Navbar';
import { Footer } from './Components/layout/Footer';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetail } from './pages/ProductDetail';
import { Tutorials } from './pages/Tutorials';
import { Services } from './pages/Services';
import { Contact } from './pages/Contact';
import { Auth } from './pages/Auth';
import { Cart } from './pages/Cart';
import { AdminDashboard } from './pages/AdminDashboard';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { About } from './pages/About';
import { Industries } from './pages/Industries';
import { Projects } from './pages/Projects';
import { Shop } from './pages/Shop';

export const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(DRONES[0]);
  
  // Real cart starts empty (no demo data)
  const [cart, setCart] = useState([]);

  // Scroll to top on page navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Navigation handler
  const handleNavigate = (page) => {
    // Route guard: the admin dashboard is for signed-in administrators only.
    if (page === 'admin' && !session.isAdmin()) {
      setCurrentPage(session.isLoggedIn() ? 'account' : 'auth');
      return;
    }

    if (page === 'account' && !session.isLoggedIn()) {
      setCurrentPage('auth');
      return;
    }

    setCurrentPage(page);
  };

  // Product selection handler -> Navigates to FULL PAGE Product Detail
  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
  };

  // Category selection handler
  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
  };

  // Add to cart handler
  const handleAddToCart = (productToAdd) => {
    const qtyToAdd = productToAdd.qty || 1;
    setCart((prev) => {
      const existing = prev.find((item) => item.id === productToAdd.id);
      if (existing) {
        return prev.map((item) =>
          item.id === productToAdd.id
            ? { ...item, qty: item.qty + qtyToAdd }
            : item
        );
      }
      return [...prev, { ...productToAdd, qty: qtyToAdd }];
    });
  };

  // Update item quantity in cart
  const handleUpdateQty = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  // Remove item from cart
  const handleRemoveItem = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const cartTotalCount = cart.reduce((sum, item) => sum + item.qty, 0);

  // Admin Dashboard has its own full layout (sidebar), so render it separately
  if (currentPage === 'admin') {
    return <AdminDashboard onNavigate={handleNavigate} />;
  }

  return (
    <div className="min-h-screen bg-[#05080F] text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        cartCount={cartTotalCount}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
      />

      {/* Main Full-Width Content Container */}
      <main className="flex-1 w-full">
        {currentPage === 'home' && (
          <Home
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            onSelectCategory={handleSelectCategory}
          />
        )}

        {currentPage === 'shop' && (
          <Shop
            initialCategory={selectedCategory}
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
          />
        )}

        {currentPage === 'products' && (
          <Shop
            initialCategory={selectedCategory}
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
          />
        )}

        {currentPage === 'product-detail' && (
          <ProductDetail
            product={selectedProduct}
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentPage === 'tutorials' && (
          <Tutorials
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'services' && (
          <Services
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'contact' && (
          <Contact />
        )}

        {currentPage === 'auth' && (
          <Auth onNavigate={handleNavigate} />
        )}

        {currentPage === 'account' && (
          <CustomerDashboard onNavigate={handleNavigate} />
        )}

        {currentPage === 'cart' && (
          <Cart
            cart={cart}
            onUpdateQty={handleUpdateQty}
            onRemoveItem={handleRemoveItem}
            onClearCart={() => setCart([])}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'about' && (
          <About onNavigate={handleNavigate} />
        )}

        {currentPage === 'industries' && (
          <Industries onNavigate={handleNavigate} />
        )}

        {currentPage === 'projects' && (
          <Projects onNavigate={handleNavigate} />
        )}
      </main>

      {/* Bottom Footer */}
      <Footer
        onNavigate={handleNavigate}
        onSelectCategory={handleSelectCategory}
      />
    </div>
  );
};
