'use client';

import React, { useEffect, useState } from 'react';

import { AccountCard, Button, Loading, Modal } from '@/components';
import { User } from '@/types';
import {
  getUsers,
  subscribeToCollectionChanges,
  unsubscribeFromCollectionChanges,
  updateUser,
} from '@/actions/firestore';
import { showAlert } from '@/components/SweetAlert';

const Akun = () => {
  const initialUser: User = {
    uid: '',
    username: '',
    role: 0,
    email: '',
    password: '',
    confirmation_password: '',
  };

  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [isSubmiting, setSubmiting] = useState<boolean>(false);
  const [isFetching, setFetching] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);

  const [formValues, setFormValues] = useState<User>(initialUser);

  const openModal = (item: User) => {
    setModalOpen(true);
    setFormValues({
      uid: item.uid,
      username: item.username,
      role: item.role,
      email: item.email,
      password: item.password,
      confirmation_password: '',
    });
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormValues(initialUser);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const fetchData = async () => {
    setFetching(true);
    const { result, error } = await getUsers();
    if (error) {
      showAlert('Error', error, 'error');
      setFetching(false);
      return;
    }

    setUsers(result);
    setFetching(false);
  };

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmiting(true);
    if (formValues.confirmation_password !== formValues.password) {
      showAlert(
        'Pehatian',
        'Password yang anda masukkan tidak sama',
        'warning'
      );
      setSubmiting(false);
      return;
    }
    try {
      if (formValues.password) {
        const { result, error } = await updateUser(formValues);
        if (error) {
          showAlert('Error', error, 'error');
          return;
        }
        showAlert(result?.status ?? '', result?.message ?? '', 'success');
      }
    } catch (error) {
      console.error(`Terjadi Kesalahan : ${error}`);
    } finally {
      setSubmiting(false);
      closeModal();
    }
  };

  useEffect(() => {
    fetchData();

    const unsubscribe = subscribeToCollectionChanges('users', updatedData => {
      fetchData();
    });

    return () => {
      unsubscribeFromCollectionChanges(unsubscribe);
    };
  }, []);

  return (
    <div className='flex flex-col items-center w-full h-screen'>
      <div className='mt-40 2xl:mt-44 px-[50px] 2xl:px-[100px] pb-20 w-full max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl'>
        <div className='flex flex-row flex-wrap w-full h-full space-x-3'>
          {isFetching ? (
            <Loading />
          ) : users.length > 0 ? (
            users.map(user => (
              <AccountCard
                key={user.uid}
                user={user}
                handleClick={e => openModal(user)}
              />
            ))
          ) : (
            <div>Tidak ada user</div>
          )}
        </div>

        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <div>
            <div className='flex flex-col px-6 py-4 relative'>
              <button onClick={closeModal} className='absolute right-2 top-4'>
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
                Ubah Data Akun
              </h2>

              <form
                onSubmit={submitForm}
                className='flex flex-col mt-3 space-y-3'
              >
                <div className='mt-5 flex flex-col space-y-3'>
                  <label
                    htmlFor='username'
                    className='text-base text-black font-bold'
                  >
                    Username
                  </label>
                  <input
                    type='text'
                    name='username'
                    className='outline-none w-full border border-[#5C25E7] rounded-lg px-3 py-2 text-sm text-black'
                    value={formValues.username}
                    onChange={handleChange}
                  />
                </div>
                <div className='mt-5 flex flex-col space-y-3'>
                  <label
                    htmlFor='password'
                    className='text-base text-black font-bold'
                  >
                    Password Baru
                  </label>
                  <input
                    type='password'
                    name='password'
                    className='outline-none w-full border border-[#5C25E7] rounded-lg px-3 py-2 text-sm text-black'
                    value={formValues.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className='mt-5 flex flex-col space-y-3'>
                  <label
                    htmlFor='confirmation_password'
                    className='text-base text-black font-bold'
                  >
                    Konfirmasi Password
                  </label>
                  <input
                    type='password'
                    name='confirmation_password'
                    className='outline-none w-full border border-[#5C25E7] rounded-lg px-3 py-2 text-sm text-black'
                    value={formValues.confirmation_password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <Button
                  btnType='submit'
                  title={isSubmiting ? `Loading...` : `SIMPAN`}
                  containerStyles={`bg-[#5C25E7] text-white px-3 py-2 rounded-lg self-end`}
                  isDisabled={isSubmiting}
                />
              </form>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Akun;
