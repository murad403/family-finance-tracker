'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'; // Wait, let's write simple react-hook-form validator or zod since zod is installed.
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useFinance } from '@/context/FinanceContext';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useFinance();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'murad.alhassan@familyfinance.com',
      password: 'demopassword123',
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const success = login(data.email, data.password);
      if (success) {
        router.push('/dashboard');
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
    <div className="flex flex-1 min-h-screen items-center justify-center bg-linear-to-tr from-slate-100 via-slate-50 to-indigo-50/50 p-6 dark:from-zinc-950 dark:via-zinc-950 dark:to-indigo-950/20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        {/* Brand Logo */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20 text-white text-xl font-bold dark:bg-primary/100">
            📊
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-50">
            Family Finance Tracker
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-zinc-400">
            Private financial system for your family
          </p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-2xl p-8 shadow-xl shadow-slate-100/50 dark:shadow-none">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-zinc-50">
            Sign In
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
            Enter your credentials to access your family dashboard.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            {errorMsg && (
              <div className="rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-600 dark:bg-rose-950/30 dark:text-rose-400">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Email Address
              </label>
              <div className="relative mt-1.5 flex items-center">
                <Mail className="absolute left-3 h-4 w-4 text-slate-400 dark:text-slate-400" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="name@family.com"
                  className="w-full rounded-xl border border-slate-200 bg-white/50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-primary focus:bg-white dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-100 dark:hover:border-zinc-700 dark:focus:border-primary-hover dark:focus:bg-zinc-900"
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
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-primary hover:text-primary dark:text-primary"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative mt-1.5 flex items-center">
                <Lock className="absolute left-3 h-4 w-4 text-slate-400 dark:text-slate-400" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-white/50 py-2.5 pl-10 pr-10 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-primary focus:bg-white dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-100 dark:hover:border-zinc-700 dark:focus:border-primary-hover dark:focus:bg-zinc-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-zinc-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white shadow-lg shadow-primary/10 transition-all hover:bg-primary-hover hover:shadow-indigo-600/20 active:scale-[0.98] disabled:scale-100 disabled:opacity-50 dark:bg-primary/100 dark:hover:bg-primary"
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  Sign In <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo Details info */}
          <div className="mt-6 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/30">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
              Demo Credentials
            </span>
            <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
              Feel free to log in with the prefilled credentials or enter any email and password.
            </p>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500 dark:text-zinc-400">
            Don't have an account?{' '}
            <Link
              href="/register"
              className="font-semibold text-primary hover:underline dark:text-primary"
            >
              Create Family Account
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
