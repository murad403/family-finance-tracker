'use client';
import Link from 'next/link';
import { Eye, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { FamilyMember } from '@/lib/types';
import CustomTable from '@/components/shared/CustomTable';


interface MembersTableProps {
    members: FamilyMember[];
    currency: string;
    getMemberBalances: (memberId: string) => { income: number; expense: number; balance: number };
    onEditClick: (member: FamilyMember) => void;
    onDeleteClick: (member: FamilyMember) => void;
}

const MembersTable = ({ members, currency, getMemberBalances, onEditClick, onDeleteClick }: MembersTableProps) => {
    const thead = [
        "profile", "relationship", "status", "phone", "lifetime income", "lifetime spend", "balance", "actions"
    ]
    const DEMO_MEMBERS = [
        {
            id: 'm1',
            name: 'Murad Hossain',
            relationship: 'Self',
            phone: '+880 1711-111111',
            status: 'Active',
            joinDate: '2026-01-15',
            avatar: '👨',
            lifeTimeIncome: 1000,
            lifeTimeSpend: 200,
            balance: 300
        },
        {
            id: 'm2',
            name: 'Fariha Yasmin',
            relationship: 'Spouse',
            phone: '+880 1819-222222',
            status: 'Active',
            joinDate: '2026-01-18',
            avatar: '👩',
            lifeTimeIncome: 1000,
            lifeTimeSpend: 200,
            balance: 300
        },
        {
            id: 'm3',
            name: 'Ayaan Hossain',
            relationship: 'Son',
            phone: '+880 1912-333333',
            status: 'Active',
            joinDate: '2026-02-01',
            avatar: '👦',
            lifeTimeIncome: 1000,
            lifeTimeSpend: 200,
            balance: 300
        },
        {
            id: 'm4',
            name: 'Sara Hossain',
            relationship: 'Daughter',
            phone: '+880 1515-444444',
            status: 'Inactive',
            joinDate: '2026-03-10',
            avatar: '👧',
            lifeTimeIncome: 1000,
            lifeTimeSpend: 200,
            balance: 300
        }
    ];
    return (
        <div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-zinc-800 bg-zinc-900/40 text-sm font-bold uppercase tracking-wider text-zinc-400">
                                <th className="py-4 px-6">Profile</th>
                                <th className="py-4 px-4">Relationship</th>
                                <th className="py-4 px-4">Status</th>
                                <th className="py-4 px-4">Phone</th>
                                <th className="py-4 px-4 text-right">Lifetime Income</th>
                                <th className="py-4 px-4 text-right">Lifetime Spent</th>
                                <th className="py-4 px-4 text-right">Balance</th>
                                <th className="py-4 px-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                            {members.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="py-12 text-center text-xs font-semibold text-slate-400">
                                        No family members logged.
                                    </td>
                                </tr>
                            ) : (
                                members.map((m) => {
                                    const bal = getMemberBalances(m.id);
                                    return (
                                        <tr key={m.id} className="hover:bg-zinc-800/40 transition-colors">
                                            {/* Name & Avatar */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xl bg-zinc-800 h-10 w-10 rounded-xl flex items-center justify-center">
                                                        {m.avatar}
                                                    </span>
                                                    <div>
                                                        <h4 className="text-sm font-bold text-zinc-100 leading-tight">{m.name}</h4>
                                                        <span className="text-xs text-zinc-400 font-semibold mt-1 block">Joined: {m.joinDate}</span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Relationship */}
                                            <td className="py-4 px-4">
                                                <span className="text-sm font-bold px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                                                    {m.relationship}
                                                </span>
                                            </td>

                                            {/* Status */}
                                            <td className="py-4 px-4">
                                                <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${m.status === 'Active'
                                                    ? 'bg-emerald-950/20 text-emerald-400'
                                                    : 'bg-zinc-800 text-zinc-400'
                                                    }`}>
                                                    {m.status}
                                                </span>
                                            </td>

                                            {/* Phone */}
                                            <td className="py-4 px-4 text-xs font-semibold text-zinc-300">
                                                {m.phone || 'No phone logged'}
                                            </td>

                                            {/* Income */}
                                            <td className="py-4 px-4 text-right text-xs font-bold text-emerald-400">
                                                +{currency}{bal.income.toLocaleString()}
                                            </td>

                                            {/* Expense */}
                                            <td className="py-4 px-4 text-right text-xs font-bold text-rose-400">
                                                -{currency}{bal.expense.toLocaleString()}
                                            </td>

                                            {/* Balance */}
                                            <td className="py-4 px-4 text-right text-xs font-bold text-zinc-200">
                                                {currency}{bal.balance.toLocaleString()}
                                            </td>

                                            {/* Actions */}
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Link
                                                        href={`/members/${m.id}`}
                                                        className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-zinc-800/80 transition-colors"
                                                        title="View Personal Dashboard"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => onEditClick(m)}
                                                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-zinc-800/80 transition-colors"
                                                        title="Edit Member Info"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    {m.relationship !== 'Self' && (
                                                        <button
                                                            onClick={() => onDeleteClick(m)}
                                                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-50 dark:hover:bg-zinc-800/80 transition-colors"
                                                            title="Delete Profile"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Static Pagination Toolbar */}
                <div className="px-6 py-4 border-t border-zinc-800 flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-400">
                        Showing 1 to {members.length} of {members.length} members
                    </span>
                    <div className="flex items-center gap-1.5">
                        <button
                            disabled
                            className="p-1.5 rounded-lg border border-zinc-800 opacity-40 cursor-not-allowed"
                        >
                            <ChevronLeft className="h-4 w-4 text-zinc-400" />
                        </button>
                        <span className="text-xs font-bold text-zinc-200 px-3">1 / 1</span>
                        <button
                            disabled
                            className="p-1.5 rounded-lg border border-zinc-800 opacity-40 cursor-not-allowed"
                        >
                            <ChevronRight className="h-4 w-4 text-zinc-400" />
                        </button>
                    </div>
                </div>
            </div>

            <CustomTable thead={thead} tbody={DEMO_MEMBERS} path='members'/>
        </div>
    );
};

export default MembersTable;