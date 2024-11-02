"use server";

import { db } from "@/lib/db";

export async function userSignUp(email: string, password: string) {
    try {
        console.log("Creating user with email:", email);

        // Check database connection and model
        if (!db || !db.userscreds) {
            throw new Error("Database connection or userscreds model is undefined");
        }

        // check if user already exists
        const existingUser = await db.userscreds.findUnique({
            where: {
                email: email,
            },
        });

        const user = await db.userscreds.create({
            data: {
                email: email,
                password: password,
            },
        });

        return { success: true, message: "User successfully created" };
    } catch (error) {
        console.error("Error during user creation:", error);

        if (error instanceof Error) {
            return { success: false, message: "User creation failed", error: error.message };
        } else {
            return { success: false, message: "User creation failed", error: String(error) };
        }
    }
}
