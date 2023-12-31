import { useMutation, useSuspenseQuery } from '@tanstack/react-query';

import { threadKeys, useThreadCache } from './cache';
import { getThread, getThreads, postThread } from './queries';

export const useGetThread = (threadId: number) => {
  const { data, isPending, isError, error } = useSuspenseQuery({
    queryKey: threadKeys.detail(threadId),
    queryFn: () => getThread(threadId),
  });
  if (error) throw error;
  return { data, isPending, isError, error };
};

export const useGetThreads = () => {
  const { data, isPending, isError, error } = useSuspenseQuery({
    queryKey: threadKeys.threads(),
    queryFn: getThreads,
  });
  if (error) throw error;
  return { data, isPending, isError, error };
};

export const usePostThread = () => {
  const { invalidateThread } = useThreadCache();

  const { mutate, error, status, isError, isPending, isSuccess } = useMutation({
    mutationFn: postThread,
    onSuccess: () => {
      invalidateThread();
    },
    throwOnError: true, // to escalation for ErrorBoundary
  });

  return { mutate, error, status, isError, isPending, isSuccess };
};
