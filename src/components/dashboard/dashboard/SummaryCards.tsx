import SummaryStatsCard from '@/components/shared/SummaryStatsCard';
import { TSummaryStatsCard } from '@/types/dashboard.types';
import { TrendingDown, TrendingUp, Users, Wallet } from 'lucide-react';



const SummaryCards = () => {
    const summaryCardsData: TSummaryStatsCard[] = [
        {
            label: "total income",
            icon: TrendingUp,
            value: 100,
            sublabel: "Lifetime earnings",
            trendPercentage: 10,
            color: "text-emerald-400 text-emerald-400"
        },
        {
            label: "total expenses",
            icon: TrendingDown,
            value: 10,
            sublabel: "Lifetime spending",
            trendPercentage: 10,
            color: "text-emerald-400 text-emerald-400"
        },
        {
            label: "Net Balance",
            icon: Wallet,
            value: 100,
            sublabel: "Total net assets",
            trendPercentage: 10,
            color: "bg-primary/10 text-primary"
        },
        {
            label: "Family Members",
            icon: Users,
            value: 5,
            sublabel: "Active profiles",
            trendPercentage: 25,
            color: "bg-violet-950/20 text-violet-400"
        },
        {
            label: "This Month Income",
            icon: Users,
            value: 500,
            sublabel: "June 2026 earnings",
            trendPercentage: 25,
            color: "bg-violet-950/20 text-violet-400"
        },
        {
            label: "This Month Exp.",
            icon: Users,
            value: 500,
            sublabel: "June 2026 spending",
            trendPercentage: 25,
            color: "bg-violet-950/20 text-violet-400"
        },
    ]
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {
                summaryCardsData.map((item: TSummaryStatsCard, index: number) =>
                    <SummaryStatsCard item={item} key={index}/>
                )
            }
        </div>
    )
}


export default SummaryCards;