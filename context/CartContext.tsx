'use client';

import { Carts, CartContextProps, Medicine } from '@/types';
import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from 'react';

const CartContext = createContext<CartContextProps>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  increaseQuantity: () => {},
  decreaseQuantity: () => {},
  updateMedicineInCart: () => {},
  purgeCart: () => {},
});

export const useCart = (): CartContextProps => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

const CartProvider = ({ children }: PropsWithChildren) => {
  const [cart, setCart] = useState<Carts[]>([]);

  const addToCart = (Medicine: Carts) => {
    setCart(prevCart => [...prevCart, Medicine]);
  };

  const removeFromCart = (Medicine: Carts) => {
    setCart(prevCart =>
      prevCart.filter(
        item =>
          item.MedicineInCart.medicine_name !==
          Medicine.MedicineInCart.medicine_name
      )
    );
  };

  const increaseQuantity = (Medicine: Carts) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.MedicineInCart.medicine_name ===
        Medicine.MedicineInCart.medicine_name
          ? { ...item, totalMedicine: item.totalMedicine + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (Medicine: Carts) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.MedicineInCart.medicine_name ===
        Medicine.MedicineInCart.medicine_name
          ? { ...item, totalMedicine: item.totalMedicine - 1 }
          : item
      )
    );
  };

  const purgeCart = () => {
    setCart([]);
  };

  const updateMedicineInCart = (Medicine: Carts) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.MedicineInCart.medicine_name ===
        Medicine.MedicineInCart.medicine_name
          ? Medicine
          : item
      )
    );
  };

  const value: CartContextProps = {
    cart,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    purgeCart,
    updateMedicineInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartProvider;
