import React from 'react';

interface AuthLayoutProps {
    title: string;
    children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ title, children }) => {
    return (
        <div className="flex min-h-screen bg-white dark:bg-slate-900">
            <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div>
                        <h1 className="text-3xl font-bold text-primary">Ordina</h1>
                        <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                            {title}
                        </h2>
                    </div>
                    <div className="mt-8">
                        {children}
                    </div>
                </div>
            </div>
            <div className="relative hidden w-0 flex-1 lg:block">
                <img
                    className="absolute inset-0 h-full w-full object-cover"
                    src="https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1776&q=80"
                    alt="Abstract data visualization"
                />
                 <div className="absolute inset-0 bg-slate-800 mix-blend-multiply" />
            </div>
        </div>
    );
};