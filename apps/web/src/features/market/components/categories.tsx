import { ReactNode, useMemo, useState } from 'react';

import ai from '../../../assets/logo/ai.svg';
import defi from '../../../assets/logo/defi.svg';
import depin from '../../../assets/logo/depin.svg';
import games from '../../../assets/logo/games.svg';
import others from '../../../assets/logo/others.svg';

import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

interface CategoryProps {
  name: string;
  icon: ReactNode;
  onClick: () => void;
  isActive: boolean;
}

const Category = ({ name, icon, onClick, isActive }: CategoryProps) => {
  return (
    <Button
      variant="ghost"
      className={cn(
        'bg-transparent hover:bg-transparent text-black hover:text-black flex flex-col justify-center items-center border h-fit py-[30px] rounded-[40px]',
        isActive ? 'border-black' : 'border-[#C7C7C7]',
      )}
      onClick={onClick}
    >
      {icon}
      {name}
    </Button>
  );
};

interface CategoriesProps {
  selectedCategories?: string[];
  onCategoryChange?: (categories: string[]) => void;
}

export const Categories = ({
  selectedCategories = [],
  onCategoryChange,
}: CategoriesProps) => {
  const [selected, setSelected] = useState<string[]>(selectedCategories);

  const categories = useMemo(() => {
    return [
      {
        name: 'DeFi',
        value: 'defi',
        icon: <img src={defi} alt="defi" />,
      },
      {
        name: 'AI',
        value: 'ai',
        icon: <img src={ai} alt="ai" />,
      },
      {
        name: 'DePIN',
        value: 'depin',
        icon: <img src={depin} alt="depin" />,
      },
      {
        name: 'Games',
        value: 'games',
        icon: <img src={games} alt="games" />,
      },
      {
        name: 'Others',
        value: 'others',
        icon: <img src={others} alt="others" />,
      },
    ];
  }, []);

  const handleCategoryClick = (categoryValue: string) => {
    const newSelected = selected.includes(categoryValue)
      ? selected.filter((cat) => cat !== categoryValue)
      : [...selected, categoryValue];

    setSelected(newSelected);

    if (onCategoryChange) {
      onCategoryChange(newSelected);
    }
  };

  return (
    <div className="grid grid-cols-5 gap-[20px]">
      {categories.map((category) => (
        <Category
          key={category.name}
          name={category.name}
          icon={category.icon}
          isActive={selected.includes(category.value)}
          onClick={() => handleCategoryClick(category.value)}
        />
      ))}
    </div>
  );
};
