import React, { useState, useEffect } from 'react';
import { Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button, Input, EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '../components/common';
import { useNotification } from '../hooks/useNotification';
import { AuthLayout } from './AuthLayout';

const LoginPage: React.FC = () => {
    const { login, isAuthenticated } = useAuth();
    const { addNotification } = useNotification();
    const location = useLocation();
    const [email, setEmail] = useState('manager@ordina.com');
    const [password, setPassword] = useState('password');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (location.state?.message) {
            addNotification({ type: 'success', title: 'Success', message: location.state.message });
            window.history.replaceState({}, document.title)
        }
    }, [location.state, addNotification]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const success = await login(email, password);
        if (!success) {
            const message = 'Invalid credentials. Please try again.';
            setError(message);
            addNotification({ type: 'error', title: 'Login Failed', message });
        }
        setLoading(false);
    };

    if (isAuthenticated) {
        return <Navigate to="/" />;
    }

    return (
        <AuthLayout title="Sign in to your account">
            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label="Email address" id="email" name="email" type="email"
                    autoComplete="email" required value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<EnvelopeIcon className="h-5 w-5 text-slate-400" />}
                />

                <Input
                    label="Password" id="password" name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password" required value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={<LockClosedIcon className="h-5 w-5 text-slate-400" />}
                    endAdornment={
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-400 hover:text-slate-500">
                           {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                        </button>
                    }
                />

                <div className="flex items-center justify-between">
                    <div />
                    <div className="text-sm">
                        <a href="#" className="font-semibold text-primary hover:text-primary-hover">
                            Forgot password?
                        </a>
                    </div>
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign in'}
                    </Button>
                </div>
            </form>

            <div className="mt-6 text-center text-sm">
                <p className="text-slate-600 dark:text-slate-300">
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-semibold text-primary hover:text-primary-hover">
                        Sign up
                    </Link>
                </p>
            </div>

            <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-6 text-sm text-slate-500 dark:text-slate-400">
                <p className="font-semibold text-slate-700 dark:text-slate-200">Demo accounts:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>manager@ordina.com</li>
                    <li>employee@ordina.com</li>
                    <li>cs@ordina.com</li>
                </ul>
                <p className="mt-2">All use password: "password"</p>
            </div>
        </AuthLayout>
    );
};

export default LoginPage;