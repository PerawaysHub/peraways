import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  "/",
   "/danke", 
   "/impressum", 
   "/datenschutz",
    "/cookie-policy",
    "/sitemap.xml",
]);

const isApiRoute = createRouteMatcher(["/api(.*)"]);
const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isDashboardRoute(req)) {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.rewrite(new URL("/_not-found", req.url));
    }
    return;
  }

  if (isApiRoute(req)) return;

  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
