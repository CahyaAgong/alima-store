'use client';

import { useEffect, useState } from 'react';
import { Authentication } from '@/actions/auth';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context/AuthContext';
import { getCurrentUser } from '@/actions/localstorage';

export default function Home() {
  const router = useRouter();
  const userLogged = useAuthContext();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [type, setType] = useState<string>('signin');
  const [currentUser, setCurrentUser] = useState<object | null>(null);

  const handleAuthentication = async (
    event: React.FormEvent<HTMLFormElement>,
    type: string
  ) => {
    event.preventDefault();

    const { error } = await Authentication(email, password, type);
    if (error) {
      alert(error.code);
      return;
    }
  };

  useEffect(() => {
    const storedUser = getCurrentUser('currentUser');
    if (userLogged != null || storedUser != null) {
      router.push('/dashboard');
    }
  }, [userLogged]);

  return (
    <main>
      <div className='flex flex-col justify-center items-center h-screen relative'>
        <div className='hidden'>
          <button type='button' onClick={() => setType('signin')}>
            SignIn
          </button>
          <button type='button' onClick={() => setType('signup')}>
            SignUp
          </button>
        </div>

        <div className='absolute top-0 left-0 w-[200px] h-[150px] bg-gradient-to-br from-[#D8CCF3] to-white rounded-br-full'></div>
        <div className='absolute bottom-0 right-0 w-[200px] h-[150px] bg-gradient-to-br from-white  to-[#D8CCF3] rounded-tl-full'></div>

        <h1 className='text-7xl text-[#5C25E7] font-bold mb-5'>Toko Alima</h1>
        <div className='flex justify-center items-center bg-white w-full md:w-3/4 lg:w-1/2 xl:w-1/3 p-10 rounded-lg shadow-xl'>
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

            <button
              type='submit'
              className='bg-[#5C25E7] px-4 py-2 rounded-full text-white text-sm w-1/4 font-light self-center'
            >
              LOGIN
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
