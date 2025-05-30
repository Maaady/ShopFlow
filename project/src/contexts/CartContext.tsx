import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ProductType, CartItemType } from '../types';

interface CartContextType {
  cartItems: CartItemType[];
  addToCart: (product: ProductType, variant: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);

  const addToCart = (product: ProductType, variant: string, quantity: number) => {
    setCartItems([{
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      variant,
      quantity
    }]);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};