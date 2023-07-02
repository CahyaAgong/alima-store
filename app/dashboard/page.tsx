'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context/AuthContext';
import { getCurrentUser } from '@/actions/localstorage';

import { Navbar } from '@/components';

export default function Dashboard() {
  const router = useRouter();
  const userLogged = useAuthContext();

  useEffect(() => {
    const storedUser = getCurrentUser('currentUser');
    if (userLogged == null && storedUser == null) {
      router.push('/');
    }
  }, [userLogged]);

  return (
    <div className='flex flex-col justify-center items-center bg-[#FAFAFA]'>
      <Navbar />

      <div className='mt-32 max-w-screen-2xl w-full'>
        <div className='px-2 py-3 bg-white rounded-lg'>
          <h2 className='text-black'>Total Pendapatan</h2>
          <h3 className='text-black text-2xl font-bold'>Rp 148.000</h3>
        </div>
      </div>
    </div>
  );
}
