import { Box, ListItem, Thead, UnorderedList } from '@chakra-ui/react';
import { type FC } from 'react';
import { useGetThreadCommentsCount } from '../service/comment';
import { useGetThreads } from '../service/thread';

export const ThreadList: FC = () => {
  const { data } = useGetThreads();
  const { record: commentsCount } = useGetThreadCommentsCount(data.map((d) => d.id));

  return (
    <>
      <Box>
        <UnorderedList styleType={'none'}>
          {data.map((thread) => {
            return (
              <ListItem key={thread.id}>
                <Box>
                  {thread.id}: {thread.title} {commentsCount[thread.id]}
                </Box>
              </ListItem>
            );
          })}
        </UnorderedList>
      </Box>
    </>
  );
};
