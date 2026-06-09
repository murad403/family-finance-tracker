'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useFinance } from '@/context/FinanceContext';
import { SignInFormData, signInSchema } from '@/validation/auth.validation';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';



export default function LoginPage() {
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
    <div className='w-full'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="rounded-2xl p-8 shadow-md shadow-heading/50 hover:scale-105 transition-all duration-500">
          <div className='text-center'>
            <h2 className="text-xl md:text-2xl font-semibold text-title">
              Sign In
            </h2>
            <p className="mt-1 text-sm md:text-base text-description">
              Enter your credentials to access your family dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            {errorMsg && (
              <div className="rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-600 dark:bg-rose-950/30 dark:text-rose-400">
                {errorMsg}
              </div>
            )}

            <div>
              <Label htmlFor="email">Email address</Label>
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
                <Lock className="absolute left-3 h-4 w-4 text-slate-400 dark:text-slate-400" />
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

            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  Sign In <ArrowRight className="h-4 w-4" />
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
        </div>
      </motion.div>
    </div>
  );
}
