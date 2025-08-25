import React, { useMemo, useState } from 'react';
import { Card, PageHeader, Pagination, Spinner, Select, ChevronDownIcon, ChevronUpIcon, ChevronUpDownIcon } from '../components/common';
import { useData } from '../hooks/useData';
import { useTable } from '../hooks/useTable';
import { StockMovement } from '../types';

const StockMovementsPage: React.FC = () => {
    const { stockMovements, products, loading } = useData();
    const [typeFilter, setTypeFilter] = useState<'all' | 'in' | 'out'>('all');
    const [productFilter, setProductFilter] = useState('all');

    const productMap = useMemo(() => new Map(products.map(p => [p.id, p])), [products]);

    const filteredMovements = useMemo(() => {
        return stockMovements.filter(movement =>
            (typeFilter === 'all' || movement.type === typeFilter) &&
            (productFilter === 'all' || movement.productId === productFilter)
        );
    }, [stockMovements, typeFilter, productFilter]);

    const { paginatedData, requestSort, sortConfig, currentPage, pageCount, setPage } = useTable(
        filteredMovements, 15, { key: 'date', direction: 'descending' }
    );

    const getSortIcon = (key: keyof StockMovement | 'productName') => {
        if (!sortConfig || sortConfig.key !== key) return <ChevronUpDownIcon className="h-4 w-4 ml-1 text-slate-400" />;
        if (sortConfig.direction === 'ascending') return <ChevronUpIcon className="h-4 w-4 ml-1" />;
        return <ChevronDownIcon className="h-4 w-4 ml-1" />;
    };
    
    const getTypeBadge = (type: 'in' | 'out') => {
        const baseClasses = "px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full";
        if (type === 'in') {
            return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200`;
        }
        return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200`;
    };

    if (loading) return <Spinner />;

    return (
        <div className="space-y-6">
            <PageHeader title="Stock Movements" />

            <Card>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <Select label="" id="productFilter" value={productFilter} onChange={e => setProductFilter(e.target.value)}>
                        <option value="all">All Products</option>
                        {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </Select>
                    <Select label="" id="typeFilter" value={typeFilter} onChange={e => setTypeFilter(e.target.value as any)}>
                        <option value="all">All Types</option>
                        <option value="in">Stock In</option>
                        <option value="out">Stock Out</option>
                    </Select>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-slate-50 dark:bg-slate-800">
                            <tr>
                                <th className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300 sm:pl-0 cursor-pointer" onClick={() => requestSort('productId')}>
                                    <div className="flex items-center">Product {getSortIcon('productId')}</div>
                                </th>
                                <th className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300 cursor-pointer" onClick={() => requestSort('date')}>
                                    <div className="flex items-center">Date {getSortIcon('date')}</div>
                                </th>
                                <th className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300 cursor-pointer" onClick={() => requestSort('type')}>
                                    <div className="flex items-center">Type {getSortIcon('type')}</div>
                                </th>
                                <th className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300 cursor-pointer" onClick={() => requestSort('quantity')}>
                                    <div className="flex items-center">Quantity {getSortIcon('quantity')}</div>
                                </th>
                                <th className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300 cursor-pointer" onClick={() => requestSort('user')}>
                                    <div className="flex items-center">User {getSortIcon('user')}</div>
                                </th>
                                <th className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300">
                                    Notes
                                </th>
                            </tr>
                        </thead>
                         <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {paginatedData.map(movement => {
                                const product = productMap.get(movement.productId);
                                return (
                                    <tr key={movement.id} className="hover:bg-slate-100 dark:hover:bg-slate-700">
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 dark:text-white sm:pl-0">{product?.name || movement.productId}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">{new Date(movement.date).toLocaleString()}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm"><span className={getTypeBadge(movement.type)}>{movement.type === 'in' ? 'Stock In' : 'Stock Out'}</span></td>
                                        <td className={`whitespace-nowrap px-3 py-4 text-sm font-semibold ${movement.type === 'in' ? 'text-green-600' : 'text-red-600'}`}>{movement.type === 'in' ? '+' : '-'}{movement.quantity}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">{movement.user}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">{movement.notes}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                 <Pagination currentPage={currentPage} pageCount={pageCount} setPage={setPage} />
            </Card>
        </div>
    );
}

export default StockMovementsPage;