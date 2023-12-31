import { type FC, FormEventHandler, useCallback, useRef, useState } from 'react';
import { usePostThread } from '../service/thread';
import { Form } from './Form';

export const ThreadForm: FC = () => {
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
    <Form
      formRef={formRef}
      inputRef={threadTitleRef}
      inpuTitle={'タイトル'}
      textareaRef={threadTopicRef}
      textareaTitle={'トピック'}
      isError={isError}
      isPending={isPending}
      handleSubmit={handleSubmit}
    />
  );
};
