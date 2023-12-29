import { Box, ListItem, OrderedList } from '@chakra-ui/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { type FC } from 'react';
import { Thread, ThreadContentProps } from '../types/types';

const sleep = async (n: number) => {
  return new Promise((resolve) => setTimeout(resolve, n));
};

const fetchData = async (): Promise<Thread[]> => {
  await sleep(2000);
  const fetchedData = await fetch('/api/threadsx');
  if (!fetchedData.ok) {
    throw new Error('Error in fetching!');
  }
  return await fetchedData.json();
};

const useFetchData = (): Thread[] => {
  const { data, error } = useSuspenseQuery({ queryKey: ['yes'], queryFn: fetchData });
  if (error) throw error;
  return data;
};

export const ThreadList: FC<ThreadContentProps> = ({ threadsDispatch, threadsState }) => {
  const result = useFetchData();
  console.dir(result);
  return (
    <>
      <Box>
        <OrderedList>
          {result.map((thread) => {
            return (
              <ListItem key={thread.id}>
                <Box>
                  {thread.id}: {thread.title}
                </Box>
              </ListItem>
            );
          })}
        </OrderedList>
      </Box>
    </>
  );
};
