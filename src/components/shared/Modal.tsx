import React from "react"
import { motion, AnimatePresence } from 'framer-motion';

type TProps = {
    children: React.ReactNode;
    isOpen?: boolean;
    onClose?: () => void;
    title?: string;
    description?: string;
}

const Modal = ({ children, isOpen, onClose, title, description }: TProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 backdrop-blur-3xl"
                    />
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-white/10 backdrop-blur-sm border border-global-border rounded-xl shadow-lg w-full max-w-lg relative z-10 p-6"
                    >
                        <h3 className="text-lg font-semibold text-white">{title}</h3>
                        <p className="text-title text-sm">{description}</p>
                        {children}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

export default Modal