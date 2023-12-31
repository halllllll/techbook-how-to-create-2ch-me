import { Comment } from '../../types/types';

export const getThreadComments = async (threadId: number): Promise<Comment[]> => {
  // このAPIはjson-serverの仕様
  const fetchedData = await fetch(`/api/threads/${threadId}/comments`);
  if (!fetchedData.ok) {
    throw new Error('Error at fetching comments!');
  }
  return await fetchedData.json();
};

export const getThreadCommentsCount = async (threadId: number): Promise<number> => {
  const resp = await getThreadComments(threadId);
  return resp.length;
};
