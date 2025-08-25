import React, { useState, useMemo } from 'react';
import { Order, OrderStatus, Product } from '../types';
import { api } from '../services/mockApi';
import { Button, Spinner, Card, Modal, Input, PageHeader, EmptyState, ShoppingCartIcon, Pagination, ChevronUpIcon, ChevronDownIcon, ChevronUpDownIcon, formatCurrency } from '../components/common';
import { useNotification } from '../hooks/useNotification';
import { useData } from '../hooks/useData';
import { useTable } from '../hooks/useTable';

const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>);

const OrderDetailsModal: React.FC<{ order: Order; products: Product[]; onClose: () => void; }> = ({ order, products, onClose }) => {
    const productMap = useMemo(() => new Map(products.map(p => [p.id, p.name])), [products]);

    return (
        <Modal isOpen={!!order} onClose={onClose} title={`Order Details: #${order.id}`}>
            <div className="space-y-4 text-sm">
                <p><strong>Customer:</strong> {order.customerName}</p>
                <p><strong>Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <h4 className="font-semibold mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">Items:</h4>
                <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                    {order.items.map(item => (
                        <li key={item.productId} className="py-2 flex justify-between">
                            <span>{productMap.get(item.productId) || 'Unknown Product'}</span>
                            <span className="text-slate-500 dark:text-slate-400">{item.quantity} x {formatCurrency(item.price)}</span>
                        </li>
                    ))}
                </ul>
                <p className="text-right font-bold text-base mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">Total: {formatCurrency(order.total)}</p>
            </div>
             <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="secondary" onClick={onClose}>Close</Button>
            </div>
        </Modal>
    );
};

const NewOrderForm: React.FC<{ products: Product[]; onSave: (order: Omit<Order, 'id' | 'orderDate' | 'status'>) => void; onCancel: () => void; }> = ({ products, onSave, onCancel }) => {
    const [customerName, setCustomerName] = useState('');
    const [items, setItems] = useState<{ productId: string; quantity: number; price: number }[]>([]);
    const [currentItem, setCurrentItem] = useState({ productId: '', quantity: 1 });
    const { addNotification } = useNotification();
    
    const availableProducts = useMemo(() => products.filter(p => p.stock > 0 && !items.find(i => i.productId === p.id)), [products, items]);

    const handleAddItem = () => {
        if (!currentItem.productId || currentItem.quantity <= 0) return;
        const product = products.find(p => p.id === currentItem.productId);
        if (product && product.stock >= currentItem.quantity) {
            setItems([...items, { ...currentItem, price: product.price }]);
            setCurrentItem({ productId: '', quantity: 1 });
        } else {
            addNotification({type: 'error', title: 'Out of Stock', message: 'Not enough stock available for the selected quantity.'});
        }
    };
    
    const handleRemoveItem = (productId: string) => {
        setItems(items.filter(item => item.productId !== productId));
    };

    const total = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);

    const handleSubmit = () => {
        if (!customerName || items.length === 0) {
            addNotification({type: 'error', title: 'Invalid Order', message: 'Please provide a customer name and add at least one item.'});
            return;
        }
        onSave({ customerName, items, total });
    };
    
    const productMap = useMemo(() => new Map(products.map(p => [p.id, p])), [products]);

    return (
        <div className="space-y-4">
            <Input label="Customer Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
            
            <div className="border border-slate-200 dark:border-slate-700 p-4 rounded-md space-y-2">
                 <h4 className="font-semibold text-slate-800 dark:text-slate-100">Order Items</h4>
                 {items.map(item => {
                     const product = productMap.get(item.productId);
                     return (
                         <div key={item.productId} className="flex justify-between items-center py-2">
                             <span>{product?.name} ({item.quantity} x {formatCurrency(item.price)})</span>
                             <Button variant="danger" onClick={() => handleRemoveItem(item.productId)}>Remove</Button>
                         </div>
                     );
                 })}
                 {items.length > 0 && <p className="text-right font-bold pt-2 border-t border-slate-200 dark:border-slate-700">Subtotal: {formatCurrency(total)}</p>}
                 {items.length === 0 && <p className="text-sm text-slate-500">No items added yet.</p>}
            </div>

            <div className="flex items-end space-x-2 border border-slate-200 dark:border-slate-700 p-4 rounded-md">
                <div className="flex-grow">
                     <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Product</label>
                    <select value={currentItem.productId} onChange={e => setCurrentItem(p => ({...p, productId: e.target.value}))} className="block w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:ring-primary focus:border-primary sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                        <option value="">Select a product</option>
                        {availableProducts.map(p => <option key={p.id} value={p.id}>{p.name} (In stock: {p.stock})</option>)}
                    </select>
                </div>
                 <div>
                     <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">Quantity</label>
                    <input type="number" min="1" value={currentItem.quantity} onChange={e => setCurrentItem(p => ({...p, quantity: parseInt(e.target.value, 10)}))} className="block w-24 p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:ring-primary focus:border-primary sm:text-sm dark:bg-slate-700 dark:border-slate-600" />
                </div>
                <Button onClick={handleAddItem}>Add Item</Button>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
                <Button variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button onClick={handleSubmit}>Create Order</Button>
            </div>
        </div>
    );
};


