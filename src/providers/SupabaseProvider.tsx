'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import { type BaseUser } from '@/lib/auth';

interface SupabaseContext {
  user: BaseUser | null;
  signOut: () => Promise<void>;
}

const Context = createContext<SupabaseContext>({
  user: null,
  signOut: async () => {},
});

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<BaseUser | null>(null);

  useEffect(() => {
    const getInitialUser = async () => {
      const { data: { user: supabaseUser } } = await supabase.auth.getUser();
      if (supabaseUser) {
        const { data: userData } = await supabase
          .from('users')
          .select('role, points, regionId')
          .eq('supabaseId', supabaseUser.id)
          .single();

        console.log('Initial user data:', userData); // Pour le débogage

        setUser({
          ...supabaseUser,
          role: (userData?.role || 'USER').toUpperCase(),
          points: userData?.points || 0,
          region: userData?.regionId
        });
      }
    };

    getInitialUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: userData } = await supabase
          .from('users')
          .select('role, points, regionId')
          .eq('supabaseId', session.user.id)
          .single();

        console.log('Session user data:', userData); // Pour le débogage

        setUser({
          ...session.user,
          role: (userData?.role || 'USER').toUpperCase(),
          points: userData?.points || 0,
          region: userData?.regionId
        });
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        router.push('/auth/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  const value = {
    user,
    signOut: async () => {
      await supabase.auth.signOut();
      router.push('/auth/login');
    },
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export const useSupabase = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};
