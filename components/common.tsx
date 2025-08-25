import React, { ReactNode, useEffect, useState, useRef } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useNotification, Notification as NotificationType } from '../hooks/useNotification';

declare const Html5Qrcode: any;

// --- Icon Components ---
export const XMarkIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>);
export const ExclamationTriangleIcon: React.FC<{ className?: string }> = ({ className = "h-6 w-6" }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>);
export const SunIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>);
export const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>);
export const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.553L16.5 21.75l-.398-1.197a3.375 3.375 0 00-2.456-2.456L12.75 18l1.197-.398a3.375 3.375 0 002.456-2.456L16.5 14.25l.398 1.197a3.375 3.375 0 002.456 2.456L20.25 18l-1.197.398a3.375 3.375 0 00-2.456 2.456z" /></svg>);
export const ChartPieIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" /></svg>);
export const CubeIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /></svg>);
export const TruckIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25m-17.25 4.5v-1.875a3.375 3.375 0 003.375-3.375h1.5a1.125 1.125 0 011.125 1.125v-1.5a3.375 3.375 0 00-3.375-3.375H3.375m15.75 9V14.25M3.375 14.25v-1.5a3.375 3.375 0 013.375-3.375h1.5a1.125 1.125 0 001.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H3.75" /></svg>);
export const ShoppingCartIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .962-.344 1.087-.849l1.855-6.994a.75.75 0 00-.7-1.002H5.617m-3.381 0a2.25 2.25 0 00-2.25 2.25v1.5a2.25 2.25 0 002.25 2.25h15a2.25 2.25 0 002.25-2.25v-1.5a2.25 2.25 0 00-2.25-2.25H2.237z" /></svg>);
export const DocumentChartBarIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h15.75c.621 0 1.125.504 1.125 1.125v6.75c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 013 21v-7.875zM12 9.75a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v-.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v.008zM12 3.75a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v-.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v.008z" /></svg>);
export const ArrowLeftOnRectangleIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>);
export const Bars3Icon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>);
export const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
export const XCircleIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
export const InformationCircleIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>);
export const ChevronUpIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></svg>);
export const ChevronDownIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>);
export const ChevronUpDownIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" /></svg>);
export const EnvelopeIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25-2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>);
export const LockClosedIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 00-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>);
export const UserIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>);
export const EyeIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>);
export const EyeSlashIcon: React.FC<{ className?: string }> = ({ className = "h-5 w-5" }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243l-4.243-4.243" /></svg>);
export const ArrowsUpDownIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" /></svg>);
export const BanknotesIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125-1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" /></svg>);
export const ArrowTrendingUpIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-3.75-.625m3.75.625V18" /></svg>);


// --- Utility Functions ---
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(amount);
};

export const formatCurrencyShort = (amount: number): string => {
    const value = Number(amount);
    if (value >= 1000000000) {
        return `₦${(value / 1000000000).toFixed(1).replace(/\.0$/, '')}B`;
    }
    if (value >= 1000000) {
        return `₦${(value / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
    }
    if (value >= 1000) {
        return `₦${(value / 1000).toFixed(0)}k`;
    }
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        maximumFractionDigits: 0,
    }).format(value);
};


// --- Theme Toggle ---
export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-slate-800"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
    </button>
  );
};

// --- UI Components ---

export const Card: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700 ${className}`}>
    {children}
  </div>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  children: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-slate-900';
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-hover focus:ring-primary-focus',
    secondary: 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-600 focus:ring-primary',
    danger: 'bg-danger text-white hover:bg-danger-hover focus:ring-danger',
    ghost: 'bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 focus:ring-primary',
    outline: 'bg-transparent border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 focus:ring-primary',
  };
  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900 bg-opacity-70" aria-modal="true" role="dialog">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col m-4">
        <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-grow">
          {children}
        </div>
        {footer && <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end space-x-3">{footer}</div>}
      </div>
    </div>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon?: ReactNode;
    endAdornment?: ReactNode;
}
export const Input: React.FC<InputProps> = ({ label, id, icon, endAdornment, ...props }) => (
    <div>
        <label htmlFor={id} className={`block mb-2 text-sm font-medium text-slate-900 dark:text-white ${!label && 'sr-only'}`}>{label}</label>
        <div className="relative">
            {icon && <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">{icon}</div>}
            <input id={id} {...props} className={`block w-full rounded-lg border-slate-300 bg-slate-50 focus:border-primary focus:ring-primary sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white ${icon ? 'pl-10' : ''} ${endAdornment ? 'pr-10' : ''} p-2.5`} />
            {endAdornment && <div className="absolute inset-y-0 right-0 flex items-center pr-3">{endAdornment}</div>}
        </div>
    </div>
);

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
}
export const Textarea: React.FC<TextareaProps> = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">{label}</label>
        <textarea id={id} {...props} rows={4} className="block w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:ring-primary focus:border-primary dark:bg-slate-700 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary dark:focus:border-primary" />
    </div>
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    children: ReactNode;
}
export const Select: React.FC<SelectProps> = ({ label, id, children, ...props }) => (
    <div>
        <label htmlFor={id} className={`block mb-2 text-sm font-medium text-slate-900 dark:text-white ${!label && 'sr-only'}`}>{label}</label>
        <select id={id} {...props} className="block w-full p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:ring-primary focus:border-primary sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white">
            {children}
        </select>
    </div>
);


