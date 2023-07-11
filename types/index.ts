import { Timestamp } from 'firebase/firestore';
import React, { MouseEventHandler } from 'react';

export interface User {
  email: string;
  role: number;
  uid: string;
  username: string;
}

export interface ContextProviderProps {
  children: React.ReactNode;
}

export interface DashboardData {
  totalRevenue: number;
  totalTransactions: number;
  totalItemsSold: number;
}

export interface resultRequest {
  code: number;
  message: any;
  status: string;
  data?: any;
}

export interface Medicine {
  id: string;
  medicine_name: string;
  price: string;
  stock: number;
  image: string | null;
  noBPOM: string;
  safetyStock?: number;
  isExistInProcurement?: boolean;
  availableStatus?: string;
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
  purgeCart: () => void;
}

export interface SalesData {
  idOrder: string;
  obat: Carts[];
  tanggal: Timestamp;
  totalPenjualan: number;
  totalItems: number;
  uid: string;
}

export interface ProcurementData {
  uid: string;
  procurementDate: Timestamp;
  medicine: Medicine;
  Qty: number;
  oldStock: string;
  status: string;
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
  placeholder?: string;
  handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
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
