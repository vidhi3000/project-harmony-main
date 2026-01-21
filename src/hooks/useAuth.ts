import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/appStore';
import { User as SupabaseUser } from '@supabase/supabase-js';

export const useAuth = () => {
  const { setCurrentUser, setAuthenticated } = useAppStore();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const user = mapSupabaseUserToAppUser(session.user);
        setCurrentUser(user);
        setAuthenticated(true);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const user = mapSupabaseUserToAppUser(session.user);
          setCurrentUser(user);
          setAuthenticated(true);
        } else {
          setCurrentUser(null);
          setAuthenticated(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [setCurrentUser, setAuthenticated]);
};

const mapSupabaseUserToAppUser = (supabaseUser: SupabaseUser) => {
  return {
    id: supabaseUser.id,
    name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
    email: supabaseUser.email || '',
    avatar: supabaseUser.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${supabaseUser.id}`,
    role: 'member' as const,
    timezone: 'utc+0',
  };
};
