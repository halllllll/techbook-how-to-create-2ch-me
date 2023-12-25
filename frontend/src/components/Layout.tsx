import { Box } from '@chakra-ui/react';
import { type FC } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export const Layout: FC = () => {
  return (
    <>
      <Header />
      <Box>これは固定</Box>
      <Outlet />
    </>
  );
};
