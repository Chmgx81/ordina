import { User, UserRole, Product, Supplier, Order, OrderStatus, StockMovement } from '../types';

// --- MOCK DATA ---

let users: User[] = [
  { id: 'u1', name: 'Alex Johnson', email: 'manager@ordina.com', role: UserRole.STORE_MANAGER, avatar: 'https://picsum.photos/seed/u1/100/100' },
  { id: 'u2', name: 'Maria Garcia', email: 'employee@ordina.com', role: UserRole.EMPLOYEE, avatar: 'https://picsum.photos/seed/u2/100/100' },
  { id: 'u3', name: 'Chen Wei', email: 'supplier@ordina.com', role: UserRole.SUPPLIER, avatar: 'https://picsum.photos/seed/u3/100/100' },
  { id: 'u4', name: 'Samira Khan', email: 'cs@ordina.com', role: UserRole.CUSTOMER_SERVICE, avatar: 'https://picsum.photos/seed/u4/100/100' },
];

let suppliers: Supplier[] = [
    { id: 's1', name: 'Global Electronics', contactPerson: 'John Doe', email: 'contact@globalelec.com', phone: '123-456-7890', address: '123 Tech Ave, Silicon Valley, CA' },
    { id: 's2', name: 'Component Solutions', contactPerson: 'Jane Smith', email: 'sales@componentsol.com', phone: '987-654-3210', address: '456 Circuit Rd, Austin, TX' },
    { id: 's3', name: 'Device Makers Inc.', contactPerson: 'Li Wang', email: 'info@devicemakers.com', phone: '555-123-4567', address: '789 Innovation Dr, Boston, MA' },
];

let products: Product[] = [
  { id: 'p1', name: 'Quantum Pro Laptop', sku: 'QPL-001', barcode: '111222333', supplierId: 's1', price: 1200000, stock: 25, lowStockThreshold: 10, category: 'Laptops', description: 'High-performance laptop with 16-inch display, 32GB RAM, 1TB SSD.', imageUrl: 'https://picsum.photos/seed/p1/400/300' },
  { id: 'p2', name: 'CyberView 4K Monitor', sku: 'CVM-002', barcode: '444555666', supplierId: 's2', price: 450000, stock: 8, lowStockThreshold: 5, category: 'Monitors', description: '27-inch 4K UHD monitor with HDR support and 144Hz refresh rate.', imageUrl: 'https://picsum.photos/seed/p2/400/300' },
  { id: 'p3', name: 'SonicWave Wireless Buds', sku: 'SWB-003', barcode: '777888999', supplierId: 's3', price: 85000, stock: 150, lowStockThreshold: 20, category: 'Audio', description: 'True wireless earbuds with active noise cancellation and 24-hour battery life.', imageUrl: 'https://picsum.photos/seed/p3/400/300' },
  { id: 'p4', name: 'MegaCharge Power Bank', sku: 'MCP-004', barcode: '123123123', supplierId: 's1', price: 35000, stock: 200, lowStockThreshold: 50, category: 'Accessories', description: '20,000mAh power bank with fast charging capabilities.', imageUrl: 'https://picsum.photos/seed/p4/400/300' },
  { id: 'p5', name: 'Streamer Pro Webcam', sku: 'SPW-005', barcode: '456456456', supplierId: 's2', price: 55000, stock: 4, lowStockThreshold: 10, category: 'Peripherals', description: '1080p webcam with ring light and stereo microphone.', imageUrl: 'https://picsum.photos/seed/p5/400/300' },
  { id: 'p6', name: 'RGB Mechanical Keyboard', sku: 'RMK-006', barcode: '654321987', supplierId: 's3', price: 60000, stock: 75, lowStockThreshold: 15, category: 'Peripherals', description: 'Full-size mechanical keyboard with customizable RGB lighting.', imageUrl: 'https://picsum.photos/seed/p6/400/300' },
  { id: 'p7', name: 'Stealth-X Gaming Mouse', sku: 'SGM-007', barcode: '987654321', supplierId: 's1', price: 45000, stock: 120, lowStockThreshold: 25, category: 'Peripherals', description: 'High-DPI gaming mouse with programmable buttons.', imageUrl: 'https://picsum.photos/seed/p7/400/300' },
  { id: 'p8', name: 'ImmersiView VR Headset', sku: 'IVR-008', barcode: '123456789', supplierId: 's2', price: 380000, stock: 30, lowStockThreshold: 10, category: 'Gaming', description: 'Next-generation virtual reality headset for immersive experiences.', imageUrl: 'https://picsum.photos/seed/p8/400/300' },
  { id: 'p9', name: 'Chrono-Smart Watch', sku: 'CSW-009', barcode: '987123654', supplierId: 's3', price: 180000, stock: 60, lowStockThreshold: 15, category: 'Wearables', description: 'Feature-rich smartwatch with fitness tracking and notifications.', imageUrl: 'https://picsum.photos/seed/p9/400/300' },
  { id: 'p10', name: 'NovaTab 10 Tablet', sku: 'NTT-010', barcode: '456789123', supplierId: 's1', price: 280000, stock: 45, lowStockThreshold: 10, category: 'Tablets', description: '10-inch tablet with a high-resolution display and long battery life.', imageUrl: 'https://picsum.photos/seed/p10/400/300' },
  { id: 'p11', name: 'Aero-Drone 4K', sku: 'ADK-011', barcode: '789123456', supplierId: 's2', price: 750000, stock: 15, lowStockThreshold: 5, category: 'Drones', description: '4K camera drone with advanced stabilization and flight modes.', imageUrl: 'https://picsum.photos/seed/p11/400/300' },
  { id: 'p12', name: 'Titan-V Graphics Card', sku: 'TVG-012', barcode: '321654987', supplierId: 's3', price: 1500000, stock: 10, lowStockThreshold: 3, category: 'Components', description: 'Top-of-the-line graphics card for gaming and professional workloads.', imageUrl: 'https://picsum.photos/seed/p12/400/300' }
];

