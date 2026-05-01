import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, BarChart2, Camera, Calculator, BookOpen, ShieldCheck, LayoutDashboard, LogOut, LogIn, Menu, X, Recycle, Sparkles, Sun, Moon } from 'lucide-react';
import { useAuth, useTheme } from '../App';
import { auth } from '../firebase';

export default function Navbar({ currentPage, navigate }: { currentPage: string, navigate: (p: string) => void }) {
  const { user, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, color: 'from-blue-500 to-indigo-600' },
    { id: 'analysis', label: 'Analysis', icon: BarChart2, color: 'from-emerald-500 to-teal-600' },
    { id: 'quality', label: 'Quality', icon: Camera, color: 'from-rose-500 to-pink-600' },
    { id: 'calculator', label: 'Impact', icon: Calculator, color: 'from-amber-500 to-orange-600' },
    { id: 'research', label: 'Research', icon: BookOpen, color: 'from-violet-500 to-purple-600' },
  ];

  return (
    <motion.nav 
      initial={{ y: -100, x: '-50%', opacity: 0 }}
      animate={{ y: 0, x: '-50%', opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.2 }}
      className="fixed top-4 sm:top-6 left-1/2 z-50 w-full max-w-[95vw] lg:max-w-[1800px]"
    >
      <div className="glass rounded-[2rem] sm:rounded-[2.5rem] px-4 py-3 sm:px-10 sm:py-6 flex justify-between items-center shadow-2xl shadow-slate-900/10 border border-white/60 dark:border-slate-800/60 backdrop-blur-2xl">
        <div className="flex items-center gap-2 sm:gap-4 cursor-pointer group" onClick={() => navigate('home')}>
          <div className="relative">
            <div className="p-2 sm:p-3 bg-slate-900 dark:bg-emerald-600 rounded-xl sm:rounded-2xl text-white group-hover:bg-emerald-600 dark:group-hover:bg-emerald-500 transition-all duration-500 shadow-xl shadow-slate-900/20 group-hover:rotate-12">
              <Recycle size={20} className="sm:w-7 sm:h-7" />
            </div>
            <div className="absolute -top-1 -right-1 bg-emerald-500 text-white p-0.5 sm:p-1 rounded-lg shadow-lg animate-pulse">
              <Sparkles size={8} className="sm:w-3 sm:h-3" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-lg sm:text-2xl font-black tracking-tighter text-slate-900 dark:text-white font-display leading-none">EcoRoad</span>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-3">
          <motion.div 
            layout
            className="flex items-center gap-1.5 bg-white/40 dark:bg-slate-800/40 p-1.5 rounded-[1.5rem] border border-white/60 dark:border-slate-700/60 backdrop-blur-md"
          >
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => navigate(item.id)}
                layout
                initial={false}
                animate={{
                  scale: currentPage === item.id ? 1.05 : 1,
                  color: currentPage === item.id ? '#ffffff' : (theme === 'dark' ? '#94a3b8' : '#475569')
                }}
                whileHover={{ scale: currentPage === item.id ? 1.05 : 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ 
                  scale: { type: 'spring', stiffness: 400, damping: 30 },
                  color: { duration: 0.8, ease: "easeInOut" }
                }}
                className={`px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2.5 relative group overflow-hidden`}
              >
                {currentPage === item.id && (
                  <motion.div 
                    layoutId="nav-pill"
                    className={`absolute inset-0 bg-gradient-to-r ${item.color} shadow-lg`}
                    transition={{ 
                      type: 'spring', 
                      stiffness: 150, 
                      damping: 25,
                      mass: 1.2
                    }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2.5">
                  <item.icon 
                    size={16} 
                    className={currentPage === item.id ? 'animate-pulse' : 'group-hover:rotate-12 transition-transform'} 
                  />
                  {item.label}
                </span>
              </motion.button>
            ))}
          </motion.div>
          
          <div className="h-8 w-px bg-slate-200/50 dark:bg-slate-700/50 mx-4" />
          
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-3.5 rounded-2xl bg-white/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 transition-all duration-300 shadow-sm border border-white/60 dark:border-slate-700/60"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
            </button>

            {user ? (
              <>
                {isAdmin && (
                  <button
                    onClick={() => navigate('admin')}
                    className={`p-3.5 rounded-2xl transition-all duration-300 ${currentPage === 'admin' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 shadow-lg shadow-amber-200/50' : 'text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50'}`}
                    title="Admin"
                  >
                    <ShieldCheck size={22} />
                  </button>
                )}
                <button
                  onClick={() => navigate('dashboard')}
                  className={`p-3.5 rounded-2xl transition-all duration-300 ${currentPage === 'dashboard' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 shadow-lg shadow-emerald-200/50' : 'text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50'}`}
                  title="Dashboard"
                >
                  <LayoutDashboard size={22} />
                </button>
                <button
                  onClick={() => auth.signOut()}
                  className="p-3.5 text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-2xl transition-all duration-300"
                  title="Sign Out"
                >
                  <LogOut size={22} />
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('login')}
                className="px-10 py-4 bg-slate-900 dark:bg-emerald-600 text-white rounded-2xl text-[12px] font-black uppercase tracking-[0.15em] hover:bg-slate-800 dark:hover:bg-emerald-500 transition-all shadow-2xl shadow-slate-900/30 flex items-center gap-3 active:scale-95 group whitespace-nowrap"
              >
                <LogIn size={18} className="group-hover:translate-x-1 transition-transform" />
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 sm:p-4 rounded-xl sm:rounded-2xl text-slate-600 hover:bg-white/50 transition-all active:scale-90"
          >
            {isOpen ? <X size={20} className="sm:w-7 sm:h-7" /> : <Menu size={20} className="sm:w-7 sm:h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden mt-2 glass rounded-2xl overflow-hidden shadow-xl"
          >
            <div className="p-2 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { navigate(item.id); setIsOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 ${
                    currentPage === item.id ? 'bg-slate-900 dark:bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </button>
              ))}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => { toggleTheme(); setIsOpen(false); }}
                  className="w-full text-left px-4 py-3 text-slate-600 dark:text-slate-400 flex items-center gap-3 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                  {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                </button>
                {user ? (
                  <>
                    <button
                      onClick={() => { navigate('dashboard'); setIsOpen(false); }}
                      className="w-full text-left px-4 py-3 text-slate-600 dark:text-slate-400 flex items-center gap-3 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    >
                      <LayoutDashboard size={18} /> Dashboard
                    </button>
                    <button
                      onClick={() => auth.signOut()}
                      className="w-full text-left px-4 py-3 text-red-600 dark:text-red-400 flex items-center gap-3 text-sm font-semibold hover:bg-red-50 dark:hover:bg-red-900/10"
                    >
                      <LogOut size={18} /> Sign Out
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => { navigate('login'); setIsOpen(false); }}
                    className="w-full px-4 py-3 bg-slate-900 dark:bg-emerald-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 text-sm whitespace-nowrap"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
