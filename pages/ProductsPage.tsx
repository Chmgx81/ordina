import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Product, Supplier, UserRole } from '../types';
import { api } from '../services/mockApi';
import { Button, Modal, Input, Textarea, Select, Spinner, Card, DeleteConfirmationModal, PageHeader, EmptyState, SparklesIcon, CubeIcon, ChevronUpIcon, ChevronDownIcon, ChevronUpDownIcon, Pagination, BarcodeScannerModal, formatCurrency } from '../components/common';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import { GoogleGenAI } from '@google/genai';
import { useData } from '../hooks/useData';
import { useTable } from '../hooks/useTable';

const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>);
const BarcodeIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h.375c.621 0 1.125.504 1.125 1.125v14.25c0 .621-.504 1.125-1.125-1.125h-.375a1.125 1.125 0 01-1.125-1.125V4.875zM8.25 12h.008v.008H8.25V12zm0 3h.008v.008H8.25v-3zm0-6h.008v.008H8.25v-6zm3 3h.008v.008H11.25v-3zm0 3h.008v.008H11.25v-3zm0-6h.008v.008H11.25v-6zM12 12h9" /></svg>);
const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>);

const AIGenerateButton: React.FC<{ onGenerate: () => void; isLoading: boolean; disabled: boolean }> = ({ onGenerate, isLoading, disabled }) => (
    <button type="button" onClick={onGenerate} disabled={disabled || isLoading} className="text-sm font-medium text-primary disabled:text-slate-400 disabled:cursor-not-allowed hover:text-primary-hover inline-flex items-center">
        {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
        ) : (
            <SparklesIcon className="h-4 w-4 mr-1" />
        )}
        {isLoading ? 'Generating...' : 'Generate with AI'}
    </button>
);


const ProductForm: React.FC<{ product?: Product | null; suppliers: Supplier[]; onSave: (product: Product | Omit<Product, 'id'>) => void; onCancel: () => void; }> = ({ product, suppliers, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '', sku: '', barcode: '', supplierId: '', category: '',
        price: 0, stock: 0, lowStockThreshold: 0, description: '', imageUrl: '',
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const { addNotification } = useNotification();


    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                sku: product.sku,
                barcode: product.barcode,
                supplierId: product.supplierId,
                category: product.category,
                price: product.price,
                stock: product.stock,
                lowStockThreshold: product.lowStockThreshold,
                description: product.description,
                imageUrl: product.imageUrl,
            });
        }
    }, [product]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleGenerateDescription = async () => {
        if (!formData.name) {
            addNotification({ type: 'error', title: 'Missing Information', message: 'Please enter a product name first.' });
            return;
        }
        setIsGenerating(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            const prompt = `Generate a compelling, short marketing description for a product named "${formData.name}" in the category "${formData.category || 'electronics'}". Keep it under 200 characters.`;
            const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: prompt,
            });
            const description = response.text;
            setFormData(prev => ({ ...prev, description }));
            addNotification({ type: 'success', title: 'Description Generated', message: 'AI-powered description has been added.' });
        } catch (error) {
            console.error("Gemini API error:", error);
            addNotification({ type: 'error', title: 'Generation Failed', message: 'Could not generate a description at this time.' });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const productData = {
            ...formData,
            price: Number(formData.price),
            stock: Number(formData.stock),
            lowStockThreshold: Number(formData.lowStockThreshold),
        };
        onSave(product ? { ...product, ...productData } : productData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Product Name" name="name" value={formData.name} onChange={handleChange} required />
                <Input label="SKU" name="sku" value={formData.sku} onChange={handleChange} required />
                <Input label="Barcode" name="barcode" value={formData.barcode} onChange={handleChange} />
                <Select label="Supplier" name="supplierId" value={formData.supplierId} onChange={handleChange} required>
                    <option value="">Select a supplier</option>
                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </Select>
                <Input label="Category" name="category" value={formData.category} onChange={handleChange} />
                <Input label="Price" name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} required />
                <Input label="Stock Count" name="stock" type="number" value={formData.stock} onChange={handleChange} required />
                <Input label="Low Stock Threshold" name="lowStockThreshold" type="number" value={formData.lowStockThreshold} onChange={handleChange} required />
            </div>
            <div>
                 <div className="flex justify-between items-center mb-2">
                    <label htmlFor="description" className="block text-sm font-medium text-slate-900 dark:text-white">Description</label>
                    <AIGenerateButton onGenerate={handleGenerateDescription} isLoading={isGenerating} disabled={!formData.name} />
                </div>
                <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} className="block w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:ring-primary focus:border-primary dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary" />
            </div>
            <Input label="Image URL" name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
            <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button type="submit">Save Product</Button>
            </div>
        </form>
    );
};

