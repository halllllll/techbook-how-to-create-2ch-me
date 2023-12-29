import React from 'react';

export type UserCtxType = {
  userState: UserState;
  userDispatch: React.Dispatch<UserAction>;
  setToken: (token: string | undefined) => void;
} | null;

export type User = {
  name: string;
  hashedPassword: string;
  likes: string[];
  comments: number[];
  token: string;
  id: number;
} | null;

export type UserState = {
  user: User;
  isLoading: boolean;
  error: null | string;
};

export type UserAction =
  | {
      type: 'add_comment';
      newComment: number;
    }
  | {
      type: 'set_user';
      user: User;
    }
  | {
      type: 'set_error';
      error: string | null;
    }
  | {
      type: 'reset';
    };

export type Thread = {
  id: number;
  title: string;
  topic: string;
  createdAt: string;
  commentTotal: number;
  builder: string;
};

export type ThreadState = {
  threads: Thread[];
  isLoading: boolean;
  currentThread: null | Thread;
  error: null | string;
};

export type ThreadAction =
  | {
      type: 'add_thread';
      newThread: Thread;
    }
  | {
      type: 'set_threads';
      threads: Thread[];
    }
  | {
      type: 'set_error';
      error: string | null;
    }
  | {
      type: 'reset';
    };

export type ThreadFormProps = {
  threadsDispatch: React.Dispatch<ThreadAction>;
};

export type ThreadContentProps = ThreadFormProps & {
  threadsState: ThreadState;
};
