export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string | null;
          email: string | null;
          emailVerified: Date | null;
          image: string | null;
          phone: string | null;
          country: string | null;
          currency: string | null;
          points: number;
          balance: number;
          costPerPlay: number | null;
          affiliateCode: string | null;
          referredBy: string | null;
          referralCount: number;
          referralEarnings: number;
          role: 'user' | 'admin';
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id: string;
          name?: string | null;
          email?: string | null;
          emailVerified?: Date | null;
          image?: string | null;
          phone?: string | null;
          country?: string | null;
          currency?: string | null;
          points?: number;
          balance?: number;
          costPerPlay?: number | null;
          affiliateCode?: string | null;
          referredBy?: string | null;
          referralCount?: number;
          referralEarnings?: number;
          role?: 'user' | 'admin';
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          name?: string | null;
          email?: string | null;
          emailVerified?: Date | null;
          image?: string | null;
          phone?: string | null;
          country?: string | null;
          currency?: string | null;
          points?: number;
          balance?: number;
          costPerPlay?: number | null;
          affiliateCode?: string | null;
          referredBy?: string | null;
          referralCount?: number;
          referralEarnings?: number;
          role?: 'user' | 'admin';
          createdAt?: string;
          updatedAt?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          userId: string;
          type: 'deposit' | 'withdrawal' | 'game' | 'referral';
          amount: number;
          currency: string;
          status: 'pending' | 'completed' | 'failed';
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id: string;
          userId: string;
          type: 'deposit' | 'withdrawal' | 'game' | 'referral';
          amount: number;
          currency: string;
          status?: 'pending' | 'completed' | 'failed';
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          userId?: string;
          type?: 'deposit' | 'withdrawal' | 'game' | 'referral';
          amount?: number;
          currency?: string;
          status?: 'pending' | 'completed' | 'failed';
          createdAt?: string;
          updatedAt?: string;
        };
      };
      prizes: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          image: string | null;
          points: number;
          quantity: number;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id: string;
          name: string;
          description?: string | null;
          image?: string | null;
          points: number;
          quantity: number;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          image?: string | null;
          points?: number;
          quantity?: number;
          createdAt?: string;
          updatedAt?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

export type ExtendedUser = Database['public']['Tables']['users']['Row'];
