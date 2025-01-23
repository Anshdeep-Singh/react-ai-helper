// Header.tsx 

"use client"

import Link from "next/link"
import { LogIn, LogOut, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useContext, useState } from "react"
import { AuthContext } from "@/context/authContext"
import LoginModal from "./LoginModal"
import { useRouter } from "next/navigation"
import { SidebarTrigger } from "@/components/ui/sidebar"

export default function Header() {
  const { user, setUser } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  }


  return (
    <>
    <header className="w-full sticky top-0 h-[70px] px-8 py-4 flex items-center justify-between bg-background border-b transition-all duration-300 hover:shadow-lg backdrop-blur-sm bg-background/95 mb-4">
      <div className="flex items-center gap-2">
        <Link href="/" className="text-4xl font-black hover:text-primary transition-all duration-300 hover:scale-110 transform">
          #
        </Link>
      </div>
      <div className="flex items-center gap-6">
        {user ? (
          <Button variant="outline" size="default" className="hover:bg-primary/10" onClick={handleLogout}>
            {user.name?.slice(0, 1).toUpperCase()}
            <span className="ml-3 font-medium">{user.name}</span>
            <LogOut className="w-4 h-4 ml-3 opacity-70" />
          </Button>
        ) : (
          <>
            <Button 
              variant="outline" 
              size="default" 
              onClick={() => setOpen(true)}
              className="hover:bg-primary/10 px-6 transition-all duration-300 hover:scale-105"
            >
              <LogIn className="w-4 h-4 mr-3 opacity-70" />
              Sign In / Get Started
            </Button>
            {/* <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Sign Up
            </Button> */}
          </>
        )}
        <LoginModal open={open} setOpen={setOpen} />
      </div>
    </header>
    </>
  )
}
