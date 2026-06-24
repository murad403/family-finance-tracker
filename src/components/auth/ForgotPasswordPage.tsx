'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, ArrowLeft, ArrowRight } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ForgotPasswordFormData, forgotPasswordSchema } from '@/validation/auth.validation';
import AuthChildrenLayout from '../shared/AuthChildrenLayout';



const ForgotPasswordPage = () => {
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
        <AuthChildrenLayout title='Reset Password' subtitle='Enter your administrative email, and we&apos;ll send you recovery steps.'>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

            <div className="mt-6 pt-4 text-center">
                <Link
                    href="/sign-in"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-title"
                >
                    <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
                </Link>
            </div>
        </AuthChildrenLayout>
    );
}

export default ForgotPasswordPage;