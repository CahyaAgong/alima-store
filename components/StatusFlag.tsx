import { StatusFlagProps } from '@/types';

const StatusFlag = ({ title, containerStyles }: StatusFlagProps) => {
  return (
    <div className={containerStyles}>
      <span>{title}</span>
    </div>
  );
};

export default StatusFlag;
