import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: "/login",
  },
})

export const config = {
  matcher: ["/member/:path*", "/dashboard/:path*", "/producer/:path*", "/affiliate/:path*"],
}
