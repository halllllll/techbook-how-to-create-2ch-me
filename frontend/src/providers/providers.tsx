import { ChakraProvider } from '@chakra-ui/react';
import { type FC } from 'react';
import { RouterProvider } from 'react-router-dom';
import { UserProvider } from '../context/userContext';
import { router } from '../routes';
import { QueryProvider } from './queryProvider';

export const Providers: FC = () => {
  return (
    <QueryProvider>
      <UserProvider>
        <ChakraProvider>
          <RouterProvider router={router} />
        </ChakraProvider>
      </UserProvider>
    </QueryProvider>
  );
};