let orders: Order[] = [
    { id: 'o1', customerName: 'Alice Brown', orderDate: '2024-07-20T10:30:00Z', status: OrderStatus.DELIVERED, total: 1200000, items: [{ productId: 'p1', quantity: 1, price: 1200000 }] },
    { id: 'o2', customerName: 'Bob Green', orderDate: '2024-07-21T14:00:00Z', status: OrderStatus.SHIPPED, total: 85000, items: [{ productId: 'p3', quantity: 1, price: 85000 }] },
    { id: 'o3', customerName: 'Charlie Black', orderDate: '2024-07-22T09:15:00Z', status: OrderStatus.PENDING, total: 505000, items: [{ productId: 'p2', quantity: 1, price: 450000 }, { productId: 'p5', quantity: 1, price: 55000 }] },
    { id: 'o4', customerName: 'Diana Prince', orderDate: '2024-07-23T11:00:00Z', status: OrderStatus.DELIVERED, total: 140000, items: [{ productId: 'p4', quantity: 4, price: 35000 }] },
    { id: 'o5', customerName: 'Ethan Hunt', orderDate: '2024-07-23T15:45:00Z', status: OrderStatus.SHIPPED, total: 425000, items: [{ productId: 'p3', quantity: 5, price: 85000 }] },
    { id: 'o6', customerName: 'Fiona Glenanne', orderDate: '2024-07-24T08:20:00Z', status: OrderStatus.DELIVERED, total: 90000, items: [{ productId: 'p7', quantity: 2, price: 45000 }] },
    { id: 'o7', customerName: 'George Costanza', orderDate: '2024-07-24T12:00:00Z', status: OrderStatus.PENDING, total: 495000, items: [{ productId: 'p9', quantity: 1, price: 180000 }, { productId: 'p10', quantity: 1, price: 280000 }, { productId: 'p4', quantity: 1, price: 35000 }] },
    { id: 'o8', customerName: 'Harry Potter', orderDate: '2024-07-25T18:00:00Z', status: OrderStatus.SHIPPED, total: 255000, items: [{ productId: 'p3', quantity: 3, price: 85000 }] },
    { id: 'o9', customerName: 'Irene Adler', orderDate: '2024-07-26T10:00:00Z', status: OrderStatus.DELIVERED, total: 1500000, items: [{ productId: 'p12', quantity: 1, price: 1500000 }] },
    { id: 'o10', customerName: 'James Bond', orderDate: '2024-07-26T14:30:00Z', status: OrderStatus.DELIVERED, total: 120000, items: [{ productId: 'p6', quantity: 2, price: 60000 }] },
    { id: 'o11', customerName: 'Kara Danvers', orderDate: '2024-07-27T09:00:00Z', status: OrderStatus.PENDING, total: 350000, items: [{ productId: 'p4', quantity: 10, price: 35000 }] },
    { id: 'o12', customerName: 'Luke Skywalker', orderDate: '2024-07-28T11:20:00Z', status: OrderStatus.SHIPPED, total: 380000, items: [{ productId: 'p8', quantity: 1, price: 380000 }] },
    { id: 'o13', customerName: 'Michael Scott', orderDate: '2024-07-28T16:00:00Z', status: OrderStatus.DELIVERED, total: 750000, items: [{ productId: 'p11', quantity: 1, price: 750000 }] },
    { id: 'o14', customerName: 'Neville Longbottom', orderDate: '2024-07-29T10:10:00Z', status: OrderStatus.SHIPPED, total: 105000, items: [{ productId: 'p7', quantity: 1, price: 45000 }, { productId: 'p6', quantity: 1, price: 60000 }] },
    { id: 'o15', customerName: 'Olivia Pope', orderDate: '2024-07-29T13:00:00Z', status: OrderStatus.PENDING, total: 170000, items: [{ productId: 'p3', quantity: 2, price: 85000 }] }
];


