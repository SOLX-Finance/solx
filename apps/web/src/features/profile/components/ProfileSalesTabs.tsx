import { Button } from '@/components/ui/button';
import { SalesFilter } from '@/features/profile/hooks/useUserSales';

interface ProfileSalesTabsProps {
  activeTab: SalesFilter;
  onTabChange: (tab: SalesFilter) => void;
  showBoughtTab?: boolean;
}

export const ProfileSalesTabs = ({
  activeTab,
  onTabChange,
  showBoughtTab = true,
}: ProfileSalesTabsProps) => {
  return (
    <div className="flex items-center gap-[20px]">
      {showBoughtTab && (
        <Button
          className={`relative min-h-[60px] min-w-[355px] ${
            activeTab === 'bought' ? 'bg-[#BA8FFF]' : 'bg-white'
          } hover:bg-[#BA8FFF] rounded-[30px] text-black px-[40px] py-[15px] text-[24px] font-medium border border-black leading-[30px] duration-300`}
          onClick={() => onTabChange('bought')}
        >
          Bought Sales
        </Button>
      )}
      <Button
        className={`relative min-h-[60px] min-w-[355px] ${
          activeTab === 'created' ? 'bg-[#BA8FFF]' : 'bg-white'
        } hover:bg-[#BA8FFF] rounded-[30px] text-black px-[40px] py-[15px] text-[24px] font-medium border border-black leading-[30px] duration-300`}
        onClick={() => onTabChange('created')}
      >
        {showBoughtTab ? 'My Sales' : 'Sales'}
      </Button>
    </div>
  );
};
