'use client';

import { useEffect, useState } from 'react';

import { CustomDatePicker } from '@/components';
import { DashboardData, ProcurementData, SalesData } from '@/types';
import {
  getConfirmedProcurements,
  getDashboardData,
  getDataPenjualan,
} from '@/actions/firestore';
import { showAlert } from '@/components/SweetAlert';
import { formatCurrency } from '@/utils/helper';
import { format } from 'date-fns';

export default function Dashboard() {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [procurementData, setProcurementData] = useState<ProcurementData[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isFetchingProcurement, setIsFetchingProcurement] =
    useState<boolean>(false);

  const [startSelectedDate, setStartSelectedDate] = useState<Date>(new Date());
  const [endSelectedDate, setEndSelectedDate] = useState<Date>(new Date());
  const [summaryData, setSummaryData] = useState<DashboardData>({
    totalRevenue: 0,
    totalTransactions: 0,
    totalItemsSold: 0,
  });

  const handleStartDateChange = (date: Date) => {
    setStartSelectedDate(date);
  };

  const handleEndDateChange = (date: Date) => {
    setEndSelectedDate(date);
  };

  const summarySalesData = async () => {
    const { totalRevenue, totalTransactions, totalItemsSold } =
      await getDashboardData(startSelectedDate, endSelectedDate);
    setSummaryData({
      totalRevenue,
      totalTransactions,
      totalItemsSold,
    });
  };

  const fetchDataSales = async () => {
    setIsFetching(true);
    const { result, error } = await getDataPenjualan(
      startSelectedDate,
      endSelectedDate
    );

    if (error) {
      setIsFetching(false);
      showAlert('Terjadi Kesalahan', error, 'error');
      return;
    }
    setSalesData(result.data);
    setIsFetching(false);
  };

  const fetchDataProcurement = async () => {
    setIsFetchingProcurement(true);
    const result = await getConfirmedProcurements(
      startSelectedDate,
      endSelectedDate
    );
    const { code, message, status, data } = result;
    if (code === 500) {
      showAlert(status, message, 'error');
      setIsFetchingProcurement(false);
      return;
    }
    setProcurementData(data);
    setIsFetchingProcurement(false);
  };

  useEffect(() => {
    if (startSelectedDate > endSelectedDate) {
      showAlert('Perhatian', 'Rentang tanggal salah!', 'error');
      setStartSelectedDate(new Date());
      setEndSelectedDate(new Date());
      return;
    }
    summarySalesData();
    fetchDataSales();
    fetchDataProcurement();
  }, [startSelectedDate, endSelectedDate]);

  return (
    <div className='flex flex-col items-center w-full h-screen'>
      <div className='mt-40 2xl:mt-44 px-[50px] 2xl:px-[100px] pb-20 w-full max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl'>
        <div className='flex flex-col lg:flex-row items-center justify-between mb-5'>
          <h1 className='text-4xl font-bold'>Ringkasan</h1>
          <div className='flex flex-col'>
            <h4 className='text-black font-normal text-sm mb-1'>
              Rentang Waktu
            </h4>
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
        </div>

        <div className='flex flex-row justify-center items-center space-x-10 2xl:space-x-24 px-3 py-4 bg-white rounded-lg text-[#5C25E7] border border-[#F0653A]'>
          <div>
            <h2 className='text-sm mb-2'>Total Pendapatan</h2>
            <div className='flex flex-row items-center space-x-1 lg:space-x-3'>
              <span className='bg-[#F0653A] p-2 w-fit h-fit rounded-lg'>
                <svg
                  className='w-4 lg:w-6 h-4 lg:h-6'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M20 5C20.5523 5 21 4.55228 21 4C21 3.44772 20.5523 3 20 3V5ZM5.50001 5L20 5V3L5.50001 3L5.50001 5ZM5.50001 10H13.5V8L5.50001 8V10ZM4.00001 6.5C4.00001 5.67157 4.67158 5 5.50001 5L5.50001 3C3.56701 3 2.00001 4.567 2.00001 6.5L4.00001 6.5ZM2.00001 6.5C2.00001 8.433 3.56701 10 5.50001 10V8C4.67158 8 4.00001 7.32843 4.00001 6.5L2.00001 6.5Z'
                    fill='#FDFDFD'
                  />
                  <path d='M3 12L3 6.5' stroke='#FDFDFD' strokeWidth='2' />
                  <path
                    d='M21.5 18V17.5H21H18C16.6193 17.5 15.5 16.3807 15.5 15C15.5 13.6193 16.6193 12.5 18 12.5H21H21.5V12V11L21.5 10.9671C21.5 10.5238 21.5 10.1419 21.4589 9.8361C21.4149 9.50835 21.3155 9.19417 21.0607 8.93934C20.8058 8.68451 20.4917 8.58514 20.1639 8.54107C19.8581 8.49995 19.4762 8.49997 19.0329 8.5L19 8.5L3 8.5H2.5V9L2.5 19V19.0329C2.49998 19.4762 2.49995 19.8581 2.54107 20.1639C2.58514 20.4917 2.68451 20.8058 2.93934 21.0607L2.93934 21.0607C3.19417 21.3155 3.50835 21.4149 3.83611 21.4589C4.14193 21.5 4.52384 21.5 4.96708 21.5L5 21.5L19 21.5C19.011 21.5 19.022 21.5 19.0329 21.5C19.4762 21.5 19.8581 21.5 20.1639 21.4589C20.4917 21.4149 20.8058 21.3155 21.0607 21.0607C21.3155 20.8058 21.4149 20.4917 21.4589 20.1639C21.5 19.8581 21.5 19.4762 21.5 19.0329C21.5 19.022 21.5 19.011 21.5 19V18Z'
                    fill='#FDFDFD'
                    stroke='#FDFDFD'
                  />
                </svg>
              </span>
              <h3 className='text-xl lg:text-2xl xl:text-4xl font-bold'>
                {formatCurrency(summaryData.totalRevenue)}
              </h3>
            </div>
          </div>

          <hr className='w-[1px] h-20 bg-[#F0653A]' />

          <div>
            <h2 className='text-sm mb-2'>Total Transaksi</h2>
            <div className='flex flex-row items-center space-x-3'>
              <span className='bg-[#F0653A] p-2 w-fit h-fit rounded-lg'>
                <svg
                  className='w-4 lg:w-6 h-4 lg:h-6'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M2 21V7C2 5.11438 2 4.17157 2.58579 3.58579C3.17157 3 4.11438 3 6 3H16C16.8317 3 17.4778 3 18.0037 3.02706C15.7519 3.2741 14 5.18245 14 7.5V11.0002L13.9012 20.9671L11 20L8 21L5 20L2 21ZM21 11L16 11V7.5C16 6.11929 17.1193 5 18.5 5C19.8807 5 21 6.11929 21 7.5V11ZM4 7C4 6.44772 4.44772 6 5 6H11C11.5523 6 12 6.44772 12 7C12 7.55228 11.5523 8 11 8H5C4.44772 8 4 7.55228 4 7ZM4 11C4 10.4477 4.44772 10 5 10H7C7.55228 10 8 10.4477 8 11C8 11.5523 7.55228 12 7 12H5C4.44772 12 4 11.5523 4 11ZM4 15C4 14.4477 4.44772 14 5 14H9C9.55228 14 10 14.4477 10 15C10 15.5523 9.55228 16 9 16H5C4.44772 16 4 15.5523 4 15Z'
                    fill='#FDFDFD'
                  />
                </svg>
              </span>
              <h3 className='text-xl lg:text-2xl xl:text-4xl font-bold'>
                {summaryData.totalTransactions} Pembelian
              </h3>
            </div>
          </div>

          <hr className='w-[1px] h-20 bg-[#F0653A]' />

          <div>
            <h2 className='text-sm mb-2'>Total Barang Terjual</h2>
            <div className='flex flex-row items-center space-x-3'>
              <span className='bg-[#F0653A] p-2 w-fit h-fit rounded-lg'>
                <svg
                  className='w-4 lg:w-6 h-4 lg:h-6'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M8 5L6 9M16 5L18 9'
                    stroke='#FDFDFD'
                    strokeWidth='2'
                    strokeLinecap='round'
                  />
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M21 10H19.8022C19.3335 10 18.9277 10.3255 18.826 10.7831L17.348 17.4339C17.1447 18.3489 16.3331 19 15.3957 19H8.60434C7.66695 19 6.85532 18.3489 6.65197 17.4339L5.17402 10.7831C5.07234 10.3255 4.66653 10 4.19783 10H3C2.44772 10 2 9.55228 2 9C2 8.44772 2.44772 8 3 8H21C21.5523 8 22 8.44772 22 9C22 9.55228 21.5523 10 21 10ZM11 12C11 11.4477 10.5523 11 10 11C9.44772 11 9 11.4477 9 12V15C9 15.5523 9.44772 16 10 16C10.5523 16 11 15.5523 11 15V12ZM15 12C15 11.4477 14.5523 11 14 11C13.4477 11 13 11.4477 13 12V15C13 15.5523 13.4477 16 14 16C14.5523 16 15 15.5523 15 15V12Z'
                    fill='#FDFDFD'
                  />
                </svg>
              </span>
              <h3 className='text-xl lg:text-2xl xl:text-4xl font-bold'>
                {summaryData.totalItemsSold} Obat
              </h3>
            </div>
          </div>
        </div>

        <div className='flex flex-row justify-center items-center px-1 lg:px-5 xl:px-10 py-8 space-x-4 min-h-[500px] h-[500px] max-h-[500px] overflow-hidden bg-white rounded-lg text-black border border-[#F0653A] mt-5'>
          <div className='flex flex-col w-1/2 h-full overflow-y-auto'>
            <h3 className='text-xl font-semibold text-center'>PENJUALAN</h3>
            <table className='table-fixed w-full border-separate border-spacing-2 lg:border-spacing-5 text-base lg:text-xl'>
              <thead className='text-xl font-semibold'>
                <tr>
                  <th>Tanggal</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody className='text-center font-normal'>
                {isFetching ? (
                  <tr>
                    <td colSpan={2}> Loading .... </td>
                  </tr>
                ) : salesData.length > 0 ? (
                  salesData.map(item => (
                    <tr key={item.uid}>
                      <td>{format(item.tanggal.toDate(), 'dd MMMM yyyy')}</td>
                      <td>{formatCurrency(item.totalPenjualan)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2}>Tidak ada data..</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <hr className='w-[1px] h-full bg-[#F0653A]' />

          <div className='flex flex-col w-1/2 h-full overflow-y-auto'>
            <h3 className='text-xl font-semibold text-center'>PENGADAAN</h3>
            <table className='table-fixed w-full border-separate border-spacing-2 lg:border-spacing-5 text-base lg:text-xl'>
              <thead className='text-xl font-semibold'>
                <tr>
                  <th>Tanggal</th>
                  <th>Nama</th>
                  <th>Qty</th>
                </tr>
              </thead>
              <tbody className='text-center font-normal'>
                {isFetchingProcurement ? (
                  <tr>
                    <td colSpan={3}>Loading....</td>
                  </tr>
                ) : procurementData.length > 0 ? (
                  procurementData.map(item => (
                    <tr key={item.uid}>
                      <td>
                        {format(item.procurementDate.toDate(), 'dd MMMM yyyy')}
                      </td>
                      <td>{item.medicine.medicine_name}</td>
                      <td>{item.Qty}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3}>Tidak ada data..</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
