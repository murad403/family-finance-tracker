'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSubmitted(true);
    } catch (err) {
      // Handle error
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
            Password Recovery
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
            Recover access to your family tracking workspace
          </p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-2xl p-8 shadow-xl shadow-slate-100/50 dark:shadow-none">
          {!isSubmitted ? (
            <>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-zinc-50">
                Reset Password
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
                Enter your administrative email, and we'll send you recovery steps.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
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

                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white shadow-lg shadow-primary/10 transition-all hover:bg-primary-hover hover:shadow-indigo-600/20 active:scale-[0.98] disabled:scale-100 disabled:opacity-50 dark:bg-primary/100 dark:hover:bg-primary"
                >
                  {isLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  ) : (
                    <>
                      Send Recovery Link <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-slate-900 dark:text-zinc-50">
                Check Your Inbox
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">
                We've sent a password reset link to your email address. Please follow the instructions to secure your account.
              </p>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="mt-6 text-xs text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-zinc-300"
              >
                Didn't receive email? Try again
              </button>
            </motion.div>
          )}

          <div className="mt-6 border-t border-slate-100 pt-4 text-center dark:border-zinc-800">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline dark:text-primary"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
