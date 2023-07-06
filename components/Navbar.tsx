import { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { NavbarProps, User } from '@/types';
import { getCookie } from '@/actions/cookie';

export default function Navbar({ handleClick }: NavbarProps) {
  const [currenUser, setCurrentUser] = useState<User | undefined>(undefined);

  const getUserSession = async () => {
    const cookieUser: User | undefined = await getCookie('userSession');
    setCurrentUser(cookieUser);
  };

  useEffect(() => {
    getUserSession();
  }, []);

  return (
    <nav className='flex flex-row justify-between items-center px-[100px] py-5 bg-[#5C25E7] text-white mt-5 rounded-xl fixed w-full h-20 top-0 max-w-screen-2xl'>
      <div>
        <ul className='inline-flex space-x-5 text-2xl'>
          <li>
            <Link href='/dashboard'>Beranda</Link>
          </li>
          <li>
            <Link href='/dashboard/penjualan/kasir'>Penjualan</Link>
          </li>
          <li>
            <Link href='/dashboard/pengadaan/rencana'>Pengadaan</Link>
          </li>
          <li>
            <Link href='/dashboard/obat'>Obat</Link>
          </li>
        </ul>
      </div>

      <div className='flex flex-row space-x-3 items-center text-2xl cursor-pointer'>
        <Image
          src={currenUser?.role === 1 ? '/pemilik.webp' : '/karyawan.webp'}
          width={56}
          height={56}
          alt='Image Profile'
          className='rounded-full'
        />
        <span onClick={handleClick}>{currenUser?.username ?? 'No User'}</span>
      </div>
    </nav>
  );
}
