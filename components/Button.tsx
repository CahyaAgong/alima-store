'use client';

import { CustomButtonProps } from '@/types';

export default function Button({
  isDisabled,
  title,
  containerStyles,
  handleClick,
  btnType,
}: CustomButtonProps) {
  return (
    <button
      disabled={isDisabled}
      type={btnType || 'button'}
      className={`${containerStyles}`}
      onClick={handleClick}
    >
      <span> {title} </span>
    </button>
  );
}
