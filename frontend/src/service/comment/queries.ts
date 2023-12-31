import { Comment } from '../../types/types';
import { sleep } from '../../utils/sleep';

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

// 適当
type X = {
  threadId: number;
  commenter: string;
  commentContent: string;
};
export const postComment = async (x: X) => {
  await sleep(250);
  const { threadId, commenter, commentContent } = x;
  const data = { commenter, commentContent };
  const fetchedData = await fetch(`/api/threads/${threadId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!fetchedData.ok) {
    throw new Error('Error at posting comment!');
  }
  return await fetchedData.json();
};
