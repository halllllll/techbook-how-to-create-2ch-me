import { Thread } from '../../types/types';
import { sleep } from '../../utils/sleep';

export const getThread = async (threadId: number): Promise<Thread> => {
  await sleep(200);
  const fetchedData = await fetch(`/api/threads/${threadId}`);
  if (!fetchedData.ok) {
    throw new Error(`Error at fetching thread ${threadId}!`);
  }
  return await fetchedData.json();
};

export const getThreads = async (): Promise<Thread[]> => {
  await sleep(500);
  const fetchedData = await fetch('/api/threads');
  if (!fetchedData.ok) {
    throw new Error('Error at fetching threads!');
  }
  return await fetchedData.json();
};

// TODO: あとでなんかする（もしくは何もしなさそう）
type P = {
  title: string;
  topic: string;
};
export const postThread = async (p: P) => {
  await sleep(500);
  const fetchedNewThread = await fetch('/api/threads', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(p),
  });
  if (!fetchedNewThread.ok) {
    throw new Error('Error at posting thread!');
  }
  return await fetchedNewThread.json();
};
