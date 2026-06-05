'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';

// Custom Tooltip for premium SaaS look
const CustomTooltip = ({ active, payload, label, prefix = '$' }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-200/80 bg-white/95 p-3 shadow-lg backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/95 text-xs font-semibold">
        {label && <p className="mb-1.5 text-slate-400 dark:text-zinc-500">{label}</p>}
        <div className="space-y-1">
          {payload.map((p: any) => (
            <p key={p.name} style={{ color: p.color || p.fill }} className="flex justify-between items-center gap-4">
              <span className="font-medium text-slate-600 dark:text-zinc-400">{p.name}:</span>
              <span className="font-bold">{prefix}{Number(p.value).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
            </p>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

// 1. Income vs Expense Comparison Chart
interface ComparisonData {
  month: string;
  Income: number;
  Expense: number;
}
export const IncomeExpenseComparison: React.FC<{ data: ComparisonData[]; currency: string }> = ({ data, currency }) => {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'rgba(156, 163, 175, 0.8)', fontSize: 11, fontWeight: 600 }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'rgba(156, 163, 175, 0.8)', fontSize: 11, fontWeight: 600 }}
          />
          <Tooltip content={<CustomTooltip prefix={currency} />} cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }} />
          <Legend 
            verticalAlign="top" 
            height={36} 
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 12, fontWeight: 600, paddingBottom: 10 }}
          />
          <Bar dataKey="Income" fill="#22C55E" radius={[4, 4, 0, 0]} name="Income" maxBarSize={28} />
          <Bar dataKey="Expense" fill="#EF4444" radius={[4, 4, 0, 0]} name="Expense" maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// 2. Expense Category Breakdown Pie Chart
interface CategoryData {
  name: string;
  value: number;
}
const CATEGORY_COLORS: { [key: string]: string } = {
  Grocery: '#10B981',       // Emerald
  Food: '#14B8A6',          // Teal
  Utilities: '#F59E0B',     // Amber
  Medical: '#EC4899',       // Pink
  Education: '#6366F1',     // Indigo
  Transportation: '#3B82F6', // Blue
  Entertainment: '#A855F7',  // Purple
  Others: '#64748b'         // Slate
};
export const ExpenseCategoryPie: React.FC<{ data: CategoryData[]; currency: string }> = ({ data, currency }) => {
  const chartData = data.filter(d => d.value > 0);
  
  if (chartData.length === 0) {
    return (
      <div className="flex h-80 items-center justify-center text-xs font-semibold text-slate-400">
        No expenses to display.
      </div>
    );
  }

  return (
    <div className="w-full h-80 flex flex-col sm:flex-row items-center justify-center gap-6">
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
            <span className="text-slate-600 dark:text-zinc-400 truncate max-w-21.25">{entry.name}</span>
            <span className="text-slate-900 dark:text-zinc-200 ml-auto">{currency}{entry.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// 3. Family Member Contribution Chart
interface ContributionData {
  name: string;
  amount: number;
}
export const FamilyContributionBar: React.FC<{ data: ContributionData[]; currency: string }> = ({ data, currency }) => {
  const sortedData = [...data].sort((a, b) => b.amount - a.amount);
  
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={sortedData} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(148, 163, 184, 0.1)" />
          <XAxis 
            type="number" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'rgba(156, 163, 175, 0.8)', fontSize: 11, fontWeight: 600 }}
          />
          <YAxis 
            type="category" 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'rgba(156, 163, 175, 0.8)', fontSize: 11, fontWeight: 600 }}
            width={80}
          />
          <Tooltip content={<CustomTooltip prefix={currency} />} cursor={{ fill: 'rgba(99, 102, 241, 0.03)' }} />
          <Bar dataKey="amount" fill="#22C55E" radius={[0, 4, 4, 0]} maxBarSize={20}>
            {sortedData.map((entry, index) => {
              const colors = ['#22C55E', '#10B981', '#14B8A6', '#3B82F6', '#6366F1'];
              return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// 4. Savings Rate Trend (Income - Expense) Line Chart
interface SavingsTrendData {
  month: string;
  Savings: number;
}
export const SavingsTrendArea: React.FC<{ data: SavingsTrendData[]; currency: string }> = ({ data, currency }) => {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'rgba(156, 163, 175, 0.8)', fontSize: 11, fontWeight: 600 }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'rgba(156, 163, 175, 0.8)', fontSize: 11, fontWeight: 600 }}
          />
          <Tooltip content={<CustomTooltip prefix={currency} />} />
          <Area 
            type="monotone" 
            dataKey="Savings" 
            stroke="#3B82F6" 
            strokeWidth={3} 
            fillOpacity={1} 
            fill="url(#colorSavings)" 
            name="Savings"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
export default { IncomeExpenseComparison, ExpenseCategoryPie, FamilyContributionBar, SavingsTrendArea };