const ProductsPage: React.FC = () => {
    const { products, suppliers, loading, refreshProducts } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [supplierFilter, setSupplierFilter] = useState('all');
    const [isScannerOpen, setIsScannerOpen] = useState(false);

    const { hasRole } = useAuth();
    const { addNotification } = useNotification();
    
    const canEdit = hasRole([UserRole.STORE_MANAGER, UserRole.EMPLOYEE]);
    const canDelete = hasRole([UserRole.STORE_MANAGER]);

    const handleSaveProduct = async (productData: Product | Omit<Product, 'id'>) => {
        const isUpdating = 'id' in productData;
        try {
            if (isUpdating) {
                await api.updateProduct(productData.id, productData);
            } else {
                await api.addProduct(productData);
            }
            addNotification({ type: 'success', title: 'Success', message: `Product ${isUpdating ? 'updated' : 'added'} successfully.` });
            await refreshProducts();
            closeModal();
        } catch (error) {
            addNotification({ type: 'error', title: 'Error', message: (error as Error).message || 'Failed to save product.' });
        }
    };
    
    const handleDeleteProduct = async () => {
        if (productToDelete) {
             try {
                await api.deleteProduct(productToDelete.id);
                addNotification({ type: 'success', title: 'Success', message: `Product "${productToDelete.name}" deleted.` });
                await refreshProducts();
                closeDeleteModal();
            } catch (error) {
                addNotification({ type: 'error', title: 'Error', message: (error as Error).message || 'Failed to delete product.' });
            }
        }
    };
    
    const openModal = (product: Product | null = null) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };
    const closeModal = () => setIsModalOpen(false);
    const openDeleteModal = (product: Product) => {
        setProductToDelete(product);
        setIsDeleteModalOpen(true);
    };
    const closeDeleteModal = () => setIsDeleteModalOpen(false);
    
    const handleScanSuccess = (barcode: string) => {
        setIsScannerOpen(false);
        if (barcode) {
            const product = products.find(p => p.barcode === barcode);
            if (product) {
                addNotification({ type: 'info', title: 'Product Found', message: `${product.name} (Stock: ${product.stock})` });
                openModal(product);
            } else {
                addNotification({ type: 'error', title: 'Not Found', message: 'No product with that barcode was found.' });
            }
        }
    };
    
    const handleScanBarcode = () => {
        setIsScannerOpen(true);
    }

    const categories = useMemo(() => ['all', ...Array.from(new Set(products.map(p => p.category)))], [products]);

    const filteredProducts = useMemo(() => {
        return products.filter(p => 
            (p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (categoryFilter === 'all' || p.category === categoryFilter) &&
            (supplierFilter === 'all' || p.supplierId === supplierFilter)
        );
    }, [products, searchTerm, categoryFilter, supplierFilter]);
    
    const { paginatedData, requestSort, sortConfig, currentPage, pageCount, setPage } = useTable(filteredProducts, 10, { key: 'name', direction: 'ascending' });

    const getSortIcon = (key: keyof Product) => {
        if (!sortConfig || sortConfig.key !== key) return <ChevronUpDownIcon className="h-4 w-4 ml-1 text-slate-400" />;
        if (sortConfig.direction === 'ascending') return <ChevronUpIcon className="h-4 w-4 ml-1" />;
        return <ChevronDownIcon className="h-4 w-4 ml-1" />;
    };

    if (loading) return <Spinner />;

    return (
        <div className="space-y-6">
            <PageHeader title="Products">
                 <div className="flex space-x-2">
                    {canEdit && <Button variant="outline" onClick={handleScanBarcode}><BarcodeIcon className="h-5 w-5 mr-2" />Scan</Button>}
                    {canEdit && <Button onClick={() => openModal()}><PlusIcon className="h-5 w-5 mr-2" />Add Product</Button>}
                </div>
            </PageHeader>

            <Card>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <Input label="" id="search" placeholder="Search by name or SKU..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} icon={<SearchIcon className="h-5 w-5 text-slate-400" />} />
                    <Select label="" id="categoryFilter" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                        {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>)}
                    </Select>
                     <Select label="" id="supplierFilter" value={supplierFilter} onChange={e => setSupplierFilter(e.target.value)}>
                        <option value="all">All Suppliers</option>
                        {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </Select>
                </div>
                <div>
                  {filteredProducts.length === 0 ? (
                    <EmptyState
                        icon={<CubeIcon className="h-12 w-12" />}
                        title="No products found"
                        message={searchTerm ? "No products match your search/filters." : "Get started by adding a new product to your inventory."}
                        action={canEdit && !searchTerm ? <Button onClick={() => openModal()}><PlusIcon className="h-5 w-5 mr-2" />Add Product</Button> : null}
                    />
                  ) : (
                    <>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-slate-50 dark:bg-slate-800">
                                <tr>
                                    <th className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300 sm:pl-0 cursor-pointer" onClick={() => requestSort('name')}>
                                        <div className="flex items-center">Product {getSortIcon('name')}</div>
                                    </th>
                                    <th className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300 cursor-pointer" onClick={() => requestSort('sku')}>
                                        <div className="flex items-center">SKU {getSortIcon('sku')}</div>
                                    </th>
                                    <th className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300 cursor-pointer" onClick={() => requestSort('category')}>
                                        <div className="flex items-center">Category {getSortIcon('category')}</div>
                                    </th>
                                    <th className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300 cursor-pointer" onClick={() => requestSort('price')}>
                                        <div className="flex items-center">Price {getSortIcon('price')}</div>
                                    </th>
                                    <th className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300 cursor-pointer" onClick={() => requestSort('stock')}>
                                        <div className="flex items-center">Stock {getSortIcon('stock')}</div>
                                    </th>
                                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-0"><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {paginatedData.map(product => (
                                    <tr key={product.id} className="group hover:bg-slate-100 dark:hover:bg-slate-700">
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-0">
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
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">{formatCurrency(product.price)}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                                            <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${product.stock <= product.lowStockThreshold ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200' : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'}`}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0 space-x-2">
                                            {canEdit && <Button variant="secondary" onClick={() => openModal(product)}>Edit</Button>}
                                            {canDelete && <Button variant="danger" onClick={() => openDeleteModal(product)}>Delete</Button>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                     <Pagination currentPage={currentPage} pageCount={pageCount} setPage={setPage} />
                    </>
                  )}
                </div>
            </Card>

            <Modal isOpen={isModalOpen} onClose={closeModal} title={selectedProduct ? 'Edit Product' : 'Add New Product'}>
                <ProductForm product={selectedProduct} suppliers={suppliers} onSave={handleSaveProduct} onCancel={closeModal} />
            </Modal>
            
            <DeleteConfirmationModal 
              isOpen={isDeleteModalOpen} 
              onClose={closeDeleteModal} 
              onConfirm={handleDeleteProduct} 
              itemName={productToDelete?.name || ''} 
            />

            <BarcodeScannerModal 
                isOpen={isScannerOpen}
                onClose={() => setIsScannerOpen(false)}
                onScanSuccess={handleScanSuccess}
            />
        </div>
    );
};

export default ProductsPage;