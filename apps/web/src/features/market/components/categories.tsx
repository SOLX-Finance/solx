import { ReactNode, useMemo } from 'react';

import ai from '../../../assets/logo/ai.svg';
import defi from '../../../assets/logo/defi.svg';
import depin from '../../../assets/logo/depin.svg';
import games from '../../../assets/logo/games.svg';
import others from '../../../assets/logo/others.svg';

import { Button } from '@/components/ui/button';

interface CategoryProps {
  name: string;
  icon: ReactNode;
  onClick: () => void;
}
const Category = ({ name, icon, onClick }: CategoryProps) => {
  return (
    <Button
      variant="ghost"
      className="bg-transparent hover:bg-transparent text-black hover:text-black flex flex-col justify-center items-center border border-[#C7C7C7] h-fit py-[30px] rounded-[40px]  "
    >
      {icon}
      {name}
    </Button>
  );
};

export const Categories = () => {
  const categories = useMemo(() => {
    return [
      {
        name: 'DeFi',
        icon: <img src={defi} alt="defi" />,
        onClick: () => {
          // no-op
        },
      },
      {
        name: 'AI',
        icon: <img src={ai} alt="ai" />,
        onClick: () => {
          // no-op
        },
      },
      {
        name: 'DePIN',
        icon: <img src={depin} alt="depin" />,
        onClick: () => {
          // no-op
        },
      },
      {
        name: 'Games',
        icon: <img src={games} alt="games" />,
        onClick: () => {
          // no-op
        },
      },
      {
        name: 'Others',
        icon: <img src={others} alt="others" />,
        onClick: () => {
          // no-op
        },
      },
    ];
  }, []);

  return (
    <div className="grid grid-cols-5 gap-[20px]">
      {categories.map((category) => (
        <Category key={category.name} {...category} />
      ))}
    </div>
  );
};
