'use client';
import { useFinance } from '@/context/FinanceContext';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import CardHeader from '@/components/shared/CardHeader';
import { div } from 'framer-motion/client';



// Custom Tooltip for premium SaaS look
const CustomTooltip = ({ active, payload, label, prefix = '$' }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/30 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                {label && <p className="mb-1.5 text-subheading">{label}</p>}
                <div className="space-y-1">
                    {payload.map((p: any) => (
                        <p key={p.name} style={{ color: p.color || p.fill }} className="flex justify-between items-center gap-4 text-sm">
                            <span className="font-medium text-white">{p.name}:</span>
                            <span className="font-bold">{prefix}{Number(p.value).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                        </p>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

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

    return (
        <div className='lg:col-span-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl'>
            <div className="flex flex-col w-full h-full p-4 ">
                {/* Header with Title and Legend */}
                <div className="flex justify-between items-center mb-6">
                    <CardHeader title='Income vs Expense' description='Last 12 months' />

                    {/* Custom Legend */}
                    <div className="flex items-center gap-4 text-xs font-semibold">
                        <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
                            <span className="text-white">Income</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
                            <span className="text-white">Expense</span>
                        </span>
                    </div>
                </div>



                {/* Chart Canvas */}
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
            </div>
        </div>
    );
};

export default IncomeExpenseComparisonChart;