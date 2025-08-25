
export enum UserRole {
  STORE_MANAGER = 'Store Manager',
  EMPLOYEE = 'Employee',
  SUPPLIER = 'Supplier',
  CUSTOMER_SERVICE = 'Customer Service',
  ACCOUNTANT = 'Accountant',
  WAREHOUSE_STAFF = 'Warehouse Staff',
  IT_SUPPORT = 'IT Support',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  supplierId: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  description: string;
  category: string;
  imageUrl: string;
}

export enum OrderStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  SHIPPED = 'Shipped',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled',
  RETURNED = 'Returned'
}

export interface Order {
  id: string;
  customerName: string;
  customerAvatar?: string;
  orderDate: string;
  status: OrderStatus;
  total: number;
  items: { productId: string; quantity: number; price: number }[];
}

export interface StockMovement {
  id: string;
  productId: string;
  date: string;
  type: 'in' | 'out';
  quantity: number;
  user: string;
  notes: string;
}

export interface Notification {
  id: string;
  message: string;
  type: 'alert' | 'info' | 'success';
  date: string;
  read: boolean;
}