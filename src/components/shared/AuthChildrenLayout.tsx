import React from "react"
import { motion } from 'framer-motion';

type TProps = {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
}

const AuthChildrenLayout = ({ children, title, subtitle }: TProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            <div className="rounded-2xl p-4 sm:p-6 lg:p-8 shadow-md shadow-heading/50 hover:scale-102 transition-all duration-500 space-y-4 md:space-y-6">
                <div className="text-center">
                    {
                        title && <h2 className="text-xl md:text-2xl font-semibold text-title">{title}</h2>
                    }
                    {
                        subtitle && <p className="mt-1 text-sm md:text-base text-description">{subtitle}</p>
                    }
                </div>


                <main>
                    {children}
                </main>
            </div>
        </motion.div>

    )
}

export default AuthChildrenLayout