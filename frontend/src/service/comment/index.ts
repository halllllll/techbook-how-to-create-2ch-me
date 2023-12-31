import { useSuspenseQueries, useSuspenseQuery } from '@tanstack/react-query';

import { commentKeys, useCommentCache } from './cache';
import { getThreadComments, getThreadCommentsCount } from './queries';

const useGetThreadComments = (threadId: number) => {
  const { data, isPending, isError, error } = useSuspenseQuery({
    queryKey: commentKeys.threadComments(threadId),
    queryFn: () => getThreadCommentsCount(threadId),
  });
  if (error) throw error;
  return { data, isPending, isError, error };
};

export const useGetThreadCommentsCount = (threadIds: number[]) => {
  const c: Record<number, number> = {};
  const result = useSuspenseQueries({
    queries: threadIds
      ? threadIds.map((id) => {
          return {
            queryKey: commentKeys.threadCommentCount(id),
            queryFn: () => getThreadCommentsCount(id),
            select: (data: number) => {
              c[id] = data;
              return data;
            },
          };
        })
      : [],
  });
  return { result, record: c };
};
