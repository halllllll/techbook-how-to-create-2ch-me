import { Box, Heading, Text } from '@chakra-ui/react';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { type FC, Suspense, useReducer, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ThreadReducer, threadInitialState } from '../reducers/reducer';
import { ErrorFallback } from './ErrorFallback';
import { ThreadForm } from './ThreadForm';
import { ThreadList } from './ThreadList';

export const ThreadFormRoot: FC = () => {
  const [threadsState, threadsDispatch] = useReducer(ThreadReducer, threadInitialState);

  const [errCount, setErrCount] = useState<number>(0);

  return (
    <Box>
      <Heading as="h2">スレッドの新規作成</Heading>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onError={() => {
          setErrCount(errCount + 1);
        }}
      >
        {errCount > 0 && (
          <Box>
            <Text as={'p'} color={'tomato'} fontSize={'xl'}>{`エラー回数: ${errCount}`}</Text>
          </Box>
        )}
        <ThreadForm threadsDispatch={threadsDispatch} />
      </ErrorBoundary>

      <Heading as="h2">スレッド一覧</Heading>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary FallbackComponent={ErrorFallback} onReset={reset}>
            <Suspense fallback={<h2>ちょっとまっててね〜</h2>}>
              <ThreadList threadsState={threadsState} threadsDispatch={threadsDispatch} />
            </Suspense>
            <hr />
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </Box>
  );
};
