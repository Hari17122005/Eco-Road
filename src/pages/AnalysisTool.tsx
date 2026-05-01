import React, { useState, useEffect } from 'react';
import { useAuth, useTheme } from '../App';
import { db } from '../firebase';
import { collection, addDoc, query, where, orderBy, getDocs } from 'firebase/firestore';
import { getWasteRecommendation } from '../services/gemini';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart3, Recycle, Info, Save, CheckCircle2, AlertCircle, ChevronRight, Sparkles, Clock, Loader2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { WasteAnalysis } from '../types';

import LoginRequired from '../components/LoginRequired';

export default function AnalysisTool({ navigate }: { navigate: (p: string) => void }) {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    textileType: 'Polyester',
    amount: 100,
    processingForm: 'Shredded Fibers',
    roadType: 'High-Traffic Highway'
  });
  const [result, setResult] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [history, setHistory] = useState<WasteAnalysis[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      setLoadingHistory(true);
      try {
        const q = query(
          collection(db, 'waste_analyses'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        setHistory(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as WasteAnalysis)));
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchHistory();
  }, [user]);

  const handleAnalyze = async () => {
    if (!user) return;
    const recommendation = getWasteRecommendation(formData.textileType, formData.amount, formData.processingForm);
    const newResult = {
      ...formData,
      ...recommendation,
      createdAt: new Date().toISOString()
    };
    setResult(newResult);
    setSaved(false);

    // Automatically save to dashboard if logged in
    if (user) {
      setSaving(true);
      try {
        const docRef = await addDoc(collection(db, 'waste_analyses'), {
          ...newResult,
          userId: user.uid
        });
        setSaved(true);
        setHistory(prev => [{ id: docRef.id, ...newResult, userId: user.uid }, ...prev]);
      } catch (error) {
        console.error("Error auto-saving analysis:", error);
      } finally {
        setSaving(false);
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-24 sm:pt-32 pb-8 sm:pb-12 px-4 sm:px-6 md:px-12 lg:px-24 bg-transparent">
        <div className="max-w-[1800px] mx-auto">
          <div className="mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4 font-display">Waste Resource Analysis</h1>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl">Evaluate the suitability of textile waste for asphalt modification and predict performance outcomes.</p>
          </div>
          <div className="bento-card p-12">
            <LoginRequired 
              title="Authentication Required"
              description="To access our advanced waste resource analysis tools and predict performance outcomes, please sign in. Logged-in users can save their analyses and access detailed reports."
              onLogin={() => navigate('login')}
            />
          </div>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    if (!user || !result) return;
    setSaving(true);
    try {
      await addDoc(collection(db, 'waste_analyses'), {
        ...result,
        userId: user.uid
      });
      setSaved(true);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const chartData = result ? [
    { name: 'Textile Waste', value: result.recommendedPercentage },
    { name: 'Bitumen/Aggregate', value: 100 - result.recommendedPercentage }
  ] : [];

  const COLORS = ['#10b981', '#f1f5f9'];

  return (
    <div className="min-h-screen pt-24 sm:pt-32 pb-8 sm:pb-12 px-4 sm:px-6 md:px-12 lg:px-24 bg-transparent">
      <div className="max-w-[1800px] mx-auto">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4 font-display">Waste Resource Analysis</h1>
          <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl">Evaluate the suitability of textile waste for asphalt modification and predict performance outcomes.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Input Form */}
          <div className="lg:col-span-4">
            <div className="bento-card p-6 sm:p-8 sticky top-24 sm:top-32">
              <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                <div className="p-2 sm:p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl sm:rounded-2xl">
                  <Recycle size={20} className="sm:w-6 sm:h-6" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-display">Resource Details</h2>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Textile Type</label>
                  <select 
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium text-sm sm:text-base text-slate-900 dark:text-white"
                    value={formData.textileType}
                    onChange={(e) => setFormData({...formData, textileType: e.target.value})}
                  >
                    <option className="bg-white dark:bg-slate-900">Polyester</option>
                    <option className="bg-white dark:bg-slate-900">Cotton</option>
                    <option className="bg-white dark:bg-slate-900">Mixed Fabrics</option>
                    <option className="bg-white dark:bg-slate-900">Nylon</option>
                    <option className="bg-white dark:bg-slate-900">Denim</option>
                  </select>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Amount (kg)</label>
                  <input 
                    type="number"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium text-sm sm:text-base text-slate-900 dark:text-white"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
                  />
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Processing Form</label>
                  <select 
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium text-sm sm:text-base text-slate-900 dark:text-white"
                    value={formData.processingForm}
                    onChange={(e) => setFormData({...formData, processingForm: e.target.value})}
                  >
                    <option className="bg-white dark:bg-slate-900">Shredded Fibers</option>
                    <option className="bg-white dark:bg-slate-900">Powdered Material</option>
                    <option className="bg-white dark:bg-slate-900">Fabric Fragments</option>
                  </select>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Target Road</label>
                  <select 
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium text-sm sm:text-base text-slate-900 dark:text-white"
                    value={formData.roadType}
                    onChange={(e) => setFormData({...formData, roadType: e.target.value})}
                  >
                    <option className="bg-white dark:bg-slate-900">High-Traffic Highway</option>
                    <option className="bg-white dark:bg-slate-900">Urban Residential Road</option>
                    <option className="bg-white dark:bg-slate-900">Industrial Pavement</option>
                    <option className="bg-white dark:bg-slate-900">Pedestrian Pathway</option>
                  </select>
                </div>

                <button 
                  onClick={handleAnalyze}
                  className="w-full py-3 sm:py-4 bg-slate-900 dark:bg-emerald-600 text-white rounded-xl sm:rounded-2xl font-bold hover:bg-slate-800 dark:hover:bg-emerald-500 transition-all shadow-lg flex items-center justify-center gap-2 group text-sm sm:text-base mt-2 sm:mt-0"
                >
                  Analyze Suitability <ChevronRight size={16} className="sm:w-[18px] sm:h-[18px] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div 
                  key="results"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4 sm:space-y-6"
                >
                  <div className="bento-card p-6 sm:p-8 md:p-12">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-6 mb-8 sm:mb-12">
                      <div>
                        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest mb-3 sm:mb-4 border border-emerald-100 dark:border-emerald-800/50">
                          <Sparkles size={10} className="sm:w-3 sm:h-3" /> Analysis Complete
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-display">Optimization Report</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm sm:text-base">Resource: {result.amount}kg of {result.textileType}</p>
                      </div>
                      {user && (
                        <button 
                          onClick={handleSave}
                          disabled={saving || saved}
                          className={`w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-sm sm:text-base ${
                            saved ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-slate-900 dark:bg-emerald-600 text-white hover:bg-slate-800 dark:hover:bg-emerald-500'
                          }`}
                        >
                          {saved ? <CheckCircle2 size={18} className="sm:w-5 sm:h-5" /> : <Save size={18} className="sm:w-5 sm:h-5" />}
                          {saved ? 'Saved to Dashboard' : saving ? 'Saving...' : 'Save Report'}
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
                      <div className="p-6 sm:p-8 bg-emerald-50 dark:bg-emerald-900/20 rounded-[1.5rem] sm:rounded-3xl border border-emerald-100 dark:border-emerald-800/50 flex flex-col justify-center">
                        <p className="text-[10px] sm:text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1 sm:mb-2 uppercase tracking-widest">Recommended Mix</p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl sm:text-5xl font-black text-emerald-900 dark:text-white font-display">{result.recommendedPercentage}</span>
                          <span className="text-lg sm:text-xl font-bold text-emerald-700 dark:text-emerald-500">%</span>
                        </div>
                      </div>
                      <div className="p-6 sm:p-8 bg-blue-50 dark:bg-blue-900/20 rounded-[1.5rem] sm:rounded-3xl border border-blue-100 dark:border-blue-800/50 flex flex-col justify-center">
                        <p className="text-[10px] sm:text-xs font-bold text-blue-600 dark:text-blue-400 mb-1 sm:mb-2 uppercase tracking-widest">Suitability</p>
                        <p className="text-3xl sm:text-4xl font-black text-blue-900 dark:text-white font-display">{result.suitabilityRating}</p>
                      </div>
                      <div className="p-6 sm:p-8 bg-slate-900 dark:bg-slate-800 rounded-[1.5rem] sm:rounded-3xl flex flex-col justify-center text-white sm:col-span-2 md:col-span-1">
                        <p className="text-[10px] sm:text-xs font-bold text-emerald-400 mb-1 sm:mb-2 uppercase tracking-widest">Durability Gain</p>
                        <p className="text-xl sm:text-2xl font-bold font-display">High Performance</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
                      <div className="h-[250px] sm:h-[320px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={chartData}
                              cx="50%"
                              cy="50%"
                              innerRadius={window.innerWidth < 640 ? 50 : 70}
                              outerRadius={window.innerWidth < 640 ? 80 : 100}
                              paddingAngle={8}
                              dataKey="value"
                              stroke="none"
                            >
                              {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : (theme === 'dark' ? '#1e293b' : '#f1f5f9')} />
                              ))}
                            </Pie>
                            <Tooltip 
                              contentStyle={{ 
                                borderRadius: '16px', 
                                border: 'none', 
                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', 
                                fontSize: '12px', 
                                backgroundColor: theme === 'dark' ? '#1e293b' : '#fff', 
                                color: theme === 'dark' ? '#fff' : '#000' 
                              }}
                              itemStyle={{ color: theme === 'dark' ? '#fff' : '#000' }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-[10px] sm:text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Mix Ratio</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3 sm:space-y-4">
                        <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl sm:rounded-2xl border border-slate-100 dark:border-slate-800">
                          <div className="flex gap-2 sm:gap-3 mb-2 sm:mb-3">
                            <div className="p-1.5 sm:p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
                              <Info size={14} className="sm:w-4 sm:h-4" />
                            </div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">Technical Insight</h4>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                            {result.durabilityImprovement}
                          </p>
                        </div>
                        <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl sm:rounded-2xl border border-slate-100 dark:border-slate-800">
                          <div className="flex gap-2 sm:gap-3 mb-2 sm:mb-3">
                            <div className="p-1.5 sm:p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg">
                              <AlertCircle size={14} className="sm:w-4 sm:h-4" />
                            </div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">Processing Tip</h4>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                            For {result.processingForm}, ensure a dry mixing process at 160°C for optimal fiber distribution and adhesion.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full min-h-[300px] sm:min-h-[500px] flex flex-col items-center justify-center text-center p-6 sm:p-12 bento-card border-dashed"
                >
                  <div className="w-16 h-16 sm:w-24 sm:h-24 bg-slate-50 dark:bg-slate-900/50 text-slate-200 dark:text-slate-800 rounded-full flex items-center justify-center mb-6 sm:mb-8">
                    <BarChart3 size={32} className="sm:w-12 sm:h-12" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2 font-display">Ready for Analysis</h3>
                  <p className="text-slate-400 dark:text-slate-500 text-sm sm:text-base max-w-sm">Enter your waste resource details in the form to generate a comprehensive suitability report and optimization data.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* History Section */}
        <div className="mt-16 sm:mt-20">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6 sm:mb-8 font-display flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <Clock size={16} className="sm:w-5 sm:h-5" />
            </div>
            Analysis History
          </h2>
          
          {loadingHistory ? (
            <div className="flex justify-center p-8 sm:p-12">
              <Loader2 className="animate-spin text-emerald-500 sm:w-8 sm:h-8" size={24} />
            </div>
          ) : history.length === 0 ? (
            <div className="text-center p-8 sm:p-12 bento-card border-dashed text-slate-400 text-sm sm:text-base">
              No previous analyses found. Complete an analysis to see it here.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {history.map((item) => (
                <div 
                  key={item.id} 
                  className="bento-card p-4 sm:p-6 cursor-pointer hover:border-emerald-500/50 hover:shadow-lg transition-all group"
                  onClick={() => {
                    setResult(item);
                    setSaved(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 sm:p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
                      <Recycle size={20} />
                    </div>
                    <div className="text-right">
                      <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-display">
                        {item.recommendedPercentage}%
                      </div>
                      <div className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mix Ratio</div>
                    </div>
                  </div>
                  
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1 font-display">{item.textileType}</h4>
                  <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mb-4">{item.amount}kg • {item.roadType}</p>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <Clock size={10} />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                      {item.suitabilityRating}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
