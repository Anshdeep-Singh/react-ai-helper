"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AuthContext } from "@/context/authContext"
import { useGoogleLogin } from "@react-oauth/google"
import axios from "axios"
import { useContext, useState } from "react"
import { FcGoogle } from "react-icons/fc"
import { doc, setDoc, getDoc } from "firebase/firestore"; 
import { db } from "@/database/firebase"
import { User, userConverter } from "@/database/schemas"
import { v4 as uuid4 } from 'uuid';
import { useRouter } from "next/navigation"


export default function LoginModal({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {

    const { user, setUser } = useContext(AuthContext);
    const router = useRouter();
    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
          console.log(tokenResponse);
          const userInfo = await axios.get(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            { headers: { Authorization: `Bearer ${tokenResponse?.access_token}` } },
          );
      
          console.log(userInfo);
          setUser(userInfo?.data);
          const userDocRef = doc(db, 'users', userInfo?.data?.sub).withConverter(userConverter);
          
          // Check if user document exists
          const docSnap = await getDoc(userDocRef);
          
          // Only create new document if user doesn't exist
          if (!docSnap.exists()) {
            await setDoc(userDocRef, new User(userInfo?.data?.name, userInfo?.data?.email, uuid4()));
          }

          if(typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(userInfo?.data));
          }

          setOpen(false);
          window.location.href = '/';  // This will force a full page reload
        },
        onError: errorResponse => console.log(errorResponse),
      });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Sign In
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center py-6">
          <Button 
            variant="outline" 
            size="lg"
            className="w-full max-w-sm"
            onClick={() => googleLogin()}
          >
            <FcGoogle className="mr-2 h-5 w-5" />
            Continue with Google
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
