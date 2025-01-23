"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { AuthContext } from "@/context/authContext";
import { ChatContext } from "@/context/chatContext";
import { useContext, useEffect, useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/database/firebase";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/AppSidebar";
import Header from "./_components/Header";
import { SidebarContext } from "@/context/sidebarContext";
import { GenerateCodeContext } from "@/context/generateCodeContext";

export function Provider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const [messages, setMessages] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true);
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    // Check local storage and set up auth state immediately
    const localUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (localUser?.sub) {
      const userDocRef = doc(db, "users", localUser.sub);
      // Set initial user state from local storage
      setUser(localUser);

      // Set up real-time listener for user data
      const unsubscribe = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          setUser({ ...localUser, ...userData });
        }
      });

      return () => unsubscribe();
    }
  }, []);

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen, toggleSidebar }}>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
        <AuthContext.Provider value={{ user, setUser }}>
          <GenerateCodeContext.Provider
            value={{ isGenerating, setIsGenerating }}
          >
            <ChatContext.Provider value={{ messages, setMessages }}>
              <NextThemesProvider {...props}>
                <SidebarProvider onOpenChange={setIsOpen} open={isOpen}>
                  <AppSidebar />
                  <div className="flex flex-col w-full h-full">
                    <Header />
                    {user && (
                      <div className="absolute left-auto size-12 top-20 z-50">
                        <SidebarTrigger onMouseEnter={() => setIsOpen(true)} />
                      </div>
                    )}
                    {children}
                  </div>
                </SidebarProvider>
              </NextThemesProvider>
            </ChatContext.Provider>
          </GenerateCodeContext.Provider>
        </AuthContext.Provider>
      </GoogleOAuthProvider>
    </SidebarContext.Provider>
  );
}
