import React, { useState, ReactNode, useMemo } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ThemeProvider, useTheme } from './hooks/useTheme';
import { NotificationProvider } from './hooks/useNotification';
import { DataProvider } from './hooks/useData';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import SuppliersPage from './pages/SuppliersPage';
import OrdersPage from './pages/OrdersPage';
import ReportsPage from './pages/ReportsPage';
import StockMovementsPage from './pages/StockMovementsPage';
import { UserRole } from './types';
import { 
    ThemeToggle, 
    NotificationContainer,
    ChartPieIcon,
    CubeIcon,
    TruckIcon,
    ShoppingCartIcon,
    DocumentChartBarIcon,
    ArrowLeftOnRectangleIcon,
    Bars3Icon,
    ArrowsUpDownIcon
} from './components/common';

// --- Navigation ---
interface NavItemProps {
    to: string;
    icon: ReactNode;
    children: string;
    roles?: UserRole[];
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, children, roles }) => {
    const location = useLocation();
    const { hasRole } = useAuth();
    const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));

    if (roles && !hasRole(roles)) {
        return null;
    }

    return (
        <Link
            to={to}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-r-md transition-colors group border-l-4 ${isActive
                ? 'bg-slate-100 text-primary dark:bg-slate-700 border-primary'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border-transparent'
                }`}
        >
             <span className={`mr-3 ${isActive ? 'text-primary' : 'text-slate-400 dark:text-slate-400 group-hover:text-slate-500 dark:group-hover:text-slate-300'}`}>{icon}</span>
            {children}
        </Link>
    );
};


// --- Layout ---
const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user, logout } = useAuth();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const { theme } = useTheme();

    const navLinks = useMemo(() => [
        { to: "/", icon: <ChartPieIcon className="h-6 w-6" />, text: "Dashboard", roles: [UserRole.STORE_MANAGER, UserRole.EMPLOYEE, UserRole.CUSTOMER_SERVICE, UserRole.ACCOUNTANT] },
        { to: "/products", icon: <CubeIcon className="h-6 w-6" />, text: "Products", roles: [UserRole.STORE_MANAGER, UserRole.EMPLOYEE] },
        { to: "/orders", icon: <ShoppingCartIcon className="h-6 w-6" />, text: "Orders", roles: [UserRole.STORE_MANAGER, UserRole.CUSTOMER_SERVICE] },
        { to: "/suppliers", icon: <TruckIcon className="h-6 w-6" />, text: "Suppliers", roles: [UserRole.STORE_MANAGER, UserRole.EMPLOYEE] },
        { to: "/stock", icon: <ArrowsUpDownIcon className="h-6 w-6" />, text: "Stock Movements", roles: [UserRole.STORE_MANAGER, UserRole.EMPLOYEE] },
        { to: "/reports", icon: <DocumentChartBarIcon className="h-6 w-6" />, text: "Reports", roles: [UserRole.STORE_MANAGER, UserRole.ACCOUNTANT] },
    ], []);

    const sidebarContent = (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-center h-16 border-b border-slate-200 dark:border-slate-700 flex-shrink-0 px-4">
                <h1 className="text-2xl font-bold text-primary dark:text-white">Ordina</h1>
            </div>
            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                {navLinks.map(link => <NavItem key={link.to} to={link.to} icon={link.icon} roles={link.roles}>{link.text}</NavItem>)}
            </nav>
            <div className="border-t border-slate-200 dark:border-slate-700 p-4 mt-auto">
                 <div className="flex items-center">
                    <img className="h-10 w-10 rounded-full" src={user?.avatar} alt="User avatar" />
                    <div className="ml-3">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{user?.name}</p>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{user?.role}</p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className={`flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans ${theme}`}>
            {/* Mobile Sidebar */}
            <div className={`fixed inset-0 z-40 flex md:hidden transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                 <aside className="relative z-10 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700">
                    {sidebarContent}
                </aside>
                <div className="flex-shrink-0 w-14 bg-black bg-opacity-25" onClick={() => setSidebarOpen(false)}></div>
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex md:flex-shrink-0 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700">
              {sidebarContent}
            </aside>

            {/* Main Content */}
            <div className="flex flex-col flex-1 w-0 overflow-hidden">
                <header className="relative z-30 flex-shrink-0 flex h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                    <button onClick={() => setSidebarOpen(true)} className="px-4 border-r border-slate-200 dark:border-slate-700 text-slate-500 md:hidden" aria-label="Open sidebar">
                        <Bars3Icon className="h-6 w-6" />
                    </button>
                    <div className="flex-1 px-4 flex justify-end items-center">
                        <div className="flex items-center space-x-4">
                            <ThemeToggle />
                            <button
                                onClick={logout}
                                className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
                                title="Logout"
                            >
                                <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </header>

                <main className="flex-1 relative overflow-y-auto focus:outline-none p-6 sm:p-8 bg-white dark:bg-slate-900" tabIndex={0}>
                    {children}
                </main>
            </div>
        </div>
    );
};


// --- Route Protection ---
const ProtectedRoute: React.FC<{ children: ReactNode; roles?: UserRole[] }> = ({ children, roles }) => {
    const { isAuthenticated, hasRole } = useAuth();
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    if (roles && !hasRole(roles)) {
        return <Navigate to="/" replace />; // Or a dedicated "Access Denied" page
    }
    return <>{children}</>;
};


// --- App Component ---
function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/products" element={<ProtectedRoute roles={[UserRole.STORE_MANAGER, UserRole.EMPLOYEE]}><ProductsPage /></ProtectedRoute>} />
        <Route path="/suppliers" element={<ProtectedRoute roles={[UserRole.STORE_MANAGER, UserRole.EMPLOYEE]}><SuppliersPage /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute roles={[UserRole.STORE_MANAGER, UserRole.CUSTOMER_SERVICE]}><OrdersPage /></ProtectedRoute>} />
        <Route path="/stock" element={<ProtectedRoute roles={[UserRole.STORE_MANAGER, UserRole.EMPLOYEE]}><StockMovementsPage /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute roles={[UserRole.STORE_MANAGER, UserRole.ACCOUNTANT]}><ReportsPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

function AppContent() {
    const { isAuthenticated } = useAuth();
    return (
         <HashRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/*" element={isAuthenticated ? <AppRoutes /> : <Navigate to="/login" replace />} />
            </Routes>
        </HashRouter>
    )
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <DataProvider>
            <AppContent />
          </DataProvider>
          <NotificationContainer />
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;