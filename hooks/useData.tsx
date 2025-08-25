import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { Product, Supplier, Order, StockMovement } from '../types';
import { api } from '../services/mockApi';

interface DataContextType {
    products: Product[];
    suppliers: Supplier[];
    orders: Order[];
    stockMovements: StockMovement[];
    loading: boolean;
    error: string | null;
    refreshProducts: () => Promise<void>;
    refreshSuppliers: () => Promise<void>;
    refreshOrders: () => Promise<void>;
    refreshStockMovements: () => Promise<void>;
    refreshAll: () => Promise<void>;
    getProductMap: () => Map<string, Product>;
    getSupplierMap: () => Map<string, Supplier>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = useCallback(async () => {
        const productsData = await api.getProducts();
        setProducts(productsData);
    }, []);

    const fetchSuppliers = useCallback(async () => {
        const suppliersData = await api.getSuppliers();
        setSuppliers(suppliersData);
    }, []);

    const fetchOrders = useCallback(async () => {
        const ordersData = await api.getOrders();
        setOrders(ordersData);
    }, []);

    const fetchStockMovements = useCallback(async () => {
        const stockMovementsData = await api.getStockMovements();
        setStockMovements(stockMovementsData);
    }, []);

    const fetchAllData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            await Promise.all([fetchProducts(), fetchSuppliers(), fetchOrders(), fetchStockMovements()]);
        } catch (err) {
            setError('Failed to fetch data. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [fetchProducts, fetchSuppliers, fetchOrders, fetchStockMovements]);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    const getProductMap = useCallback(() => new Map(products.map(p => [p.id, p])), [products]);
    const getSupplierMap = useCallback(() => new Map(suppliers.map(s => [s.id, s])), [suppliers]);

    const value: DataContextType = {
        products,
        suppliers,
        orders,
        stockMovements,
        loading,
        error,
        refreshProducts: fetchProducts,
        refreshSuppliers: fetchSuppliers,
        refreshOrders: fetchOrders,
        refreshStockMovements: fetchStockMovements,
        refreshAll: fetchAllData,
        getProductMap,
        getSupplierMap,
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};