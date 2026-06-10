'use client';

import React from 'react';
import { useFinance } from '@/context/FinanceContext';
import { ShoppingBag, User, Crown } from 'lucide-react';
import CardHeader from '@/components/shared/CardHeader';
import { ExpenseCategory } from '@/lib/types';

const SmartFinancialInsights = () => {
    const { members, incomes, expenses, settings } = useFinance();
    const currency = settings?.familyInfo?.currency || '$';

    const currentMonthStr = '2026-06';
    const thisMonthExpenses = expenses.filter(e => e.date.startsWith(currentMonthStr));

    // a) Highest spending category this month
    const categorySpending: { [key in ExpenseCategory]?: number } = {};
    thisMonthExpenses.forEach(e => {
        categorySpending[e.category] = (categorySpending[e.category] || 0) + e.amount;
    });
    let highestSpendingCategory: ExpenseCategory | 'None' = 'None';
    let maxCatSpent = 0;
    Object.entries(categorySpending).forEach(([cat, amt]) => {
        if (amt && amt > maxCatSpent) {
            maxCatSpent = amt;
            highestSpendingCategory = cat as ExpenseCategory;
        }
    });

    // b) Most Active Family Member (highest count of expenses overall)
    const memberActivity: { [key: string]: number } = {};
    expenses.forEach(e => {
        memberActivity[e.memberId] = (memberActivity[e.memberId] || 0) + 1;
    });
    let mostActiveMemberId = '';
    let maxActiveCount = 0;
    Object.entries(memberActivity).forEach(([mId, count]) => {
        if (count > maxActiveCount) {
            maxActiveCount = count;
            mostActiveMemberId = mId;
        }
    });
    const mostActiveMember = members.find(m => m.id === mostActiveMemberId);

    // c) Highest Contributor (highest sum of income overall)
    const memberContributions: { [key: string]: number } = {};
    incomes.forEach(i => {
        memberContributions[i.memberId] = (memberContributions[i.memberId] || 0) + i.amount;
    });
    let highestContributorId = '';
    let maxContributorAmt = 0;
    Object.entries(memberContributions).forEach(([mId, amt]) => {
        if (amt > maxContributorAmt) {
            maxContributorAmt = amt;
            highestContributorId = mId;
        }
    });
    const highestContributor = members.find(m => m.id === highestContributorId);

    return (
        <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-4">
            <CardHeader title="Smart Financial Insights" />

            <div className="space-y-4 mt-4">
                {/* Highest Spending Category */}
                <div className="flex items-center gap-3.5 p-3 rounded-xl bg-zinc-950/50 border border-zinc-800/30">
                    <span className="h-9 w-9 rounded-lg bg-rose-950/20 text-rose-450 flex items-center justify-center">
                        <ShoppingBag className="h-4.5 w-4.5" />
                    </span>
                    <div>
                        <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Highest Spender Category</p>
                        <h4 className="text-sm font-bold text-white mt-0.5">{highestSpendingCategory}</h4>
                        <span className="text-xs text-white/60 font-semibold">
                            {currency}{maxCatSpent.toLocaleString()} spent this month
                        </span>
                    </div>
                </div>

                {/* Most Active Family Member */}
                <div className="flex items-center gap-3.5 p-3 rounded-xl bg-zinc-950/50 border border-zinc-800/30">
                    <span className="h-9 w-9 rounded-lg bg-cyan-950/20 text-cyan-400 flex items-center justify-center">
                        <User className="h-4.5 w-4.5" />
                    </span>
                    <div>
                        <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Most Active Member</p>
                        <h4 className="text-sm font-bold text-white mt-0.5">
                            {mostActiveMember ? `${mostActiveMember.avatar} ${mostActiveMember.name}` : 'None'}
                        </h4>
                        <span className="text-xs text-white/60 font-semibold">
                            {maxActiveCount} transactions logged
                        </span>
                    </div>
                </div>

                {/* Highest Contributor */}
                <div className="flex items-center gap-3.5 p-3 rounded-xl bg-zinc-950/50 border border-zinc-800/30">
                    <span className="h-9 w-9 rounded-lg bg-emerald-950/20 text-emerald-400 flex items-center justify-center">
                        <Crown className="h-4.5 w-4.5" />
                    </span>
                    <div>
                        <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Highest Contributor</p>
                        <h4 className="text-sm font-bold text-white mt-0.5">
                            {highestContributor ? `${highestContributor.avatar} ${highestContributor.name}` : 'None'}
                        </h4>
                        <span className="text-xs text-white/60 font-semibold">
                            {currency}{maxContributorAmt.toLocaleString()} total contributed
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SmartFinancialInsights;