let stockMovements: StockMovement[] = [
    {id: 'sm1', productId: 'p1', date: '2024-07-15T10:00:00Z', type: 'in', quantity: 50, user: 'Alex Johnson', notes: 'Initial stock'},
    {id: 'sm2', productId: 'p2', date: '2024-07-15T10:05:00Z', type: 'in', quantity: 20, user: 'Alex Johnson', notes: 'Initial stock'},
    {id: 'sm3', productId: 'p1', date: '2024-07-20T10:35:00Z', type: 'out', quantity: 1, user: 'Maria Garcia', notes: 'Order #o1'},
];


const simulateDelay = <T,>(data: T): Promise<T> =>
  new Promise(resolve => {
    const delay = 500 + Math.random() * 800; // Delay between 500ms and 1300ms
    setTimeout(() => resolve(data), delay);
  });

// --- API FUNCTIONS ---

export const api = {
  login: async (email: string, pass: string): Promise<User | null> => {
    console.log(`Attempting login for: ${email}`);
    const user = users.find(u => u.email === email);
    // In a real app, 'pass' would be checked against a hashed password.
    return simulateDelay(user || null);
  },
  signup: async (userData: {name: string, email: string, password: string}): Promise<boolean> => {
    if (users.find(u => u.email === userData.email)) {
      return simulateDelay(false); // Email already exists
    }
    const newUser: User = {
      id: `u${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: UserRole.EMPLOYEE, // Default role for new signups
      avatar: `https://picsum.photos/seed/u${Date.now()}/100/100`,
    };
    users.push(newUser);
    return simulateDelay(true);
  },

  getProducts: async () => simulateDelay([...products]),
  getProduct: async (id: string) => simulateDelay(products.find(p => p.id === id) || null),
  addProduct: async (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = { ...productData, id: `p${Date.now()}` };
    products.push(newProduct);
    return simulateDelay(newProduct);
  },
  updateProduct: async (id: string, updates: Partial<Product>) => {
    const index = products.findIndex(p => p.id === id);
    if (index === -1) throw new Error("Product not found");
    products[index] = { ...products[index], ...updates };
    return simulateDelay(products[index]);
  },
  deleteProduct: async (id: string) => {
    const index = products.findIndex(p => p.id === id);
    if (index === -1) throw new Error("Product not found");
    products = products.filter(p => p.id !== id);
    return simulateDelay({ success: true });
  },

  getSuppliers: async () => simulateDelay([...suppliers]),
  getSupplier: async (id: string) => simulateDelay(suppliers.find(p => p.id === id) || null),
  addSupplier: async (supplierData: Omit<Supplier, 'id'>) => {
    const newSupplier: Supplier = { ...supplierData, id: `s${Date.now()}` };
    suppliers.push(newSupplier);
    return simulateDelay(newSupplier);
  },
  updateSupplier: async (id: string, updates: Partial<Supplier>) => {
    const index = suppliers.findIndex(s => s.id === id);
    if (index === -1) throw new Error("Supplier not found");
    suppliers[index] = { ...suppliers[index], ...updates };
    return simulateDelay(suppliers[index]);
  },
  deleteSupplier: async (id: string) => {
    const index = suppliers.findIndex(s => s.id === s.id);
    if (index === -1) throw new Error("Supplier not found");
    suppliers = suppliers.filter(s => s.id !== id);
    return simulateDelay({ success: true });
  },
  
  getOrders: async () => simulateDelay([...orders]),
  getOrder: async (id:string) => simulateDelay(orders.find(o => o.id === id) || null),
  addOrder: async (orderData: Omit<Order, 'id' | 'orderDate' | 'status'>) => {
      const newOrder: Order = {
          ...orderData,
          id: `o${Date.now()}`,
          orderDate: new Date().toISOString(),
          status: OrderStatus.PENDING,
      };
      // Update stock and create stock movement records
      newOrder.items.forEach(item => {
          const product = products.find(p => p.id === item.productId);
          if (product) {
              if (product.stock < item.quantity) {
                  throw new Error(`Not enough stock for product ${product.name}`);
              }
              product.stock -= item.quantity;
              const movement: StockMovement = {
                  id: `sm${Date.now()}`,
                  productId: item.productId,
                  date: newOrder.orderDate,
                  type: 'out',
                  quantity: item.quantity,
                  user: 'System', // In a real app, this would be the logged-in user
                  notes: `Order #${newOrder.id}`,
              };
              stockMovements.push(movement);
          }
      });
      orders.unshift(newOrder); // Add to beginning of array
      return simulateDelay(newOrder);
  },
  
  getStockMovements: async () => simulateDelay([...stockMovements]),

  getTopSellingProducts: async () => {
    const productSales: Record<string, number> = {};
    orders.forEach(order => {
        // For this report, let's consider all orders regardless of status to have some data
        order.items.forEach(item => {
            productSales[item.productId] = (productSales[item.productId] || 0) + item.quantity;
        });
    });

    const sortedProducts = Object.entries(productSales)
        .sort(([, qtyA], [, qtyB]) => qtyB - qtyA)
        .slice(0, 10);

    const topProducts = sortedProducts.map(([productId, unitsSold]) => {
        const productDetails = products.find(p => p.id === productId);
        return {
            ...(productDetails as Product),
            unitsSold,
        };
    }).filter(p => p && p.id); // Filter out any potential undefined products

    return simulateDelay(topProducts as (Product & { unitsSold: number })[]);
  },

  getDashboardData: async () => {
    const lowStockProducts = products.filter(p => p.stock <= p.lowStockThreshold);
    const recentOrders: Order[] = orders
        .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
        .slice(0, 5)
        .map(order => ({
            ...order,
            customerAvatar: `https://i.pravatar.cc/40?u=${encodeURIComponent(order.customerName)}`
        }));
    const inventoryValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
    const totalSales = orders.filter(o => o.status === OrderStatus.DELIVERED || o.status === OrderStatus.SHIPPED).reduce((sum, o) => sum + o.total, 0);
    const salesDataByMonth = orders.reduce((acc, order) => {
        const month = new Date(order.orderDate).toLocaleString('default', { month: 'short' });
        acc[month] = (acc[month] || 0) + order.total;
        return acc;
    }, {} as Record<string, number>);

    const chartData = Object.entries(salesDataByMonth).map(([name, sales]) => ({ name, sales }));

    return simulateDelay({
        stats: {
            products: products.length,
            inventoryValue: inventoryValue,
            totalSales: totalSales,
            suppliers: suppliers.length,
        },
        lowStockProducts,
        recentOrders,
        chartData
    });
  }
};