import { cn } from '@/utils/cn';

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const Spinner = ({ size = 'medium', className }: SpinnerProps) => {
  const sizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-12 w-12',
    large: 'h-16 w-16',
  };

  return (
    <div className="flex justify-center">
      <div
        className={cn(
          'animate-spin rounded-full border-t-2 border-b-2 border-indigo-500',
          sizeClasses[size],
          className,
        )}
      ></div>
    </div>
  );
};
