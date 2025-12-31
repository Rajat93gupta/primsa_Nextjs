/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { createContext, useContext, useState, ReactNode } from "react";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity?: number;
}

interface CartContextType {
  cart: Product[];
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Product[]>([]);

  const addToCart = async (product: Product) => {
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setCart((prev) => {
        const existing = prev.find((p) => p.id === product.id);
        if (existing) {
          return prev.map((p) =>
            p.id === product.id
              ? { ...p, quantity: (p.quantity || 1) + 1 }
              : p
          );
        }
        return [...prev, { ...product, quantity: 1 }];
      });
    } catch (err) {
      console.error(err);
      alert("Login required");
    }
  };

 const removeFromCart = async (id: number) => {
  console.log(id);
  
  try {
    const res = await fetch(`/api/cart?productId=${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    
    
    const data = await res.json();
    console.log(data);
    if (!res.ok) throw new Error(data.message);

    // Update local state after API success
    setCart((prev) => prev.filter((p) => p.id !== id));
  } catch (err: any) {
    console.error(err);
    alert(err.message || "Failed to remove item");
  }
};


  const updateQuantity = async (id: number, quantity: number) => {
  try {
    const res = await fetch("/api/cart", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ productId: id, quantity }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    // Update local state after API success
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  } catch (err: any) {
    console.error(err);
    alert(err.message || "Failed to update quantity");
  }
};

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
