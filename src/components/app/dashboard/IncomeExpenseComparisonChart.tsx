'use client';
import { useFinance } from '@/context/FinanceContext';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import Card from '@/components/shared/Card';
import CustomTooltip from '@/components/shared/CustomTooltip';


const IncomeExpenseComparisonChart = () => {
    const { incomes, expenses, settings } = useFinance();
    const currency = settings?.familyInfo?.currency || '$';

    // 12 months calculator (June 2025 to May 2026)
    const comparisonChartData = Array.from({ length: 12 }).map((_, idx) => {
        const d = new Date(2025, 5 + idx, 1);
        const monthName = d.toLocaleString('en-US', { month: 'short' });
        const year = d.getFullYear();
        const monthNum = String(d.getMonth() + 1).padStart(2, '0');
        const monthPrefix = `${year}-${monthNum}`;

        const monthlyInc = incomes.filter(i => i.date.startsWith(monthPrefix)).reduce((sum, i) => sum + i.amount, 0);
        const monthlyExp = expenses.filter(e => e.date.startsWith(monthPrefix)).reduce((sum, e) => sum + e.amount, 0);

        return {
            month: monthName,
            Income: monthlyInc,
            Expense: monthlyExp
        };
    });

    const formatYAxis = (value: number) => {
        return `${currency}${Math.round(value / 1000)}k`;
    };

    const stats = [
        {
            label: "income",
            color: "bg-[#22c55e]"
        },
        {
            label: "Expense",
            color: "bg-[#ef4444]"
        },
    ]
    return (
        <Card title='Income vs Expense' subtitle='Last 12 months' stats={stats} className='lg:col-span-2'>
            <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={comparisonChartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} />
                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0.0} />
                            </linearGradient>
                            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={true}
                            horizontal={true}
                            stroke="rgba(255, 255, 255, 0.05)"
                        />
                        <XAxis
                            dataKey="month"
                            axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                            tickLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                            tick={{ fill: 'oklch(86.9% 0.022 252.894)', fontSize: 11, fontWeight: 500 }}
                            dy={8}
                        />
                        <YAxis
                            axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                            tickLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
                            tickFormatter={formatYAxis}
                            tick={{ fill: 'oklch(86.9% 0.022 252.894)', fontSize: 11, fontWeight: 500 }}
                            dx={-8}
                        />
                        <Tooltip
                            content={<CustomTooltip prefix={currency} />}
                            cursor={{ stroke: 'oklch(86.9% 0.022 252.894)', strokeWidth: 1, strokeDasharray: '3 3' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="Income"
                            stroke="#22c55e"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorIncome)"
                            name="Income"
                            activeDot={{ r: 6, strokeWidth: 0, fill: '#22c55e' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="Expense"
                            stroke="#ef4444"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorExpense)"
                            name="Expense"
                            activeDot={{ r: 6, strokeWidth: 0, fill: '#ef4444' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

export default IncomeExpenseComparisonChart;