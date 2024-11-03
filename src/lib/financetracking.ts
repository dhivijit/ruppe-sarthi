/* eslint-disable padded-blocks */
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
        return { success: false, message: "User not found" };
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
        return { success: false, message: "User not found" };
    }
}

// Pie chart data

// create a function which gets the categories and the total amount of expenses for each category to an array
// The output should be like this
// const expenses = {
//     values: [40, 30, 20, 10], // Change to [] to test "No Data" state
//     labels: ['Rent', 'Groceries', 'Entertainment', 'Other'],
// };
// The labels should be made according to the data present in the database

export async function getExpensesData(email: string) {
    const expenses = await getExpenses(email);
    const categories: string[] = [];
    const values: number[] = [];
    if (!expenses.success) {
        return { values: [], labels: [] };
    }
    if (expenses.data) {
        expenses.data.forEach((expense: any) => {
            if (categories.includes(expense.category)) {
                values[categories.indexOf(expense.category)] += expense.amount;
            } else {
                categories.push(expense.category);
                values.push(expense.amount);
            }
        });
        return { values, labels: categories };
    } else {
        return { values: [], labels: [] };
    }
}

// Do the same for income 
export async function getIncomeData(email: string) {
    const income = await getIncome(email);
    const categories: string[] = [];
    const values: number[] = [];
    if (!income.success) {
        return { values: [], labels: [] };
    }
    if (income.data) {
        income.data.forEach((income: any) => {
            if (categories.includes(income.category)) {
                values[categories.indexOf(income.category)] += income.amount;
            } else {
                categories.push(income.category);
                values.push(income.amount);
            }
        });
        return { values, labels: categories };
    } else {
        return { values: [], labels: [] };
    }
}