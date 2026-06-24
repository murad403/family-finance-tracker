import React from 'react'

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

export default CustomTooltip;