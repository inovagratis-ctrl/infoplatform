import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AdminSidebar } from "./AdminSidebar"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== "admin") redirect("/login")

  return (
    <div className="flex min-h-[80vh] bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 p-6 lg:p-8 overflow-auto">
        {children}
      </div>
    </div>
  )
}
