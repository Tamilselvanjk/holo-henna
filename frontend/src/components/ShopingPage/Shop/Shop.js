import React, { useState, useEffect } from 'react';
import HeroBanner from '../HeroBanner/HeroBanner';
import ShopHeader from '../ShopHeader/ShopHeader';
import Categories from '../Categories/Categories';
import ProductCards from '../ProductCards/ProductCards';
import Cart from '../Carts/Carts';
import Toast from '../Toast/Toast';
import './Shop.css';

const Shop = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('All Products');
  const [cartTotal, setCartTotal] = useState(0);

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setCartTotal(total);
  }, [cartItems]);

  const handleAddToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  return (
    <div className="shop-container">
      <HeroBanner />
      <ShopHeader
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
        onSearch={handleSearch}
      />
      <Categories
        onCategoryChange={(category) => setCurrentCategory(category)}
      />
      <ProductCards
        category={currentCategory}
        onAddToCart={handleAddToCart}
        searchTerm={searchTerm}
      />
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        total={cartTotal}
        onUpdateQuantity={handleUpdateQuantity}
      />
      <Toast
        show={showToast}
        message="Item added to cart!"
        onClose={() => setShowToast(false)}
      />
    </div>
  )
};

export default Shop;
