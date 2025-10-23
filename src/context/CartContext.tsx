"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";

interface CartItem {
  id: number;
  title: string;
  price: number;
  discountedPrice: number;
  discountPercent: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">, quantityToAdd?: number) => void;
  removeFromCart: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  getItemQuantity: (id: number) => number;
  total: number;
  discountTotal: number;
  finalTotal: number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);


  const addToCart = useCallback(
    (item: Omit<CartItem, "quantity">, quantityToAdd: number = 1) => {
      setCart((prev) => {
        const existing = prev.find((i) => i.id === item.id);
        if (existing) {
          return prev.map((i) =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + quantityToAdd }
              : i
          );
        }
        return [...prev, { ...item, quantity: quantityToAdd }];
      });
    },
    []
  );

  const removeFromCart = useCallback((id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback(
    (id: number, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(id);
        return;
      }
      setCart((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    },
    [removeFromCart]
  );

  const decreaseQuantity = useCallback((id: number) => {
    setCart(
      (prev) =>
        prev
          .map((item) =>
            item.id === id
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
          .filter((item) => item.quantity > 0)
    );
  }, []);
  const clearCart = useCallback(() => setCart([]), []);

  const getItemQuantity = useCallback(
    (id: number) => {
      return cart.find((item) => item.id === id)?.quantity || 0;
    },
    [cart]
  );

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const discountTotal = useMemo(
    () =>
      cart.reduce(
        (sum, item) =>
          sum + (item.price - item.discountedPrice) * item.quantity,
        0
      ),
    [cart]
  );

  const finalTotal = useMemo(
    () => total - discountTotal,
    [total, discountTotal]
  );

  const value = useMemo(
    () => ({
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      decreaseQuantity,
      getItemQuantity,
      total,
      discountTotal,
      finalTotal,
      clearCart,
    }),
    [
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      decreaseQuantity,
      getItemQuantity,
      total,
      discountTotal,
      finalTotal,
      clearCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// --- Custom Hook ---
// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
