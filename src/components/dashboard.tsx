import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import React, { useEffect, useState } from 'react';
import { getIncomeData, getExpensesData } from '../lib/financetracking';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = ({ email }: { email: string }) => {
    // Use useState to store expenses and income data
    const [expenses, setExpenses] = useState<{ values: number[], labels: string[] }>({ values: [], labels: [] });
    const [income, setIncome] = useState<{ values: number[], labels: string[] }>({ values: [], labels: [] });

    useEffect(() => {
        async function dataGetter() {
            const expensesData = await getExpensesData(email);
            const incomeData = await getIncomeData(email);

            // Set state for expenses and income, which will trigger a re-render
            setExpenses({
                values: expensesData.values,
                labels: expensesData.labels,
            });
            setIncome({
                values: incomeData.values,
                labels: incomeData.labels,
            });
        }
        dataGetter();
    }, [email]);

    const defaultColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'];
    const noDataColors = ['#d3d3d3']; // Grey color for "No Data" chart

    // Function to get chart data
    const getChartData = (data: { values: number[], labels: string[] }) => ({
        labels: data.labels.length > 0 ? data.labels : ['No Data'],
        datasets: [
            {
                data: data.values.length > 0 ? data.values : [1],
                backgroundColor: data.values.length > 0 ? defaultColors : noDataColors,
                hoverBackgroundColor: data.values.length > 0 ? defaultColors : noDataColors,
            },
        ],
    });

    // Options for displaying labels on each chart
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
    };

    return (
        <>
            <header className="mb-8">
                <h1 className="font-title text-3xl text-neutral-950">Dashboard</h1>
            </header>
            <div style={{ display: 'flex', justifyContent: 'space-around', padding: '20px' }}>
                <div style={{ width: '250px', height: '250px', textAlign: 'center', position: 'relative' }}>
                    <h4>Expenses by Category</h4>
                    <Pie data={getChartData(expenses)} options={options} />
                    {expenses.values.length === 0 && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                color: '#666',
                                fontWeight: 'bold',
                                fontSize: '16px',
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                padding: '10px',
                                borderRadius: '50%',
                            }}
                        >
                            No Data Available
                        </div>
                    )}
                </div>

                <div style={{ width: '250px', height: '250px', textAlign: 'center', position: 'relative' }}>
                    <h4>Income by Category</h4>
                    <Pie data={getChartData(income)} options={options} />
                    {income.values.length === 0 && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                color: '#666',
                                fontWeight: 'bold',
                                fontSize: '16px',
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                padding: '10px',
                                borderRadius: '50%',
                            }}
                        >
                            No Data Available
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Dashboard;
