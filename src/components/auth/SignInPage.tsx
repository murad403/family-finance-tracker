'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useFinance } from '@/context/FinanceContext';
import { SignInFormData, signInSchema } from '@/validation/auth.validation';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AuthChildrenLayout from '../shared/AuthChildrenLayout';


const SignInPage = () => {
    const router = useRouter();
    const { login } = useFinance();
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<SignInFormData>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: 'murad.alhassan@familyfinance.com',
            password: 'demopassword123',
        }
    });

    const onSubmit = async (data: SignInFormData) => {
        setIsLoading(true);
        setErrorMsg('');
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const success = login(data.email, data.password);
            if (success) {
                router.push('/');
            } else {
                setErrorMsg('Invalid email or password.');
            }
        } catch (err) {
            setErrorMsg('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthChildrenLayout title='Sign In' subtitle='Enter your credentials to access your family dashboard.'>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {errorMsg && (
                    <div className="rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-600 dark:bg-rose-950/30 dark:text-rose-400">
                        {errorMsg}
                    </div>
                )}

                <div>
                    <Label htmlFor="email">Email address</Label>
                    <div className="relative mt-1.5 flex items-center">
                        <Mail className="absolute left-3 size-4 text-label" />
                        <Input
                            {...register('email')}
                            type="email"
                            placeholder="info@gmail.com"
                        />
                    </div>
                    {errors.email && (
                        <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">
                            Password
                        </Label>
                        <Link
                            href="/forgot-password"
                            className="text-xs font-medium text-heading hover:underline"
                        >
                            Forgot password?
                        </Link>
                    </div>
                    <div className="relative mt-1.5 flex items-center">
                        <Lock className="absolute left-3 size-4 text-label" />
                        <Input
                            {...register('password')}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-zinc-300"
                        >
                            {showPassword ? (
                                <EyeOff className="size-4" />
                            ) : (
                                <Eye className="size-4" />
                            )}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    ) : (
                        <>
                            Sign In <ArrowRight className="size-4" />
                        </>
                    )}
                </Button>
            </form>

            <div className="mt-6 text-center text-xs text-description">
                Don't have an account?{' '}
                <Link
                    href="/sign-up"
                    className="font-semibold text-title"
                >
                    Create Family Account
                </Link>
            </div>
        </AuthChildrenLayout>
    );
}


export default SignInPage;