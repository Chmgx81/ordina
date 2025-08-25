import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, Spinner, formatCurrency, formatCurrencyShort, PageHeader, CubeIcon, TruckIcon, BanknotesIcon, ArrowTrendingUpIcon } from '../components/common';
import { api } from '../services/mockApi';
import { Product, Order, OrderStatus } from '../types';
import { Link } from 'react-router-dom';

interface DashboardStats {
    products: number;
    inventoryValue: number;
    totalSales: number;
    suppliers: number;
}
interface ChartData {
    name: string;
    sales: number;
}

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; colorClass: string; }> = ({ title, value, icon, colorClass }) => (
    <Card className="p-5 flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">{title}</p>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1 break-words">{value}</p>
        </div>
        <div className={`p-4 rounded-lg text-white ${colorClass} flex-shrink-0`}>
            {icon}
        </div>
    </Card>
);

const DashboardPage: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await api.getDashboardData();
                setStats(data.stats);
                setLowStockProducts(data.lowStockProducts);
                setRecentOrders(data.recentOrders);
                setChartData(data.chartData);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <Spinner />;
    }

    const getStatusBadge = (status: OrderStatus) => {
        const baseClasses = "px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full";
        const statusClasses = {
            [OrderStatus.PENDING]: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200",
            [OrderStatus.CONFIRMED]: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200",
            [OrderStatus.SHIPPED]: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200",
            [OrderStatus.DELIVERED]: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200",
            [OrderStatus.CANCELLED]: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200",
            [OrderStatus.RETURNED]: "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200",
        };
        return `${baseClasses} ${statusClasses[status]}`;
    }
    
    return (
        <div className="space-y-8">
            <PageHeader title="Dashboard" />
            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Products" value={stats?.products.toString() || '0'} colorClass="bg-indigo-500" icon={<CubeIcon className="h-7 w-7" />} />
                <StatCard title="Inventory Value" value={formatCurrencyShort(stats?.inventoryValue || 0)} colorClass="bg-green-500" icon={<BanknotesIcon className="h-7 w-7" />} />
                <StatCard title="Total Sales" value={formatCurrencyShort(stats?.totalSales || 0)} colorClass="bg-amber-500" icon={<ArrowTrendingUpIcon className="h-7 w-7" />} />
                <StatCard title="Active Suppliers" value={stats?.suppliers.toString() || '0'} colorClass="bg-sky-500" icon={<TruckIcon className="h-7 w-7" />} />
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Inventory Sales Chart */}
                <div className="lg:col-span-2">
                    <Card>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Sales Trends</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                     <defs>
                                        <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8}/>
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0.9}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156, 163, 175, 0.3)" />
                                    <XAxis dataKey="name" tick={{ fill: 'rgb(100 116 139)', fontSize: 12 }} />
                                    <YAxis tickFormatter={formatCurrencyShort} tick={{ fill: 'rgb(100 116 139)', fontSize: 12 }} />
                                    <Tooltip contentStyle={{ backgroundColor: 'rgb(15 23 42 / 0.8)', border: '1px solid rgb(51 65 85)', color: '#fff' }} cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }} formatter={(value: number) => formatCurrency(value)} />
                                    <Bar dataKey="sales" fill="url(#salesGradient)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>

                {/* Low Stock Alerts */}
                <Card>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Low Stock Alerts</h3>
                    <div className="space-y-4">
                        {lowStockProducts.length > 0 ? lowStockProducts.slice(0, 5).map(product => {
                            const stockPercentage = Math.max(0, (product.stock / product.lowStockThreshold) * 100);
                             return (
                                <div key={product.id}>
                                    <div className="flex items-center justify-between text-sm mb-1">
                                        <Link to="/products" className="font-medium text-slate-800 dark:text-slate-100 hover:text-primary dark:hover:text-primary truncate pr-2">{product.name}</Link>
                                        <span className={`font-semibold ${product.stock === 0 ? 'text-red-500' : 'text-amber-500'}`}>{product.stock} / {product.lowStockThreshold}</span>
                                    </div>
                                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                        <div className={`${product.stock === 0 ? 'bg-red-500' : 'bg-amber-500'} h-2 rounded-full`} style={{ width: `${stockPercentage}%` }}></div>
                                    </div>
                                </div>
                            )
                        }) : <p className="text-sm text-slate-500 dark:text-slate-400">No products are low on stock.</p>}
                    </div>
                </Card>
            </div>

            {/* Recent Orders */}
            <Card>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Recent Orders</h3>
                 <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-slate-50 dark:bg-slate-800">
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider sm:pl-0">Order ID</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {recentOrders.map(order => (
                                <tr key={order.id} className="hover:bg-slate-100 dark:hover:bg-slate-700">
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-primary sm:pl-0">{order.id}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0">
                                                <img className="h-10 w-10 rounded-full object-cover" src={order.customerAvatar} alt={order.customerName} />
                                            </div>
                                            <div className="ml-4 min-w-0">
                                                <div className="font-medium text-slate-900 dark:text-white truncate">{order.customerName}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">{new Date(order.orderDate).toLocaleDateString()}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">{formatCurrency(order.total)}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                                        <span className={getStatusBadge(order.status)}>{order.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default DashboardPage;