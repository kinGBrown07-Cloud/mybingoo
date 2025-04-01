'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import { type BaseUser } from '@/lib/auth';
import toast from 'react-hot-toast';

interface SupabaseContext {
  user: BaseUser | null;
  signOut: () => Promise<void>;
  loading: boolean;
}

const Context = createContext<SupabaseContext>({
  user: null,
  signOut: async () => {},
  loading: true,
});

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<BaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getInitialUser = async () => {
      try {
        const { data: { user: supabaseUser } } = await supabase.auth.getUser();
        if (supabaseUser) {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('role, points, regionId')
            .eq('supabaseId', supabaseUser.id)
            .single();

          if (userError) {
            console.error('Error fetching user data:', userError);
            return;
          }

          setUser({
            ...supabaseUser,
            role: (userData?.role || 'USER').toUpperCase(),
            points: userData?.points || 0,
            region: userData?.regionId
          });
        }
      } catch (error) {
        console.error('Error in getInitialUser:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role, points, regionId')
          .eq('supabaseId', session.user.id)
          .single();

        if (userError) {
          console.error('Error fetching user data on auth change:', userError);
          return;
        }

        setUser({
          ...session.user,
          role: (userData?.role || 'USER').toUpperCase(),
          points: userData?.points || 0,
          region: userData?.regionId
        });
        router.refresh();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        router.refresh();
        router.push('/auth/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      router.push('/auth/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Erreur lors de la déconnexion');
    }
  };

  return (
    <Context.Provider value={{ user, signOut, loading }}>
      {children}
    </Context.Provider>
  );
}

export const useSupabase = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};
