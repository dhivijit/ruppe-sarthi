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

        const today = new Date(date).toISOString().split('T')[0];
        const todayExpense = await db.expenseHistory.findFirst({
            where: {
                creatorId: creatorUser.id,
                date: today
            }
        });

        if (todayExpense) {
            await db.expenseHistory.update({
                where: {
                    id: todayExpense.id
                },
                data: {
                    amount: {
                        increment: amount
                    }
                }
            });
        } else {
            await db.expenseHistory.create({
                data: {
                    creatorId: creatorUser.id,
                    amount: amount,
                    date: today
                }
            });
        }

        const updatedBalance = await db.users.update({
            where: {
                email: email
            },
            data: {
                balance: {
                    decrement: amount
                }
            }
        });

        const todayBalance = await db.balanceHistory.findFirst({
            where: {
                creatorId: creatorUser.id,
                date: today
            }
        });

        if (todayBalance) {
            await db.balanceHistory.update({
                where: {
                    id: todayBalance.id
                },
                data: {
                    amount: updatedBalance.balance
                }
            });
        } else {
            await db.balanceHistory.create({
                data: {
                    creatorId: creatorUser.id,
                    amount: updatedBalance.balance,
                    date: today
                }
            });
        }

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

        const today = new Date(date).toISOString().split('T')[0];
        const todayIncome = await db.incomeHistory.findFirst({
            where: {
                creatorId: creatorUser.id,
                date: today
            }
        });

        if (todayIncome) {
            await db.incomeHistory.update({
                where: {
                    id: todayIncome.id
                },
                data: {
                    amount: {
                        increment: amount
                    }
                }
            });
        } else {
            await db.incomeHistory.create({
                data: {
                    creatorId: creatorUser.id,
                    amount: amount,
                    date: today
                }
            });
        }

        const latestData = await db.users.update({
            where: {
                email: email
            },
            data: {
                balance: {
                    increment: amount
                }
            }
        });

        const todayBalance = await db.balanceHistory.findFirst({
            where: {
                creatorId: creatorUser.id,
                date: today
            }
        });

        if (todayBalance) {
            await db.balanceHistory.update({
                where: {
                    id: todayBalance.id
                },
                data: {
                    amount: latestData.balance
                }
            });
        } else {
            await db.balanceHistory.create({
                data: {
                    creatorId: creatorUser.id,
                    amount: latestData.balance,
                    date: today
                }
            });
        }

        return { success: true, data: income };
    } else {
        return { success: false, message: "User not found" };
    }
}

// Dashboard Data

// Pie Chart Data
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

// Line Chart Data
// create a getBalanceHistory function which takes in the email, from date and to date as arguments and returns the balance history data. the from date and to date can be null or undefined, in which case the function should return the entire balance history data. if the from date is provided, the function should return the balance history data from the from date to the current date. if the to date is provided, the function should return the balance history data from the beginning to the to date. if both from date and to date are provided, the function should return the balance history data between the from date and to date. the function should return the balance history data in the format { date: string, amount: number }[].
export async function getBalanceHistory(email: string, fromDate?: Date, toDate?: Date) {
    const user = await db.users.findUnique({
        where: {
            email
        }
    });
    if (user) {
        let balanceHistory = await db.balanceHistory.findMany({
            where: {
                creatorId: user.id
            },
            orderBy: {
            date: 'asc'
            }
        });
        if (fromDate) {
            balanceHistory = balanceHistory.filter((entry: any) => new Date(entry.date) >= fromDate);
        }
        if (toDate) {
            balanceHistory = balanceHistory.filter((entry: any) => new Date(entry.date) <= toDate);
        }
        return { success: true, data: balanceHistory };
    } else {
        return { success: false, message: "User not found" };
    }
}

// create a getIncomeHistory function which takes in the email, from date and to date as arguments and returns the income history data. the from date and to date can be null or undefined, in which case the function should return the entire income history data. if the from date is provided, the function should return the income history data from the from date to the current date. if the to date is provided, the function should return the income history data from the beginning to the to date. if both from date and to date are provided, the function should return the income history data between the from date and to date. the function should return the income history data in the format { date: string, amount: number }[].
export async function getIncomeHistory(email: string, fromDate?: Date, toDate?: Date) {
    const user = await db.users.findUnique({
        where: {
            email
        }
    });
    if (user) {
        let incomeHistory = await db.incomeHistory.findMany({
            where: {
                creatorId: user.id
            },
            orderBy: {
            date: 'asc'
            }
        });
        if (fromDate) {
            incomeHistory = incomeHistory.filter((entry: any) => new Date(entry.date) >= fromDate);
        }
        if (toDate) {
            incomeHistory = incomeHistory.filter((entry: any) => new Date(entry.date) <= toDate);
        }
        return { success: true, data: incomeHistory };
    } else {
        return { success: false, message: "User not found" };
    }
}

// create a getExpensesHistory function which takes in the email, from date and to date as arguments and returns the expenses history data. the from date and to date can be null or undefined, in which case the function should return the entire expenses history data. if the from date is provided, the function should return the expenses history data from the from date to the current date. if the to date is provided, the function should return the expenses history data from the beginning to the to date. if both from date and to date are provided, the function should return the expenses history data between the from date and to date. the function should return the expenses history data in the format { date: string, amount: number }[].
export async function getExpensesHistory(email: string, fromDate?: Date, toDate?: Date) {
    const user = await db.users.findUnique({
        where: {
            email
        }
    });
    if (user) {
        let expensesHistory = await db.expenseHistory.findMany({
            where: {
            creatorId: user.id
            },
            orderBy: {
            date: 'asc'
            }
        });
        if (fromDate) {
            expensesHistory = expensesHistory.filter((entry: any) => new Date(entry.date) >= fromDate);
        }
        if (toDate) {
            expensesHistory = expensesHistory.filter((entry: any) => new Date(entry.date) <= toDate);
        }
        return { success: true, data: expensesHistory };
    } else {
        return { success: false, message: "User not found" };
    }
}