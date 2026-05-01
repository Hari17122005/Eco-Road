import React, { useState } from 'react';
import { useAuth, useTheme } from '../App';
import { calculateWasteImpact } from '../services/gemini';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, Leaf, Recycle, Droplets, Wind, ArrowRight, TrendingUp, ShieldCheck, Zap, DollarSign, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, AreaChart, Area, CartesianGrid } from 'recharts';
import LoginRequired from '../components/LoginRequired';

export default function ImpactCalculator({ navigate }: { navigate: (p: string) => void }) {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [amount, setAmount] = useState(1000);
  const impact = calculateWasteImpact(amount);

  if (!user) {
    return (
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 md:px-12 lg:px-24 py-24 sm:py-32 bg-transparent">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-20">
          <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6 font-display">Environmental Impact Calculator</h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
            Quantify the positive change you're making by integrating textile waste into infrastructure projects.
          </p>
        </div>
        <div className="bento-card p-12">
          <LoginRequired 
            title="Authentication Required"
            description="To use the Environmental Impact Calculator and visualize sustainability metrics, please sign in to your account."
            onLogin={() => navigate('login')}
          />
        </div>
      </div>
    );
  }

  const data = [
    { name: 'Landfill Diverted (kg)', value: impact.landfillDiverted, color: '#10b981' },
    { name: 'CO2 Saved (kg)', value: impact.co2Saved, color: '#3b82f6' },
    { name: 'Material Saved (kg)', value: impact.materialSaved, color: '#8b5cf6' },
  ];

  // Projection data for road longevity
  const projectionData = [
    { year: 0, standard: 100, textile: 100 },
    { year: 5, standard: 85, textile: 92 },
    { year: 10, standard: 65, textile: 82 },
    { year: 15, standard: 40, textile: 70 },
    { year: 20, standard: 15, textile: 55 },
  ];

  const additionalMetrics = [
    { 
      label: 'Economic Savings', 
      value: `$${(amount * 0.45).toLocaleString()}`, 
      icon: DollarSign, 
      color: 'text-emerald-500',
      desc: 'Estimated reduction in raw material procurement costs.'
    },
    { 
      label: 'Road Longevity', 
      value: '+35%', 
      icon: Clock, 
      color: 'text-blue-500',
      desc: 'Projected increase in pavement lifespan due to fiber reinforcement.'
    },
    { 
      label: 'Energy Efficiency', 
      value: `${(amount * 1.2).toLocaleString()} kWh`, 
      icon: Zap, 
      color: 'text-amber-500',
      desc: 'Energy saved by reducing bitumen heating requirements.'
    },
    { 
      label: 'Structural Integrity', 
      value: 'Enhanced', 
      icon: ShieldCheck, 
      color: 'text-violet-500',
      desc: 'Higher resistance to thermal cracking and rutting.'
    }
  ];

  return (
    <div className="max-w-[1800px] mx-auto px-4 sm:px-6 md:px-12 lg:px-24 py-24 sm:py-32 bg-transparent">
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-sm font-bold mb-6 border border-emerald-100 dark:border-emerald-800"
        >
          <TrendingUp size={16} />
          Sustainability Metrics
        </motion.div>
        <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6 font-display">Environmental Impact Calculator</h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
          Quantify the positive change you're making by integrating textile waste into infrastructure projects. Our AI-driven projections show the long-term benefits of circular construction.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
        {/* Input and Primary Stats */}
        <div className="lg:col-span-5 space-y-8 sm:space-y-10">
          <div className="bento-card p-6 sm:p-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 sm:p-4 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl">
                <Recycle size={28} className="sm:w-8 sm:h-8" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Waste Input</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">Enter total weight of textile waste</p>
              </div>
            </div>

            <div className="space-y-8">
              <input 
                type="range"
                min="100"
                max="10000"
                step="100"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400 font-semibold">Total Waste Amount</span>
                <div className="flex items-end gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">{amount.toLocaleString()}</span>
                  <span className="text-slate-500 font-bold mb-1">kg</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <motion.div 
              whileHover={{ y: -5 }}
              className="p-6 sm:p-8 bg-emerald-600 text-white rounded-[2rem] sm:rounded-[2.5rem] shadow-lg shadow-emerald-200 dark:shadow-none"
            >
              <Leaf size={28} className="mb-4 opacity-80 sm:w-8 sm:h-8" />
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider opacity-80 mb-1">CO2 Reduction</p>
              <p className="text-2xl sm:text-3xl font-black">{impact.co2Saved.toLocaleString()} kg</p>
              <p className="text-[10px] sm:text-xs mt-2 opacity-70">Equivalent to planting {Math.round(impact.co2Saved / 20)} trees.</p>
            </motion.div>
            <motion.div 
              whileHover={{ y: -5 }}
              className="p-6 sm:p-8 bg-slate-900 dark:bg-slate-800 text-white rounded-[2rem] sm:rounded-[2.5rem] shadow-lg"
            >
              <Droplets size={28} className="mb-4 text-blue-400 sm:w-8 sm:h-8" />
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider opacity-80 mb-1">Bitumen Saved</p>
              <p className="text-2xl sm:text-3xl font-black">{impact.materialSaved.toLocaleString()} kg</p>
              <p className="text-[10px] sm:text-xs mt-2 opacity-70">Reducing reliance on petroleum-based binders.</p>
            </motion.div>
          </div>
        </div>

        {/* Charts and Projections */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bento-card p-6 sm:p-10">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Impact Visualization</h3>
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Diverted</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CO2</span>
                </div>
              </div>
            </div>
            <div className="h-[300px] sm:h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ left: 20, right: 40 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={120} axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: theme === 'dark' ? '#0f172a' : '#1e293b', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={32}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bento-card p-6 sm:p-8">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <TrendingUp size={18} className="text-emerald-500" />
                Longevity Projection
              </h4>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={projectionData}>
                    <defs>
                      <linearGradient id="colorTextile" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#1e293b' : '#e2e8f0'} />
                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: theme === 'dark' ? '#64748b' : '#94a3b8' }} />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: theme === 'dark' ? '#0f172a' : '#fff', color: theme === 'dark' ? '#fff' : '#000' }}
                    />
                    <Area type="monotone" dataKey="textile" stroke="#10b981" fillOpacity={1} fill="url(#colorTextile)" strokeWidth={3} />
                    <Area type="monotone" dataKey="standard" stroke="#94a3b8" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 justify-between text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400">
                <span>Standard Road</span>
                <span className="text-emerald-500">EcoRoad (Textile)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {additionalMetrics.map((metric, i) => (
                <div key={i} className="bento-card p-4 sm:p-5 flex flex-col justify-between group hover:border-emerald-500/30 transition-all">
                  <div className={`p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50 ${metric.color} w-fit group-hover:scale-110 transition-transform`}>
                    <metric.icon size={18} />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-3">{metric.value}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{metric.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 sm:mt-16 p-6 sm:p-10 bg-slate-900 dark:bg-slate-800 rounded-[2.5rem] sm:rounded-[3rem] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="p-5 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/10">
            <ShieldCheck size={48} className="text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2">Sustainable Infrastructure Standard</h3>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl">
              Our calculations are based on extensive research into textile-reinforced asphalt. By diverting waste from landfills and reducing bitumen consumption, we help municipalities achieve their net-zero goals while building more resilient roads.
            </p>
          </div>
          <button className="ml-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-bold transition-all flex items-center gap-2 whitespace-nowrap">
            Download Report <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
