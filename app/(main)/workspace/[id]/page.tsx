"use client";
import React, { useState } from "react"
import ChatView from "../_components/ChatView"
import CodeView from "../_components/CodeView"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function WorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params)
  const [isChatVisible, setIsChatVisible] = useState(true);

  return (
    <div className="py-8 w-full max-w-[1800px] mx-auto px-6 relative">
      <div className="flex gap-6">
        <div className={`transition-all duration-300 ${isChatVisible ? 'w-[30%]' : 'w-0'}`}>
          {isChatVisible && <ChatView id={resolvedParams.id} />}
        </div>
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 mx-5 bg-transparent hover:cursor-pointer"
          onClick={() => setIsChatVisible(!isChatVisible)}
        >
          {isChatVisible ? <ChevronLeft /> : <ChevronRight />}
        </div>
        <div className={`transition-all duration-300 ${isChatVisible ? 'w-[70%]' : 'w-full'}`}>
          <CodeView id={resolvedParams.id} />
        </div>
      </div>
    </div>
  )
}

