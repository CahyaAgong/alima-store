'use client';
import { Carts } from '@/types';
import { formatCurrency } from '@/utils/helper';

const MedicineInCart = ({
  MedicineInCart,
  totalMedicine,
  isConfirmation,
}: Carts) => {
  const totalPrice = parseInt(MedicineInCart.price) * totalMedicine;

  return (
    <div className='flex flex-row justify-between w-full items-center mb-5'>
      <div
        className={`flex flex-col justify-between items-center ${
          !isConfirmation ? 'w-1/2' : 'w-1/4'
        }`}
      >
        <div className='w-full text-black font-semibold'>
          <h3 className='text-base'>{MedicineInCart.medicine_name}</h3>
          <div className={`flex flex-row font-normal justify-between `}>
            <h5>{formatCurrency(parseInt(MedicineInCart.price))}</h5>
            <span>x{totalMedicine}</span>
          </div>
        </div>
      </div>

      <div
        className={`font-semibold flex justify-end ${
          !isConfirmation ? 'w-1/2' : 'w-3/4'
        }`}
      >
        <h3 className='text-xl'>{formatCurrency(totalPrice)}</h3>
      </div>
    </div>
  );
};

export default MedicineInCart;
