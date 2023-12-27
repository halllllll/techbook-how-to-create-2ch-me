import { type FC, FormEventHandler, useState, useRef, useCallback, useEffect } from "react";
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
import { ThreadAction } from "../types/types";
import { useErrorBoundary } from "react-error-boundary";

export interface ThreadFormContentProps {
  threadDispatch: React.Dispatch<ThreadAction>;
}


export const ThreadForm:FC<ThreadFormContentProps> = ({threadDispatch}) =>{
    const [isError, setIsError] = useState<boolean>(false); // メッセージ自体じゃなくてエラーのスイッチにした（横着）
  // 本書に倣ってuseRefを使う
  const formRef = useRef<HTMLFormElement>(null);
  const threadTitleRef = useRef<HTMLInputElement>(null);
  const threadTopicRef = useRef<HTMLTextAreaElement>(null);

  const {resetBoundary, showBoundary} = useErrorBoundary()

  const handleSubmit = useCallback<FormEventHandler>(async (event) => {
    event.preventDefault();
    setIsError(false);
    if (!threadTitleRef.current?.value || !threadTopicRef.current?.value) {
      setIsError(true);
      return;
    }
    const data = { title: threadTitleRef.current.value, topic: threadTopicRef.current.value };

    const fetchedNewThread = await fetch('/api/threads', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if(!fetchedNewThread.ok){
      
        formRef.current?.reset();
        showBoundary(new Error("Error in FETCHING!"));
      }
      const result = await fetchedNewThread.json();
      
      threadDispatch({ type: 'add_thread', newThread: result });
      formRef.current?.reset();
  }, []);

  const sleep = async  (n: number) => {
    return new Promise((resolve) => setTimeout(resolve, n))
  } 
  
  useEffect((): void=>{
    console.log("preprocess before rendering component...")
    // なんかめっちゃ長いなにか
    const f = async () => {
      await sleep(1000000)
    }
    console.log("done!")
    void f()
  }, [])

    return(
        <form ref={formRef} onSubmit={handleSubmit}>
          <VStack>
            <FormControl isRequired isInvalid={isError}>
              <HStack spacing={5}>
                <FormLabel>タイトル</FormLabel>
                <VStack spacing={0}>
                  <Input ref={threadTitleRef} />
                  <FormErrorMessage>タイトルを入力してください！</FormErrorMessage>
                </VStack>
              </HStack>
            </FormControl>

            <FormControl isRequired isInvalid={isError}>
              <HStack spacing={5}>
                <FormLabel>トピック</FormLabel>
                <VStack>
                  <Textarea ref={threadTopicRef} />
                  <FormErrorMessage>トピックを入力してください！</FormErrorMessage>
                </VStack>
              </HStack>
            </FormControl>
            <Center>
              <Button type="submit">送信</Button>
            </Center>
          </VStack>
        </form>
    )

}