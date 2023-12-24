import { ChakraProvider } from '@chakra-ui/react';
import { type FC } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '../routes';

export const Providers: FC = () => {
  return (
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  );
};
