import { useEffect } from 'react';
import { useAppStore } from '@/store/appStore';
import { supabase } from '@/lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export const useAuth = () => {
  const { setCurrentUser, setAuthenticated } = useAppStore();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
          setCurrentUser(null);
          setAuthenticated(false);
          return;
        }
        if (session?.user) {
          setCurrentUser({
            id: session.user.id,
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            avatar: session.user.user_metadata?.avatar_url,
            role: 'member',
          });
          setAuthenticated(true);
        } else {
          setCurrentUser(null);
          setAuthenticated(false);
        }
      } catch (error) {
        console.error('Unexpected error getting session:', error);
        setCurrentUser(null);
        setAuthenticated(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          if (session?.user) {
            setCurrentUser({
              id: session.user.id,
              name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
              email: session.user.email || '',
              avatar: session.user.user_metadata?.avatar_url,
              role: 'member',
            });
            setAuthenticated(true);
          } else {
            setCurrentUser(null);
            setAuthenticated(false);
          }
        } catch (error) {
          console.error('Error in auth state change:', error);
          setCurrentUser(null);
          setAuthenticated(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [setCurrentUser, setAuthenticated]);
};
