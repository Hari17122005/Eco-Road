import React from 'react';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Microscope, TrendingUp, ShieldCheck, Zap, Sparkles, ChevronRight, Info } from 'lucide-react';

const stabilityData = [
  { name: 'Standard HMA', stability: 12.5, flow: 3.2 },
  { name: '1% Textile', stability: 14.2, flow: 3.5 },
  { name: '2% Textile', stability: 15.8, flow: 3.8 },
  { name: '3% Textile', stability: 16.5, flow: 4.1 },
  { name: '5% Textile', stability: 15.2, flow: 4.5 },
];

const ruttingData = [
  { cycles: 0, standard: 0, textile: 0 },
  { cycles: 2000, standard: 1.2, textile: 0.8 },
  { cycles: 4000, standard: 2.5, textile: 1.5 },
  { cycles: 6000, standard: 4.1, textile: 2.2 },
  { cycles: 8000, standard: 5.8, textile: 3.1 },
  { cycles: 10000, standard: 7.5, textile: 4.2 },
];

export default function Research() {
  return (
    <div className="min-h-screen pt-32 pb-12 px-6 md:px-12 lg:px-24 bg-transparent">
      <div className="max-w-[1800px] mx-auto space-y-24">
        <section className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-6 border border-emerald-100 dark:border-emerald-800/50">
              <Sparkles size={12} /> Empirical Data
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-8 font-display tracking-tight">Experimental Results</h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Visualizing the performance improvements of textile-reinforced asphalt through standardized laboratory testing and comparative analysis.
            </p>
          </motion.div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Marshall Stability */}
          <div className="bento-card p-10 md:p-12">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
              <div>
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl w-fit mb-6">
                  <Zap size={24} />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white font-display">Marshall Stability Test</h3>
                <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm max-w-sm">
                  Measures the maximum load carried by a compacted specimen at 60°C. Higher stability indicates better resistance to permanent deformation.
                </p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-display">+32%</div>
                <div className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest">Peak Improvement</div>
              </div>
            </div>
            
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stabilityData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fontWeight: 600, fill: '#64748b' }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fontWeight: 600, fill: '#64748b' }}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend 
                    verticalAlign="top" 
                    align="right" 
                    iconType="circle"
                    wrapperStyle={{ paddingBottom: '20px' }}
                  />
                  <Bar dataKey="stability" name="Stability (kN)" fill="#10b981" radius={[8, 8, 0, 0]} barSize={32} />
                  <Bar dataKey="flow" name="Flow (mm)" fill="#3b82f6" radius={[8, 8, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Rutting Resistance */}
          <div className="bento-card p-10 md:p-12">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
              <div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl w-fit mb-6">
                  <TrendingUp size={24} />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white font-display">Rutting Resistance</h3>
                <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm max-w-sm">
                  Wheel tracking test showing the rut depth (mm) over 10,000 cycles. Lower values indicate superior durability under heavy traffic.
                </p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="text-2xl font-black text-blue-600 dark:text-blue-400 font-display">-44%</div>
                <div className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest">Rut Depth Reduction</div>
              </div>
            </div>
            
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ruttingData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="cycles" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fontWeight: 600, fill: '#64748b' }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fontWeight: 600, fill: '#64748b' }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend 
                    verticalAlign="top" 
                    align="right" 
                    iconType="circle"
                    wrapperStyle={{ paddingBottom: '20px' }}
                  />
                  <Line type="monotone" dataKey="standard" name="Standard Asphalt" stroke="#94a3b8" strokeWidth={3} dot={{ r: 4, fill: '#94a3b8', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="textile" name="3% Textile Asphalt" stroke="#10b981" strokeWidth={4} dot={{ r: 6, fill: '#10b981', strokeWidth: 0 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Summary Table */}
        <section className="rounded-[3rem] p-12 md:p-20 bg-black text-white relative overflow-hidden shadow-2xl border border-white/5">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-emerald-500/20 to-transparent pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div className="max-w-xl">
                <h3 className="text-3xl md:text-4xl font-bold mb-4 font-display text-white">Key Performance Indicators</h3>
                <p className="text-slate-200">Comparative analysis of mechanical properties between standard and textile-reinforced asphalt mixtures.</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl border border-white/20 text-xs font-bold uppercase tracking-widest text-emerald-400">
                <Info size={14} /> Laboratory Verified
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="pb-6 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Property</th>
                    <th className="pb-6 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Standard Asphalt</th>
                    <th className="pb-6 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Textile Reinforced</th>
                    <th className="pb-6 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Improvement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {[
                    { prop: 'Fatigue Life (Cycles)', std: '120,000', text: '185,000', imp: '+54%' },
                    { prop: 'Tensile Strength Ratio', std: '82%', text: '91%', imp: '+11%' },
                    { prop: 'Resilient Modulus (MPa)', std: '3,200', text: '4,150', imp: '+29%' },
                    { prop: 'Maintenance Interval', std: '5-7 Years', text: '8-10 Years', imp: '+40%' },
                  ].map((row, i) => (
                    <tr key={i} className="group hover:bg-white/5 transition-colors">
                      <td className="py-6 font-bold text-lg font-display text-white">{row.prop}</td>
                      <td className="py-6 text-slate-300 font-medium">{row.std}</td>
                      <td className="py-6 text-emerald-400 font-black text-xl font-display">{row.text}</td>
                      <td className="py-6">
                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm font-black">
                          {row.imp}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
