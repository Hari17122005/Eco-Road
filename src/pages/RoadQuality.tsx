import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../App';
import { db } from '../firebase';
import { collection, addDoc, query, where, orderBy, getDocs } from 'firebase/firestore';
import { analyzeRoadImage } from '../services/gemini';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Upload, Search, CheckCircle2, AlertTriangle, XCircle, Save, Loader2, Image as ImageIcon, Sparkles, ChevronRight, Clock } from 'lucide-react';
import { RoadEvaluation } from '../types';

import LoginRequired from '../components/LoginRequired';

export default function RoadQuality({ navigate }: { navigate: (p: string) => void }) {
  const { user } = useAuth();
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [history, setHistory] = useState<RoadEvaluation[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoadingHistory(true);
      try {
        // Load local history first
        const localHistory = JSON.parse(localStorage.getItem('road_analysis_history') || '[]');
        
        if (user) {
          // If logged in, fetch from Firestore and merge with local
          const q = query(
            collection(db, 'road_evaluations'),
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc')
          );
          const snap = await getDocs(q);
          const firestoreHistory = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as RoadEvaluation));
          
          // Merge and remove duplicates by ID or timestamp
          const merged = [...firestoreHistory];
          localHistory.forEach((local: any) => {
            if (!merged.find(m => m.createdAt === local.createdAt)) {
              merged.push(local);
            }
          });
          setHistory(merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        } else {
          setHistory(localHistory);
        }
      } catch (error) {
        console.error("Error fetching history:", error);
        // Fallback to local history if firestore fails (e.g. index not ready)
        const localHistory = JSON.parse(localStorage.getItem('road_analysis_history') || '[]');
        setHistory(localHistory);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchHistory();
  }, [user]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setSaved(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!user) return; // Guard against unauthenticated calls
    if (!image) return;
    setAnalyzing(true);
    try {
      const base64 = image.split(',')[1];
      const analysis = await analyzeRoadImage(base64);
      setResult(analysis);
      
      // Automatically save to dashboard if logged in
      if (user) {
        setSaving(true);
        try {
          const newDoc = {
            ...analysis,
            imageUrl: image,
            userId: user.uid,
            createdAt: new Date().toISOString()
          };
          const docRef = await addDoc(collection(db, 'road_evaluations'), newDoc);
          setSaved(true);
          setHistory(prev => [{ id: docRef.id, ...newDoc }, ...prev.filter(h => !h.id?.toString().startsWith('local-'))]);
        } catch (error) {
          console.error("Error auto-saving evaluation:", error);
        } finally {
          setSaving(false);
        }
      } else {
        // Automatically add to local history after analysis if not logged in
        const newEntry = {
          ...analysis,
          imageUrl: image,
          createdAt: new Date().toISOString(),
          id: `local-${Date.now()}`
        };
        
        const currentLocal = JSON.parse(localStorage.getItem('road_analysis_history') || '[]');
        const updatedLocal = [newEntry, ...currentLocal].slice(0, 10);
        localStorage.setItem('road_analysis_history', JSON.stringify(updatedLocal));
        setHistory(updatedLocal);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setAnalyzing(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-24 sm:pt-32 pb-8 sm:pb-12 px-4 sm:px-6 md:px-12 lg:px-24">
        <div className="max-w-[1800px] mx-auto">
          <div className="mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4 font-display">Road Quality Assessment</h1>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl">Upload images of road surfaces and our AI will detect defects, analyze severity, and suggest maintenance strategies.</p>
          </div>
          <div className="bento-card p-12">
            <LoginRequired 
              title="Authentication Required"
              description="To use our AI-powered road quality assessment tool, please sign in to your account. This allows us to provide personalized results and save your analysis history."
              onLogin={() => navigate('login')}
            />
          </div>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    if (!user || !result || !image) return;
    setSaving(true);
    try {
      const newDoc = {
        ...result,
        imageUrl: image,
        userId: user.uid,
        createdAt: new Date().toISOString()
      };
      const docRef = await addDoc(collection(db, 'road_evaluations'), newDoc);
      setSaved(true);
      setHistory(prev => [{ id: docRef.id, ...newDoc }, ...prev.filter(h => !h.id?.toString().startsWith('local-'))]);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const getConditionColor = (cond: string) => {
    switch (cond) {
      case 'Good': return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/50';
      case 'Moderate': return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800/50';
      case 'Poor': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800/50';
      default: return 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/20 border-slate-100 dark:border-slate-800/50';
    }
  };

  const getConditionIcon = (cond: string) => {
    switch (cond) {
      case 'Good': return <CheckCircle2 size={20} />;
      case 'Moderate': return <AlertTriangle size={20} />;
      case 'Poor': return <XCircle size={20} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen pt-24 sm:pt-32 pb-8 sm:pb-12 px-4 sm:px-6 md:px-12 lg:px-24 bg-transparent">
      <div className="max-w-[1800px] mx-auto">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4 font-display">Road Quality Detection</h1>
          <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl">
            Upload images of road surfaces to detect cracks, potholes, and surface wear using our advanced AI analysis engine.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-5">
            <div className="bento-card p-3 sm:p-4 md:p-6 sticky top-24 sm:top-32">
              <div 
                className={`relative aspect-square rounded-[1.5rem] sm:rounded-[2rem] border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-900/50 ${
                  image ? 'border-emerald-500/50' : 'border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                }`}
              >
                {image ? (
                  <>
                    <img src={image} alt="Upload" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 sm:px-6 py-2 sm:py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl sm:rounded-2xl font-bold shadow-xl flex items-center gap-2 text-sm sm:text-base"
                      >
                        <ImageIcon size={16} className="sm:w-[18px] sm:h-[18px]" /> Change Image
                      </button>
                    </div>
                  </>
                ) : (
                  <div 
                    className="text-center cursor-pointer p-6 sm:p-8 w-full h-full flex flex-col items-center justify-center"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white dark:bg-slate-800 text-emerald-500 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-sm mb-4 sm:mb-6">
                      <Upload size={24} className="sm:w-8 sm:h-8" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-1 sm:mb-2 font-display">Upload Road Image</h3>
                    <p className="text-slate-400 dark:text-slate-500 text-xs sm:text-sm max-w-[200px]">Drag and drop or click to select a photo of the road surface</p>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                />
              </div>

              <div className="mt-4 sm:mt-6">
                <button
                  onClick={handleAnalyze}
                  disabled={!image || analyzing}
                  className="w-full py-3 sm:py-4 bg-slate-900 dark:bg-emerald-600 text-white rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:bg-slate-800 dark:hover:bg-emerald-500 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3 group"
                >
                  {analyzing ? <Loader2 className="animate-spin sm:w-5 sm:h-5" size={18} /> : <Search size={18} className="sm:w-5 sm:h-5" />}
                  {analyzing ? 'Analyzing Surface...' : 'Start AI Analysis'}
                  {!analyzing && image && <ChevronRight size={16} className="sm:w-[18px] sm:h-[18px] group-hover:translate-x-1 transition-transform" />}
                </button>
              </div>
            </div>
          </div>

          {/* Analysis Results */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4 sm:space-y-6"
                >
                  <div className="bento-card p-6 sm:p-8 md:p-10">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-6 mb-6 sm:mb-10">
                      <div>
                        <div className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border text-xs sm:text-sm font-bold mb-3 sm:mb-4 ${getConditionColor(result.condition)}`}>
                          {getConditionIcon(result.condition)}
                          {result.condition} Condition
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-display">Surface Assessment</h2>
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
                          {saved ? 'Report Saved' : saving ? 'Saving...' : 'Save Report'}
                        </button>
                      )}
                    </div>

                    <div className="mb-8 sm:mb-12 p-6 sm:p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-100 dark:border-slate-800">
                      <div className="flex justify-between items-end mb-3 sm:mb-4">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <Sparkles size={16} className="text-emerald-500 sm:w-[18px] sm:h-[18px]" />
                          <h3 className="text-xs sm:text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Damage Severity</h3>
                        </div>
                        <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-display">{result.damagePercentage}%</span>
                      </div>
                      <div className="w-full h-2 sm:h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${result.damagePercentage}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-full rounded-full ${
                            result.damagePercentage < 30 ? 'bg-emerald-500' : 
                            result.damagePercentage < 60 ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2 font-display text-sm sm:text-base">
                          <AlertTriangle size={16} className="text-amber-500 sm:w-[18px] sm:h-[18px]" />
                          Detected Issues
                        </h4>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {result.detectedIssues.map((issue: string, i: number) => (
                            <span key={i} className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold shadow-sm">
                              {issue}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2 font-display text-sm sm:text-base">
                          <CheckCircle2 size={16} className="text-emerald-500 sm:w-[18px] sm:h-[18px]" />
                          Maintenance Strategy
                        </h4>
                        <div className="p-4 sm:p-6 bg-emerald-50/50 dark:bg-emerald-900/20 rounded-xl sm:rounded-2xl border border-emerald-100 dark:border-emerald-800/50 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed italic">
                          "{result.suggestions}"
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
                  className="h-full min-h-[400px] sm:min-h-[500px] flex flex-col items-center justify-center text-center p-8 sm:p-12 bento-card border-dashed"
                >
                  <div className="w-16 h-16 sm:w-24 sm:h-24 bg-slate-50 dark:bg-slate-900/50 text-slate-200 dark:text-slate-800 rounded-full flex items-center justify-center mb-6 sm:mb-8">
                    <Camera size={32} className="sm:w-12 sm:h-12" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2 font-display">Analysis Pending</h3>
                  <p className="text-slate-400 dark:text-slate-500 max-w-sm text-sm sm:text-base">Upload a clear photo of the road surface and click "Start AI Analysis" to see detailed results and maintenance recommendations.</p>
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
              No previous analyses found. Upload an image to start your first analysis.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {history.map((item) => (
                <div 
                  key={item.id} 
                  className="bento-card p-3 sm:p-4 cursor-pointer hover:border-emerald-500/50 hover:shadow-lg transition-all group"
                  onClick={() => {
                    setImage(item.imageUrl);
                    setResult({
                      condition: item.condition,
                      damagePercentage: item.damagePercentage,
                      detectedIssues: item.detectedIssues,
                      suggestions: item.suggestions
                    });
                    setSaved(item.id?.toString().startsWith('local-') ? false : true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <div className="aspect-video rounded-lg sm:rounded-xl overflow-hidden mb-3 sm:mb-4 relative">
                    <img src={item.imageUrl} alt="Road" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className={`absolute top-2 right-2 px-2 sm:px-3 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-bold shadow-lg backdrop-blur-md ${
                      item.condition === 'Good' ? 'bg-emerald-500/90 text-white' : 
                      item.condition === 'Moderate' ? 'bg-amber-500/90 text-white' : 'bg-red-500/90 text-white'
                    }`}>
                      {item.condition}
                    </div>
                    {item.id?.toString().startsWith('local-') && (
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-slate-900/80 text-white text-[8px] font-bold rounded uppercase tracking-widest backdrop-blur-sm">
                        Local
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-start mb-2 sm:mb-3">
                    <div className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <Clock size={10} className="sm:w-3 sm:h-3" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white font-display">
                      {item.damagePercentage}% Damage
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 sm:gap-1.5 overflow-hidden h-[22px] sm:h-[26px]">
                    {item.detectedIssues.slice(0, 2).map((issue, i) => (
                      <span key={i} className="text-[8px] sm:text-[10px] font-bold bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded sm:rounded-md border border-slate-100 dark:border-slate-800 truncate max-w-[100px] sm:max-w-[120px]">
                        {issue}
                      </span>
                    ))}
                    {item.detectedIssues.length > 2 && (
                      <span className="text-[8px] sm:text-[10px] font-bold bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded sm:rounded-md border border-slate-100 dark:border-slate-800">
                        +{item.detectedIssues.length - 2}
                      </span>
                    )}
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
