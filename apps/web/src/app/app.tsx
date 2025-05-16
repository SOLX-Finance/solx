import AppRoutes from './routes';

import { Toaster } from '@/components/ui/toaster';

export function App() {
  return (
    <>
      <AppRoutes />
      <Toaster toastOptions={{ unstyled: true }} />
    </>
  );
}

export default App;
