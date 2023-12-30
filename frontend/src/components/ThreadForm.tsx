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
import { type FC, FormEventHandler, useCallback, useRef, useState } from 'react';
import { usePostThread } from '../service/thread';
import { ThreadFormProps } from '../types/types';

export const ThreadForm: FC<ThreadFormProps> = ({ threadsDispatch }) => {
  const [isError, setIsError] = useState<boolean>(false); // メッセージ自体じゃなくてエラーのスイッチにした（横着）
  // 本書に倣ってuseRefを使う
  const formRef = useRef<HTMLFormElement>(null);
  const threadTitleRef = useRef<HTMLInputElement>(null);
  const threadTopicRef = useRef<HTMLTextAreaElement>(null);

  const { mutate, isPending } = usePostThread();
  const handleSubmit = useCallback<FormEventHandler>(
    async (event) => {
      event.preventDefault();
      setIsError(false);
      // 超簡易的バリデーションチェック(手抜き)
      if (!threadTitleRef.current?.value || !threadTopicRef.current?.value) {
        setIsError(true);
        return;
      }

      // ここからTanStack QueryのuseMutationを使う
      // （useMutationのオプションで設定しているため、react-error-boundaryのためのshowBoundaryは不要）
      const data = { title: threadTitleRef.current.value, topic: threadTopicRef.current.value };
      mutate(data, {
        onSuccess: () => formRef.current?.reset(),
        onError: () => {},
      });
    },
    [mutate],
  );

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <VStack>
        <FormControl isRequired isInvalid={isError}>
          <HStack spacing={5}>
            <FormLabel>タイトル</FormLabel>
            <VStack spacing={0}>
              <Input ref={threadTitleRef} isDisabled={isPending} />
              <FormErrorMessage>タイトルを入力してください！</FormErrorMessage>
            </VStack>
          </HStack>
        </FormControl>

        <FormControl isRequired isInvalid={isError}>
          <HStack spacing={5}>
            <FormLabel>トピック</FormLabel>
            <VStack>
              <Textarea ref={threadTopicRef} isDisabled={isPending} />
              <FormErrorMessage>トピックを入力してください！</FormErrorMessage>
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
