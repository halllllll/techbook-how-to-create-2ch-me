// reducerの実装と初期値

import { ThreadAction, ThreadState, UserAction, UserState } from '../types/types';

const initialize = <T extends UserState | ThreadState>(initialState: T): T => {
  return {
    ...initialState,
    isLoading: false,
  };
};

export const userInitialState: UserState = {
  user: null,
  isLoading: true,
  error: null,
};

export const userReducer = (userState: UserState, action: UserAction): UserState => {
  // 実装
  switch (action.type) {
    case 'add_comment':
      if (userState.user === null) return userState;
      return {
        user: {
          ...userState.user,
          comments: [...userState.user.comments, action.newComment],
        },
        isLoading: false,
        error: null,
      };
    case 'set_user':
      return {
        user: action.user,
        isLoading: false,
        error: null,
      };
    case 'set_error':
      return {
        ...userState,
        isLoading: false,
        error: action.error,
      };
    case 'reset':
      return initialize(userInitialState);
    default:
      return userState;
  }
};

export const threadInitialState: ThreadState = {
  threads: [],
  isLoading: true,
  currentThread: null,
  error: null,
};

export const ThreadReducer = (threadState: ThreadState, action: ThreadAction): ThreadState => {
  switch (action.type) {
    case 'add_thread':
      return {
        ...threadState,
        threads: [...threadState.threads, action.newThread],
        isLoading: false,
        error: null,
      };
    case 'set_threads':
      return {
        ...threadState,
        threads: action.threads,
        isLoading: false,
        error: null,
      };
    case 'set_error':
      return {
        ...threadState,
        isLoading: false,
        error: action.error,
      };
    case 'reset':
      return initialize(threadInitialState);
    default:
      return threadState;
  }
};
