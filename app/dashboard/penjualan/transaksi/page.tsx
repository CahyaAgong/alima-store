'use client';
import React, { useEffect, useState } from 'react';

import { getDataPenjualan } from '@/actions/firestore';
import {
  Button,
  CustomDatePicker,
  Modal,
  PdfContent,
  Tabs,
} from '@/components';
import MedicineInCart from '@/components/MedicineInCart';
import { showAlert } from '@/components/SweetAlert';
import { penjualanMenus } from '@/constant/menus';
import { SalesData } from '@/types';
import { formatCurrency } from '@/utils/helper';
import { format } from 'date-fns';

import { PDFViewer, pdf } from '@react-pdf/renderer';
import FileSaver from 'file-saver';

const TransaksiPenjualan = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [startSelectedDate, setStartSelectedDate] = useState<Date>(new Date());
  const [endSelectedDate, setEndSelectedDate] = useState<Date>(new Date());

  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [salesDetail, setSalesDetail] = useState<SalesData | null>(null);

  const handleStartDateChange = (date: Date) => {
    setStartSelectedDate(date);
  };

  const handleEndDateChange = (date: Date) => {
    setEndSelectedDate(date);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSalesDetail(null);
  };

  const handleDetailAction = (item: SalesData) => {
    setModalOpen(true);
    setSalesDetail(item);
  };

  const handlePrint = async (item: SalesData[]) => {
    const blob = await pdf(
      <PdfContent
        data={item}
        type='PNJ'
        startDate={startSelectedDate}
        endDate={endSelectedDate}
      />
    ).toBlob();
    const fileName = `Report Penjualan - ${format(
      startSelectedDate,
      'dd MMMM yyyy'
    )} - ${format(endSelectedDate, 'dd MMMM yyyy')}`;
    FileSaver.saveAs(blob, fileName);
  };

  useEffect(() => {
    if (startSelectedDate > endSelectedDate) {
      showAlert('Perhatian', 'Rentang tanggal salah!', 'error');
      setStartSelectedDate(new Date());
      setEndSelectedDate(new Date());
      return;
    }
    setIsLoading(true);
    const fetchData = async () => {
      const { result, error } = await getDataPenjualan(
        startSelectedDate,
        endSelectedDate
      );

      if (error) {
        setIsLoading(false);
        showAlert('Terjadi Kesalahan', error, 'error');
        return;
      }
      setSalesData(result.data);
      setIsLoading(false);
    };
    fetchData();
  }, [startSelectedDate, endSelectedDate]);

  return (
    <div className='flex flex-col items-center h-screen w-full relative'>
      <div className='mt-40 2xl:mt-44 w-full px-[100px] 2xl:px-[200px] pb-20'>
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
              <Button
                title={`Print`}
                containerStyles='px-3 py-1 rounded-lg bg-[#5C25E7] text-white'
                handleClick={() => handlePrint(salesData)}
              />
            </div>
          </div>
          <div className='bg-white min-h-[500px] h-[500px] max-h-[500px] overflow-hidden overflow-y-scroll rounded-lg mt-3 pb-10 shadow-md px-10 pt-6'>
            <table className='table-fixed w-full text-center mt-5'>
              <thead>
                <tr>
                  <th scope='col' className='px-6 py-3 w-auto'>
                    Tanggal
                  </th>
                  <th scope='col' className='px-6 py-3 w-auto'>
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

              <tbody className='font-normal'>
                {isLoading ? (
                  <tr>
                    <td colSpan={4}>Loading.....</td>
                  </tr>
                ) : salesData.length > 0 ? (
                  salesData.map(item => (
                    <tr key={item.uid}>
                      <td className='px-6 py-4'>
                        {format(item.tanggal.toDate(), 'dd MMMM yyyy')}
                      </td>
                      <td className='px-6 py-4'>{item.idOrder}</td>
                      <td className='px-6 py-4'>
                        {formatCurrency(item.totalPenjualan)}
                      </td>
                      <td className='px-6 py-4'>
                        <Button
                          title='Detail'
                          containerStyles='bg-[#5C25E7] rounded-lg text-white px-3 py-2 w-full lg:w-1/2 2xl:w-1/3'
                          handleClick={() => handleDetailAction(item)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4}>Tidak ada data..</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className='flex flex-col w-full relative px-8 py-6'>
          <div className='mb-8'>
            <h1 className='font-semibold text-black text-xl'>
              Detail Penjualan - {salesDetail?.idOrder ?? ''}
            </h1>
            <p>
              {format(
                salesDetail?.tanggal?.toDate() || new Date(),
                'dd MMMM yyyy'
              )}
            </p>
          </div>
          <div className='px-3 flex flex-col'>
            {salesDetail && salesDetail.obat && salesDetail.obat.length > 0 ? (
              salesDetail?.obat.map(item => (
                <div key={item.MedicineInCart.id}>
                  <MedicineInCart
                    MedicineInCart={item.MedicineInCart}
                    totalMedicine={item.totalMedicine}
                    isConfirmation
                  />
                </div>
              ))
            ) : (
              <p>tidak ada data!</p>
            )}
            <div className='flex flex-row justify-between border-t-2 border-[#D8CCF3] w-full pt-3'>
              <div className='flex flex-col'>
                <h3 className='font-semibold'>TOTAL</h3>
                <span>{salesDetail?.totalItems ?? 0} item</span>
              </div>

              <h3 className='font-semibold text-lg'>
                {formatCurrency(salesDetail?.totalPenjualan ?? 0)}
              </h3>
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
};

export default TransaksiPenjualan;
