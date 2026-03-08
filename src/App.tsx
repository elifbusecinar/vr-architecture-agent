import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { AuthProvider } from './context';
import { useTechnicalImprovements } from '@/hooks';

import { ChatProvider } from './context/ChatContext';

function App() {
  useTechnicalImprovements();

  return (
    <AuthProvider>
      <ChatProvider>
        <RouterProvider router={router} />
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;
