import React, { MouseEventHandler } from 'react';

export interface Medicine {
  medicine_name: string;
  price: string;
  stock: number;
}

// ========= interface untuk @/components

export interface NavbarProps {
  handleClick?: MouseEventHandler<HTMLElement>;
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
