import { useMutation, useSuspenseQueries, useSuspenseQuery } from '@tanstack/react-query';

import { commentKeys, useCommentCache } from './cache';
import { getThreadComments, getThreadCommentsCount, postComment } from './queries';

export const useGetThreadComments = (threadId: number) => {
  const { data, isPending, isError, error } = useSuspenseQuery({
    queryKey: commentKeys.threadComments(threadId),
    queryFn: () => getThreadComments(threadId),
  });
  if (error) throw error;
  return { data, isPending, isError, error };
};

export const usePostComment = (threadId: number) => {
  const { invalidateThreadComments, invalidateThreadCommentCount } = useCommentCache();
  const { mutate, error, status, isError, isPending, isSuccess } = useMutation({
    mutationFn: postComment,
    onSuccess: () => {
      invalidateThreadComments(threadId);
      invalidateThreadCommentCount(threadId);
    },
    throwOnError: true, // to escalation for ErrorBoundary
  });

  return { mutate, error, status, isError, isPending, isSuccess };
};

// ＊返す値がRecordになってるのは種本の踏襲のため。コメントの数だけを取得する専用
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
