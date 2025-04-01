import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { type User } from '@supabase/supabase-js';
import { AuthOptions } from 'next-auth';

export interface BaseUser extends User {
  role?: string;
  points?: number;
  region?: string;
}

export const supabase = createClientComponentClient();

export const authOptions: AuthOptions = {
  providers: [],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
};

export async function getUser(): Promise<BaseUser | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Récupérer les informations supplémentaires de l'utilisateur depuis la table users
    const { data: userData } = await supabase
      .from('users')
      .select('role, points, regionId')
      .eq('supabaseId', user.id)
      .single();

    console.log('User data from auth:', userData); // Pour le débogage

    return {
      ...user,
      role: userData?.role || 'USER',
      points: userData?.points || 0,
      region: userData?.regionId
    };
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

export async function signOut() {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}
