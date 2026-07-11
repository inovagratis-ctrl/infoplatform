import { PrismaClient } from "@prisma/client"
import { compare } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.findUnique({ where: { email: "admin@infoplatform.com" } })
  if (!user || !user.password) { console.log("User not found"); return }
  const valid = await compare("admin123", user.password)
  console.log("Password valid:", valid)
}

main().finally(() => prisma.$disconnect())
