"use client"
import { Button } from '@/components/ui/button';
import { SandpackPreview, useSandpack, type SandpackPreviewRef } from '@codesandbox/sandpack-react'
import { RocketIcon } from 'lucide-react';
import React, { useRef, useEffect } from 'react'

function SandpackPreviewClient() {
    const { sandpack } = useSandpack();
    const previewRef = useRef<SandpackPreviewRef>(null);


    const getClient = async () => {
        const client = previewRef.current?.getClient();
     
        if (client && sandpack) {
          // @ts-ignore
          const result = await client.getCodeSandboxURL();
          console.log(result);
          window.open(`https://${result.sandboxId}.csb.app/`, '_blank');

        }    
    }

  return (
    <>
    <SandpackPreview
              showOpenInCodeSandbox={true}
              showRefreshButton={true}
              showRestartButton={true}
              ref={previewRef}
              showOpenNewtab={true}
                style={{
                  height: "100%",
                  width: "100%",
                  minWidth: "100%",
                  
                }}
                actionsChildren={
                    <div className="flex items-center gap-2 bg-gray-900 p-2 rounded-full">
                        <div onClick={getClient} className="flex items-center gap-2 cursor-pointer opacity-50 hover:opacity-100 transition-all duration-300">
                            <RocketIcon size={20} />
                            Deploy</div>
                    </div>
                }
                showNavigator={true}
              />
    </>
  )
}

export default SandpackPreviewClient
