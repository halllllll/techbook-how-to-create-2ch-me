import {
  type FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { userInitialState, userReducer } from '../reducers/reducer';
import { UserCtxType } from '../types/types';

// createContextもここでやってる
const UserContext = createContext<UserCtxType>(null);

// propsはtypesで定義したほうがいいかも
type Props = {
  children: ReactNode;
};
export const UserProvider: FC<Props> = ({ children }) => {
  // UserCtx用のDispatcherを作るなど
  const [userState, userDispatch] = useReducer(userReducer, userInitialState);
  const setTokenDemo = (token: string | undefined) => {
    console.log(token);
  };

  return (
    <UserContext.Provider value={{ userState, userDispatch, setToken: setTokenDemo }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = (): UserCtxType => {
  const ctx = useContext(UserContext);
  if (ctx === null) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return ctx;
};
