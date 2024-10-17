import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchDashboardSummary,
    fetchDailyEarnings,
} from '../../store/slices/dashboardSlice';
import { Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './css/AdminDashboard.css';
import Loder from '../../components/ui/Loder';

const AdminDashboard = () => {
    const dispatch = useDispatch();

    const { dashboardData, loading: summaryLoading } = useSelector(
        (state) => state.dashboard?.fetchDashboardSummary ?? {}
    );

    const {
        dailyEarningsdata: {
            summary = {},
            topDays = {},
            dailyEarnings = [],
            revenueByCategory = [],
        } = {},
        loading: earningsLoading,
    } = useSelector((state) => state.dashboard?.fetchDailyEarnings ?? {});

    

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
        setStartDate(startOfMonth.toISOString().split('T')[0]); // Set startDate to the first day of the current month
        setEndDate(endOfMonth.toISOString().split('T')[0]);     // Set endDate to the last day of the current month
    
        dispatch(fetchDashboardSummary());
        dispatch(fetchDailyEarnings({
            startDate: startOfMonth.toISOString().split('T')[0],
            endDate: endOfMonth.toISOString().split('T')[0],
        }));
    }, [dispatch]);
    

    const handleDateChange = () => {
        const formattedStartDate = startDate
            ? new Date(startDate)?.toISOString()?.split('T')[0]
            : null;
        const formattedEndDate = endDate
            ? new Date(endDate)?.toISOString()?.split('T')[0]
            : null;

        if (formattedStartDate && formattedEndDate) {
            dispatch(
                fetchDailyEarnings({
                    startDate: formattedStartDate,
                    endDate: formattedEndDate,
                })
            );
        }
    };

    if (summaryLoading || earningsLoading) {
        return <Loder/>
    }

    const userStats = dashboardData?.userStats ?? {};
    const orderStats = dashboardData?.orderStats ?? {};
    const totalSales = dashboardData?.totalSales?.totalSales ?? 0;
    const monthlyEarnings = dashboardData?.monthlyEarnings ?? [];

    const earningsData =
        dailyEarnings.map((e) => ({
            date: e?._id ?? '', // Assuming _id is the date
            total: e?.total ?? 0, // Total earnings for the day
            transactionCount: e?.transactionCount ?? 0, // Number of transactions
        })) ?? [];

    const userChartData = {
        labels: [
            'Total Users',
            'Active Users',
            'Inactive Users',
            'Blocked Users',
        ],
        datasets: [
            {
                label: 'Users',
                data: [
                    userStats?.totalUsers ?? 0,
                    userStats?.activeUsers ?? 0,
                    userStats?.inactiveUsers ?? 0,
                    userStats?.blockedUsers ?? 0,
                ],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const salesChartData = {
        labels: dailyEarnings.map((e) => e?._id ?? ''), // Dates from daily earnings
        datasets: [
            {
                label: 'Total Earnings',
                data: dailyEarnings.map((e) => e?.total ?? 0), // Total earnings for each day
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
                fill: true,
            },
            {
                label: 'Transaction Count',
                data: dailyEarnings.map((e) => e?.transactionCount ?? 0), // Transaction count for each day
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                fill: true,
            },
            {
                label: 'Average Daily Earnings',
                data: Array(dailyEarnings.length).fill(
                    summary.averageDailyEarnings ?? 0
                ), // Filling with the average daily earnings value
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: true,
            },
            {
                label: 'Top Earning Day',
                data: dailyEarnings.map((e) =>
                    e?._id === topDays?.topEarningDay?._id
                        ? topDays.topEarningDay.total
                        : null
                ),
                backgroundColor: 'rgba(255, 206, 86, 0.6)',
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 1,
                fill: true,
            },
            {
                label: 'Top Transaction Day',
                data: dailyEarnings.map((e) =>
                    e?._id === topDays?.topTransactionDay?._id
                        ? topDays.topTransactionDay.transactionCount
                        : null
                ),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                fill: true,
            },
            ...(revenueByCategory.map((category) => ({
                label: category?._id
                    ? `Category ${category?._id}`
                    : 'Uncategorized', // Label for each category
                data: dailyEarnings.map((e) =>
                    e._id === category?._id
                        ? category.totalCategoryEarnings
                        : null
                ),
                backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`, // Random color for category
                borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
                borderWidth: 1,
                fill: true,
            })) ?? []),
        ],
    };

    const orderChartData = {
        labels: [
            'Total Orders',
            'Pending Orders',
            'Completed Orders',
            'Canceled Orders',
        ],
        datasets: [
            {
                label: 'Orders',
                data: [
                    orderStats?.totalOrders ?? 0,
                    orderStats?.pendingOrders ?? 0,
                    orderStats?.completedOrders ?? 0,
                    orderStats?.canceledOrders ?? 0,
                ],
                backgroundColor: [
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                ],
                borderColor: [
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const monthlyEarningsChartData = {
        labels: monthlyEarnings.map((e) => e?._id ?? ''), // Use the month as the label
        datasets: [
            {
                label: 'Monthly Earnings',
                data: monthlyEarnings.map((e) => e?.total ?? 0), // Use total earnings per month
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: true,
            },
        ],
    };

    const chartOptions = {
        plugins: {
            legend: {
                labels: {
                    color: 'white',
                },
            },
            tooltip: {
                titleColor: 'white',
                bodyColor: 'white',
            },
        },
        scales: {
            x: {
                ticks: {
                    color: 'white',
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.2)',
                },
            },
            y: {
                ticks: {
                    color: 'white',
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.2)',
                },
            },
        },
    };

    return (
        <div className="AdminDashboard">
            <div className="adminNameDash">
                <h2>Admin Dashboard</h2>
            </div>

            <div className="adminChart">
                <div className="chart-container">
                    <h5>User Stats</h5>
                    <Bar data={userChartData} options={chartOptions} />
                </div>

                <div className="chart-container">
                    <h5>Order Stats</h5>
                    <Bar data={orderChartData} options={chartOptions} />
                </div>

                <div className="chart-container">
                    <h5>Monthly Earnings</h5>
                    <Line
                        data={monthlyEarningsChartData}
                        options={chartOptions}
                    />
                </div>
                <div className="chart-container Sales">
                    <div>
                        <h5>Sales Overview</h5>
                        <div className="date-range-filters">
                            <input
                                type="date"
                                id="startDate"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                            <input
                                type="date"
                                id="endDate"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                            <button onClick={handleDateChange}>Filter</button>
                        </div>
                    </div>

                    <Line data={salesChartData} options={chartOptions} />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
