import { type NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	const authStatus = await isAuthenticated(request);
	console.log("authintecation boolean before /admin", authStatus);
	console.log("testing", pathname);

	// Protect admin routes
	if (pathname.startsWith("/admin")) {
		console.log(
			"authentication boolean in the /admin",
			authStatus
		);

		if (!authStatus) {
			// Redirect to login page
			return NextResponse.redirect(new URL("/login", request.url));
		}
	}

	// Protect admin API routes
	if (pathname.startsWith("/api/admin")) {
		if (!authStatus) {
			return NextResponse.json(
				{ error: "Authentication required" },
				{ status: 401 }
			);
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/admin/:path*", "/api/admin/:path*"],
};
