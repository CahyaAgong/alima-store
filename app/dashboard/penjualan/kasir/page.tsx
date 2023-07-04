'use client';

import { getMedicines } from '@/actions/firestore';
import { Button, Modal, SearchBar, Tabs } from '@/components';
import { Medicine as MedicineCard } from '@/components';
import MedicineInCart from '@/components/MedicineInCart';
import { showAlert } from '@/components/SweetAlert';
import { penjualanMenus } from '@/constant/menus';
import { useCart } from '@/context/CartContext';
import { Medicine } from '@/types';
import { formatCurrency } from '@/utils/helper';
import { useEffect, useState } from 'react';

const Kasir = () => {
  const { cart } = useCart();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [totalPriceCart, setTotalPriceCart] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const handleClose = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    const totalPrice = cart.reduce((total, item) => {
      const itemPrice = parseFloat(item.MedicineInCart.price);
      const itemQuantity = item.totalMedicine;
      return total + itemPrice * itemQuantity;
    }, 0);
    setTotalPriceCart(totalPrice);

    const totalItems = cart.reduce(
      (total, item) => total + item.totalMedicine,
      0
    );

    setTotalItems(totalItems);
    // Lakukan tindakan yang sesuai dengan total harga baru, misalnya penyimpanan ke state atau pengiriman ke komponen lain.
    // Misalnya: setTotalPrice(totalPrice);
  }, [cart]);

  useEffect(() => {
    const fetchData = async () => {
      const { result, error } = await getMedicines('obat');
      if (error) {
        showAlert('error', error, 'error');
        return;
      }
      setMedicines(result);
    };

    fetchData();
  }, []);

  return (
    <div className='flex flex-col items-center bg-[#FAFAFA] h-screen w-full'>
      <div className='mt-44 max-w-screen-2xl w-full px-[100px]'>
        <div className='w-full flex flex-col'>
          <Tabs menus={penjualanMenus} />
          <div className='flex flex-row min-h-[500px] max-h-[600px] space-x-5'>
            <div className='flex-grow bg-white overflow-hidden overflow-y-scroll rounded-lg mt-3 shadow-md p-6 w-3/4'>
              <SearchBar searchIcon />
              {medicines.length > 0
                ? medicines.map(item => (
                    <div key={item.medicine_name}>
                      <MedicineCard
                        id={item.id}
                        medicine_name={item.medicine_name}
                        price={item.price}
                        stock={item.stock}
                        image={item.image}
                      />
                    </div>
                  ))
                : ''}
            </div>

            <div className='flex-grow flex flex-col bg-white overflow-hidden overflow-y-scroll rounded-lg mt-3 shadow-md p-5 w-1/4'>
              <h2 className='text-4xl font-semibold mb-8'>Pesanan</h2>
              {cart.length > 0 ? (
                cart.map(item => (
                  <div key={item.MedicineInCart.medicine_name}>
                    <MedicineInCart
                      MedicineInCart={item.MedicineInCart}
                      totalMedicine={item.totalMedicine}
                    />
                  </div>
                ))
              ) : (
                <div>
                  <h2 className='font-normal text-black text-sm'>
                    Tidak ada pesanan
                  </h2>
                </div>
              )}

              {cart.length > 0 && (
                <>
                  <div className='flex flex-row justify-between border-t-2 border-[#D8CCF3] w-full pt-3'>
                    <div className='flex flex-col'>
                      <h3 className='font-semibold'>TOTAL</h3>
                      <span>{totalItems} item</span>
                    </div>

                    <h3 className='font-semibold text-lg'>
                      {formatCurrency(totalPriceCart)}
                    </h3>
                  </div>

                  <Button
                    title='BAYAR'
                    containerStyles='px-3 py-2 bg-[#5C25E7] text-white rounded-lg mt-2 self-end'
                    handleClick={() => setModalOpen(true)}
                  />
                </>
              )}
            </div>
          </div>
        </div>
        <Modal isOpen={isModalOpen} onClose={handleClose}>
          <div className='flex flex-col relative px-5 py-4'>
            <div className='mb-5'>
              <h1 className='font-semibold text-black text-xl'>
                Detail Penjualan - OD0008
              </h1>
              <p>{Date()}</p>
            </div>

            <div className='px-3 flex flex-col'>
              {cart.map(item => (
                <div key={item.MedicineInCart.medicine_name}>
                  <MedicineInCart
                    MedicineInCart={item.MedicineInCart}
                    totalMedicine={item.totalMedicine}
                    isConfirmation
                  />
                </div>
              ))}
              <div className='flex flex-row justify-between border-t-2 border-[#D8CCF3] w-full pt-3'>
                <div className='flex flex-col'>
                  <h3 className='font-semibold'>TOTAL</h3>
                  <span>{totalItems} item</span>
                </div>

                <h3 className='font-semibold text-lg'>
                  {formatCurrency(totalPriceCart)}
                </h3>
              </div>

              <div className='w-full flex flex-row items-center space-x-2 px-3 py-1 rounded-lg my-3 bg-[#EBAFAF]'>
                <span>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='#F03A3A'
                    className='w-6 h-6'
                  >
                    <path
                      fillRule='evenodd'
                      d='M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z'
                      clipRule='evenodd'
                    />
                  </svg>
                </span>
                <p className='font-semibold text-black text-xs'>
                  Pastikan kembali rincian pembelian sudah benar
                </p>
              </div>

              <Button
                title='BAYAR'
                containerStyles='px-3 py-2 bg-[#5C25E7] text-white rounded-lg mt-2 self-end mb-5'
                handleClick={() =>
                  showAlert('Sukses', 'Pembelian berhasil disimpan', 'success')
                }
              />
            </div>

            <span
              className='absolute right-3 top-3 cursor-pointer'
              onClick={handleClose}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='currentColor'
                className='w-6 h-6'
              >
                <path
                  fillRule='evenodd'
                  d='M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z'
                  clipRule='evenodd'
                />
              </svg>
            </span>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Kasir;