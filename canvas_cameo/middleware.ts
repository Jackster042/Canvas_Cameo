import { auth } from "./auth";

export default auth((req) => {
  console.log(req.nextUrl.pathname, "path from MIDDLEWARE CLIENT");

  const isLoginPage = req.nextUrl.pathname.startsWith("/login");
  const isAuthUser = !!req.auth;

  if (isLoginPage && isAuthUser) {
    return Response.redirect(new URL("/", req.url));
  }

  if (!isAuthUser && !isLoginPage) {
    return Response.redirect(new URL("/login", req.url));
  }
});

export const config = {
  matcher: ["/", "/editor/:path*", "/login"],
};
