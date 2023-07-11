'use client';

import { useEffect, useState } from 'react';

import {
  Button,
  CustomDatePicker,
  Modal,
  PdfContent,
  Tabs,
} from '@/components';
import { pengadaanMenus } from '@/constant/menus';
import {
  getConfirmedProcurements,
  subscribeToCollectionChanges,
  unsubscribeFromCollectionChanges,
  updateProcurementData,
} from '@/actions/firestore';
import { showAlert } from '@/components/SweetAlert';
import { ProcurementData } from '@/types';
import { format } from 'date-fns';
import { PDFViewer, pdf } from '@react-pdf/renderer';
import FileSaver from 'file-saver';

export default function TransaksiPengadaan() {
  const [isFetching, setFetching] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isProceedData, setProceedData] = useState<boolean>(false);
  const [procurementData, setProcurementData] = useState<ProcurementData[]>([]);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [startSelectedDate, setStartSelectedDate] = useState<Date>(new Date());
  const [endSelectedDate, setEndSelectedDate] = useState<Date>(new Date());
  const [procurementId, setProcurementId] = useState<string>('');
  const [showPDFViewer, setShowPDFViewer] = useState(false);
  const [formSubmit, setFormSubmit] = useState<{
    date: Date;
    medicine_id: string;
    medicine_name: string;
    qty: string;
    oldStock: string;
  }>({
    date: new Date(),
    medicine_id: '',
    medicine_name: '',
    qty: '0',
    oldStock: '0',
  });

  const handleStartDateChange = (date: Date) => {
    setStartSelectedDate(date);
  };

  const handleEndDateChange = (date: Date) => {
    setEndSelectedDate(date);
  };

  const handleCloseModal = () => {
    setFormSubmit({
      date: new Date(),
      medicine_id: '',
      medicine_name: '',
      qty: '0',
      oldStock: '0',
    });
    setModalOpen(false);
  };

  const handleOpenModal = (item: ProcurementData) => {
    if (item) {
      setProcurementId(item.uid);
      setFormSubmit({
        date: item.procurementDate.toDate(),
        medicine_id: item.medicine.id,
        medicine_name: item.medicine.medicine_name,
        qty: item.Qty.toString(),
        oldStock: item.oldStock,
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const { medicine_id, medicine_name, qty, oldStock } = formSubmit;
    if (medicine_name === '' || qty === '0' || qty === '') return;
    setLoading(true);
    setProceedData(true);
    const result = await updateProcurementData(
      procurementId,
      medicine_id,
      medicine_name,
      parseInt(qty),
      parseInt(oldStock)
    );
    const { code, message, status } = result;
    if (code === 500) {
      showAlert(status, message, 'error');
      setLoading(false);
      return;
    }
    showAlert(status, message, 'success');
    setLoading(false);
    handleCloseModal();
  };

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormSubmit(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handlePrint = async (item: ProcurementData[]) => {
    // const blob = await pdf(
    //   <PdfContent
    //     data={item}
    //     type='PNGDN'
    //     startDate={startSelectedDate}
    //     endDate={endSelectedDate}
    //   />
    // ).toBlob();
    // const fileName = `Report Pengadaan - ${format(
    //   startSelectedDate,
    //   'dd MMMM yyyy'
    // )} - ${format(endSelectedDate, 'dd MMMM yyyy')}`;
    // FileSaver.saveAs(blob, fileName);
    handleButtonClick();
  };

  const handleButtonClick = () => {
    setShowPDFViewer(true);
  };

  const handleOutsideClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if ((event.target as HTMLDivElement).classList.contains('outside-click')) {
      setShowPDFViewer(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setFetching(true);
      const result = await getConfirmedProcurements(
        startSelectedDate,
        endSelectedDate
      );
      const { code, message, status, data } = result;
      if (code === 500) {
        showAlert(status, message, 'error');
        setFetching(false);
        return;
      }
      setProcurementData(data);
      setFetching(false);
      if (isProceedData) {
        const unsubscribe = subscribeToCollectionChanges(
          'pengadaan',
          (updatedMedicines: ProcurementData[]) => {
            if (!isFetching) setProcurementData(updatedMedicines);
          }
        );
        setProceedData(false);
        return () => {
          unsubscribeFromCollectionChanges(unsubscribe);
        };
      }
    };
    if (startSelectedDate > endSelectedDate) {
      showAlert('Perhatian', 'Rentang tanggal salah!', 'error');
      setStartSelectedDate(new Date());
      setEndSelectedDate(new Date());
      return;
    }
    fetchData();
  }, [startSelectedDate, endSelectedDate]);

  return (
    <div className='flex flex-col items-center bg-[#FAFAFA] h-screen w-full'>
      <div className='mt-40 2xl:mt-44 px-[20px] lg:px-[40px] xl:px-[100px] 2xl:px-[200px] w-full pb-20'>
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
              <Button
                title={`Print`}
                containerStyles='px-3 py-1 rounded-lg bg-[#5C25E7] text-white'
                handleClick={() => handlePrint(procurementData)}
              />
            </div>
          </div>
          <div className='bg-white min-h-[500px] h-[500px] max-h-[500px] overflow-hidden overflow-y-scroll rounded-lg mt-3 pb-10 px-10 shadow-md p-6'>
            <table className='table-fixed w-full text-center mt-5'>
              <thead>
                <tr>
                  <th scope='col' className='px-6 py-3 w-auto'>
                    Tanggal
                  </th>
                  <th scope='col' className='px-6 py-3 w-auto'>
                    Nama Obat
                  </th>
                  <th scope='col' className='px-6 py-3 w-auto'>
                    Qty
                  </th>
                  <th scope='col' className='px-6 py-3 w-auto'>
                    Stock
                  </th>
                  <th scope='col' className='px-6 py-3 w-1/4 hidden'>
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody className='font-semibold'>
                {isFetching ? (
                  <tr className='pt-10'>
                    <td colSpan={5}>Loading...</td>
                  </tr>
                ) : procurementData.length > 0 ? (
                  procurementData.map(item => (
                    <tr key={item.uid}>
                      <td className='px-6 py-4'>
                        {format(item.procurementDate.toDate(), 'dd MMMM yyyy')}
                      </td>
                      <td className='px-6 py-4'>
                        {item.medicine.medicine_name}
                      </td>
                      <td className='px-6 py-4'>{item.Qty}</td>
                      <td className='px-6 py-4'>
                        {item.Qty + parseInt(item.oldStock)}
                      </td>
                      <td className='px-6 py-4 hidden'>
                        <Button
                          title='Edit'
                          containerStyles='bg-[#F0653A] rounded-lg text-white px-3 py-2 w-full'
                          handleClick={() => handleOpenModal(item)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className='pt-10'>
                    <td colSpan={5}>Data Kosong...</td>
                  </tr>
                )}
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
                  name='date'
                  type='text'
                  readOnly
                  disabled
                  value={format(formSubmit.date, 'dd-MM-yyyy')}
                  onChange={handleFormChange}
                  className='px-3 py-2 border border-gray-300 rounded-lg w-full text-sm'
                />
              </div>
            </div>

            <div className='flex flex-row mt-3 w-full space-x-3'>
              <div className='flex flex-col w-1/2'>
                <label
                  htmlFor='medicine_name'
                  className='font-semibold text-black'
                >
                  Nama Obat
                </label>
                <div className='relative mt-2'>
                  <input
                    name='medicine_name'
                    type='text'
                    className='px-3 py-2 border border-[#5C25E7] rounded-lg w-full outline-none text-[#5C25E7] text-sm placeholder-[#5C25E7]'
                    placeholder='Nama Obat'
                    onChange={handleFormChange}
                    value={formSubmit.medicine_name}
                  />
                </div>
              </div>
              <div className='flex flex-col w-1/2'>
                <label htmlFor='qty' className='font-semibold text-black'>
                  Quantity
                </label>
                <div className='relative mt-2'>
                  <input
                    name='qty'
                    type='number'
                    className='px-3 py-2 border border-[#5C25E7] rounded-lg w-full outline-none text-[#5C25E7] text-sm placeholder-[#5C25E7]'
                    placeholder='Qty'
                    onChange={handleFormChange}
                    value={formSubmit.qty}
                  />
                </div>
              </div>
            </div>

            <div className='w-full flex mt-6 justify-end'>
              <Button
                title={isLoading ? 'Loading...' : 'SIMPAN'}
                isDisabled={isLoading}
                containerStyles='px-3 py-2 bg-[#5C25E7] text-white text-sm rounded-lg'
                handleClick={handleSubmit}
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

      {showPDFViewer && !isLoading && (
        <div
          className='outside-click w-full absolute z-50 top-20 left-1/4'
          onClick={e => handleOutsideClick(e)}
        >
          <PDFViewer width='1000' height='800'>
            <PdfContent
              data={procurementData}
              type='PNGDN'
              startDate={startSelectedDate}
              endDate={endSelectedDate}
            />
          </PDFViewer>
        </div>
      )}
    </div>
  );
}
