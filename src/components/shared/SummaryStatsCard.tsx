import { TSummaryStatsCard } from '@/types/dashboard.types';
import { motion } from 'framer-motion';


const SummaryStatsCard = ({item}: {item: TSummaryStatsCard}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-lg hover:bg-white/15 transition-all duration-300"
        >
            <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-title uppercase tracking-wider">{item?.label}</span>
                <span className={`p-2 rounded-lg ${item?.color}`}><item.icon className="h-4 w-4" /></span>
            </div>
            <div className="mt-3">
                <h3 className="text-lg font-extrabold text-title">${item?.value}</h3>
                <span className="text-xs text-heading/90 font-semibold block mt-0.5">{item?.sublabel}</span>
            </div>
        </motion.div>
    )
}

export default SummaryStatsCard