import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Supplier } from '../types';
import { api } from '../services/mockApi';
import { Button, Spinner, Card, Modal, Input, DeleteConfirmationModal, PageHeader, EmptyState, TruckIcon, Pagination, ChevronUpDownIcon, ChevronUpIcon, ChevronDownIcon } from '../components/common';
import { useNotification } from '../hooks/useNotification';
import { useData } from '../hooks/useData';
import { useTable } from '../hooks/useTable';

const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>);

const SupplierForm: React.FC<{ supplier?: Supplier | null; onSave: (supplier: Supplier | Omit<Supplier, 'id'>) => void; onCancel: () => void; }> = ({ supplier, onSave, onCancel }) => {
    const [formData, setFormData] = useState({ name: '', contactPerson: '', email: '', phone: '', address: '' });

    useEffect(() => {
        if (supplier) {
            setFormData({
                name: supplier.name,
                contactPerson: supplier.contactPerson,
                email: supplier.email,
                phone: supplier.phone,
                address: supplier.address,
            });
        } else {
             setFormData({ name: '', contactPerson: '', email: '', phone: '', address: '' });
        }
    }, [supplier]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(supplier ? { ...supplier, ...formData } : formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Supplier Name" name="name" value={formData.name} onChange={handleChange} required />
                <Input label="Contact Person" name="contactPerson" value={formData.contactPerson} onChange={handleChange} required />
                <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                <Input label="Phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
            </div>
            <Input label="Address" name="address" value={formData.address} onChange={handleChange} required />
            <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button type="submit">Save Supplier</Button>
            </div>
        </form>
    );
};

const SuppliersPage: React.FC = () => {
    const { suppliers, loading, refreshSuppliers } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
    const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);
    const { addNotification } = useNotification();

    const handleSaveSupplier = async (supplierData: Supplier | Omit<Supplier, 'id'>) => {
        const isUpdating = 'id' in supplierData;
        try {
            if (isUpdating) {
                await api.updateSupplier(supplierData.id, supplierData);
            } else {
                await api.addSupplier(supplierData);
            }
            addNotification({ type: 'success', title: 'Success', message: `Supplier ${isUpdating ? 'updated' : 'added'} successfully.` });
            await refreshSuppliers();
            closeModal();
        } catch (error) {
            addNotification({ type: 'error', title: 'Error', message: (error as Error).message || 'Failed to save supplier.' });
        }
    };
    
    const handleDeleteSupplier = async () => {
        if (supplierToDelete) {
             try {
                await api.deleteSupplier(supplierToDelete.id);
                addNotification({ type: 'success', title: 'Success', message: `Supplier "${supplierToDelete.name}" deleted.` });
                await refreshSuppliers();
                closeDeleteModal();
            } catch (error) {
                addNotification({ type: 'error', title: 'Error', message: (error as Error).message || 'Failed to delete supplier.' });
            }
        }
    };
    
    const openModal = (supplier: Supplier | null = null) => {
        setSelectedSupplier(supplier);
        setIsModalOpen(true);
    };
    const closeModal = () => setIsModalOpen(false);
    const openDeleteModal = (supplier: Supplier) => {
        setSupplierToDelete(supplier);
        setIsDeleteModalOpen(true);
    };
    const closeDeleteModal = () => setIsDeleteModalOpen(false);
    
    const filteredSuppliers = useMemo(() => {
        return suppliers.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.email.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [suppliers, searchTerm]);

    const { paginatedData, requestSort, sortConfig, currentPage, pageCount, setPage } = useTable(filteredSuppliers, 10, { key: 'name', direction: 'ascending' });

    const getSortIcon = (key: keyof Supplier) => {
        if (!sortConfig || sortConfig.key !== key) return <ChevronUpDownIcon className="h-4 w-4 ml-1 text-slate-400" />;
        if (sortConfig.direction === 'ascending') return <ChevronUpIcon className="h-4 w-4 ml-1" />;
        return <ChevronDownIcon className="h-4 w-4 ml-1" />;
    };

    if (loading) return <Spinner />;

    return (
        <div className="space-y-6">
            <PageHeader title="Suppliers">
                <Button onClick={() => openModal()}><PlusIcon className="h-5 w-5 mr-2" />Add Supplier</Button>
            </PageHeader>
            
            <Card>
                 <Input 
                    id="search-supplier"
                    label=""
                    placeholder="Search by name or email..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="mt-4">
                  {filteredSuppliers.length === 0 ? (
                      <EmptyState
                          icon={<TruckIcon className="h-12 w-12" />}
                          title="No suppliers found"
                          message={searchTerm ? "No suppliers match your search." : "Add your first supplier to get started."}
                          action={!searchTerm ? <Button onClick={() => openModal()}><PlusIcon className="h-5 w-5 mr-2" />Add Supplier</Button> : null}
                      />
                  ) : (
                    <>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-slate-50 dark:bg-slate-800">
                                <tr>
                                    <th className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300 sm:pl-0 cursor-pointer" onClick={() => requestSort('name')}>
                                       <div className="flex items-center">Supplier Name {getSortIcon('name')}</div>
                                    </th>
                                    <th className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300 cursor-pointer" onClick={() => requestSort('contactPerson')}>
                                       <div className="flex items-center">Contact Person {getSortIcon('contactPerson')}</div>
                                    </th>
                                    <th className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300 cursor-pointer" onClick={() => requestSort('email')}>
                                       <div className="flex items-center">Email {getSortIcon('email')}</div>
                                    </th>
                                    <th className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300">
                                        Phone
                                    </th>
                                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-0"><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {paginatedData.map(supplier => (
                                    <tr key={supplier.id} className="hover:bg-slate-100 dark:hover:bg-slate-700">
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 dark:text-white sm:pl-0">{supplier.name}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">{supplier.contactPerson}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">{supplier.email}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">{supplier.phone}</td>
                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0 space-x-2">
                                            <Button variant="secondary" onClick={() => openModal(supplier)}>Edit</Button>
                                            <Button variant="danger" onClick={() => openDeleteModal(supplier)}>Delete</Button>
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
            
             <Modal isOpen={isModalOpen} onClose={closeModal} title={selectedSupplier ? 'Edit Supplier' : 'Add New Supplier'}>
                <SupplierForm supplier={selectedSupplier} onSave={handleSaveSupplier} onCancel={closeModal} />
            </Modal>
            
            <DeleteConfirmationModal 
              isOpen={isDeleteModalOpen} 
              onClose={closeDeleteModal} 
              onConfirm={handleDeleteSupplier} 
              itemName={supplierToDelete?.name || ''} 
            />
        </div>
    );
};

export default SuppliersPage;