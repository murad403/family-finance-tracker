import { useFinance } from '@/context/FinanceContext';
import { BarChart3, FileText, LayoutDashboard, LogOut, Receipt, Settings, Tag, TrendingUp, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import logo from "@/assets/logo/logo3.png"


const Sidebar = () => {
    const pathname = usePathname();
    const { logout, settings } = useFinance();

    // Sidebar Links Configuration
    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Members', href: '/members', icon: Users },
        { name: 'Income', href: '/income', icon: TrendingUp },
        { name: 'Expenses', href: '/expenses', icon: Receipt },
        { name: 'Reports', href: '/reports', icon: FileText },
        { name: 'Categories', href: '/categories', icon: Tag },
        { name: 'Analytics', href: '/analytics', icon: BarChart3 },
        { name: 'Settings', href: '/settings', icon: Settings },
    ];

    return (
        <aside className="hidden lg:flex flex-col w-64 bg-slate-700/50 backdrop-blur-sm sticky top-0 h-screen overflow-y-auto">
            <Link href={"/"} className="p-4 flex items-center gap-3">
                <Image src={logo} alt='logo' width={500} height={500} />
            </Link>

            {/* Navigation List */}
            <nav className="flex-1 px-4 py-6 space-y-1.5">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-primary text-white shadow-md shadow-primary/15'
                                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                                }`}
                        >
                            <Icon className={`h-4.5 w-4.5 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-300'}`} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Profile / Logout Footer */}
            <div className="p-4 border-t border-zinc-800 bg-zinc-900/20">
                <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900 border border-zinc-800 shadow-sm">
                    <div className="flex items-center gap-2.5">
                        <span className="text-xl bg-zinc-800 h-9 w-9 rounded-lg flex items-center justify-center">
                            {settings.profile.avatar}
                        </span>
                        <div className="overflow-hidden">
                            <p className="text-xs font-bold text-zinc-200 truncate">{settings.profile.name}</p>
                            <span className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Owner</span>
                        </div>
                    </div>
                    <button
                        onClick={() => logout()}
                        className="text-slate-400 hover:text-rose-400 transition-colors p-1.5 rounded-lg hover:bg-zinc-800"
                        title="Sign Out"
                    >
                        <LogOut className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </aside>
    )
}

export default Sidebar