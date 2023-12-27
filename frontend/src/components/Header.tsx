import { Flex, Heading } from '@chakra-ui/react';
import { type FC } from 'react';
import { Link } from 'react-router-dom';

export const Header: FC = () => {
  return (
    <Flex
      w="100%" // 100vwだと一定の幅以下で文頭が左端にめり込んだことがあった
      h="8vh"
      position="sticky"
      pos="relative"
      align="center"
      bg={'gray'}
    >
      <Link to={'/'}>
        <Heading as={'h1'}>掲示板</Heading>
      </Link>
    </Flex>
  );
};
