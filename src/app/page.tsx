'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFinance } from '@/context/FinanceContext';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useFinance();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    } else {
      router.replace('/sign-in');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex flex-1 min-h-screen items-center justify-center bg-slate-50 dark:bg-zinc-950">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">Loading Family Finance Tracker...</p>
      </div>
    </div>
  );
}
