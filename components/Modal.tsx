import { ModalProps } from '@/types';
import React from 'react';

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  const handleContentClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-20'>
      <div
        className='fixed inset-0 bg-black bg-opacity-20 z-0'
        onClick={onClose}
      ></div>
      <div onClick={handleContentClick} className='z-10 w-1/4'>
        <div className='bg-white rounded-lg shadow-lg w-full'>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
