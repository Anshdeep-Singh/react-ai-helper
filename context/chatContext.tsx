import { Dispatch, SetStateAction, createContext } from "react";

type ChatContextType = {
  messages: any[];
  setMessages: Dispatch<SetStateAction<any[]>>;
}

export const ChatContext = createContext<ChatContextType>({
  messages: [],
  setMessages: () => {}
});