export const Spinner: React.FC = () => (
    <div className="flex justify-center items-center h-full p-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
);

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ isOpen, onClose, onConfirm, itemName }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Deletion">
      <div className="sm:flex sm:items-start">
        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
          <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
        </div>
        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
          <h3 className="text-base font-semibold leading-6 text-slate-900 dark:text-slate-100" id="modal-title">
            Delete "{itemName}"
          </h3>
          <div className="mt-2">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Are you sure you want to delete this item? This action is permanent and cannot be undone.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <Button onClick={onConfirm} variant="danger" className="w-full sm:ml-3 sm:w-auto">
          Delete
        </Button>
        <Button onClick={onClose} variant="secondary" className="mt-3 w-full sm:mt-0 sm:w-auto">
          Cancel
        </Button>
      </div>
    </Modal>
  );
};


export const PageHeader: React.FC<{title: string, children?: ReactNode}> = ({ title, children }) => {
    return (
        <div className="md:flex md:items-center md:justify-between pb-5 border-b border-slate-200 dark:border-slate-700 mb-6">
            <div className="min-w-0 flex-1">
                <h2 className="text-2xl font-bold leading-7 text-slate-800 dark:text-white sm:truncate sm:tracking-tight">
                    {title}
                </h2>
            </div>
            <div className="mt-4 flex md:ml-4 md:mt-0">
                {children}
            </div>
        </div>
    );
};

const NotificationToast: React.FC<{ notification: NotificationType; onDismiss: (id: number) => void; }> = ({ notification, onDismiss }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        // Mount animation
        setShow(true);
        // Auto-dismiss timer
        const timer = setTimeout(() => {
            handleDismiss();
        }, 4500);
        return () => clearTimeout(timer);
    }, [notification]);

    const handleDismiss = () => {
        setShow(false);
        // Give time for fade-out animation before removing from state
        setTimeout(() => onDismiss(notification.id), 300);
    };

    const icons = {
        success: <CheckCircleIcon className="h-6 w-6 text-green-500" />,
        error: <XCircleIcon className="h-6 w-6 text-red-500" />,
        info: <InformationCircleIcon className="h-6 w-6 text-blue-500" />,
    };

    const icon = icons[notification.type];

    return (
        <div className={`
            max-w-sm w-full bg-white dark:bg-slate-800 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden
            transform transition-all duration-300 ease-in-out
            ${show ? 'translate-y-0 opacity-100 sm:translate-x-0' : 'translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-full'}
        `}>
            <div className="p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0">{icon}</div>
                    <div className="ml-3 w-0 flex-1 pt-0.5">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{notification.title}</p>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{notification.message}</p>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex">
                        <button onClick={handleDismiss} className="inline-flex text-slate-400 hover:text-slate-500 dark:hover:text-slate-300">
                            <span className="sr-only">Close</span>
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


export const NotificationContainer: React.FC = () => {
    const { notifications, removeNotification } = useNotification();

    return (
        <div aria-live="assertive" className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-[100]">
            <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
                {notifications.map((notification) => (
                    <NotificationToast
                        key={notification.id}
                        notification={notification}
                        onDismiss={removeNotification}
                    />
                ))}
            </div>
        </div>
    );
};

interface EmptyStateProps {
    icon: ReactNode;
    title: string;
    message: string;
    action?: ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, message, action }) => {
    return (
        <div className="text-center py-16 px-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700">
            <div className="mx-auto h-12 w-12 text-slate-400">
                {icon}
            </div>
            <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{message}</p>
            {action && <div className="mt-6">{action}</div>}
        </div>
    );
};

