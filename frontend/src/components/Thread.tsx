import { Box, ListItem, Text, UnorderedList } from '@chakra-ui/react';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { format } from 'date-fns';
import { type FC, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useParams } from 'react-router-dom';
import { useGetThreadComments } from '../service/comment';
import { useGetThread } from '../service/thread';
import { CommentForm } from './CommentForm';
import { ErrorFallback } from './ErrorFallback';

type Props = { threadId: string };
const ThreadContent: FC<Props> = ({ threadId }) => {
  const { data } = useGetThread(Number(threadId));

  return (
    <Box>
      <Text>{`title: ${data.title}`}</Text>
      <Text>{`topic: ${data.topic}`}</Text>
    </Box>
  );
};

const CommentList: FC<Props> = ({ threadId }) => {
  const { data } = useGetThreadComments(Number(threadId));
  return (
    <>
      {data.length > 0 ? (
        <>
          <Box>{`スレッド ${threadId} のコメント`}</Box>
          <UnorderedList>
            {data.map((comment) => {
              return (
                <ListItem key={`${threadId}${comment.commentNo}`}>
                  <Box>
                    <Text>
                      {comment.commentNo}: {comment.commenter}:{' '}
                      {format(comment.createdAt, 'yyyy/MM/dd-HH:mm:ss')}
                    </Text>
                    <Box>{comment.commentContent}</Box>
                  </Box>
                </ListItem>
              );
            })}
          </UnorderedList>
        </>
      ) : (
        <Box>
          <Text>コメントはまだありません</Text>
        </Box>
      )}
    </>
  );
};

export const Thread: FC = () => {
  const { threadId } = useParams();
  if (!threadId) {
    // リダイレクトしてもいいけどエラー返して終わることにする
    throw new Error(`thread ${threadId} is not found`);
  }
  return (
    <>
      {`thread id: ${threadId}`}
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary FallbackComponent={ErrorFallback} onReset={reset}>
            <Suspense fallback={<h2>loading thread...</h2>}>
              <ThreadContent threadId={threadId} />
            </Suspense>
            <Suspense fallback={<h2>loading comments...</h2>}>
              <CommentList threadId={threadId} />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<h2>loading</h2>}>
          <CommentForm threadId={threadId} />
        </Suspense>
      </ErrorBoundary>
    </>
  );
};
