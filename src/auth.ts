/* eslint-disable */

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { signInSchema } from "@/lib/zod"; // Zod schema for validation
import { userSignIn } from "@/lib/userSignIn"; // Function to authenticate user with credentials
import { getUserData } from "@/lib/userData";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          // Validate credentials with Zod schema
          const { email, password } = await signInSchema.parseAsync(credentials);

          // Authenticate the user
          const response = await userSignIn(email, password);
          if (response.success) {
            const { user } = response;
            if (user) {
              const data = await getUserData(user.email);

              // Return user object if credentials are valid
              return {
                id: user.id,
                email: user.email,
                name: data.user ? data.user.firstname + " " + data.user.lastname : "Unknown User",
              };
            } else {
              throw new Error("User data is missing.");
            }
          } else {
            // Return null to indicate failed authorization
            return null;
          }
        } catch (error) {
          console.error("Authorization Error:", error);
          // Return null to trigger redirect to the error page
          throw new Error("Unable to sign in. Please try again.");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user:any }) {
      // Attach user information to the JWT token
      if (user) {
        // token.id = user.id;
        token.email = user.email;
        token.expires=  Date.now() + 60 * 60 * 24 * 7 * 1000; // 7 days

        const data = await getUserData(user.email);

        if (data.success && data.user) {
          token.name = data.user.firstname + " " + data.user.lastname;
        }
      }
      return token;
    },
    async session({ session, token }: { session: {
      expires: any; user?: { id: string; email: string; name?: string; } }; token: any }) {
      // Attach token data to session for access on the client side
      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
          name: (token.name || "John Doe") as string,
        };
        session.expires = token.expires;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login", // Custom sign-in page
    error: "/auth/login?error=true", // Redirects to sign-in page with error query parameter
  }
};

// Export NextAuth configuration with handlers for pages/api/auth/[...nextauth].ts
/* eslint-disable-next-line */
const { handlers, signOut, auth } = NextAuth(authOptions);
export { handlers, signOut, auth };
export default auth;
