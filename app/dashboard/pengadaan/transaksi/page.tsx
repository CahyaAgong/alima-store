'use client';

import { useState } from 'react';

import { Button, CustomDatePicker, Modal, Tabs } from '@/components';
import { pengadaanMenus } from '@/constant/menus';

export default function TransaksiPengadaan() {
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
          <Tabs menus={pengadaanMenus} />
          <div className='flex flex-col px-6 py-2 mt-5'>
            <h3 className='text-sm font-medium text-black mb-2'>
              Rentang Pengadaan
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
            <table className='table-fixed w-full text-center mt-10'>
              <thead>
                <tr>
                  <th scope='col' className='px-6 py-3 w-auto'>
                    Tanggal
                  </th>
                  <th scope='col' className='px-6 py-3 w-1/4 text-left'>
                    Nama Obat
                  </th>
                  <th scope='col' className='px-6 py-3 w-auto'>
                    Qty
                  </th>
                  <th scope='col' className='px-6 py-3 w-auto'>
                    Stock
                  </th>
                  <th scope='col' className='px-6 py-3 w-1/4'>
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody className='font-semibold'>
                <tr>
                  <td className='px-6 py-4'>22 Juni 2023</td>
                  <td className='px-6 py-4 text-left'>Amoxicillin</td>
                  <td className='px-6 py-4'>6</td>
                  <td className='px-6 py-4'>12</td>
                  <td className='px-6 py-4'>
                    <Button
                      title='Edit'
                      containerStyles='bg-[#F0653A] rounded-lg text-white px-3 py-2 w-full'
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
          <h2 className='text-xl font-bold'>Edit Transaksi Pengadaan</h2>
          <div className='flex flex-col'>
            <div className='mt-3 w-1/2'>
              <label htmlFor='' className='font-semibold text-black'>
                Tanggal
              </label>
              <div className='relative mt-2'>
                <input
                  type='text'
                  readOnly
                  disabled
                  value={`22/03/2019`}
                  className='px-3 py-2 border border-gray-300 rounded-lg w-full text-sm'
                />
              </div>
            </div>

            <div className='flex flex-row mt-3 w-full space-x-3'>
              <div className='flex flex-col w-1/2'>
                <label htmlFor='' className='font-semibold text-black'>
                  Nama Obat
                </label>
                <div className='relative mt-2'>
                  <input
                    type='text'
                    className='px-3 py-2 border border-[#5C25E7] rounded-lg w-full outline-none text-[#5C25E7] text-sm placeholder-[#5C25E7]'
                    placeholder='Nama Obat'
                  />
                </div>
              </div>
              <div className='flex flex-col w-1/2'>
                <label htmlFor='' className='font-semibold text-black'>
                  Quantity
                </label>
                <div className='relative mt-2'>
                  <input
                    type='number'
                    className='px-3 py-2 border border-[#5C25E7] rounded-lg w-full outline-none text-[#5C25E7] text-sm placeholder-[#5C25E7]'
                    placeholder='Qty'
                  />
                </div>
              </div>
            </div>

            <div className='w-full flex mt-6 justify-end'>
              <Button
                title='SIMPAN'
                containerStyles='px-3 py-2 bg-[#5C25E7] text-white text-sm rounded-lg'
              />
            </div>
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
}
