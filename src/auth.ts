import NextAuth from "next-auth";
import { ZodError } from "zod";
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
              console.log("Sign-in successful:", user);

              // Return user object if credentials are valid
              return {
                id: user.id,
                email: user.email,
              };
            } else {
              throw new Error("User data is missing.");
            }
          } else {
            console.log("Invalid credentials.");
            // Return null to indicate failed authorization
            return null;
          }
        } catch (error) {
          if (error instanceof ZodError) {
            console.error("Validation Error:", error.flatten().fieldErrors);
            // Redirect to error page with a validation error message
            throw new Error("Invalid input. Please check your email and password.");
          }
          console.error("Authorization Error:", error);
          // Return null to trigger redirect to the error page
          throw new Error("Unable to sign in. Please try again.");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt", // Use JWT to store session data
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      // Attach user information to the JWT token
      if (user) {
        token.id = user.id;
        token.email = user.email;

        const data = await getUserData(user.email);

        if (data.success) {
          if (data.user) {
            token.name = data.user.firstname + " " + data.user.lastname;
          }
        }
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      // Attach token data to session for access on the client side
      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
          name: token.name || "John Doe" as string,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login", // Custom sign-in page
    error: "/auth/login?error=true", // Redirects to sign-in page with error query parameter
  },
  debug: process.env.NODE_ENV === "development", // Enable debug mode in development
};

// Export NextAuth configuration with handlers for pages/api/auth/[...nextauth].ts
const { handlers, signIn, signOut, auth } = NextAuth(authOptions);
export { handlers, signIn, signOut, auth };
export default auth;
