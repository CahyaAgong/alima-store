'use client';

import { ChangeEvent, useEffect, useState } from 'react';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import {
  getMedicines,
  addMedicine,
  deleteMedicine,
  updateMedicine,
  subscribeToCollectionChanges,
  unsubscribeFromCollectionChanges,
} from '@/actions/firestore';

import { Button, FileUploader, SearchBar } from '@/components';
import Modal from '@/components/Modal';
import { Medicine } from '@/types';
import { showAlert } from '@/components/SweetAlert';
import { formatCurrency } from '@/utils/helper';

const medicineInitialValue: Medicine = {
  id: '',
  medicine_name: '',
  price: '',
  stock: 0,
  image: null,
  noBPOM: '',
};

export default function Obat() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isFetching, setFetching] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [medicineId, setMeidicineId] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isProceedData, setProceedData] = useState<boolean>(false);

  const [formValues, setFormValues] = useState<Medicine>(medicineInitialValue);

  const handleOpenModal = (
    editMode: boolean = false,
    id: string = '',
    name: string = '',
    price: string = '',
    stock: number = 0,
    img: string | null = null,
    noBPOM: string = ''
  ) => {
    setModalOpen(true);
    if (editMode) {
      setIsEdit(true);
      setMeidicineId(id);
      setFormValues({
        id: id,
        medicine_name: name,
        price,
        stock,
        image: img,
        noBPOM: noBPOM,
      });
    }
  };

  const clearForm = () => {
    setFormValues(medicineInitialValue);
    setImage(null);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    clearForm();
    setIsEdit(false);
    setMeidicineId('');
  };

  const handleFileChange = (file: File | null) => {
    if (file) {
      setImage(file);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmitMedicine = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const { medicine_name, price, stock, noBPOM } = formValues;

    setLoading(true);
    setProceedData(true);

    try {
      if (isEdit) {
        await handleUpdateMedicine(medicineId);
      } else {
        await handleAddMedicine(medicine_name, price, stock, noBPOM);
      }
    } catch (error) {
      console.error(`Error : ${error}`);
    } finally {
      setLoading(false);
      handleCloseModal();
    }
  };

  const handleDeleteMedicine = async (medicineId: string) => {
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
          setProceedData(true);
          const { result, error } = await deleteMedicine(medicineId);
          if (error) {
            showAlert('Error', error, 'error');
            setLoading(false);
            return;
          }

          showAlert('Sukses', result, 'success');
          setLoading(false);
        }
      });
  };

  const handleAddMedicine = async (
    namaObat: string,
    harga: string,
    stock: number,
    noBPOM: string
  ) => {
    if (!namaObat || !harga || !stock || !noBPOM) {
      showAlert('Error', 'form harus diisi semua', 'error');
      setLoading(false);
      return;
    }
    const { result, error } = await addMedicine(
      namaObat,
      harga,
      stock,
      image,
      noBPOM
    );
    if (error) {
      showAlert('Error', error, 'error');
      setLoading(false);
      setModalOpen(true);
      return;
    }

    showAlert('Sukses', result, 'success');
  };

  const handleUpdateMedicine = async (medicineId: string) => {
    const updatedData: Medicine = {
      id: medicineId,
      medicine_name: formValues.medicine_name,
      price: formValues.price,
      stock: +formValues.stock,
      image: formValues.image,
      noBPOM: formValues.noBPOM,
    };
    const { result, error } = await updateMedicine(
      medicineId,
      updatedData,
      image
    );
    if (error) {
      showAlert('Error', error, 'error');
      setLoading(false);
      setModalOpen(true);
      return;
    }

    showAlert('Sukses', result, 'success');
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    setFetching(true);
    const fetchData = async () => {
      const { result, error } = await getMedicines('obat');
      if (error) {
        showAlert('error', error, 'error');
        setFetching(false);
        return;
      }
      setMedicines(result);
      setFetching(false);

      if (isProceedData) {
        const unsubscribe = subscribeToCollectionChanges(
          'obat',
          (updatedMedicines: Medicine[]) => {
            // if (!isFetching) setMedicines(updatedMedicines);
            setMedicines(updatedMedicines);
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
    <div className='flex flex-col items-center bg-[#FAFAFA] h-screen'>
      <div className='mt-40 2xl:mt-44 px-[20px] lg:px-[40px] xl:px-[100px] 2xl:px-[200px] w-full pb-20'>
        <div className='flex flex-row space-x-5 w-full'>
          <SearchBar
            containerStyles='w-[85%] rounded-lg'
            searchIcon
            handleChange={e => handleSearchChange(e)}
            placeholder='Cari Nama Obat...'
          />
          <Button
            title={'TAMBAH OBAT'}
            containerStyles={`w-[15%] bg-[#5C25E7] text-white rounded-lg text-sm font-semibold`}
            handleClick={() => handleOpenModal()}
          />
        </div>

        <div className='w-full mt-12 bg-white rounded-lg px-3 py-0 min-h-[500px] h-[500px] max-h-[500px] overflow-hidden overflow-y-scroll shadow-md'>
          <table
            className='table-fixed w-full text-black text-center '
            style={{ borderCollapse: 'separate', borderSpacing: '0 30px' }}
          >
            <thead className=''>
              <tr className=''>
                <th>No BPOM</th>
                <th>Nama Obat</th>
                <th>Harga</th>
                {/* <th>Safety Stock</th> */}
                <th>Stock</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {isFetching ? (
                <tr>
                  <td colSpan={5}>Loading.....</td>
                </tr>
              ) : filteredMedicines.length > 0 ? (
                filteredMedicines.map(medicine => {
                  return (
                    <tr key={medicine.id}>
                      <td>{medicine.noBPOM}</td>
                      <td>{medicine.medicine_name}</td>
                      <td>{formatCurrency(parseInt(medicine.price))}</td>
                      {/* <td>{medicine.safetyStock}</td> */}
                      <td>{medicine.stock}</td>
                      <td>
                        <Button
                          title={`UBAH`}
                          containerStyles={`bg-[#F0D33A] text-black rounded-lg text-sm font-normal px-4 py-2 mr-1`}
                          handleClick={() =>
                            handleOpenModal(
                              true,
                              medicine.id,
                              medicine.medicine_name,
                              medicine.price,
                              medicine.stock,
                              medicine.image,
                              medicine.noBPOM
                            )
                          }
                        />
                        <Button
                          title={`HAPUS`}
                          containerStyles={`bg-[#F03A3A] text-white rounded-lg text-sm font-normal px-4 py-2 ml-1`}
                          handleClick={() => handleDeleteMedicine(medicine.id)}
                        />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5}>tidak ada data!</td>
                </tr>
              )}
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
                      htmlFor='noBPOM'
                      className='text-base text-black font-bold'
                    >
                      No BPOM
                    </label>
                    <input
                      name='noBPOM'
                      type='text'
                      placeholder='No BPOM'
                      className='outline-none w-full border border-[#5C25E7] rounded-lg px-3 py-2 text-sm text-black'
                      value={formValues.noBPOM}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className='mt-5 flex flex-col space-y-3'>
                    <label
                      htmlFor='medicine_name'
                      className='text-base text-black font-bold'
                    >
                      Nama Obat
                    </label>
                    <input
                      name='medicine_name'
                      type='text'
                      placeholder='Nama Obat'
                      className='outline-none w-full border border-[#5C25E7] rounded-lg px-3 py-2 text-sm text-black'
                      value={formValues.medicine_name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className='mt-5 flex flex-col space-y-3'>
                    <label
                      htmlFor='price'
                      className='text-base text-black font-bold'
                    >
                      Harga
                    </label>
                    <input
                      name='price'
                      type='number'
                      placeholder='Rp xx.xxx'
                      className='outline-none w-full border border-[#5C25E7] rounded-lg px-3 py-2 text-sm text-black'
                      value={formValues.price}
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

                  <div className='w-full'>
                    <FileUploader
                      label={`Foto Obat`}
                      onChange={handleFileChange}
                      isRequired={false}
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
