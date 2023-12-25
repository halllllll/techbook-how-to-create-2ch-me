import { Box, Heading } from '@chakra-ui/react';
import { type FC } from 'react';
import { Link } from 'react-router-dom';

export const Header: FC = () => {
  return (
    <Box as={'header'}>
      <Link to={'/'}>
        <Heading as={"h1"}>掲示板</Heading>
      </Link>
    </Box>
  );
};
