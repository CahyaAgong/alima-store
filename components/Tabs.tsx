import { TabsProps } from '@/types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Tabs = ({ menus }: TabsProps) => {
  const pathName = usePathname();

  if (menus.length < 1) return <div></div>;

  return (
    <div className='text-2xl text-center text-black border-b border-black'>
      <ul className='flex flex-wrap -mb-px'>
        {menus.map(menu => (
          <li className='mr-2' key={menu.name}>
            <Link href={menu.slug}>
              <span
                className={`inline-block p-4 border-b-2 rounded-t-lg ${
                  pathName === menu.slug.toLocaleLowerCase()
                    ? 'font-bold border-b-black'
                    : 'font-normal border-transparent'
                }`}
              >
                {menu.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tabs;
