"use server";

import { db } from "@/lib/db";

export async function userSignUp(firstname: string, lastname: string, email: string, password: string) {
    try {
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

        if(existingUser) {
            return { success: false, message: "User already exists" };
        }

        await db.userscreds.create({
            data: {
                email: email,
                password: password,
            },
        });

        await db.users.create({
            data: {
                email: email,
                firstname: firstname,
                lastname: lastname
            },
        })

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
