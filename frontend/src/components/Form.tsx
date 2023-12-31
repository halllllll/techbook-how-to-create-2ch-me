import {
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { type FC, FormEventHandler, RefObject } from 'react';

type Props = {
  formRef: RefObject<HTMLFormElement>;
  inputRef: RefObject<HTMLInputElement>;
  inpuTitle: string;
  textareaRef: RefObject<HTMLTextAreaElement>;
  textareaTitle: string;
  isError: boolean;
  isPending: boolean;
  handleSubmit: FormEventHandler;
};

export const Form: FC<Props> = (props) => {
  const {
    formRef,
    inputRef,
    inpuTitle,
    textareaRef,
    textareaTitle,
    isError,
    isPending,
    handleSubmit,
  } = props;
  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <VStack>
        <FormControl isRequired isInvalid={isError}>
          <HStack spacing={5}>
            <FormLabel>{inpuTitle}</FormLabel>
            <VStack spacing={0}>
              <Input ref={inputRef} isDisabled={isPending} />
              <FormErrorMessage>{`${inpuTitle}を入力してください！`}</FormErrorMessage>
            </VStack>
          </HStack>
        </FormControl>

        <FormControl isRequired isInvalid={isError}>
          <HStack spacing={5}>
            <FormLabel>{textareaTitle}</FormLabel>
            <VStack>
              <Textarea ref={textareaRef} isDisabled={isPending} />
              <FormErrorMessage>{`${textareaTitle}を入力してください！`}</FormErrorMessage>
            </VStack>
          </HStack>
        </FormControl>
        <Center>
          <Button type="submit" isLoading={isPending}>
            送信
          </Button>
        </Center>
      </VStack>
    </form>
  );
};
