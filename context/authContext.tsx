import { Dispatch, SetStateAction, createContext } from "react";

type AuthContextType = {
  user: any;
  setUser: Dispatch<SetStateAction<any>>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {}
});