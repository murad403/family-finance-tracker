'use client';

import React from 'react';
import { useFinance } from '@/context/FinanceContext';
import { ArrowUpRight, ArrowDownRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import CategoryBadge from '@/components/CategoryBadge';

const RecentTransactions = () => {
    const { members, incomes, expenses, settings } = useFinance();
    const currency = settings?.familyInfo?.currency || '$';

    const combinedTransactions = [
        ...incomes.map(i => ({ ...i, type: 'income' as const })),
        ...expenses.map(e => ({ ...e, type: 'expense' as const }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    return (
        <div className="lg:col-span-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h2 className="text-sm font-bold text-zinc-100">Recent Transactions</h2>
                    <p className="text-xs text-white/50">Latest cash ins and cash outs across the family</p>
                </div>
                <Link
                    href="/expenses"
                    className="text-sm font-bold text-white hover:text-white/80 flex items-center gap-1 transition-colors"
                >
                    View All Ledger <ArrowRight className="h-3.5 w-3.5" />
                </Link>
            </div>

            <div className="divide-y divide-white/5">
                {combinedTransactions.map((tx) => {
                    const member = members.find(m => m.id === tx.memberId);
                    const isIncome = tx.type === 'income';
                    return (
                        <div key={tx.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                            <div className="flex items-center gap-3">
                                <span className="text-base h-9 w-9 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                                    {member?.avatar || '👤'}
                                </span>
                                <div>
                                    <h4 className="text-xs font-bold text-white leading-tight">
                                        {isIncome ? (tx as any).description : (tx as any).productName}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs font-semibold text-white/60">
                                            {member?.name}
                                        </span>
                                        <span className="h-1 w-1 rounded-full bg-white/20" />
                                        <CategoryBadge category={tx.category} type={tx.type} />
                                    </div>
                                </div>
                            </div>

                            <div className="text-right">
                                <span className={`text-xs font-extrabold flex items-center justify-end ${isIncome ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {isIncome ? <ArrowUpRight className="h-3.5 w-3.5 mr-0.5 shrink-0" /> : <ArrowDownRight className="h-3.5 w-3.5 mr-0.5 shrink-0" />}
                                    {isIncome ? '+' : '-'}{currency}{tx.amount.toLocaleString()}
                                </span>
                                <span className="text-xs text-white/40 font-semibold mt-1 block">
                                    {tx.date}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RecentTransactions;