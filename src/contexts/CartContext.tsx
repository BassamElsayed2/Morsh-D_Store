import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from "react";

export interface CartItem {
  id: string;
  name: string;
  nameAr: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  couponCode: string;
  setCouponCode: (code: string) => void;
  applyCoupon: () => boolean;
  removeCoupon: () => void;
  isCouponApplied: boolean;
  discountAmount: number;
  finalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const VALID_COUPON = "MORSH-D";
const COUPON_DISCOUNT = 0.2; // 20%

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  const addItem = useCallback((item: Omit<CartItem, "quantity">) => {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (i) => i.id === item.id && i.size === item.size
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        };
        return updatedItems;
      }

      return [...prevItems, { ...item, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((id: string, size: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => !(item.id === id && item.size === size))
    );
  }, []);

  const updateQuantity = useCallback((id: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prevItems) =>
        prevItems.filter((item) => !(item.id === id && item.size === size))
      );
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.size === size ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items]
  );

  const discountAmount = useMemo(
    () => (isCouponApplied ? Math.round(totalPrice * COUPON_DISCOUNT) : 0),
    [isCouponApplied, totalPrice]
  );

  const finalPrice = useMemo(
    () => totalPrice - discountAmount,
    [totalPrice, discountAmount]
  );

  const applyCoupon = useCallback(() => {
    if (couponCode.trim().toUpperCase() === VALID_COUPON) {
      setIsCouponApplied(true);
      return true;
    }
    return false;
  }, [couponCode]);

  const removeCoupon = useCallback(() => {
    setIsCouponApplied(false);
    setCouponCode("");
  }, []);

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
      couponCode,
      setCouponCode,
      applyCoupon,
      removeCoupon,
      isCouponApplied,
      discountAmount,
      finalPrice,
    }),
    [items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice, couponCode, applyCoupon, removeCoupon, isCouponApplied, discountAmount, finalPrice]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
