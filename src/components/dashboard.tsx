'use client'

import React, { useEffect, useState } from 'react'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js'
import { getIncomeData, getExpensesData, getIncomeHistory, getBalanceHistory, getExpensesHistory } from '../lib/financetracking'
import { getUserData } from '@/lib/userData'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Separator } from "@/components/ui/separator"
import { LineChart, Line as RechartsLine, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from "recharts";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement)

const Dashboard = ({ email }: { email: string }) => {
    const [expenses, setExpenses] = useState<{ values: number[], labels: string[] }>({ values: [], labels: [] })
    const [income, setIncome] = useState<{ values: number[], labels: string[] }>({ values: [], labels: [] })
    const [balance, setBalance] = useState<number>(0)
    const [expensesHistory, setExpensesHistory] = useState<{ date: string, amount: number }[]>([])
    const [incomeHistory, setIncomeHistory] = useState<{ date: string, amount: number }[]>([])
    const [balanceHistory, setBalanceHistory] = useState<{ date: string, amount: number }[]>([])

    useEffect(() => {
        async function dataGetter() {
            const expenseHistoryData = await getExpensesHistory(email);
            if (expenseHistoryData.success) {
                setExpensesHistory(expenseHistoryData.data)
            }

            const incomeHistoryData = await getIncomeHistory(email);
            if (incomeHistoryData.success) {
                setIncomeHistory(incomeHistoryData.data)
            }

            const balanceHistoryData = await getBalanceHistory(email);
            if (balanceHistoryData.success) {
                setBalanceHistory(balanceHistoryData.data)
            }
        }
        dataGetter()
    }, [email])

    useEffect(() => {
        async function dataGetter() {
            const expensesData = await getExpensesData(email)
            const incomeData = await getIncomeData(email)
            const userData = await getUserData(email)

            setExpenses({
                values: expensesData.values,
                labels: expensesData.labels,
            })
            setIncome({
                values: incomeData.values,
                labels: incomeData.labels,
            })
            setBalance(userData.user?.balance || 0)
        }
        dataGetter()
    }, [email])

    const defaultColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
    const noDataColors = ['#d3d3d3']

    const getChartData = (data: { values: number[], labels: string[] }) => ({
        labels: data.labels.length > 0 ? data.labels : ['No Data'],
        datasets: [
            {
                data: data.values.length > 0 ? data.values : [1],
                backgroundColor: data.values.length > 0 ? defaultColors : noDataColors,
                hoverBackgroundColor: data.values.length > 0 ? defaultColors : noDataColors,
            },
        ],
    })

    const options = {
        plugins: {
            legend: {
                display: true,
                position: 'bottom' as const,
            },
            tooltip: {
                enabled: true,
            },
        },
    }

    const LineChartComponent = ({ data, title, color }: { data: { date: string, amount: number }[], title: string, color: string }) => (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={{
                        amount: {
                            label: "Amount",
                            color: color,
                        },
                    }}
                    className="h-[175px]" // Reduced height to make the graph smaller
                >
                    {data.length > 0 ? (
                        <LineChart
                            data={data}
                            margin={{ top: 20, right: 20, left: -30, bottom: 20 }} // Adjusted margins to shift chart to the right
                        >
                            {/* X and Y Axes */}
                            <XAxis dataKey="date" stroke="#6b7280" padding={{ left: 10, right: 10 }} /> {/* Adds padding on X-axis */}
                            <YAxis
                                stroke="#6b7280"
                                domain={['dataMin', 'dataMax + 20']} // Adds padding on top of Y-axis to prevent clipping
                            />

                            {/* Grid lines */}
                            <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />

                            {/* Line with clip to keep it within bounds */}
                            <RechartsLine
                                type="monotone"
                                dataKey="amount"
                                stroke="#1f2937"
                                strokeWidth={2}
                                dot={{ fill: "#1f2937" }}
                            />

                            {/* Tooltip */}
                            <RechartsTooltip content={<ChartTooltipContent />} />
                        </LineChart>
                    ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                            No data available
                        </div>
                    )}
                </ChartContainer>
            </CardContent>
        </Card>
    )

    return (
        <>
            <header className="mb-8">
                <h1 className="font-title text-3xl text-neutral-950">Dashboard</h1>
            </header>

            <header className="mb-8">
                <h3 className="font-title text-xl text-neutral-950">Your current balance is ${balance}</h3>
            </header>

            <div className="flex justify-around mb-8">
                <div className="w-[250px] h-[250px] text-center relative">
                    <h4 className="mb-2">Expenses by Category</h4>
                    <Pie data={getChartData(expenses)} options={options} />
                    {expenses.values.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/80 text-sm font-bold text-gray-500">
                            No Data Available
                        </div>
                    )}
                </div>

                <div className="w-[250px] h-[250px] text-center relative">
                    <h4 className="mb-2">Income by Category</h4>
                    <Pie data={getChartData(income)} options={options} />
                    {income.values.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/80 text-sm font-bold text-gray-500">
                            No Data Available
                        </div>
                    )}
                </div>
            </div>

            <Separator className="my-8" />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <LineChartComponent data={expensesHistory} title="Expenses Over Time" color="black" />
                <LineChartComponent data={incomeHistory} title="Income Over Time" color="black" />
                <LineChartComponent data={balanceHistory} title="Balance Over Time" color="black" />
            </div>
        </>
    )
}

export default Dashboard
