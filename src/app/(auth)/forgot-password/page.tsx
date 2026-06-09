'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ForgotPasswordFormData, forgotPasswordSchema } from '@/validation/auth.validation';



export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
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
    <div className='w-full'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full"
      >

        {/* Card */}
        <div className="rounded-2xl p-8 shadow-xl shadow-heading/50 hover:scale-105 transition-all duration-500">
          {!isSubmitted ? (
            <div>
              <div className='text-center'>
                <h2 className="text-xl md:text-2xl font-semibold text-title">
                  Reset Password
                </h2>
                <p className="mt-1 text-sm md:text-base text-description">
                  Enter your administrative email, and we'll send you recovery steps.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                <div>
                  <Label htmlFor='email'>Email Address</Label>
                  <div className="relative mt-1.5 flex items-center">
                    <Mail className="absolute left-3 h-4 w-4 text-slate-400 dark:text-slate-400" />
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

                <Button
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  ) : (
                    <>
                      Send Recovery Link <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </div>
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

          <div className="mt-6 pt-4 text-center">
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-title"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
