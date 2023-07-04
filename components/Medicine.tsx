import Image from 'next/image';
import { Medicine, Carts } from '@/types';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/utils/helper';

const Medicine = ({ id, medicine_name, price, stock, image }: Medicine) => {
  const {
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    cart,
  } = useCart();
  const existingMedicine = cart.find(
    item => item.MedicineInCart.medicine_name === medicine_name
  );
  const totalMedicine = existingMedicine?.totalMedicine || 0;

  const handleMinusClick = () => {
    if (totalMedicine < 0 || !existingMedicine) return;
    if (totalMedicine === 1) removeFromCart(existingMedicine);
    decreaseQuantity(existingMedicine);
  };

  const handleAddClick = () => {
    if (existingMedicine) {
      if (existingMedicine.totalMedicine >= stock) return;
      increaseQuantity(existingMedicine);
    } else {
      addToCart({
        MedicineInCart: { id, medicine_name, price, stock, image },
        totalMedicine: 1,
      });
    }
  };

  return (
    <div className='flex flex-row justify-center items-center border-b border-b-gray-300 mb-3 w-full px-9 py-7 space-x-3'>
      <div className='w-[8%] h-14 overflow-hidden rounded-lg flex relative shadow-md'>
        <Image
          src={image ? image : '/DEFAULT_MEDICINE_IMG.webp'}
          fill
          alt={medicine_name}
        />
      </div>

      <div className='flex flex-row justify-between items-center text-black w-[80%]'>
        <div className='flex flex-col'>
          <h3 className='font-medium'>{medicine_name}</h3>
          <span className='font-normal text-sm'>Stock : {stock}</span>
        </div>

        <div>
          <h2 className='text-xl font-medium'>
            {formatCurrency(parseInt(price))}
          </h2>
        </div>
      </div>

      <div className='flex flex-row w-[15%] justify-center items-center space-x-5'>
        <button
          type='button'
          className='p-2 border border-[#5C25E7] cursor-pointer rounded-md'
          onClick={handleMinusClick}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='2'
            stroke='#000'
            className='w-3 h-3'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M19.5 12h-15'
            />
          </svg>
        </button>

        <h5 className='font-medium text-lg'>{totalMedicine}</h5>

        <button
          type='button'
          className='p-2 border border-[#5C25E7] cursor-pointer rounded-md'
          onClick={handleAddClick}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='2'
            stroke='#000'
            className='w-3 h-3'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M12 4.5v15m7.5-7.5h-15'
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Medicine;