import { Box, Button, Text } from '@chakra-ui/react';
import { FC } from 'react';
import { FallbackProps } from 'react-error-boundary';

export const ErrorFallback: FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  const err = error as Error;

  return (
    <Box>
      <Text>エラー発生: {err.message}</Text>
      <Button
        onClick={() => {
          resetErrorBoundary();
        }}
      >
        エラーをクリア
      </Button>
    </Box>
  );
};
