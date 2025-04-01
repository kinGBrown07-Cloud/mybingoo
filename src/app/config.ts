import { NextConfig } from 'next';

export const dynamicConfig: NextConfig = {
  runtime: 'edge'
};

// Force dynamic rendering for specific routes
export const dynamic = 'force-dynamic';
export const revalidate = 0;
