"use server"

import { db } from "./db"

export async function getExpenses(email: string) {
    const user = await db.users.findUnique({
        where: {
            email
        }
    });
    if (user) {
        const expenses = await db.expenses.findMany({
            where: {
                creatorId: user.id
            }
        });
        return { success: true, data: expenses };
    } else {
        return { success: false, message: "User not found" };
    }
}

export async function createExpense(email: string, amount: number, category: string, date: Date, description?: string) {
    const creatorUser = await db.users.findUnique({
        where: {
            email
        }
    });
    if (creatorUser) {
        const expense = await db.expenses.create({
            data: {
            amount: amount,
            category: category,
            date: date,
            description: description,
            creationDate: new Date(),
            creatorId: creatorUser.id
            }
        });
        return { success: true, data: expense };
    } else {
        return {success: false, message: "User not found"};
    }
}

export async function getIncome(email: string) {
    const user = await db.users.findUnique({
        where: {
            email
        }
    });
    if (user) {
        const income = await db.income.findMany({
            where: {
                creatorId: user.id
            }
        });
        return { success: true, data: income };
    } else {
        return { success: false, message: "User not found" };
    }
}

export async function createIncome(email: string, amount: number, category: string, date: Date, description?: string) {
    const creatorUser = await db.users.findUnique({
        where: {
            email
        }
    });
    if (creatorUser) {
        const income = db.income.create({
            data: {
                amount: amount,
                category: category,
                date: date,
                description: description,
                creationDate: new Date(),
                creatorId: creatorUser.id
            }
        })

        return { success: true, data: income };
    } else {
        return {success: false, message: "User not found"};
    }
}