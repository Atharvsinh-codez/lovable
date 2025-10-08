# __tests__/setup/test-utils.tsx

import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';

// Mock do Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    };
  },
}));

// Mock do SweetAlert2
jest.mock('sweetalert2', () => ({
  fire: jest.fn().mockResolvedValue({ isConfirmed: true }),
  mixin: jest.fn(),
  isLoading: jest.fn(),
  isVisible: jest.fn(),
  isConfirmed: jest.fn(),
  isDenied: jest.fn(),
  isDismissed: jest.fn(),
}));

// Mock do jQuery
jest.mock('jquery', () => {
  const mockJQuery = jest.fn(() => ({
    mask: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
    val: jest.fn(),
    focus: jest.fn(),
    length: 1,
  }));
  mockJQuery.extend = jest.fn();
  return mockJQuery;
});

// Mock das APIs externas
global.fetch = jest.fn();

// Configuração do QueryClient para testes
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
    },
    mutations: {
      retry: false,
    },
  },
});

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient;
}

export function renderWithProviders(
  ui: React.ReactElement,
  { queryClient = createTestQueryClient(), ...renderOptions }: CustomRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="light">
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient,
  };
}

// Utilitários para testes
export const mockAPISuccess = (data: any) => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve(data),
  });
};

export const mockAPIFailure = (status = 500) => {
  (global.fetch as jest.Mock).mockRejectedValueOnce(
    new Error(`HTTP ${status}`)
  );
};

export const mockAPITimeout = () => {
  (global.fetch as jest.Mock).mockImplementationOnce(
    () => new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), 100)
    )
  );
};

// Cleanup após cada teste
afterEach(() => {
  jest.clearAllMocks();
  (global.fetch as jest.Mock).mockClear();
});
