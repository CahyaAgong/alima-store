import React, { MouseEventHandler } from 'react';

export interface Medicine {
  id: string;
  medicine_name: string;
  price: string;
  stock: number;
  image: string | null;
}

export interface Carts {
  MedicineInCart: Medicine;
  totalMedicine: number;
  isConfirmation?: boolean;
}

export interface CartContextProps {
  cart: Carts[];
  addToCart: (medicine: Carts) => void;
  removeFromCart: (medicine: Carts) => void;
  increaseQuantity: (medicine: Carts) => void;
  decreaseQuantity: (medicine: Carts) => void;
}

// ========= interface untuk @/components

export interface NavbarProps {
  handleClick?: MouseEventHandler<HTMLElement>;
}

export interface TabsProps {
  menus: {
    name: string;
    slug: string;
  }[];
}

export interface SearchBarProps {
  containerStyles?: string;
  inputStyles?: string;
  searchIcon?: boolean;
}

export interface StatusFlagProps {
  title: string;
  containerStyles?: string;
}

export interface CustomButtonProps {
  isDisabled?: boolean;
  btnType?: 'button' | 'submit';
  containerStyles?: string;
  textStyles?: string;
  title: string;
  rightIcon?: string;
  handleClick?: MouseEventHandler<HTMLButtonElement>;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export interface DatePickerProps {
  value?: string;
  onClick?: () => void;
}

export interface FileUploaderProps {
  label?: string;
  onChange: (file: File | null) => void;
  isRequired?: boolean;
}
