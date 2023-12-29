import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type FC, ReactNode } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export const QueryProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
