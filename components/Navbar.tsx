import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { NavbarProps, User } from '@/types';
import { getCookie } from '@/actions/cookie';
import { usePathname } from 'next/navigation';
import {
  getMedicines,
  subscribeToCollectionChanges,
  unsubscribeFromCollectionChanges,
} from '@/actions/firestore';
import { showAlert } from './SweetAlert';

export default function Navbar({ handleClick }: NavbarProps) {
  const pathName = usePathname();
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
  const [isOpen, setOpen] = useState<boolean>(false);
  const [limitedStockCount, setLimitedStockCount] = useState<number>(0);

  const getUserSession = async () => {
    const cookieUser: User | undefined = await getCookie('userSession');
    setCurrentUser(cookieUser);
  };

  const toggleDropdownMenu = () => {
    setOpen(!isOpen);
  };

  const countLimitedStock = async () => {
    const { result, error } = await getMedicines('obat');
    if (error) {
      showAlert('Error', error, 'success');
      return;
    }
    if (result.length > 0) {
      let count = 0;
      for (const data of result) {
        if (data.availableStatus === 'Terbatas') count++;
      }
      setLimitedStockCount(count);
    }
  };

  useEffect(() => {
    getUserSession();
    countLimitedStock();

    const unsubscribe = subscribeToCollectionChanges('obat', updatedData => {
      countLimitedStock();
    });

    const unsubscribeUser = subscribeToCollectionChanges(
      'users',
      updatedData => {
        setInterval(() => {
          getUserSession();
        }, 500);
      }
    );

    return () => {
      unsubscribeFromCollectionChanges(unsubscribe);
      unsubscribeFromCollectionChanges(unsubscribeUser);
    };
  }, []);

  return (
    <nav className='flex flex-row justify-between items-center bg-[#5C25E7] text-white mt-5 rounded-xl fixed w-full h-20 top-0 z-50 px-[50px] 2xl:px-[100px] py-5 max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl'>
      <div>
        <ul className='inline-flex space-x-5 text-2xl'>
          <li
            className={pathName === '/dashboard' ? 'font-bold' : 'font-normal'}
          >
            <Link href='/dashboard'>Beranda</Link>
          </li>
          <li
            className={
              pathName.includes('/dashboard/penjualan')
                ? 'font-bold'
                : 'font-normal'
            }
          >
            <Link href='/dashboard/penjualan/kasir'>Penjualan</Link>
          </li>
          <li
            className={`${
              pathName.includes('/dashboard/pengadaan')
                ? 'font-bold'
                : 'font-normal'
            } relative`}
          >
            <Link href='/dashboard/pengadaan/rencana'>Pengadaan</Link>
            {limitedStockCount > 0 && (
              <span className='absolute top-2 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-[#F03A3A] rounded-full'>
                {limitedStockCount}
              </span>
            )}
          </li>
          {currentUser?.role === 1 && (
            <>
              <li
                className={
                  pathName.includes('/dashboard/obat')
                    ? 'font-bold'
                    : 'font-normal'
                }
              >
                <Link href='/dashboard/obat'>Obat</Link>
              </li>
              <li
                className={
                  pathName.includes('/akun') ? 'font-bold' : 'font-normal'
                }
              >
                <Link href='/akun'>Akun</Link>
              </li>
            </>
          )}
        </ul>
      </div>

      <div className='relative' onClick={toggleDropdownMenu}>
        <div className='flex flex-row space-x-3 items-center text-2xl cursor-pointer'>
          <Image
            src={currentUser?.role === 1 ? '/pemilik.webp' : '/karyawan.webp'}
            width={56}
            height={56}
            alt='Image Profile'
            className='rounded-full'
          />
          <h3 className='text-2xl font-normal'>
            {currentUser?.username ?? 'No User'}
          </h3>
        </div>
        <div
          className={`absolute z-10 right-0 bg-white shadow-md rounded w-full py-3 mt-3 text-black ${
            isOpen ? 'flex' : 'hidden'
          }`}
        >
          <ul className='w-full'>
            <li className='hidden cursor-pointer py-1 font-medium text-lg hover:bg-gray-300 hover:text-white'>
              <span className='px-4'>Setting</span>
            </li>
            <li
              className='cursor-pointer py-1 font-medium text-lg hover:bg-gray-300 hover:text-white'
              onClick={handleClick}
            >
              <span className='px-4'>Logout</span>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
