'use client';

import { useState } from 'react';
import { Authentication } from '@/actions/auth';
import { useAuthContext } from '@/context/AuthContext';
import { Button } from '@/components';
import { showAlert } from '@/components/SweetAlert';
import { setCookie } from '@/actions/cookie';
import Image from 'next/image';

export default function Home() {
  const { userLogin, setUserLogin } = useAuthContext();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [type, setType] = useState<string>('signin');
  const [isLoading, setLoading] = useState<boolean>(false);

  const handleAuthentication = async (
    event: React.FormEvent<HTMLFormElement>,
    type: string
  ) => {
    event.preventDefault();
    setLoading(true);
    const { result, error } = await Authentication(email, password, type);
    if (error) {
      showAlert('Error', error, 'error');
      setLoading(false);
      return;
    }

    await setCookie('userSession', result.data, { expires: 1 });
    showAlert(result.status, result.message, 'success');
    setUserLogin(result.data);
    setLoading(false);
  };

  return (
    <div className='flex flex-row h-screen w-full'>
      <div className='hidden'>
        <button type='button' onClick={() => setType('signin')}>
          SignIn
        </button>
        <button type='button' onClick={() => setType('signup')}>
          SignUp
        </button>
      </div>

      <div className='w-0 lg:w-[30%] relative'>
        <Image src={`/login.png`} alt={`Login Pages`} fill />
      </div>

      <div className='w-full lg:w-[70%] flex flex-col justify-center items-center'>
        <h1 className='text-7xl text-[#5C25E7] font-bold mb-5'>Sign In</h1>
        <div className='flex justify-center items-center bg-white w-full md:w-[40%] p-10 rounded-lg shadow-xl'>
          <form
            onSubmit={e => handleAuthentication(e, type)}
            className='flex flex-col space-y-5 text-sm w-full'
          >
            <div className='flex flex-col relative border border-[#5C25E7] rounded-lg overflow-hidden group'>
              <label
                htmlFor='username'
                className={`absolute left-4 ${
                  email !== '' ? `top-1 text-sm` : `top-3 text-base`
                } text-[#5C25E7] font-bold group-focus-within:top-1 group-focus-within:text-sm`}
              >
                Username
              </label>
              <input
                type='text'
                onChange={e => setEmail(e.target.value)}
                className='outline-none px-4 pt-5 pb-2 text-[#5C25E7] font-normal text-sm'
                required
              />
            </div>
            <div className='flex flex-col relative border border-[#5C25E7] rounded-lg overflow-hidden group'>
              <label
                htmlFor='password'
                className={`absolute left-4 ${
                  password !== '' ? `top-1 text-sm` : `top-3 text-base`
                } text-[#5C25E7] font-bold group-focus-within:top-1 group-focus-within:text-sm`}
              >
                Password
              </label>
              <input
                type='password'
                onChange={e => setPassword(e.target.value)}
                className='outline-none px-4 pt-5 pb-2 text-[#5C25E7] font-normal text-sm'
                required
              />
            </div>

            <Button
              btnType='submit'
              isDisabled={isLoading}
              title={isLoading ? 'Loading....' : `LOGIN`}
              containerStyles='bg-[#5C25E7] px-4 py-2 rounded-full text-white text-sm w-1/4 font-light self-center font-medium'
            />
          </form>
        </div>
      </div>
    </div>
  );
}
