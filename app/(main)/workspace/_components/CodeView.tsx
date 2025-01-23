"use client";
import React, { useContext, useEffect, useState } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
  Sandpack,
  SandpackConsole,
  useActiveCode,
} from "@codesandbox/sandpack-react";
import { Button } from "@/components/ui/button";
import { ChatContext } from "@/context/chatContext";
import Prompts from "@/data/Prompts";
import SetupConfig from "@/data/SetupConfig";
import { chatSessionAiFiles } from "@/config/GeminiConfig";
import { AuthContext } from "@/context/authContext";
import { workspaceConverter } from "@/database/schemas";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/database/firebase";
import { Loader } from "lucide-react";
import { GenerateCodeContext } from "@/context/generateCodeContext";

const CodeView = ({ id }: { id: string }) => {
  const [openPreview, setOpenPreview] = useState(false);
  const [files, setFiles] = useState(SetupConfig.DEFAULT_FILE);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const { messages, setMessages } = useContext(ChatContext);
  const { isGenerating, setIsGenerating } = useContext(GenerateCodeContext);
  const [fileHistory, setFileHistory] = useState('');

  const SaveInDatabase = async ( files: any) => {
    const workspaceRef = doc(db, "workspaces", user?.uid, "userWorkspaces", id).withConverter(workspaceConverter);
    await updateDoc(workspaceRef, { fileData: files });
    setFileHistory(JSON.stringify(files));
  }

  const GetFromDatabase = async () => {
    setIsLoading(true);
    const workspaceRef = doc(db, "workspaces", user.uid, "userWorkspaces", id).withConverter(workspaceConverter);
    const workspace = await getDoc(workspaceRef);
    // console.log("Getting from database");
    if (workspace.data()?.fileData) {
    //   console.log("workspace.data()?.fileData : ", JSON.stringify(workspace.data()?.fileData));
      setFileHistory(JSON.stringify(workspace.data()?.fileData));
      const mergedFiles = { ...SetupConfig.DEFAULT_FILE, ...workspace.data()?.fileData };
      setFiles(mergedFiles);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    if (id && user?.uid) {
      GetFromDatabase();
    }
  }, [id, user?.uid]);
  

  const generateAiCode = async () => {
     try {
        setIsLoading(true);
        const PROMPT = JSON.stringify(messages) + " #####\n " + Prompts.CODE_GEN_PROMPT + " \n ##### Past File History Only For Reference#####\n " + fileHistory;
        // const PROMPT = JSON.stringify(messages) + " #####\n " + Prompts.CODE_GEN_PROMPT;
        // console.log("PROMPT", PROMPT);
        
        // Get the response stream
        const response = await chatSessionAiFiles.sendMessage(PROMPT);
        
        // Wait for the response to complete
        const text = await response.response.text();
        // console.log("Complete response text:", text);

        if (!text) {
          console.error("Response text is empty");
          return;
        }

        try {
          const aiResponse = JSON.parse(text);
          const mergedFiles = { ...SetupConfig.DEFAULT_FILE, ...aiResponse?.files };
          setFiles(mergedFiles);
          await SaveInDatabase(aiResponse?.files);
        } catch (parseError) {
          console.error("Failed to parse response text:", text);
          console.error("Parse error:", parseError);
        }
     } catch (error) {
        console.error("Error generating AI code:", error);
     } finally {
        setIsLoading(false);
        setOpenPreview(true);
     }
  }

  useEffect(() => {
    if (messages.length > 0 && !isGenerating) {
        const role = messages[messages.length - 1].role;
        if (role === "assistant") {
            generateAiCode();
            setIsGenerating(true);
        }
      }
  }, [messages, fileHistory, isGenerating]);

  return (
    <div className="h-[80vh] w-full relative bg-gray-600 p-5 rounded-lg shadow-inner shadow-gray-900">
      <div className="flex items-center gap-2 mb-4">
        <Button
          size="sm"
          className={`relative px-8 transition-colors ${
            openPreview ? "bg-gray-600 text-white" : "hover:bg-gray-700/10"
          }`}
          onClick={() => setOpenPreview(!openPreview)}
        >
          <span
            className={`absolute left-2 transition-opacity ${
              openPreview ? "opacity-100" : "opacity-0"
            }`}
          >
            ◀
          </span>
          {openPreview ? "Code" : "Preview"}
          <span
            className={`absolute right-2 transition-opacity ${
              !openPreview ? "opacity-100" : "opacity-0"
            }`}
          >
            ▶
          </span>
        </Button>
      </div>
    
      <div className="relative">
        <SandpackProvider
          template="react"
          theme="dark"
          files={files}
          customSetup={{
            dependencies: {
              ...SetupConfig.DEPENDANCY,
            },
          }}
          options={{
            externalResources: ["https://cdn.tailwindcss.com"],
          }}
        >
          <SandpackLayout className="h-[70vh]">
            {!openPreview && (
              <>
                <SandpackFileExplorer
                  style={{
                    height: "100%",
                    minWidth: "200px",
                    maxWidth: "200px",
                  }}
                />
                <SandpackCodeEditor
                  showTabs={true}
                  showLineNumbers={true}
                  showRunButton={true}
                  showInlineErrors={true}
                  closableTabs={true}
                  wrapContent={true}   
                  style={{
                    height: "100%",
                    flex: 1,
                  }}
                  
                />
              </>
            )}
            {openPreview && (
              <SandpackPreview
              showOpenInCodeSandbox={true}
              showRefreshButton={true}
              showRestartButton={true}
              showOpenNewtab={true}
                style={{
                  height: "100%",
                  width: "100%",
                  minWidth: "100%",
                  
                }}
                showNavigator={true}
              />
            )}
          </SandpackLayout>
        </SandpackProvider>

        {isLoading && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="flex items-center gap-2 text-white">
              <Loader className="w-4 h-4 animate-spin" />
              <span className="text-sm">AI is generating code...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeView;
