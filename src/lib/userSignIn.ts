import { db } from "@/lib/db";

export async function userSignIn(email: string, password: string) {
    try {
        console.log("Signing in user with email:", email);

        // Check database connection and model
        if (!db || !db.userscreds) {
            throw new Error("Database connection or userscreds model is undefined");
        }

        const user = await db.userscreds.findUnique({
            where: {
                email: email,
                password: password,
            },
        });

        if (!user) {
            throw new Error("User not found");
        }

        return { success: true, message: "User successfully signed in", user: user };
    } catch (error) {
        console.error("Error during user sign-in:", error);

        if (error instanceof Error) {
            return { success: false, message: "User sign-in failed", error: error.message };
        } else {
            return { success: false, message: "User sign-in failed", error: String(error) };
        }
    }
}