import { useState } from 'react';
import Image from 'next/image';

import { Button } from '@/components';
import { AccountCardProps } from '@/types';

const AccountCard = ({ user, handleClick }: AccountCardProps) => {
  const [isVisible, setVisible] = useState<string>('');

  const togglePassword = () => {
    if (isVisible === '') {
      setVisible(user.uid);
    } else {
      setVisible('');
    }
  };
  return (
    <div className='AccountCard'>
      <div className='flex flex-col space-y-1'>
        <h2 className='text-lg font-semibold'>{user?.username ?? ''}</h2>
        <span className='text-base font-light'>PASSWORD</span>
        <div className='flex flex-row space-x-2'>
          <input
            type={isVisible === user.uid ? 'text' : 'password'}
            value={user.password}
            readOnly
            className='ountline-none border-none bg-transparent text-white focus:outline-none focus:border-none focus:bg-transparent w-[60%]'
          />
          <div onClick={togglePassword} className='cursor-pointer'>
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
                d='M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z'
              />
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
              />
            </svg>
          </div>
        </div>
        <Button
          title={`UBAH`}
          containerStyles='text-black bg-[#FDFDFD] px-2 py-1 w-fit rounded-md text-xs mt-10'
          handleClick={handleClick}
        />
      </div>
      <div>
        <Image
          src={user?.role === 1 ? '/pemilik.webp' : '/karyawan.webp'}
          width={56}
          height={56}
          alt='Image Profile'
          className='rounded-full border border-[#5C25E7]'
        />
      </div>
    </div>
  );
};

export default AccountCard;
