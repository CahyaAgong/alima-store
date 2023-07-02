import { NavbarProps } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar({ handleClick }: NavbarProps) {
  return (
    <nav className='flex flex-row justify-between items-center px-[100px] py-5 bg-[#5C25E7] text-white mt-5 rounded-xl fixed w-full h-20 top-0 max-w-screen-2xl'>
      <div>
        <ul className='inline-flex space-x-5 text-2xl'>
          <li>
            <Link href='/'>Beranda</Link>
          </li>
          <li>
            <Link href='/dashboard/penjualan'>Penjualan</Link>
          </li>
          <li>
            <Link href='/dashboard/pengadaan'>Pengadaan</Link>
          </li>
          <li>
            <Link href='/dashboard/obat'>Obat</Link>
          </li>
        </ul>
      </div>

      <div className='flex flex-row space-x-3 items-center text-2xl cursor-pointer'>
        <Image
          src='https://wallpapers-clan.com/wp-content/uploads/2022/08/default-pfp-18.jpg'
          width={56}
          height={56}
          alt='Image Profile'
          className='rounded-full'
        />
        <span onClick={handleClick}>Username</span>
      </div>
    </nav>
  );
}
