import { ReactNode } from 'react';
import { vi } from 'vitest';
import { render } from '@testing-library/react';

// Mock du routeur Next.js
export const mockRouter = {
  back: vi.fn(),
  forward: vi.fn(),
  push: vi.fn(),
  replace: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(),
  pathname: '/',
  query: {},
};

// Mock du hook useRouter
vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
}));

interface TestWrapperProps {
  children: ReactNode;
}

export function TestWrapper({ children }: TestWrapperProps) {
  return <>{children}</>;
}

export function renderWithWrapper(ui: React.ReactElement) {
  return render(ui, {
    wrapper: TestWrapper,
  });
}
