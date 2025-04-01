import { vi } from 'vitest';

export const createMockSupabaseClient = (mockData: any = null) => {
  // Si mockData contient initial et updated, c'est pour simuler une mise à jour
  const hasUpdate = mockData && mockData.initial && mockData.updated;
  const initialData = hasUpdate ? mockData.initial : mockData;
  const updatedData = hasUpdate ? mockData.updated : mockData;

  return {
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: { session: { user: { id: '123' } } },
        error: null,
      }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      onAuthStateChange: vi.fn(),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          data: initialData,
          error: null,
        }),
        single: vi.fn().mockResolvedValue({
          data: initialData,
          error: null,
        }),
      }),
      update: vi.fn().mockResolvedValue({
        data: updatedData,
        error: null,
      }),
      insert: vi.fn().mockResolvedValue({
        data: mockData,
        error: null,
      }),
      delete: vi.fn().mockResolvedValue({
        data: null,
        error: null,
      }),
    }),
    storage: {
      from: vi.fn().mockReturnValue({
        upload: vi.fn().mockResolvedValue({ error: null }),
        getPublicUrl: vi.fn().mockReturnValue({ publicUrl: 'https://example.com/image.jpg' }),
      }),
    },
  };
};
