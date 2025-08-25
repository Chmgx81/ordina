import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input, EnvelopeIcon, LockClosedIcon, UserIcon, EyeIcon, EyeSlashIcon } from '../components/common';
import { api } from '../services/mockApi';
import { AuthLayout } from './AuthLayout';

const SignUpPage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setLoading(true);
        setError('');
        const success = await api.signup({ name: formData.name, email: formData.email, password: formData.password });
        if (success) {
            navigate('/login', { state: { message: 'Registration successful! Please sign in.' } });
        } else {
            setError('An account with this email already exists.');
        }
        setLoading(false);
    };

    return (
        <AuthLayout title="Create your new account">
            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label="Full Name" id="name" name="name" type="text"
                    autoComplete="name" required value={formData.name}
                    onChange={handleChange}
                    icon={<UserIcon className="h-5 w-5 text-slate-400" />}
                />
                <Input
                    label="Email address" id="email" name="email" type="email"
                    autoComplete="email" required value={formData.email}
                    onChange={handleChange}
                    icon={<EnvelopeIcon className="h-5 w-5 text-slate-400" />}
                />
                <Input
                    label="Password" id="password" name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password" required value={formData.password}
                    onChange={handleChange}
                    icon={<LockClosedIcon className="h-5 w-5 text-slate-400" />}
                     endAdornment={
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-400 hover:text-slate-500">
                           {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                        </button>
                    }
                />
                <Input
                    label="Confirm Password" id="confirmPassword" name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password" required value={formData.confirmPassword}
                    onChange={handleChange}
                    icon={<LockClosedIcon className="h-5 w-5 text-slate-400" />}
                     endAdornment={
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-slate-400 hover:text-slate-500">
                           {showConfirmPassword ? <EyeSlashIcon /> : <EyeIcon />}
                        </button>
                    }
                />

                {error && <p className="text-sm text-red-600">{error}</p>}

                <div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Creating account...' : 'Create account'}
                    </Button>
                </div>
            </form>

            <div className="mt-6 text-center text-sm">
                <p className="text-slate-600 dark:text-slate-300">
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-primary hover:text-primary-hover">
                        Sign in
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
};

export default SignUpPage;