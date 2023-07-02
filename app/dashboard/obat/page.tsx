'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { isEqual } from 'lodash';

import {
  getMedicines,
  addMedicine,
  deleteMedicine,
  updateMedicine,
  subscribeToMedicinesChanges,
  unsubscribeFromMedicinesChanges,
} from '@/actions/firestore';
import { logOut } from '@/actions/auth';

import { useAuthContext } from '@/context/AuthContext';

import { Navbar, Button } from '@/components';
import Modal from '@/components/Modal';
import { Medicine } from '@/types';
import { showAlert } from '@/components/SweetAlert';

export default function Obat() {
  const router = useRouter();
  const userLogged = useAuthContext();

  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [medicineId, setMeidicineId] = useState<string>('');

  const [formValues, setFormValues] = useState({
    namaObat: '',
    harga: '',
    stock: 0,
  });

  let unsubscribe: (() => void) | undefined;

  const handleOpenModal = (
    editMode: boolean = false,
    name: string = '',
    price: string = '',
    stock: number = 0
  ) => {
    setModalOpen(true);
    if (editMode) {
      setIsEdit(true);
      setMeidicineId(name);
      setFormValues({ namaObat: name, harga: price, stock: stock });
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    clearForm();
    setIsEdit(false);
    setMeidicineId('');
  };

  const clearForm = () => {
    setFormValues({ namaObat: '', harga: '', stock: 0 });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmitMedicine = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const { namaObat, harga, stock } = formValues;
    if (isEdit) {
      handleUpdateMedicine(medicineId);
    } else {
      handleAddMedicine(namaObat, harga, stock);
    }
  };

  const handleDeleteMedicine = (medicineName: string) => {
    setLoading(true);
    const mySwal = withReactContent(Swal);
    mySwal
      .fire({
        title: 'Apakah anda yakin ?',
        icon: 'warning',
        text: 'Data akan Terhapus',
        confirmButtonText: 'Lanjutkan',
        cancelButtonText: 'Batal',
        showCancelButton: true,
        showCloseButton: true,
        iconColor: '#F0D33A',
        confirmButtonColor: '#47C3A6',
        cancelButtonColor: '#F03A3A',
      })
      .then(async res => {
        if (res.isConfirmed) {
          const { result, error } = await deleteMedicine(medicineName);
          if (error) {
            mySwal.fire({
              title: 'Error',
              text: `Terjadi Error ${error}`,
              icon: 'error',
              showCloseButton: true,
            });
            return;
          }

          mySwal.fire({
            title: 'Sukses',
            text: result,
            icon: 'success',
            iconColor: '#47C3A6',
            showConfirmButton: false,
            showCloseButton: true,
          });
          setLoading(false);
        }
      });
  };

  const handleAddMedicine = async (
    namaObat: string,
    harga: string,
    stock: number
  ) => {
    const { result, error } = await addMedicine(namaObat, harga, stock);
    if (error) {
      showAlert('Error', `terjadi error ${error}`);
      setModalOpen(true);
      setLoading(false);
      return;
    }

    showAlert('Sukses', result);
    clearForm();
    setModalOpen(false);
    setLoading(false);
  };

  const handleUpdateMedicine = async (medicineName: string) => {
    const oldMedicineName = medicineName;
    const updatedData = {
      medicine_name: formValues.namaObat,
      price: formValues.harga,
      stock: formValues.stock,
    };
    const { result, error } = await updateMedicine(
      oldMedicineName,
      updatedData
    );
    if (error) {
      showAlert('Error', `terjadi error ${error}`);
      setModalOpen(true);
      setLoading(false);
      return;
    }

    showAlert('Sukses', result);
    clearForm();
    setLoading(false);
    handleCloseModal();
  };

  useEffect(() => {
    if (userLogged == null) {
      router.push('/');
      return;
    }
    const fetchData = async () => {
      const { result, error } = await getMedicines('obat');
      if (error) {
        console.error(error);
      }
      setMedicines(result);
      const unsubscribe = subscribeToMedicinesChanges(
        (updatedMedicines: any[]) => {
          setMedicines(updatedMedicines);
        }
      );

      return () => {
        unsubscribeFromMedicinesChanges(unsubscribe);
      };
    };

    fetchData();
  }, [userLogged]);

  return (
    <div className='flex flex-col items-center bg-[#FAFAFA] h-screen'>
      <Navbar handleClick={logOut} />

      <div className='mt-44 max-w-screen-2xl w-full px-[100px]'>
        <div className='flex flex-row space-x-5 w-full'>
          <div className='relative w-[85%] group'>
            <input
              type='text'
              className='w-full px-3 py-2 outline-none border border-[#D8CCF3] focus:border-[#5C25E7]'
            />
            <span className='absolute right-4 top-1/2 transform -translate-y-1/2'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.8'
                stroke='currentColor'
                className='w-6 h-6 text-[#D8CCF3] group-focus-within:text-[#5C25E7] cursor-pointer'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z'
                />
              </svg>
            </span>
          </div>

          <Button
            title={'TAMBAH OBAT'}
            containerStyles={`w-[15%] bg-[#5C25E7] text-white rounded-lg text-sm font-semibold`}
            handleClick={() => handleOpenModal()}
          />
        </div>

        <div className='w-full mt-12 bg-white rounded-lg px-3 py-0 min-h-[500px] max-h-[600px] overflow-hidden overflow-y-scroll'>
          <table
            className='table-fixed w-full text-black text-center '
            style={{ borderCollapse: 'separate', borderSpacing: '0 30px' }}
          >
            <thead className=''>
              <tr className=''>
                <th>Nama Obat</th>
                <th>Harga</th>
                <th>Safety Stock</th>
                <th>Stock</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {medicines.map(medicine => {
                return (
                  <tr key={medicine.medicine_name}>
                    <td>{medicine.medicine_name}</td>
                    <td>{medicine.price}</td>
                    <td>0</td>
                    <td>{medicine.stock}</td>
                    <td>
                      <Button
                        title={`UBAH`}
                        containerStyles={`bg-[#F0D33A] text-black rounded-lg text-sm font-normal px-4 py-2 mr-1`}
                        handleClick={() =>
                          handleOpenModal(
                            true,
                            medicine.medicine_name,
                            medicine.price,
                            medicine.stock
                          )
                        }
                      />
                      <Button
                        title={`HAPUS`}
                        containerStyles={`bg-[#F03A3A] text-white rounded-lg text-sm font-normal px-4 py-2 ml-1`}
                        handleClick={() =>
                          handleDeleteMedicine(medicine.medicine_name)
                        }
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {isModalOpen && (
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
              <div className='flex flex-col px-6 py-4 relative'>
                <button
                  onClick={handleCloseModal}
                  className='absolute right-2 top-4'
                >
                  <span>
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
                </button>
                <h2 className='text-xl text-black font-semibold'>
                  {isEdit ? 'Edit Data Obat' : 'Tambah Data Obat'}
                </h2>

                <form
                  onSubmit={handleSubmitMedicine}
                  className='mt-3 flex flex-col space-y-3'
                >
                  <div className='mt-5 flex flex-col space-y-3'>
                    <label
                      htmlFor='namaObat'
                      className='text-base text-black font-bold'
                    >
                      Nama Obat
                    </label>
                    <input
                      name='namaObat'
                      type='text'
                      placeholder='Nama Obat'
                      className='outline-none w-full border border-[#5C25E7] rounded-lg px-3 py-2 text-sm text-black'
                      value={formValues.namaObat}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className='mt-5 flex flex-col space-y-3'>
                    <label
                      htmlFor='harga'
                      className='text-base text-black font-bold'
                    >
                      Harga
                    </label>
                    <input
                      name='harga'
                      type='text'
                      placeholder='Rp xx.xxx'
                      className='outline-none w-full border border-[#5C25E7] rounded-lg px-3 py-2 text-sm text-black'
                      value={formValues.harga}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className='mt-5 flex flex-col space-y-3'>
                    <label
                      htmlFor='stock'
                      className='text-base text-black font-bold'
                    >
                      Stock
                    </label>
                    <input
                      name='stock'
                      type='number'
                      placeholder='0'
                      className='outline-none w-full border border-[#5C25E7] rounded-lg px-3 py-2 text-sm text-black'
                      value={formValues.stock}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <Button
                    btnType='submit'
                    title={loading ? `Loading...` : `SIMPAN`}
                    containerStyles={`bg-[#5C25E7] text-white px-3 py-2 rounded-lg self-end`}
                    isDisabled={loading}
                  />
                </form>
              </div>
            </Modal>
          )}
        </div>
      </div>
    </div>
  );
}
