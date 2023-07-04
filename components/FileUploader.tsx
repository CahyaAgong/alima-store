import { FileUploaderProps } from '@/types';
import React, { useState } from 'react';

const FileUploader = ({ label, onChange, isRequired }: FileUploaderProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    onChange(file);
  };

  return (
    <div className='flex flex-col space-y-3'>
      {label && (
        <label htmlFor='file' className='text-base text-black font-bold'>
          {label}
        </label>
      )}
      <div className='w-full flex justify-center h-[86px] py-4 items-center border border-dashed border-[#5C25E7] rounded-lg relative'>
        <div className='flex flex-col items-center justify-center space-y-1'>
          <span>
            <svg
              version='1.0'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 512.000000 512.000000'
              preserveAspectRatio='xMidYMid meet'
              className='w-10 h-10 opacity-30'
            >
              <g
                transform='translate(0.000000,512.000000) scale(0.100000,-0.100000)'
                fill='#000000'
                stroke='none'
              >
                <path
                  d='M1285 4890 c-160 -32 -304 -142 -374 -285 -59 -121 -56 -54 -56
-1415 l0 -1255 22 -70 c57 -180 218 -328 397 -365 35 -7 581 -9 1741 -8 l1690
3 60 22 c124 47 230 140 290 254 68 129 65 63 65 1421 0 852 -3 1243 -11 1280
-30 147 -147 301 -277 367 -127 64 -22 61 -1847 60 -913 -1 -1678 -5 -1700 -9z
m3376 -449 l29 -29 0 -778 c0 -429 -4 -774 -9 -768 -4 5 -156 182 -338 394
-181 212 -346 400 -366 417 -137 120 -346 121 -482 2 -21 -19 -218 -249 -438
-513 l-399 -478 -36 33 c-21 19 -91 86 -157 151 -154 151 -198 173 -335 173
-157 -1 -159 -3 -532 -374 l-318 -315 0 1018 c0 933 1 1020 17 1046 9 16 26
33 37 39 14 6 579 10 1659 10 l1639 1 29 -29z'
                />
                <path
                  d='M1813 4245 c-81 -22 -132 -52 -193 -114 -164 -164 -168 -418 -9 -586
87 -92 185 -135 309 -135 123 0 222 43 308 133 62 66 89 119 108 210 63 302
-224 572 -523 492z'
                />
                <path
                  d='M266 2530 c-186 -621 -260 -883 -264 -930 -13 -184 96 -374 262 -455
54 -26 456 -137 1701 -470 897 -240 1655 -443 1685 -451 63 -16 176 -18 240
-3 118 27 247 124 303 227 15 27 72 193 127 368 55 175 103 327 106 337 5 16
-75 17 -1593 17 -1556 0 -1600 1 -1680 20 -293 70 -510 285 -596 589 -21 74
-21 99 -27 846 l-5 769 -259 -864z'
                />
              </g>
            </svg>
          </span>
          <p className='mb-2 text-sm font-semibold text-[#5C25E7] underline'>
            Pilih File
          </p>
        </div>
        <input
          type='file'
          onChange={handleFileChange}
          required={isRequired}
          className='w-full h-full absolute z-10 opacity-0 cursor-pointer'
        />
      </div>
      {selectedFile && (
        <span className='flex flex-row items-center space-x-2'>
          <svg
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M13.1716 3H9C7.11438 3 6.17157 3 5.58579 3.58579C5 4.17157 5 5.11438 5 7V17C5 18.8856 5 19.8284 5.58579 20.4142C6.17157 21 7.11438 21 9 21H15C16.8856 21 17.8284 21 18.4142 20.4142C19 19.8284 19 18.8856 19 17V8.82843C19 8.41968 19 8.2153 18.9239 8.03153C18.8478 7.84776 18.7032 7.70324 18.4142 7.41421L14.5858 3.58579C14.2968 3.29676 14.1522 3.15224 13.9685 3.07612C13.7847 3 13.5803 3 13.1716 3Z'
              stroke='#5C25E7'
            />
            <path d='M9 13L15 13' stroke='#5C25E7' strokeLinecap='round' />
            <path d='M9 17L13 17' stroke='#5C25E7' strokeLinecap='round' />
            <path
              d='M13 3V7C13 7.94281 13 8.41421 13.2929 8.70711C13.5858 9 14.0572 9 15 9H19'
              stroke='#5C25E7'
            />
          </svg>
          <p className='text-sm font-normal text-black'>{selectedFile.name}</p>
        </span>
      )}
    </div>
  );
};

export default FileUploader;
