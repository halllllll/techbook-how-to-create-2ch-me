import { useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

export const commentKeys = {
  all: ['comment'] as const,
  comments: () => [...commentKeys.all, 'comments'] as const,
  threadComments: (threadId: number) => [...commentKeys.comments(), { threadId }] as const,
  threadCommentCount: (threadId: number) =>
    [...commentKeys.comments(), 'count', { threadId }] as const,
  detail: (id: number) => [...commentKeys.all, 'detail', id] as const,
} as const;

export const useCommentCache = () => {
  const queryClient = useQueryClient();

  return useMemo(
    () => ({
      invalidateThreadComments: (threadId: number) =>
        queryClient.invalidateQueries({ queryKey: commentKeys.threadComments(threadId) }),
      invalidateThreadCommentCount: (threadId: number) =>
        queryClient.invalidateQueries({ queryKey: commentKeys.threadCommentCount(threadId) }),
    }),
    [queryClient],
  );
};
