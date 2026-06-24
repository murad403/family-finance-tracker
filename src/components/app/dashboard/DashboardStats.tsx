import StatsCard, { TStatsCard } from '@/components/shared/StatsCard';
import { BanknoteArrowDown, PiggyBank, TrendingDown, TrendingUp, Users, Wallet } from 'lucide-react';



const DashboardStats = () => {
    const summaryCardsData: TStatsCard[] = [
        {
            label: "total income",
            icon: TrendingUp,
            value: 100,
            sublabel: "Lifetime earnings",
            trendPercentage: 10,
            color: "text-emerald-400 bg-emerald-950/40"
        },
        {
            label: "total expenses",
            icon: TrendingDown,
            value: 10,
            sublabel: "Lifetime spending",
            trendPercentage: 10,
            color: "text-rose-400 bg-rose-950/40"
        },
        {
            label: "Net Balance",
            icon: Wallet,
            value: 100,
            sublabel: "Total net assets",
            trendPercentage: 10,
            color: "text-primary bg-primary/30"
        },
        {
            label: "Family Members",
            icon: Users,
            value: 5,
            sublabel: "Active profiles",
            trendPercentage: 25,
            color: "text-violet-400 bg-violet-950/30"
        },
        {
            label: "This Month Income",
            icon: PiggyBank,
            value: 500,
            sublabel: "June 2026 earnings",
            trendPercentage: 25,
            color: "text-yellow-400 bg-yellow-950/30"
        },
        {
            label: "This Month Exp.",
            icon: BanknoteArrowDown,
            value: 500,
            sublabel: "June 2026 spending",
            trendPercentage: 25,
            color: "text-rose-400 bg-rose-950/40"
        },
    ]
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {
                summaryCardsData.map((item: TStatsCard, index: number) =>
                    <StatsCard item={item} key={index} />
                )
            }
        </div>
    )
}


export default DashboardStats;