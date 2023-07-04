'use client';

import { Button, CustomDatePicker, Modal, Tabs } from '@/components';
import { penjualanMenus } from '@/constant/menus';
import { useState } from 'react';

const TransaksiPenjualan = () => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [startSelectedDate, setStartSelectedDate] = useState<Date | null>(
    new Date()
  );
  const [endSelectedDate, setEndSelectedDate] = useState<Date | null>(
    new Date()
  );

  const handleStartDateChange = (date: Date | null) => {
    setStartSelectedDate(date);
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndSelectedDate(date);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div className='flex flex-col items-center bg-[#FAFAFA] h-screen w-full'>
      <div className='mt-44 max-w-screen-2xl w-full px-[100px]'>
        <div className='w-full flex flex-col'>
          <Tabs menus={penjualanMenus} />
          <div className='flex flex-col px-6 py-2 mt-5'>
            <h3 className='text-sm font-medium text-black mb-2'>
              Rentang Penjualan
            </h3>
            <div className='flex flex-row'>
              <CustomDatePicker
                selected={startSelectedDate}
                onChange={handleStartDateChange}
              />
              <CustomDatePicker
                selected={endSelectedDate}
                onChange={handleEndDateChange}
              />
            </div>
          </div>
          <div className='bg-white min-h-[500px] max-h-[600px] overflow-hidden overflow-y-scroll rounded-lg mt-3 pb-10 shadow-md p-6'>
            <table className='table-fixed w-full text-center mt-5'>
              <thead>
                <tr>
                  <th scope='col' className='px-6 py-3 w-auto'>
                    Tanggal
                  </th>
                  <th scope='col' className='px-6 py-3 w-1/2 text-left'>
                    ID Order
                  </th>
                  <th scope='col' className='px-6 py-3 w-auto'>
                    Total
                  </th>
                  <th scope='col' className='px-6 py-3 w-auto'>
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody className='font-semibold'>
                <tr>
                  <td className='px-6 py-4'>22 Juni 2023</td>
                  <td className='px-6 py-4 text-left'>Amoxicillin</td>
                  <td className='px-6 py-4'>6</td>
                  <td className='px-6 py-4'>
                    <Button
                      title='Detail'
                      containerStyles='bg-[#5C25E7] rounded-lg text-white px-3 py-2 w-full'
                      handleClick={() => setModalOpen(true)}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className='flex flex-col w-full relative px-8 py-6'>
          <div className='mb-5'>
            <h1 className='font-semibold text-black text-xl'>
              Detail Penjualan - OD0008
            </h1>
            <p>{Date()}</p>
          </div>
          <span
            className='absolute top-3 right-3 cursor-pointer'
            onClick={handleCloseModal}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='currentColor'
              className='w-6 h-6'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </span>
        </div>
      </Modal>
    </div>
  );
};

export default TransaksiPenjualan;
