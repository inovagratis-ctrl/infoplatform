import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ProducerSidebar } from "./ProducerSidebar"

export default async function ProducerLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")
  const user = session.user as any
  if (user.role !== "producer" && user.role !== "admin") redirect("/")

  return (
    <div className="flex min-h-[80vh] bg-gray-50">
      <ProducerSidebar />
      <div className="flex-1 p-6 lg:p-8 overflow-auto">
        {children}
      </div>
    </div>
  )
}
