// Hero.tsx

"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { doc, setDoc } from "firebase/firestore"
import { db } from "@/database/firebase"
import { useContext, useState } from "react"
import { AuthContext } from "@/context/authContext"
import { Workspace, workspaceConverter } from "@/database/schemas"
import { ChatContext } from "@/context/chatContext"
import { useRouter } from "next/navigation"


export default function Hero() {

  const { user } = useContext(AuthContext);
  const { messages, setMessages} = useContext(ChatContext);
  const [userInput, setUserInput] = useState("");
  const router = useRouter();



  const handleGenerateAnswer = async () => {
    if (!user?.uid) return;
    
    // Generate a unique workspace ID
    const workspaceId = `${user.uid}_${Date.now()}`;
    
    // Create the updated messages array first
    const updatedMessages = [{ role: "user", content: userInput }];
    
    // Update the state
    setMessages(updatedMessages);
    console.log(user.uid);
    // Create a reference to the new workspace document
    const workspaceRef = doc(
      db, 
      "workspaces", 
      user.uid, 
      "userWorkspaces", 
      workspaceId
    ).withConverter(workspaceConverter);

    // Create the new workspace with the updated messages
    const newWorkspace = new Workspace(updatedMessages, [], user);
    
    try {
      await setDoc(workspaceRef, newWorkspace);
      // console.log("Workspace created successfully:", workspaceId);
      router.push('/workspace/'+workspaceId);
      
    } catch (error) {
      console.error("Error creating workspace:", error);
    }
  }
 
  return (
    <div className="flex h-[80vh] items-center justify-center w-full">
      <div className="w-full max-w-3xl space-y-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
            # AI Coder
          </h1>
          <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
            What do you want to build?
          </p>
        </div>

        <div className="space-y-4">
          <Textarea
            placeholder="Enter your prompt here... (e.g. 'Create a todo list app' or 'Create a calculator app') "
            className="min-h-[200px] resize-none rounded-lg shadow-sm"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <div className="flex justify-center">
            <Button 
              size="lg" 
              onClick={handleGenerateAnswer}
              className="px-8 py-2 text-lg transition-transform hover:scale-105"
            >
              Generate Project
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

