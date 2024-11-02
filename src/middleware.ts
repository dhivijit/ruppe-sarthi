import { auth } from "@/auth"
 
export default auth((req) => {
//   if (!req.auth && req.nextUrl.pathname !== "/auth/login") {
//     const newUrl = new URL("/auth/login", req.nextUrl.origin)
//     return Response.redirect(newUrl)
//   }

  if(!req.auth && req.nextUrl.pathname == "/"){
    const newUrl = new URL("/auth/login?error=You need to log in", req.nextUrl.origin)
    return Response.redirect(newUrl)
  }

  if(req.auth && req.nextUrl.pathname == "/auth/login"){
    const newUrl = new URL("/", req.nextUrl.origin)
    return Response.redirect(newUrl)
  }

  if(req.auth && req.nextUrl.pathname == "/signup"){
    const newUrl = new URL("/", req.nextUrl.origin)
    return Response.redirect(newUrl)
  }
})