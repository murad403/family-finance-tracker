import React from 'react';
import { 
  ShoppingBag, 
  Utensils, 
  Zap, 
  Activity, 
  BookOpen, 
  Car, 
  Film, 
  FolderOpen,
  Briefcase,
  TrendingUp,
  Laptop,
  Coins,
  DollarSign
} from 'lucide-react';
import { ExpenseCategory, IncomeCategory } from '@/lib/types';

interface CategoryBadgeProps {
  category: ExpenseCategory | IncomeCategory;
  type?: 'income' | 'expense';
  showIconOnly?: boolean;
}

export const CATEGORY_META = {
  // Expenses
  Grocery: { icon: ShoppingBag, bg: 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary' },
  Food: { icon: Utensils, bg: 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-450' },
  Utilities: { icon: Zap, bg: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/20 dark:text-cyan-400' },
  Medical: { icon: Activity, bg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400' },
  Education: { icon: BookOpen, bg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400' },
  Transportation: { icon: Car, bg: 'bg-purple-50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400' },
  Entertainment: { icon: Film, bg: 'bg-pink-50 text-pink-600 dark:bg-pink-950/20 dark:text-pink-400' },
  Others: { icon: FolderOpen, bg: 'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-350' },
  
  // Incomes
  Salary: { icon: Briefcase, bg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400' },
  Business: { icon: TrendingUp, bg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400' },
  Investment: { icon: DollarSign, bg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400' },
  Freelance: { icon: Laptop, bg: 'bg-purple-50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400' },
  'Pocket Money': { icon: Coins, bg: 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400' },
};

export default function CategoryBadge({ category, type = 'expense', showIconOnly = false }: CategoryBadgeProps) {
  const meta = CATEGORY_META[category as keyof typeof CATEGORY_META] || {
    icon: FolderOpen,
    bg: 'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400'
  };
  
  const Icon = meta.icon;
  
  if (showIconOnly) {
    return (
      <span className={`inline-flex items-center justify-center p-1.5 rounded-xl ${meta.bg}`} title={category}>
        <Icon className="h-4 w-4" />
      </span>
    );
  }
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${meta.bg}`}>
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span>{category}</span>
    </span>
  );
}
