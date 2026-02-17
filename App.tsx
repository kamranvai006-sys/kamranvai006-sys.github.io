
import React, { useState } from 'react';
import ZombieLogin from './components/ZombieLogin';
import HackerDashboard from './components/HackerDashboard';
import { UserAuthStatus } from './types';

const App: React.FC = () => {
  const [authStatus, setAuthStatus] = useState<UserAuthStatus>('UNAUTHENTICATED');

  if (authStatus !== 'AUTHENTICATED') {
    return <ZombieLogin onUnlock={() => setAuthStatus('AUTHENTICATED')} />;
  }

  return <HackerDashboard />;
};

export default App;
