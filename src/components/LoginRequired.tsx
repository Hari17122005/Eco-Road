import React from 'react';
import { motion } from 'motion/react';
import { Lock, LogIn, ArrowRight } from 'lucide-react';

interface LoginRequiredProps {
  title: string;
  description: string;
  onLogin: () => void;
}

export default function LoginRequired({ title, description, onLogin }: LoginRequiredProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-emerald-500/10"
      >
        <Lock size={40} />
      </motion.div>
      
      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-3xl font-bold text-slate-900 dark:text-white mb-4 font-display"
      >
        {title}
      </motion.h2>
      
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-slate-500 dark:text-slate-400 max-w-md mb-10 leading-relaxed"
      >
        {description}
      </motion.p>
      
      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        onClick={onLogin}
        className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold flex items-center gap-3 shadow-xl shadow-emerald-500/20 transition-all active:scale-95"
      >
        <LogIn size={20} />
        Sign In to Continue
        <ArrowRight size={20} />
      </motion.button>
    </div>
  );
}
