import React, { forwardRef } from 'react';
import { DatePickerProps } from '@/types';
import DatePicker, { ReactDatePickerProps } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CustomInput = forwardRef<HTMLInputElement | null, DatePickerProps>(
  ({ value, onClick }, ref) => (
    <div className='relative'>
      <span className='absolute left-2 top-1/2 transform -translate-y-1/2'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth='1.5'
          stroke='#5C25E7'
          className='w-6 h-6'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z'
          />
        </svg>
      </span>
      <input
        ref={ref}
        type='text'
        value={value}
        onClick={onClick}
        className='pl-10 py-2 border border-[#5C25E7] rounded-lg outline-none text-[#5C25E7] mr-3 text-sm'
        readOnly
      />
    </div>
  )
);

CustomInput.displayName = 'CustomDatePickerInput';

const CustomDatePicker: React.FC<ReactDatePickerProps> = props => {
  const { selected, onChange } = props;

  const handleChange = (
    date: Date | null,
    event: React.SyntheticEvent<any> | undefined
  ) => {
    if (onChange) {
      onChange(date, event);
    }
  };

  return (
    <DatePicker
      {...props}
      selected={selected}
      onChange={handleChange}
      customInput={<CustomInput />}
    />
  );
};

export default CustomDatePicker;
