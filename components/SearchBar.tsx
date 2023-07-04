import { SearchBarProps } from '@/types';

const SearchBar = ({
  containerStyles,
  inputStyles,
  searchIcon,
}: SearchBarProps) => {
  return (
    <div className={`relative group ${containerStyles}`}>
      <input
        type='text'
        className={`w-full px-3 py-2 outline-none border border-[#D8CCF3] focus:border-[#5C25E7] ${inputStyles}`}
      />
      {searchIcon && (
        <span className='absolute right-4 top-1/2 transform -translate-y-1/2'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='1.8'
            stroke='currentColor'
            className='w-6 h-6 text-[#D8CCF3] group-focus-within:text-[#5C25E7] cursor-pointer'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z'
            />
          </svg>
        </span>
      )}
    </div>
  );
};

export default SearchBar;