const OrdersPage: React.FC = () => {
    const { orders, products, loading, refreshOrders, refreshProducts } = useData();
    const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
    const { addNotification } = useNotification();

    const handleSaveOrder = async (orderData: Omit<Order, 'id' | 'orderDate' | 'status'>) => {
        try {
            await api.addOrder(orderData);
            addNotification({ type: 'success', title: 'Order Created', message: 'The new order has been successfully created.' });
            setIsNewOrderModalOpen(false);
            await Promise.all([refreshOrders(), refreshProducts()]);
        } catch (error) {
            addNotification({ type: 'error', title: 'Creation Failed', message: (error as Error).message || 'There was an error creating the order.' });
        }
    };

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

    const filteredOrders = useMemo(() => {
        if (filterStatus === 'all') return orders;
        return orders.filter(o => o.status === filterStatus);
    }, [orders, filterStatus]);

    const { paginatedData, requestSort, sortConfig, currentPage, pageCount, setPage } = useTable(filteredOrders, 10, { key: 'orderDate', direction: 'descending' });

    const getSortIcon = (key: keyof Order) => {
        if (!sortConfig || sortConfig.key !== key) return <ChevronUpDownIcon className="h-4 w-4 ml-1 text-slate-400" />;
        if (sortConfig.direction === 'ascending') return <ChevronUpIcon className="h-4 w-4 ml-1" />;
        return <ChevronDownIcon className="h-4 w-4 ml-1" />;
    };

    if (loading) return <Spinner />;

    return (
        <div className="space-y-6">
            <PageHeader title="Orders">
                <div className="flex items-center space-x-2">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as OrderStatus | 'all')}
                        className="block w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:ring-primary focus:border-primary sm:text-sm dark:bg-slate-700 dark:border-slate-600"
                    >
                        <option value="all">All Statuses</option>
                        {Object.values(OrderStatus).map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                    <Button onClick={() => setIsNewOrderModalOpen(true)}><PlusIcon className="h-5 w-5 mr-2" />New Order</Button>
                </div>
            </PageHeader>

            <Card>
                {filteredOrders.length === 0 ? (
                     <EmptyState
                        icon={<ShoppingCartIcon className="h-12 w-12" />}
                        title="No orders found"
                        message="There are no orders matching the current filter."
                        action={<Button onClick={() => setIsNewOrderModalOpen(true)}><PlusIcon className="h-5 w-5 mr-2" />New Order</Button>}
                    />
                ) : (
                    <>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-slate-50 dark:bg-slate-800">
                                <tr>
                                    <th className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300 sm:pl-0 cursor-pointer" onClick={() => requestSort('id')}>
                                        <div className="flex items-center">Order ID {getSortIcon('id')}</div>
                                    </th>
                                    <th className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300 cursor-pointer" onClick={() => requestSort('customerName')}>
                                        <div className="flex items-center">Customer {getSortIcon('customerName')}</div>
                                    </th>
                                    <th className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300 cursor-pointer" onClick={() => requestSort('orderDate')}>
                                        <div className="flex items-center">Date {getSortIcon('orderDate')}</div>
                                    </th>
                                    <th className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300 cursor-pointer" onClick={() => requestSort('total')}>
                                        <div className="flex items-center">Total {getSortIcon('total')}</div>
                                    </th>
                                    <th className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300 cursor-pointer" onClick={() => requestSort('status')}>
                                        <div className="flex items-center">Status {getSortIcon('status')}</div>
                                    </th>
                                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-0"><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {paginatedData.map(order => (
                                    <tr key={order.id} className="hover:bg-slate-100 dark:hover:bg-slate-700">
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 dark:text-white sm:pl-0">{order.id}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">{order.customerName}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">{new Date(order.orderDate).toLocaleDateString()}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">{formatCurrency(order.total)}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                                            <span className={getStatusBadge(order.status)}>{order.status}</span>
                                        </td>
                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                            <Button variant="secondary" onClick={() => setSelectedOrder(order)}>Details</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Pagination currentPage={currentPage} pageCount={pageCount} setPage={setPage} />
                    </>
                )}
            </Card>

            {selectedOrder && <OrderDetailsModal order={selectedOrder} products={products} onClose={() => setSelectedOrder(null)} />}
            
            <Modal isOpen={isNewOrderModalOpen} onClose={() => setIsNewOrderModalOpen(false)} title="Create New Order">
                 <NewOrderForm products={products} onSave={handleSaveOrder} onCancel={() => setIsNewOrderModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default OrdersPage;