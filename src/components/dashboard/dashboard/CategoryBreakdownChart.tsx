'use client';
import { useFinance } from '@/context/FinanceContext';
import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell } from 'recharts';



// Custom Tooltip for glass look (matching the comparison chart)
const CustomTooltip = ({ active, payload, prefix = '$' }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/30 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <div className="space-y-1">
                    {payload.map((p: any) => (
                        <p key={p.name} style={{ color: p.color || p.fill }} className="flex justify-between items-center gap-4 text-sm font-semibold">
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




const CATEGORY_COLORS: { [key: string]: string } = {
    Grocery: 'oklch(64.6% 0.222 41.116)',
    Food: 'oklch(53.2% 0.157 131.589)',
    Utilities: 'oklch(48.8% 0.243 264.376)',
    Medical: 'oklch(55.8% 0.288 302.321)',
    Education: 'oklch(63.6% 0.17 252.8)',
    Transportation: 'oklch(44.6% 0.043 257.281)',
    Entertainment: 'oklch(81.1% 0.111 293.571)',
    Others: 'oklch(93.8% 0.127 124.321)'
};





const CategoryBreakdownChart = () => {
    const { expenses, settings } = useFinance();
    const currency = settings?.familyInfo?.currency || '$';

    const currentMonthStr = '2026-06';
    const thisMonthExpenses = expenses.filter(e => e.date.startsWith(currentMonthStr));

    const categoriesList = ['Grocery', 'Food', 'Utilities', 'Medical', 'Education', 'Transportation', 'Entertainment', 'Others'];
    const chartData = categoriesList.map(cat => {
        const amt = thisMonthExpenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0);
        return { name: cat, value: amt };
    }).filter(c => c.value > 0);

    if (chartData.length === 0) {
        return (
            <div className="flex h-60 items-center justify-center text-xs font-semibold text-white/50">
                No expenses to display.
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col items-center justify-center gap-4 mt-4">
            <div className="w-full sm:w-1/2 h-60">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Tooltip content={<CustomTooltip prefix={currency} />} />
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={85}
                            paddingAngle={4}
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || '#6366f1'} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="flex-1 w-full grid grid-cols-2 gap-2 text-xs font-semibold">
                {chartData.map((entry) => (
                    <div key={entry.name} className="flex items-center gap-2">
                        <span
                            className="h-3 w-3 rounded-full shrink-0"
                            style={{ backgroundColor: CATEGORY_COLORS[entry.name] || '#6366f1' }}
                        />
                        <span className="text-white/75 truncate">{entry.name}</span>
                        <span className="text-white">{currency}{entry.value.toLocaleString()}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryBreakdownChart;