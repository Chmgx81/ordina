import React, { useState, useEffect } from 'react';
import { Card, Button, PageHeader, Spinner, formatCurrency } from '../components/common';
import { api } from '../services/mockApi';
import { Product, Order } from '../types';

declare const jspdf: any;
declare const Papa: any;

interface TopSellingProduct extends Product {
    unitsSold: number;
}

const ReportsPage: React.FC = () => {
    const [topProducts, setTopProducts] = useState<TopSellingProduct[]>([]);
    const [loadingTopProducts, setLoadingTopProducts] = useState(true);

    useEffect(() => {
        const fetchTopProducts = async () => {
            setLoadingTopProducts(true);
            try {
                const data = await api.getTopSellingProducts();
                setTopProducts(data);
            } catch (error) {
                console.error("Failed to fetch top selling products:", error);
            } finally {
                setLoadingTopProducts(false);
            }
        };
        fetchTopProducts();
    }, []);

    const downloadFile = (content: string, fileName: string, mimeType: string) => {
        const blob = new Blob([content], { type: mimeType });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportStockToCSV = async () => {
        const products = await api.getProducts();
        const csvData = products.map(({ id, supplierId, imageUrl, description, ...rest }) => rest);
        const csv = Papa.unparse(csvData);
        downloadFile(csv, 'stock_status_report.csv', 'text/csv;charset=utf-8;');
    };

    const exportStockToPDF = async () => {
        const products = await api.getProducts();
        const { jsPDF } = jspdf;
        const doc = new jsPDF();
        
        doc.text("Stock Status Report", 14, 16);
        (doc as any).autoTable({
            head: [['Name', 'SKU', 'Category', 'Price', 'Stock']],
            body: products.map(p => [p.name, p.sku, p.category, formatCurrency(p.price), p.stock]),
            startY: 20,
        });

        doc.save('stock_status_report.pdf');
    };
    
    const exportSalesToCSV = async () => {
        const orders = await api.getOrders();
        const csvData = orders.map(({ items, ...rest }) => ({...rest, itemCount: items.length}));
        const csv = Papa.unparse(csvData);
        downloadFile(csv, 'sales_history_report.csv', 'text/csv;charset=utf-8;');
    };

    const exportSalesToPDF = async () => {
        const orders = await api.getOrders();
        const { jsPDF } = jspdf;
        const doc = new jsPDF();
        
        doc.text("Sales History Report", 14, 16);
        (doc as any).autoTable({
            head: [['Order ID', 'Customer', 'Date', 'Total', 'Status']],
            body: orders.map(o => [o.id, o.customerName, new Date(o.orderDate).toLocaleDateString(), formatCurrency(o.total), o.status]),
            startY: 20,
        });

        doc.save('sales_history_report.pdf');
    };

    return (
        <div className="space-y-6">
            <PageHeader title="Reporting & Analytics" />
            
             <Card>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Top 10 Selling Products</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">An overview of the best-performing products based on units sold.</p>
                {loadingTopProducts ? <Spinner /> : (
                    <>
                        {topProducts.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead className="bg-slate-50 dark:bg-slate-800">
                                        <tr>
                                            <th className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300 sm:pl-0">Rank</th>
                                            <th className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300">Product</th>
                                            <th className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300">SKU</th>
                                            <th className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300">Category</th>
                                            <th className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300">Units Sold</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                        {topProducts.map((product, index) => (
                                            <tr key={product.id} className="group hover:bg-slate-100 dark:hover:bg-slate-700">
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-0">
                                                    <span className="font-medium text-slate-900 dark:text-white">{index + 1}</span>
                                                </td>
                                                <td className="whitespace-nowrap py-4 pr-3 text-sm">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 flex-shrink-0">
                                                            <img className="h-10 w-10 rounded-md object-cover transition-transform duration-300 group-hover:scale-110" src={product.imageUrl} alt={product.name} />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="font-medium text-slate-900 dark:text-white">{product.name}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">{product.sku}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">{product.category}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-900 dark:text-white font-semibold">{product.unitsSold}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-sm text-slate-500 dark:text-slate-400">No sales data available to generate this report.</p>
                            </div>
                        )}
                    </>
                )}
            </Card>

            <Card>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Stock Reports</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Generate reports on the current inventory status.</p>
                <div className="flex space-x-2">
                    <Button onClick={exportStockToCSV}>Export to CSV</Button>
                    <Button onClick={exportStockToPDF} variant="secondary">Export to PDF</Button>
                </div>
            </Card>
            
            <Card>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Sales Reports</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Generate reports on sales history and performance.</p>
                <div className="flex space-x-2">
                    <Button onClick={exportSalesToCSV}>Export to CSV</Button>
                    <Button onClick={exportSalesToPDF} variant="secondary">Export to PDF</Button>
                </div>
            </Card>

            <Card>
                 <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Supplier Performance</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">This report is not yet available.</p>
                <div className="flex space-x-2">
                    <Button disabled>Export to CSV</Button>
                    <Button disabled variant="secondary">Export to PDF</Button>
                </div>
            </Card>
        </div>
    );
};

export default ReportsPage;