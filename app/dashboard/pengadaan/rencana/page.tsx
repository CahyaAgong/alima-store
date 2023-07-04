'use client';

import { useState } from 'react';

import { Button, Modal, StatusFlag, Tabs } from '@/components';
import SearchBar from '@/components/SearchBar';
import { pengadaanMenus } from '@/constant/menus';

export default function RencanaPengadaan() {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div className='flex flex-col items-center bg-[#FAFAFA] h-screen w-full'>
      <div className='mt-44 max-w-screen-2xl w-full px-[100px]'>
        <div className='w-full flex flex-col'>
          <Tabs menus={pengadaanMenus} />
          <div className='bg-white min-h-[600px] max-h-[700px] overflow-hidden overflow-y-scroll rounded-lg mt-10 pb-10 shadow-md p-6'>
            <SearchBar inputStyles='rounded-md' searchIcon />

            <table className='table-fixed w-full text-center mt-10'>
              <thead>
                <tr>
                  <th scope='col' className='px-6 py-3 w-1/3 text-left'>
                    Nama Obat
                  </th>
                  <th scope='col' className='px-6 py-3 w-auto'>
                    Status
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
                  <td className='text-left px-6 py-4'>Obat 1</td>
                  <td className='px-6 py-4'>
                    <StatusFlag
                      title='Tersedia'
                      containerStyles='bg-[#47C3A6] px-3 py-2 text-white text-center rounded-full'
                    />
                  </td>
                  <td>
                    <span>3</span>
                  </td>
                  <td>
                    <Button
                      title='Pesan'
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
          <h2 className='text-xl font-bold'>Pesan</h2>
          <p className='mb-3 text-sm'>
            Masukkan jumlah pengadaan obat yang dibutuhkan
          </p>
          <div className='flex flex-row space-x-3'>
            <input
              type='number'
              className='w-[80%] px-3 py-2 rounded-lg outline-none border border-[#5C25E7] font-medium text-[#5C25E7] placeholder-[#5C25E7] text-sm'
              placeholder='Jumlah Pesanan'
            />
            <Button
              title='SIMPAN'
              containerStyles='bg-[#5C25E7] rounded-lg text-white px-3 py-2'
            />
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
