import { RegionKey } from '@/config/regions';

export interface Illustration {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  region: RegionKey;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
