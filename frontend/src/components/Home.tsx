import { Box } from '@chakra-ui/react';
import { type FC, useReducer } from 'react';
import { ThreadReducer, threadInitialState } from '../reducers/reducer';
import { ThreadFormRoot } from './ThreadFormRoot';

export const Home: FC = () => {
  const [threadState, threadDispatch] = useReducer(ThreadReducer, threadInitialState);

  return (
    <>
      <Box>here is home</Box>
      <ThreadFormRoot threadDispatch={threadDispatch} />
    </>
  );
};