interface PaginationProps {
    currentPage: number;
    pageCount: number;
    setPage: (page: number) => void;
}
export const Pagination: React.FC<PaginationProps> = ({ currentPage, pageCount, setPage }) => {
    if (pageCount <= 1) return null;

    const pageNumbers = [];
    // Show first page, last page, and pages around the current page
    for (let i = 1; i <= pageCount; i++) {
        if (i === 1 || i === pageCount || (i >= currentPage - 1 && i <= currentPage + 1)) {
            pageNumbers.push(i);
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            pageNumbers.push('...');
        }
    }

    // Remove consecutive '...'
    const finalPageNumbers = pageNumbers.filter((n, i) => n !== '...' || pageNumbers[i-1] !== '...');

    return (
        <nav className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 px-4 sm:px-0 mt-4 pt-4">
            <div className="flex flex-1 justify-between sm:justify-end">
                <Button
                    variant="outline"
                    onClick={() => setPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="mr-2"
                >
                    Previous
                </Button>
                {/* For smaller screens, we might just show prev/next */}
                <div className="hidden sm:flex items-center space-x-1">
                    {finalPageNumbers.map((page, index) =>
                        page === '...' ? (
                            <span key={`ellipsis-${index}`} className="px-4 py-2 text-sm text-slate-500">...</span>
                        ) : (
                            <button
                                key={page}
                                onClick={() => setPage(page as number)}
                                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                                    currentPage === page
                                        ? 'bg-primary text-white'
                                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                                }`}
                            >
                                {page}
                            </button>
                        )
                    )}
                </div>
                 <Button
                    variant="outline"
                    onClick={() => setPage(currentPage + 1)}
                    disabled={currentPage === pageCount}
                >
                    Next
                </Button>
            </div>
        </nav>
    );
};

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (decodedText: string) => void;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({ isOpen, onClose, onScanSuccess }) => {
    const scannerRef = useRef<any>(null);
    // Unique ID for the scanner element
    const readerElementId = "barcode-scanner-element"; 

    useEffect(() => {
        if (isOpen) {
            const startScanner = async () => {
                try {
                    // Ensure the element is in the DOM
                    const readerElement = document.getElementById(readerElementId);
                    if (!readerElement) {
                        console.error(`Element with id ${readerElementId} not found.`);
                        return;
                    }

                    // Check if a scanner instance already exists and is scanning
                    if (scannerRef.current && scannerRef.current.isScanning) {
                        return;
                    }

                    const scanner = new Html5Qrcode(readerElementId, /* verbose= */ false);
                    scannerRef.current = scanner;

                    const config = {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                        rememberLastUsedCamera: true,
                    };

                    const successCallback = (decodedText: string, decodedResult: any) => {
                        // Stop scanning on success to prevent multiple scans and release camera
                        if (scannerRef.current?.isScanning) {
                           scannerRef.current.stop();
                        }
                        onScanSuccess(decodedText);
                    };

                    const errorCallback = (errorMessage: string) => {
                        // ignore errors like "QR code not found."
                    };
                    
                    await scanner.start({ facingMode: "environment" }, config, successCallback, errorCallback);

                } catch (err) {
                    console.error("Error starting barcode scanner:", err);
                }
            };

            // Delay scanner start slightly to ensure modal is fully rendered
            const timeoutId = setTimeout(startScanner, 100);
            
            return () => clearTimeout(timeoutId);

        } else {
            // Cleanup when modal is closed
            if (scannerRef.current && scannerRef.current.isScanning) {
                scannerRef.current.stop().catch((err: any) => {
                    console.error("Failed to stop scanner on close:", err);
                });
            }
        }
    }, [isOpen, onScanSuccess]);
    
    // Explicit cleanup on unmount
    useEffect(() => {
        return () => {
            if (scannerRef.current && scannerRef.current.isScanning) {
                scannerRef.current.stop().catch((err: any) => {
                    console.error("Failed to stop scanner on unmount:", err);
                });
            }
        }
    }, []);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Scan Barcode">
            <div id={readerElementId} style={{ width: '100%', minHeight: '300px' }}></div>
            <div className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
                Point your camera at a barcode. The scanner will detect it automatically.
            </div>
        </Modal>
    );
};