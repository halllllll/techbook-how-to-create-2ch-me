import { Box, ListItem, OrderedList } from '@chakra-ui/react';
import { type FC } from 'react';
import { useGetThreads } from '../service/thread';
import { ThreadContentProps } from '../types/types';

export const ThreadList: FC<ThreadContentProps> = ({ threadsDispatch }) => {
  const { data: result } = useGetThreads();
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
