'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Users, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useFinance } from '@/context/FinanceContext';
import { SignUpFormData, signUpSchema } from '@/validation/auth.validation';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';



export default function RegisterPage() {
  const router = useRouter();
  const { register: registerContext } = useFinance();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema)
  });

  const onSubmit = async (data: SignUpFormData) => {
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
    <div className='w-full'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full"
      >

        {/* Card */}
        <div className="rounded-2xl p-8 shadow-xl shadow-heading/50 hover:scale-105 transition-all duration-500">
          <div className='text-center'>
            <h2 className="text-xl md:text-2xl font-semibold text-title">
              Register account
            </h2>
            <p className="mt-1 text-sm md:text-base text-description">
              Set up your family administrative account.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            {errorMsg && (
              <div className="rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-600 dark:bg-rose-950/30 dark:text-rose-400">
                {errorMsg}
              </div>
            )}

            <div>
              <Label>Admin Full Name</Label>
              <div className="relative mt-1.5 flex items-center">
                <User className="absolute left-3 h-4 w-4 text-slate-400 dark:text-slate-400" />
                <Input
                  {...register('name')}
                  type="text"
                  placeholder="your full name"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label>Family Tracker Name</Label>
              <div className="relative mt-1.5 flex items-center">
                <Users className="absolute left-3 h-4 w-4 text-slate-400 dark:text-slate-400" />
                <Input
                  {...register('familyName')}
                  type="text"
                  placeholder="your family tracker name"
                />
              </div>
              {errors.familyName && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                  {errors.familyName.message}
                </p>
              )}
            </div>

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

            <div>
              <Label htmlFor='password'>
                Password
              </Label>
              <div className="relative mt-1.5 flex items-center">
                <Lock className="absolute left-3 h-4 w-4 text-slate-400 dark:text-slate-400" />
                <Input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="create password"
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
              <Label>Confirm Password</Label>
              <div className="relative mt-1.5 flex items-center">
                <Lock className="absolute left-3 h-4 w-4 text-slate-400 dark:text-slate-400" />
                <Input
                  {...register('confirmPassword')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="re-type password"
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  Register Family <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-description">
            Already have an account?{' '}
            <Link
              href="/sign-in"
              className="font-semibold text-title"
            >
              Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
