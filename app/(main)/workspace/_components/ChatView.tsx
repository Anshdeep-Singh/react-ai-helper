"use client";

import { AuthContext } from "@/context/authContext";
import { ChatContext } from "@/context/chatContext";
import React, { useContext, useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/database/firebase";
import { workspaceConverter } from "@/database/schemas";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Prompts from "@/data/Prompts";
import { chatSession } from "@/config/GeminiConfig";
import { Loader, Bot, BotMessageSquareIcon, MessageSquare } from "lucide-react";
import ReactMarkdown from 'react-markdown'
import { GenerateCodeContext } from "@/context/generateCodeContext";

const ChatView = ({ id }: { id: string }) => {
  const { user } = useContext(AuthContext);
  const { messages, setMessages } = useContext(ChatContext);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isGenerating, setIsGenerating } = useContext(GenerateCodeContext);
  const messageContainerRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    const fetchWorkspace = async () => {
      console.log("Current user state:", user);

      if (!user?.uid) {
        console.log("No user found");
        return;
      }

      const workspaceRef = doc(
        db,
        "workspaces",
        user.uid,
        "userWorkspaces",
        id
      ).withConverter(workspaceConverter);

      try {
        const workspaceSnap = await getDoc(workspaceRef);
        if (workspaceSnap.exists()) {
          const workspace = workspaceSnap.data();
        //   console.log("Workspace data:", workspace);
        //   console.log("Workspace messages:", JSON.stringify(workspace.fileData));
          setMessages(workspace.messages || []);
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error("Error fetching workspace:", error);
        setMessages([]);
      }
    };

    fetchWorkspace();
  }, [user, id, setMessages]);

  const getAiResponse = async () => {
    setIsLoading(true);
    try {
      const PROMPT = JSON.stringify(messages) + Prompts.CHAT_PROMPT;
      console.log("PROMPT", PROMPT);
      const response = await chatSession.sendMessage(PROMPT);
      const responseText = await response.response.text();
      const responseData = JSON.parse(responseText);
      console.log("responseData", responseData);
      console.log("responseData", responseData[0].response);

      if (!responseData[0]?.response) {
        throw new Error("Invalid AI response format");
      }

      const newMessage = {
        role: "assistant",
        content: responseData[0].response,
      };
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      await SaveMessages(updatedMessages);
    } catch (error) {
      console.error("Error fetching AI response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const SaveMessages = async (messagesToSave: typeof messages) => {
    const workspaceRef = doc(
      db,
      "workspaces",
      user?.uid,
      "userWorkspaces",
      id
    ).withConverter(workspaceConverter);
    await updateDoc(workspaceRef, { messages: messagesToSave });
  };

  useEffect(() => {
    if (messages.length > 0 && !isLoading) {
      const lastMessage = messages[messages.length - 1];
      // Only get AI response if the last message is from user and we haven't processed it yet
      if (lastMessage.role === "user" && !lastMessage.processed) {
        (async () => {
          // Mark message as processed to prevent multiple calls
          messages[messages.length - 1].processed = true;
          await getAiResponse();
          setIsGenerating(false);
        })();
      }
    }
  }, [messages]);

  const handleGetAnswer = async () => {
    if (userInput.trim() === "") return;
    const newMessage = {
      role: "user",
      content: userInput,
    };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    await SaveMessages(updatedMessages);
    setUserInput("");
  };

  return (
    <div className="flex flex-col space-y-4 relative h-[80vh] bg-gray-600 rounded-lg shadow-inner shadow-gray-900 p-5">
      <div ref={messageContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-500 rounded-lg shadow-inner shadow-gray-900 ">
        {messages.map((message: any, index: number) => (
          <div
            key={index}
            className={`flex leading-7 ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`
              max-w-[90%] p-4 rounded-lg
              ${
                message.role === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-gray-800 text-white rounded-bl-none"
              }
            `}
            >
              <div className="flex items-center gap-2 mb-2">
                {message.role === "assistant" && <Bot className="w-4 h-4 text-gray-300 animate-pulse" />}
                <p className="text-xs text-gray-300">
                  {message.role === "user"
                    ? user?.name.split(" ")[0] || "User"
                    : "AI Assistant"}
                </p>
              </div>
              <ReactMarkdown className="text-sm flex flex-col gap-2 flex-wrap break-words">{message.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-gray-300 mt-2">
            <Loader className="w-4 h-4 animate-spin" />
            <span className="text-sm">AI is thinking...</span>
          </div>
        )}
      </div>
      <div className="mx-auto w-full max-w-3xl space-y-4 ">
        <Textarea
          placeholder="Type your question here..."
          required
          className="min-h-[200px] resize-none bg-gray-700 text-white placeholder:text-gray-400 border-gray-600 focus-visible:ring-gray-500"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <div className="flex justify-end items-center">
          <Button size="lg" disabled={isLoading} onClick={handleGetAnswer}>
            <BotMessageSquareIcon size={20} className={`${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "Loading..." : "Send Message"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
