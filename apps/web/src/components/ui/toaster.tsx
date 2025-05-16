import { X } from 'lucide-react';
import { Toaster as Sonner, toast } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
      {...props}
    />
  );
};

export type ToastType = 'success' | 'error' | 'info';

interface ShowToastOptions {
  type?: ToastType;
  title: string;
  description?: string;
}

export function showToast({
  type = 'info',
  title,
  description,
}: ShowToastOptions) {
  let icon: React.ReactNode = null;
  let style: React.CSSProperties = {};
  switch (type) {
    case 'success':
      icon = (
        <span
          style={{
            display: 'inline-block',
            background: '#D1FFB0',
            width: 60,
            height: 60,
            borderRadius: 10,
          }}
        />
      );
      style = { color: '#D1FFB0' };
      break;
    case 'error':
      icon = (
        <span
          style={{
            display: 'inline-block',
            background: '#F19999',
            width: 60,
            height: 60,
            borderRadius: 10,
          }}
        />
      );
      style = { color: '#F19999' };
      break;
    case 'info':
    default:
      icon = (
        <span
          style={{
            display: 'inline-block',
            background: 'white',
            width: 60,
            height: 60,
            borderRadius: 10,
          }}
        />
      );
      style = { color: 'white' };
      break;
  }
  toast.custom(
    (id) => (
      <div className="relative w-[600px] text-white flex items-center gap-4 p-[30px] rounded-[20px] bg-black">
        <button
          onClick={() => toast.dismiss(id)}
          aria-label="Close"
          className="absolute top-4 right-4 p-1 rounded hover:bg-white/10 focus:outline-none"
          tabIndex={0}
        >
          <X size={20} />
        </button>
        {icon}
        <div>
          <div style={{ fontWeight: 600, fontSize: 24, ...style }}>{title}</div>
          {description && <div style={{ fontSize: 18 }}>{description}</div>}
        </div>
      </div>
    ),
    { duration: 4000 },
  );
}

export { Toaster };
