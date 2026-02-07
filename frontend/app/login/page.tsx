'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { useRouter } from 'next/navigation';
import { Loader2, Eye, EyeOff, CheckCircle2, XCircle, Mail, LockIcon, UserIcon, CalendarIcon } from 'lucide-react';
import { authApi } from '@/src/lib/auth';
import { useAuth } from '@/src/context/auth-context';
import { Toast } from '@/src/components/ui/toast';

interface ApiError {
    detail?: string;
    message?: string;
}

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();

    // Auth State
    const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Signup
    const [isLoading, setIsLoading] = useState(false);

    // Form Fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [dob, setDob] = useState('');

    // UI State
    const [showPassword, setShowPassword] = useState(false);
    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
    const [usernameChecking, setUsernameChecking] = useState(false);

    // Toast State
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000); // Auto hide
    };

    // Reset form when switching modes
    const switchMode = () => {
        setIsLogin(!isLogin);
        setPassword('');
        setConfirmPassword('');
        setUsername('');
        setFullName('');
        setDob('');
    };

    const handleGoogleLogin = async () => {
        showToast('Google login coming soon!', 'error');
    };

    const checkUsernameAvailability = useCallback(async (u: string) => {
        if (u.length < 3) {
            setUsernameAvailable(null);
            return;
        }
        setUsernameChecking(true);
        try {
            const res = await authApi.checkUsernameAvailability(u);
            setUsernameAvailable(res.available);
        } catch (error) {
            setUsernameAvailable(null);
        } finally {
            setUsernameChecking(false);
        }
    }, []);

    // Debounce username check
    useEffect(() => {
        if (!isLogin && username) {
            const timer = setTimeout(() => checkUsernameAvailability(username), 500);
            return () => clearTimeout(timer);
        }
    }, [username, isLogin, checkUsernameAvailability]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic Validation
        if (!email) return showToast('Please enter your email', 'error');
        if (!password) return showToast('Please enter your password', 'error');

        setIsLoading(true);

        try {
            if (isLogin) {
                // Login Logic
                const res = await authApi.signin({ email, password });
                login(res.access_token, res.user);
                showToast('Successfully signed in!', 'success');
                router.push('/dashboard'); // or /chat or wherever
            } else {
                // Signup Logic
                if (password !== confirmPassword) {
                    setIsLoading(false);
                    return showToast('Passwords do not match', 'error');
                }
                if (!username || !fullName) {
                    setIsLoading(false);
                    return showToast('Please fill all fields', 'error');
                }

                const res = await authApi.signup({
                    email,
                    username,
                    full_name: fullName,
                    dob,
                    password,
                    confirm_password: confirmPassword,
                });
                login(res.access_token, res.user);
                showToast('Account created successfully!', 'success');
                router.push('/dashboard');
            }
        } catch (error: unknown) {
            const apiError = error as ApiError;
            showToast(apiError.detail || apiError.message || 'Authentication failed', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-gray-50">
            {/* Left Side - Hero/Visual */}
            <div className="hidden lg:flex w-1/2 p-4 relative">
                <div className="w-full h-full rounded-[2.5rem] bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-900 flex flex-col justify-end p-12 text-white relative overflow-hidden">
                    {/* Abstract decorative elements */}
                    <div className="absolute top-10 left-10 text-6xl opacity-20 font-serif">*</div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500 rounded-full blur-[100px] opacity-40"></div>

                    <div className="relative z-10 mb-10">
                        <p className="text-lg opacity-80 mb-2 font-medium">You can easily</p>
                        <h1 className="text-5xl font-bold leading-tight">
                            Get access to your personal hub for clarity and productivity
                        </h1>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-md space-y-8">
                    {/* Branding Icon (Small) */}
                    <div className="text-[#3b82f6] text-4xl font-bold mb-8">*</div>

                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold text-gray-900">
                            {isLogin ? 'Welcome back' : 'Create an account'}
                        </h2>
                        <p className="text-gray-500">
                            {isLogin
                                ? 'Access your tasks, notes, and projects anytime.'
                                : 'Access your tasks, notes, and projects anytime, anywhere.'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-4">
                            {/* Email */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Your email</label>
                                <Input
                                    type="email"
                                    placeholder="farazhaider786@gmail.com"
                                    className="h-12 border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500/20"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                    required
                                />
                            </div>

                            {/* Signup Extra Fields */}
                            {!isLogin && (
                                <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700">Username</label>
                                        <div className="relative">
                                            <Input
                                                placeholder="Username"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                className="h-12 rounded-xl"
                                                required
                                            />
                                            {username && (
                                                <div className="absolute right-3 top-3.5">
                                                    {usernameChecking ? <Loader2 className="w-4 h-4 animate-spin text-gray-400" /> :
                                                        usernameAvailable ? <CheckCircle2 className="w-4 h-4 text-green-500" /> :
                                                            <XCircle className="w-4 h-4 text-red-500" />}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                                        <Input
                                            placeholder="John Doe"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="h-12 rounded-xl"
                                            required
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-1">
                                        <label className="text-sm font-medium text-gray-700">Date of Birth</label>
                                        <Input
                                            type="date"
                                            value={dob}
                                            onChange={(e) => setDob(e.target.value)}
                                            className="h-12 rounded-xl"
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Password */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Password</label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••••••"
                                        className="h-12 border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500/20 pr-10"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={isLoading}
                                        required
                                        minLength={8}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password (Signup only) */}
                            {!isLogin && (
                                <div className="space-y-1 animate-in fade-in slide-in-from-top-4 duration-300">
                                    <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                                    <Input
                                        type="password"
                                        placeholder="••••••••••••"
                                        className="h-12 border-gray-200 rounded-xl bg-white"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        disabled={isLoading}
                                        required
                                    />
                                </div>
                            )}
                        </div>

                        <Button
                            className="w-full h-12 bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-xl text-base font-semibold shadow-lg shadow-indigo-200 transition-all transform hover:scale-[1.01]"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? 'Log In' : 'Get Started')}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-200"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-gray-50 px-2 text-gray-500">or continue with</span>
                        </div>
                    </div>

                    {/* Social Buttons */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="h-10 bg-gray-200 rounded-full flex items-center justify-center cursor-not-allowed opacity-70">
                            <span className="font-bold text-gray-600">Bē</span>
                        </div>
                        <button onClick={handleGoogleLogin} className="h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors">
                            <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" /></svg>
                        </button>
                        <div className="h-10 bg-gray-200 rounded-full flex items-center justify-center cursor-not-allowed opacity-70">
                            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg>
                        </div>
                    </div>

                    <div className="text-center text-sm">
                        <span className="text-gray-500">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                        </span>
                        <button onClick={switchMode} className="font-semibold text-[#4f46e5] hover:underline">
                            {isLogin ? 'Sign up' : 'Sign in'}
                        </button>
                    </div>
                </div>
            </div>

            {toast && (
                <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-xl shadow-lg text-white ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'} animate-in fade-in slide-in-from-bottom-5 z-50`}>
                    {toast.message}
                </div>
            )}
        </div>
    );
}
