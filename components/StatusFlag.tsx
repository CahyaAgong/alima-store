import { StatusFlagProps } from '@/types';

const StatusFlag = ({ title, containerStyles }: StatusFlagProps) => {
  return (
    <div
      className={`${title === 'Terbatas' && `bg-[#F03A3A] text-white`} ${
        title === 'Dipesan' && `bg-[#F0D33A] text-black`
      } ${
        title === 'Tersedia' && `bg-[#47C3A6] text-white`
      } ${containerStyles}`}
    >
      <span>{title}</span>
    </div>
  );
};

export default StatusFlag;
