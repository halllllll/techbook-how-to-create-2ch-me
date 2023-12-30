import { useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

export const threadKeys = {
  all: ['thread'] as const,
  threads: () => [...threadKeys.all, 'threads'] as const,
  // thread: (filters: string) => [...threadKeys.threads(), { filters }] as const,
  pagenateThread: (page?: number) => [...threadKeys.threads(), { page }] as const,
  detail: (id: number) => [...threadKeys.all, 'detail', id] as const,
} as const;

export const useThreadCache = () => {
  const queryClient = useQueryClient();

  return useMemo(
    () => ({
      invalidateThread: () => queryClient.invalidateQueries({ queryKey: threadKeys.threads() }),
      invalidateDetail: (id: number) =>
        queryClient.invalidateQueries({ queryKey: threadKeys.detail(id) }),
    }),
    [queryClient],
  );
};
