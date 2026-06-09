import { TSummaryStatsCard } from '@/types/dashboard.types';
import { motion } from 'framer-motion';


const SummaryStatsCard = ({item}: {item: TSummaryStatsCard}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-sm hover-glow"
        >
            <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{item?.label}</span>
                <span className="p-1.5 rounded-lg bg-emerald-950/20 text-emerald-400"><item.icon className="h-4 w-4" /></span>
            </div>
            <div className="mt-3">
                <h3 className="text-lg font-extrabold text-zinc-100">${item?.value}</h3>
                <span className="text-xs text-zinc-450 font-semibold block mt-0.5">{item?.sublabel}</span>
            </div>
        </motion.div>
    )
}

export default SummaryStatsCard