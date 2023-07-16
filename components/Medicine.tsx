import Image from 'next/image';
import { Medicine, Carts } from '@/types';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/utils/helper';
import { ChangeEvent, useEffect, useState } from 'react';

const Medicine = ({
  id,
  medicine_name,
  price,
  stock,
  image,
  noBPOM,
}: Medicine) => {
  const {
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    updateMedicineInCart,
    cart,
  } = useCart();
  const existingMedicine = cart.find(
    item => item.MedicineInCart.medicine_name === medicine_name
  );
  const [totalMedicine, setTotalMedicine] = useState<number>(
    existingMedicine?.totalMedicine || 0
  );
  const [isInputExceeded, setIsInputExceeded] = useState<boolean>(false);

  const updateQuantity = (medicine: Carts, newQuantity: number) => {
    const updatedMedicine = {
      ...medicine,
      totalMedicine: newQuantity,
    };
    updateMedicineInCart(updatedMedicine);
  };

  const handleMinusClick = () => {
    if (totalMedicine < 0 || !existingMedicine) return;
    if (totalMedicine === 1) removeFromCart(existingMedicine);
    decreaseQuantity(existingMedicine);
    setTotalMedicine(prevTotal => prevTotal - 1);
  };

  const handleAddClick = () => {
    if (existingMedicine) {
      if (existingMedicine.totalMedicine >= stock) return;
      increaseQuantity(existingMedicine);
    } else {
      if (stock === 0) return;
      addToCart({
        MedicineInCart: { id, medicine_name, price, stock, image, noBPOM },
        totalMedicine: totalMedicine + 1,
      });
    }
    setTotalMedicine(prevTotal => prevTotal + 1);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputVal: number = parseInt(e.target.value);
    const numericRegex = /^[0-9]*$/;
    if (
      numericRegex.test(inputVal.toString()) &&
      inputVal >= 0 &&
      inputVal <= stock
    ) {
      setTotalMedicine(inputVal);
      if (existingMedicine && inputVal === 0) {
        removeFromCart(existingMedicine);
        return;
      }
      if (existingMedicine) {
        updateQuantity(existingMedicine, inputVal);
        return;
      }
      if (inputVal > 0) {
        addToCart({
          MedicineInCart: { id, medicine_name, price, stock, image, noBPOM },
          totalMedicine: inputVal,
        });
        return;
      }
    } else {
      if (existingMedicine) removeFromCart(existingMedicine);
      setTotalMedicine(0);

      setIsInputExceeded(true); // Set status melebihi inputan
      setTimeout(() => {
        setIsInputExceeded(false); // Set status kembali normal setelah beberapa waktu
      }, 2000); // Ubah sesuai kebutuhan Anda
    }
  };

  useEffect(() => {
    if (cart.length < 1) {
      console.log('kereset ?');
      setTotalMedicine(0);
    }
  }, [cart]);

  return (
    <div className='flex flex-row justify-center items-center border-b border-b-gray-300 mb-3 w-full px-9 py-7 space-x-3'>
      <div className='w-[8%] h-14 overflow-hidden rounded-lg flex relative shadow-lg'>
        <Image
          src={image ? image : '/DEFAULT_MEDICINE_IMG.webp'}
          fill
          objectFit='contain'
          alt={medicine_name}
        />
      </div>

      <div className='flex flex-row justify-between items-center text-black w-[65%] xl:w-[72%]'>
        <div className='flex flex-col'>
          <h3 className='font-medium'>{medicine_name}</h3>
          <span
            className={`font-normal text-sm ${
              stock === 0 && `text-[#F03A3A]`
            } ${
              isInputExceeded
                ? 'text-[#F03A3A] font-semibold animate-pulse'
                : ''
            }`}
            style={{ animationDuration: '0.5s' }}
          >
            {stock === 0 ? `Stock Habis` : `Stock : ${stock}`}
          </span>
        </div>

        <div>
          <h2 className='text-xl font-medium'>
            {formatCurrency(parseInt(price))}
          </h2>
        </div>
      </div>

      <div className='flex flex-row w-[27%] xl:w-[20%] justify-center items-center space-x-5'>
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

        {/* <h5 className='font-medium text-lg'>{totalMedicine}</h5> */}
        <input
          type='text'
          className={`w-12 border border-gray-300 rounded-md text-center ${
            isInputExceeded ? 'text-[#F03A3A]' : ''
          }`}
          value={totalMedicine}
          onChange={handleInputChange}
        />

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
