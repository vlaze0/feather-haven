'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { BirdItem, ProductItem, CartLineItem, CouponItem, DeliveryMethod } from '@/types';

interface CartContextType {
  cart: CartLineItem[];
  wishlist: (BirdItem | ProductItem)[];
  coupon: CouponItem | null;
  deliveryMethod: DeliveryMethod;
  setDeliveryMethod: (method: DeliveryMethod) => void;
  addToCartBird: (bird: BirdItem, selectedGender?: 'Male' | 'Female' | 'Pair' | string) => void;
  addToCartProduct: (product: ProductItem, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  toggleWishlist: (item: BirdItem | ProductItem) => void;
  isInWishlist: (id: string) => boolean;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  subtotal: number;
  discountAmount: number;
  deliveryCharge: number;
  totalAmount: number;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartLineItem[]>([]);
  const [wishlist, setWishlist] = useState<(BirdItem | ProductItem)[]>([]);
  const [coupon, setCoupon] = useState<CouponItem | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('HOME_DELIVERY');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load cart and wishlist from LocalStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('fh_cart');
      const savedWishlist = localStorage.getItem('fh_wishlist');
      const savedCoupon = localStorage.getItem('fh_coupon');
      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
      if (savedCoupon) setCoupon(JSON.parse(savedCoupon));
    } catch (e) {
      console.error('Failed to load local storage', e);
    }
  }, []);

  // Sync to LocalStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem('fh_cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('fh_wishlist', JSON.stringify(wishlist));
    } catch (e) {}
  }, [wishlist]);

  useEffect(() => {
    try {
      if (coupon) {
        localStorage.setItem('fh_coupon', JSON.stringify(coupon));
      } else {
        localStorage.removeItem('fh_coupon');
      }
    } catch (e) {}
  }, [coupon]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const addToCartBird = (bird: BirdItem, selectedGender: 'Male' | 'Female' | 'Pair' | string = 'Male') => {
    if (bird.status === 'SOLD' || bird.status === 'RESERVED') {
      showToast(`Sorry, ${bird.name} is currently ${bird.status.toLowerCase()}.`);
      return;
    }

    const existingIndex = cart.findIndex(
      (item) => item.birdId === bird.id && item.selectedGender === selectedGender
    );

    if (existingIndex > -1) {
      showToast(`${bird.name} (${selectedGender}) is already in your cart.`);
      return;
    }

    let img = '/images/birds/normal_green_budgie.jpg';
    try {
      const parsed = typeof bird.images === 'string' ? JSON.parse(bird.images) : bird.images;
      if (Array.isArray(parsed) && parsed.length > 0) img = parsed[0];
    } catch (e) {}

    const newItem: CartLineItem = {
      id: `bird-${bird.id}-${selectedGender}`,
      type: 'bird',
      birdId: bird.id,
      bird,
      quantity: 1,
      unitPrice: bird.price,
      title: `${bird.name} (${selectedGender})`,
      image: img,
      selectedGender,
    };

    setCart((prev) => [...prev, newItem]);
    showToast(`Added ${bird.name} (${selectedGender}) to your cart! 🐦`);
  };

  const addToCartProduct = (product: ProductItem, quantity = 1) => {
    if (product.stock <= 0) {
      showToast(`${product.name} is currently out of stock.`);
      return;
    }

    const existingIndex = cart.findIndex((item) => item.productId === product.id);
    let img = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80';
    if (product.images && product.images.length > 0) {
      img = product.images.find((i) => i.isPrimary)?.url || product.images[0].url;
    }

    const price = product.discountPrice ?? product.price;

    if (existingIndex > -1) {
      setCart((prev) =>
        prev.map((item, idx) => {
          if (idx === existingIndex) {
            const newQty = Math.min(item.quantity + quantity, product.stock);
            return { ...item, quantity: newQty };
          }
          return item;
        })
      );
      showToast(`Updated quantity for ${product.name}.`);
    } else {
      const newItem: CartLineItem = {
        id: `prod-${product.id}`,
        type: 'product',
        productId: product.id,
        product,
        quantity: Math.min(quantity, product.stock),
        unitPrice: price,
        title: product.name,
        image: img,
      };
      setCart((prev) => [...prev, newItem]);
      showToast(`Added ${product.name} to cart! 🛍️`);
    }
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    showToast('Item removed from cart.');
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            if (item.type === 'bird') {
              return item; // Birds are strictly quantity 1 per item
            }
            const maxStock = item.product?.stock ?? 99;
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return { ...item, quantity: Math.min(newQty, maxStock) };
          }
          return item;
        })
        .filter(Boolean) as CartLineItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
    setCoupon(null);
  };

  const toggleWishlist = (item: BirdItem | ProductItem) => {
    const isBird = 'birdCode' in item;
    const itemId = item.id;
    const exists = wishlist.some((w) => w.id === itemId);

    if (exists) {
      setWishlist((prev) => prev.filter((w) => w.id !== itemId));
      showToast(`Removed from wishlist.`);
    } else {
      setWishlist((prev) => [...prev, item]);
      showToast(`Added to your wishlist! ❤️`);
    }
  };

  const isInWishlist = (id: string) => {
    return wishlist.some((w) => w.id === id);
  };

  const applyCoupon = async (code: string) => {
    const uppercaseCode = code.trim().toUpperCase();
    try {
      const res = await fetch(`/api/coupons/validate?code=${encodeURIComponent(uppercaseCode)}`);
      const data = await res.json();
      if (!res.ok || !data.coupon) {
        return { success: false, message: data.error || 'Invalid coupon code.' };
      }
      setCoupon(data.coupon);
      showToast(`Coupon ${uppercaseCode} applied! 🎉`);
      return { success: true, message: 'Coupon applied successfully!' };
    } catch (e) {
      return { success: false, message: 'Error checking coupon code.' };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    showToast('Coupon removed.');
  };

  // Financial calculations
  const subtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  let discountAmount = 0;
  if (coupon) {
    if (subtotal >= coupon.minOrderAmount) {
      if (coupon.type === 'PERCENTAGE') {
        discountAmount = (subtotal * coupon.value) / 100;
        if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
          discountAmount = coupon.maxDiscount;
        }
      } else {
        discountAmount = coupon.value;
      }
    }
  }

  const deliveryCharge =
    deliveryMethod === 'STORE_PICKUP' ? 0 : subtotal === 0 || subtotal >= 1999 ? 0 : 99;

  const totalAmount = Math.max(0, subtotal - discountAmount + deliveryCharge);

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        coupon,
        deliveryMethod,
        setDeliveryMethod,
        addToCartBird,
        addToCartProduct,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        applyCoupon,
        removeCoupon,
        subtotal,
        discountAmount,
        deliveryCharge,
        totalAmount,
        toastMessage,
        showToast,
      }}
    >
      {children}
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[9999] bg-gray-900 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center space-x-3 border border-emerald-500/30 animate-bounce">
          <span className="text-xl">🐦</span>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}
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
