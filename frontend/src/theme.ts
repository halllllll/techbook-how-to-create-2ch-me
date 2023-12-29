import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  styles: {
    global: {
      'html, body': {
        fontFamily: '"BIZ UDPGothic",Meiryo, sans-serif',
      },
    },
  },
});

export { theme };
