import { db } from "./db";

export async function getUserData(email: string) {
    try {
        // Check database connection and model
        if (!db || !db.users) {
            throw new Error("Database connection or users model is undefined");
        }

        const user = await db.users.findUnique({
            where: {
                email: email,
            },
        });

        if (!user) {
            throw new Error("User not found");
        }

        return { success: true, message: "User data successfully retrieved", user: user };
    } catch (error) {
        console.error("Error during user data retrieval:", error);

        if (error instanceof Error) {
            return { success: false, message: "User data retrieval failed", error: error.message };
        } else {
            return { success: false, message: "User data retrieval failed", error: String(error) };
        }
    }
}