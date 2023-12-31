import { type FC, FormEventHandler, useCallback, useRef, useState } from 'react';
import { usePostComment } from '../service/comment';
import { Form } from './Form';

type Props = {
  threadId: string;
};
export const CommentForm: FC<Props> = ({ threadId }) => {
  const [isError, setIsError] = useState<boolean>(false); // メッセージ自体じゃなくてエラーのスイッチにした（横着）
  // 本書に倣ってuseRefを使う
  const formRef = useRef<HTMLFormElement>(null);
  const commenterRef = useRef<HTMLInputElement>(null);
  const commentRef = useRef<HTMLTextAreaElement>(null);

  const { mutate, isPending } = usePostComment(Number(threadId));
  const handleSubmit = useCallback<FormEventHandler>(
    async (event) => {
      event.preventDefault();
      setIsError(false);
      // 超簡易的バリデーションチェック(手抜き)
      if (!commenterRef.current?.value || !commentRef.current?.value) {
        setIsError(true);
        return;
      }
      const data = {
        threadId: Number(threadId),
        commenter: commenterRef.current?.value,
        commentContent: commentRef.current?.value,
      };
      mutate(data, {
        onSuccess: () => formRef.current?.reset(),
      });
    },
    [mutate, threadId],
  );

  return (
    <Form
      formRef={formRef}
      inputRef={commenterRef}
      inpuTitle={'投稿者'}
      textareaRef={commentRef}
      textareaTitle={'コメント'}
      isError={isError}
      isPending={isPending}
      handleSubmit={handleSubmit}
    />
  );
};
