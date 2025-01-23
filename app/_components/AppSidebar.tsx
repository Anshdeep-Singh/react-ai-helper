import { useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MessageCircleDashed, MessageSquare, MessageSquarePlus, Plus } from "lucide-react"
import { collection, getDocs, onSnapshot, query } from "firebase/firestore"
import { db } from "@/database/firebase"
import { AuthContext } from "@/context/authContext"
import { workspaceConverter } from "@/database/schemas"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/context/sidebarContext"

export function AppSidebar() {
  const [workspaces, setWorkspaces] = useState<string[]>([])
  const [workspacesMessages, setWorkspacesMessages] = useState<string[]>([])
  const { user } = useContext(AuthContext)
  const { setIsOpen } = useSidebar();

  const router = useRouter()

  useEffect(() => {
    if (!user?.uid) {
      setWorkspaces([]) // Clear workspaces when user is not logged in
      return
    }

    // Set up real-time listener
    const workspacesRef = collection(db, "workspaces", user.uid, "userWorkspaces")
    const unsubscribe = onSnapshot(workspacesRef, (snapshot) => {
      const workspacesData = snapshot.docs.map(doc => doc.id)
      const workspacesMessages = snapshot.docs.map(doc => doc.data().messages[0].content)
      setWorkspaces(workspacesData)
      setWorkspacesMessages(workspacesMessages)
      // console.log(workspacesMessages)
    })

    // Cleanup subscription
    return () => unsubscribe()
  }, [user?.uid])

  const handleClick = (workspaceId: string) => {
    router.push(`/workspace/${workspaceId}`);
    setIsOpen(false); // Just set it to false directly
  }
  return (
    <Sidebar className="z-40" onMouseLeave={() => setIsOpen(false)}>
      <SidebarHeader className="flex items-center justify-center p-5 mt-12">
        <Button 
          className="w-full justify-start" 
          onClick={() => router.push('/')}
        >
          <MessageSquarePlus className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu >
            <h1 className="text-md text-white">Chat History</h1>
            {workspaces.map((workspaceId, index) => (
              <SidebarMenuItem key={workspaceId}>
                <SidebarMenuButton
                  onClick={() => handleClick(workspaceId)}
                >
                  <div className="flex items-center text-xs justify-center text-white">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    {workspacesMessages[index]?.slice(0, 25) + '...'}
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
  