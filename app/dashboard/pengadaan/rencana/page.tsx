'use client';

import { ChangeEvent, useEffect, useState } from 'react';

import { Button, Modal, StatusFlag, Tabs } from '@/components';
import SearchBar from '@/components/SearchBar';
import { pengadaanMenus } from '@/constant/menus';
import { Medicine } from '@/types';
import { showAlert } from '@/components/SweetAlert';
import {
  createPengadaan,
  getMedicines,
  getProcurementByMedicineId,
  subscribeToCollectionChanges,
  unsubscribeFromCollectionChanges,
  updateMedicine,
  updateProcurementStatus,
} from '@/actions/firestore';

export default function RencanaPengadaan() {
  const initialMedicine: Medicine = {
    id: '',
    medicine_name: '',
    price: '',
    stock: 0,
    image: '',
    noBPOM: '',
  };

  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isProceedData, setProceedData] = useState<boolean>(false);
  const [isFetching, setFecthing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [medicineItem, setMedicineItem] = useState<Medicine>(initialMedicine);
  const [Qty, setQty] = useState<string>('0');
  const [loadProcurement, setLoadProcurement] = useState<string>('');

  const handleCloseModal = () => {
    setModalOpen(false);
    setMedicineItem(initialMedicine);
    setQty('0');
  };

  const handleInputchange = (
    event: ChangeEvent<HTMLInputElement>,
    isSearch: boolean = true
  ) => {
    if (isSearch) {
      setSearchQuery(event.target.value);
    } else {
      setQty(event.target.value);
    }
  };

  const openModalProcurement = async (item: Medicine) => {
    setMedicineItem(item);
    if (item.isExistInProcurement) {
      setLoadProcurement(item.id);
      const procurementData = await getProcurementByMedicineId(item.id);
      if (procurementData) {
        setQty(procurementData.Qty.toString());
        setLoadProcurement('');
      }
    }
    setModalOpen(true);
  };

  const handleAddProcurement = async () => {
    const { result, error } = await createPengadaan(
      medicineItem,
      parseInt(Qty)
    );
    if (error) {
      showAlert('Error', error, 'error');
      setLoading(false);
      return;
    }
    showAlert('Sukses', result.message, 'success');
  };

  const handleUpdateProcurement = async () => {
    if (medicineItem) {
      const procurementData = await getProcurementByMedicineId(medicineItem.id);
      if (procurementData) {
        const { result, error } = await updateProcurementStatus(
          procurementData.uid
        );
        if (error) {
          showAlert('Error', error, 'error');
          return;
        }
        showAlert(result.status, result.message, 'success');
      }
    }
  };

  const handleSubmitProcurement = async () => {
    if (Qty === '0' || Qty === '') {
      showAlert('Perhatian', 'Isi form dengan benar', 'warning');
      return;
    }
    setLoading(true);
    setProceedData(true);

    if (medicineItem.isExistInProcurement) {
      await handleUpdateProcurement();
    } else {
      await handleAddProcurement();
    }
    setLoading(false);
    handleCloseModal();
  };

  useEffect(() => {
    setFecthing(true);
    const fetchData = async () => {
      const { result, error } = await getMedicines('obat');
      if (error) {
        showAlert('error', error, 'error');
        setFecthing(false);
        return;
      }
      setMedicines(result);
      setFecthing(false);

      if (isProceedData) {
        const unsubscribe = subscribeToCollectionChanges(
          'obat',
          (updatedMedicines: Medicine[]) => {
            if (!isFetching) setMedicines(updatedMedicines);
          }
        );
        setProceedData(false);
        return () => {
          unsubscribeFromCollectionChanges(unsubscribe);
        };
      }
    };
    fetchData();
  }, [isProceedData]);

  const filteredMedicines = searchQuery
    ? medicines.filter(medicine =>
        medicine.medicine_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : medicines;

  return (
    <div className='flex flex-col items-center bg-[#FAFAFA] h-screen w-full'>
      <div className='mt-40 2xl:mt-44 px-[20px] lg:px-[40px] xl:px-[100px] w-full pb-20'>
        <div className='w-full flex flex-col'>
          <Tabs menus={pengadaanMenus} />
          <div className='bg-white min-h-[500px] h-[500px] max-h-[500px] overflow-hidden overflow-y-scroll rounded-lg mt-10 pb-10 shadow-md p-6'>
            <SearchBar
              inputStyles='rounded-md'
              searchIcon
              handleChange={e => handleInputchange(e)}
              placeholder='Cari Nama Obat...'
            />

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
                {isFetching ? (
                  <tr>
                    <td colSpan={5}>Loading...</td>
                  </tr>
                ) : filteredMedicines.length > 0 ? (
                  filteredMedicines.map(item => {
                    return (
                      <tr key={item.id}>
                        <td className='text-left px-6 py-4'>
                          {item?.medicine_name ?? ''}
                        </td>
                        <td className='px-6 py-4'>
                          <StatusFlag
                            title={
                              item && item.availableStatus
                                ? item.availableStatus
                                : ''
                            }
                            containerStyles='px-1 py-1 lg:px-3 lg:py-2 text-center rounded-full text-xs lg:text-base'
                          />
                        </td>
                        <td>
                          <span>{item?.stock ?? 0}</span>
                        </td>
                        <td>
                          <Button
                            title={
                              item.isExistInProcurement
                                ? loadProcurement === item.id
                                  ? 'Loading..'
                                  : 'Konfirmasi'
                                : 'Pesan'
                            }
                            isDisabled={
                              loadProcurement === item.id ? true : false
                            }
                            containerStyles={`rounded-lg text-white font-normal px-1 py-1 lg:px-3 lg:py-2 w-full lg:w-1/2 ${
                              item.isExistInProcurement
                                ? 'bg-[#5C25E7]'
                                : 'bg-[#F0653A]'
                            }`}
                            handleClick={() => openModalProcurement(item)}
                          />
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5}>Tidak ada data!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className='flex flex-col w-full relative px-8 py-6'>
          <h2 className='text-xl font-bold'>
            {medicineItem.isExistInProcurement
              ? 'Konfirmasi Pengadaan'
              : 'Pesan'}
          </h2>
          <p className='mb-3 text-sm'>
            {medicineItem.isExistInProcurement
              ? 'Jumlah obat yang datang adalah sebanyak'
              : 'Masukkan jumlah pengadaan obat yang dibutuhkan'}
          </p>
          <div className='flex flex-row space-x-3'>
            <input
              type='number'
              className='w-[80%] px-3 py-2 rounded-lg outline-none border border-[#5C25E7] font-medium text-[#5C25E7] placeholder-[#5C25E7] text-sm'
              placeholder='Jumlah Pesanan'
              value={Qty}
              onChange={e => handleInputchange(e, false)}
            />
            <Button
              btnType='button'
              isDisabled={loading}
              title={loading ? 'Loading...' : 'SIMPAN'}
              containerStyles='bg-[#5C25E7] rounded-lg text-white px-3 py-2'
              handleClick={handleSubmitProcurement}
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
