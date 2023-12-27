import {
  Box,
  Heading,
  Text,
} from '@chakra-ui/react';
import { type FC, useState, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ThreadFormProps } from '../types/types';
import { ErrorFallback } from './ErrorFallback';
import { ThreadForm } from './ThreadForm';

function ThrowError():JSX.Element {
  throw new Error ('YES got Throw Error')
}

export const ThreadFormRoot: FC<ThreadFormProps> = ({ threadDispatch }) => {
  const [errCount, setErrCount] = useState<number>(0)
  return (
    <Box>
      <Heading as="h2">スレッドの新規作成</Heading>
      <ErrorBoundary FallbackComponent={ErrorFallback} onError={()=>{
        console.error("エラーがおきたってさ！")
        setErrCount(errCount+1)
      }}>
        {errCount > 0 && (
          <Box><Text as={"p"} color={"tomato"} fontSize={"xl"}>{`エラー回数: ${errCount}`}</Text></Box>
        )}
        <Suspense fallback={<h2>Loading.....</h2>}>
         <ThreadForm threadDispatch={threadDispatch}/>
        </Suspense>
      </ErrorBoundary>
    </Box>
  );
};
