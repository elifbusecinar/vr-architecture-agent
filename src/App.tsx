import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { AuthProvider } from './context';
import { useTechnicalImprovements } from '@/hooks';

function App() {
  useTechnicalImprovements();

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
