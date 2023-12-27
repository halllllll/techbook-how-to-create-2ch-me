import { Box, Container } from '@chakra-ui/react';
import { type FC } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export const Layout: FC = () => {
  return (
    <>
      <Container w={'container.md'}>
        <Header />
        <Box>これは固定</Box>
        <Outlet />
      </Container>
    </>
  );
};
