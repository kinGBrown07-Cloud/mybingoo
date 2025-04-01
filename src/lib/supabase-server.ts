import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const createAPISupabaseClient = () => {
  return createServerComponentClient({ cookies });
};
