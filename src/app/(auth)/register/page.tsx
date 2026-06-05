'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Users, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useFinance } from '@/context/FinanceContext';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  familyName: z.string().min(2, 'Family name must be at least 2 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerContext } = useFinance();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      registerContext(data.name, data.email, data.familyName);
      router.push('/dashboard');
    } catch (err) {
      setErrorMsg('Failed to create account. Please try again.');
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
        className="w-full max-w-md my-8"
      >
        {/* Brand Logo */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20 text-white text-xl font-bold dark:bg-primary/100">
            📊
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-50">
            Create Family Space
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
            Sign up to track and manage family finances.
          </p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-2xl p-8 shadow-xl shadow-slate-100/50 dark:shadow-none">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-zinc-50">
            Register Account
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
            Set up your family administrative account.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            {errorMsg && (
              <div className="rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-600 dark:bg-rose-950/30 dark:text-rose-400">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Admin Full Name
              </label>
              <div className="relative mt-1.5 flex items-center">
                <User className="absolute left-3 h-4 w-4 text-slate-400 dark:text-slate-400" />
                <input
                  {...register('name')}
                  type="text"
                  placeholder="Murad Al-Hassan"
                  className="w-full rounded-xl border border-slate-200 bg-white/50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-primary focus:bg-white dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-100 dark:hover:border-zinc-700 dark:focus:border-primary-hover dark:focus:bg-zinc-900"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Family Tracker Name
              </label>
              <div className="relative mt-1.5 flex items-center">
                <Users className="absolute left-3 h-4 w-4 text-slate-400 dark:text-slate-400" />
                <input
                  {...register('familyName')}
                  type="text"
                  placeholder="Al-Hassan Household"
                  className="w-full rounded-xl border border-slate-200 bg-white/50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-primary focus:bg-white dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-100 dark:hover:border-zinc-700 dark:focus:border-primary-hover dark:focus:bg-zinc-900"
                />
              </div>
              {errors.familyName && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                  {errors.familyName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Email Address
              </label>
              <div className="relative mt-1.5 flex items-center">
                <Mail className="absolute left-3 h-4 w-4 text-slate-400 dark:text-slate-400" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="admin@family.com"
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
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Password
              </label>
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

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Confirm Password
              </label>
              <div className="relative mt-1.5 flex items-center">
                <Lock className="absolute left-3 h-4 w-4 text-slate-400 dark:text-slate-400" />
                <input
                  {...register('confirmPassword')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-white/50 py-2.5 pl-10 pr-10 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-primary focus:bg-white dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-100 dark:hover:border-zinc-700 dark:focus:border-primary-hover dark:focus:bg-zinc-900"
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white shadow-lg shadow-primary/10 transition-all hover:bg-primary-hover hover:shadow-indigo-600/20 active:scale-[0.98] disabled:scale-100 disabled:opacity-50 dark:bg-primary/100 dark:hover:bg-primary"
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  Register Family <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500 dark:text-zinc-400">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-semibold text-primary hover:underline dark:text-primary"
            >
              Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
