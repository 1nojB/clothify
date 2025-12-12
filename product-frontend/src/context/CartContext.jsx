
import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();
export function CartProvider({ children }) {
  const STORAGE_KEY = "clothify_cart_v1";
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.error("Cart parse error:", err);
      return [];
    }
  });

  const count = items.reduce((sum, it) => sum + (it.quantity || 0), 0);
  const totalAmount = items.reduce(
    (sum, it) => sum + Number(it.price || 0) * (it.quantity || 0),
    0
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function addToCart(product, qty = 1) {
    console.log("addToCart:", product);
    const id =
      String(product.id ??
        product.productId ??
        product.pid ??
        product._id ??
        product.name);

    setItems((prev) => {
      const existing = prev.find((p) => String(p.id) === id);
      if (existing) {

        return prev.map((p) =>
          String(p.id) === id
            ? { ...p, quantity: (p.quantity || 0) + qty }
            : { ...p }
        );
      } else {
        const newItem = {
          id: id,
          name: product.name ?? "Unnamed Product",
          price: Number(product.price ?? 0),
          imageUrl:
            product.imageUrl ?? "/images/products/placeholder.png",
          quantity: qty,
        };
        return [...prev.map((p) => ({ ...p })), newItem];
      }
    });
  }

  function updateQuantity(id, newQty) {
    console.log("updateQuantity called:", id, newQty);
    setItems((prev) =>
      prev.map((it) =>
        String(it.id) === String(id)
          ? { ...it, quantity: Math.max(1, newQty) }
          : { ...it }
      )
    );
  }

  function removeFromCart(id) {
    setItems((prev) => prev.filter((it) => String(it.id) !== String(id)));
  }

  function clearCart() {
    setItems([]);
  }

  return (
    <CartContext.Provider
      value={{
        items,
        count,
        totalAmount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}


export function useCart() {
  const context = useContext(CartContext);
  if (!context)
    throw new Error("useCart must be used inside a CartProvider");
  return context;
}


