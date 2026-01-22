import { useEffect } from 'react';
import { useAppStore, dummyUsers } from '@/store/appStore';

export const useAuth = () => {
  const { setCurrentUser, setAuthenticated } = useAppStore();

  useEffect(() => {
    // For development, automatically set the first dummy user as authenticated
    const user = dummyUsers[0];
    setCurrentUser(user);
    setAuthenticated(true);
  }, [setCurrentUser, setAuthenticated]);
};
