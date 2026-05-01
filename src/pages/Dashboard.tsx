import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { WasteAnalysis, RoadEvaluation } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, Camera, Calculator, Clock, ChevronRight, 
  Download, FileText, Trash2, AlertCircle, User as UserIcon,
  ShieldCheck, Recycle, Calendar, MapPin, ExternalLink, Sparkles,
  Settings, Save, X, Upload, Image as ImageIcon
} from 'lucide-react';

export default function Dashboard({ navigate }: { navigate: (p: string) => void }) {
  const { user, profile, updateProfile } = useAuth();
  const [analyses, setAnalyses] = useState<WasteAnalysis[]>([]);
  const [evaluations, setEvaluations] = useState<RoadEvaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: '',
    photoURL: '',
    location: '',
    bio: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setEditForm({
        displayName: profile.displayName || '',
        photoURL: profile.photoURL || '',
        location: profile.location || 'Global Network',
        bio: profile.bio || 'Sustainable infrastructure researcher.'
      });
    }
  }, [profile]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const aQuery = query(collection(db, 'waste_analyses'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
        const eQuery = query(collection(db, 'road_evaluations'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
        
        const [aSnap, eSnap] = await Promise.all([getDocs(aQuery), getDocs(eQuery)]);
        
        setAnalyses(aSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as WasteAnalysis)));
        setEvaluations(eSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as RoadEvaluation)));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 400;
          const MAX_HEIGHT = 400;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          setEditForm({ ...editForm, photoURL: dataUrl });
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(editForm);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-transparent">
      <div className="text-center bento-card p-8 sm:p-12 max-w-md w-full">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <UserIcon size={32} className="sm:w-10 sm:h-10" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4 font-display">Access Restricted</h2>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mb-6 sm:mb-8">Please sign in to view your research dashboard and analysis history.</p>
        <button 
          onClick={() => navigate('login')} 
          className="w-full py-3.5 sm:py-4 bg-slate-900 dark:bg-emerald-600 text-white rounded-xl sm:rounded-2xl font-bold hover:bg-slate-800 dark:hover:bg-emerald-500 transition-all shadow-lg text-sm sm:text-base"
        >
          Sign In
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 sm:pt-32 pb-12 px-4 sm:px-6 md:px-12 lg:px-24 bg-transparent">
      <div className="max-w-[1800px] mx-auto space-y-8 sm:space-y-12">
        {/* Profile Header */}
        <section className="bento-card p-6 sm:p-8 md:p-12 flex flex-col md:flex-row items-center gap-6 sm:gap-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 sm:w-64 h-40 sm:h-64 bg-emerald-500/5 blur-[60px] sm:blur-[80px] rounded-full -mr-20 sm:-mr-32 -mt-20 sm:-mt-32" />
          
          <div className="relative">
            {profile?.photoURL ? (
              <img 
                src={profile.photoURL} 
                alt="Profile" 
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-[2rem] sm:rounded-[2.5rem] object-cover shadow-2xl shadow-slate-200 dark:shadow-black/50 border-4 border-white dark:border-slate-800"
              />
            ) : (
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-slate-900 dark:bg-emerald-600 text-white rounded-[2rem] sm:rounded-[2.5rem] flex items-center justify-center text-3xl sm:text-4xl font-bold font-display shadow-2xl shadow-slate-200 dark:shadow-black/50">
                {profile?.displayName?.[0] || 'U'}
              </div>
            )}
            <div className="absolute -bottom-2 -right-2 p-1.5 sm:p-2 bg-emerald-500 text-white rounded-xl shadow-lg border-4 border-white dark:border-slate-800">
              <ShieldCheck size={16} className="sm:w-5 sm:h-5" />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left relative z-10 w-full">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                Researcher Profile
              </div>
              <button 
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-600 transition-colors text-xs font-bold"
              >
                <Settings size={14} /> Edit Profile
              </button>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2 font-display">{profile?.displayName}</h1>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mb-4 sm:mb-6 font-medium">{profile?.bio || 'Sustainable infrastructure researcher.'}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-2 sm:gap-3">
              <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-[10px] sm:text-xs font-bold flex items-center gap-2 shadow-sm">
                <Calendar size={14} className="text-emerald-500" /> Joined {new Date(profile?.createdAt || '').toLocaleDateString()}
              </div>
              <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-[10px] sm:text-xs font-bold flex items-center gap-2 shadow-sm">
                <MapPin size={14} className="text-blue-500" /> {profile?.location || 'Global Network'}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto mt-4 md:mt-0">
            <button 
              onClick={() => navigate('analysis')} 
              className="flex-1 md:flex-none px-6 sm:px-8 py-3.5 sm:py-4 bg-emerald-500 text-slate-900 rounded-xl sm:rounded-2xl font-bold text-sm shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-all flex items-center justify-center gap-2"
            >
              <BarChart3 size={18} /> New Analysis
            </button>
            <button 
              onClick={() => navigate('quality')} 
              className="flex-1 md:flex-none px-6 sm:px-8 py-3.5 sm:py-4 bg-slate-900 text-white rounded-xl sm:rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
              <Camera size={18} /> Road Audit
            </button>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          {/* Waste Analyses */}
          <div className="space-y-6 sm:space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
                    <BarChart3 size={16} className="sm:w-5 sm:h-5" />
                  </div>
                  Waste Analyses
                </h2>
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{analyses.length} Reports</span>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              {loading ? (
                <div className="p-8 sm:p-12 text-center text-slate-400 dark:text-slate-500 bento-card border-dashed text-sm sm:text-base">Loading analyses...</div>
              ) : analyses.length === 0 ? (
                <div className="p-10 sm:p-16 text-center bento-card border-dashed flex flex-col items-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-50 dark:bg-slate-800 text-slate-200 dark:text-slate-700 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                    <Recycle size={24} className="sm:w-8 sm:h-8" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-400 dark:text-slate-500">No data yet</h3>
                  <p className="text-slate-400 dark:text-slate-500 text-xs sm:text-sm mt-1 sm:mt-2">Start by analyzing your textile waste resources.</p>
                </div>
              ) : (
                analyses.map((a) => (
                  <motion.div 
                    key={a.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white dark:bg-slate-800/50 p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-100 dark:border-slate-700 flex items-center justify-between group cursor-pointer shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-14 sm:h-14 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                        <Recycle size={18} className="sm:w-6 sm:h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white font-display text-sm sm:text-base">{a.textileType}</h4>
                        <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 mt-0.5 sm:mt-1">
                          <Clock size={10} className="sm:w-3 sm:h-3" /> {new Date(a.createdAt).toLocaleDateString()}
                          <span className="w-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-full" />
                          {a.amount}kg
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="text-right hidden sm:block">
                        <p className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400">{a.recommendedPercentage}% Mix</p>
                        <p className="text-[8px] sm:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{a.suitabilityRating}</p>
                      </div>
                      <div className="p-1.5 sm:p-2 text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 transition-colors">
                        <ExternalLink size={16} className="sm:w-5 sm:h-5" />
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Road Evaluations */}
          <div className="space-y-6 sm:space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                    <Camera size={16} className="sm:w-5 sm:h-5" />
                  </div>
                  Road Evaluations
                </h2>
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{evaluations.length} Audits</span>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {loading ? (
                <div className="p-8 sm:p-12 text-center text-slate-400 dark:text-slate-500 bento-card border-dashed text-sm sm:text-base">Loading evaluations...</div>
              ) : evaluations.length === 0 ? (
                <div className="p-10 sm:p-16 text-center bento-card border-dashed flex flex-col items-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-50 dark:bg-slate-800 text-slate-200 dark:text-slate-700 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                    <Camera size={24} className="sm:w-8 sm:h-8" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-400 dark:text-slate-500">No audits yet</h3>
                  <p className="text-slate-400 dark:text-slate-500 text-xs sm:text-sm mt-1 sm:mt-2">Upload road images to see AI-powered results.</p>
                </div>
              ) : (
                evaluations.map((e) => (
                  <motion.div 
                    key={e.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white dark:bg-slate-800/50 p-3 sm:p-4 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-100 dark:border-slate-700 flex items-center gap-3 sm:gap-5 group cursor-pointer shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="relative w-16 h-16 sm:w-24 sm:h-24 flex-shrink-0">
                      <img src={e.imageUrl} className="w-full h-full rounded-xl sm:rounded-2xl object-cover shadow-sm" alt="Road" />
                      <div className={`absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-800 ${
                        e.condition === 'Good' ? 'bg-emerald-500 text-white' : 
                        e.condition === 'Moderate' ? 'bg-amber-500 text-white' : 'bg-red-500 text-white'
                      }`}>
                        <Sparkles size={10} className="sm:w-3.5 sm:h-3.5" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1 sm:mb-2">
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white font-display text-sm sm:text-base">{e.condition} Condition</h4>
                          <p className="text-[8px] sm:text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1 mt-0.5 sm:mt-1">
                            <Clock size={8} className="sm:w-3 sm:h-3" /> {new Date(e.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-display leading-none">{e.damagePercentage}%</span>
                          <p className="text-[6px] sm:text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Damage</p>
                        </div>
                      </div>
                      <div className="flex gap-1 sm:gap-1.5 overflow-hidden flex-wrap">
                        {e.detectedIssues.slice(0, 2).map((issue, i) => (
                          <span key={i} className="text-[8px] sm:text-[9px] font-bold bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg border border-slate-100 dark:border-slate-700 uppercase tracking-tighter">
                            {issue}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="p-1.5 sm:p-2 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 transition-colors pr-2 sm:pr-4">
                      <ChevronRight size={16} className="sm:w-5 sm:h-5" />
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2rem] sm:rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-4 sm:p-6 md:p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50 flex-shrink-0">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-display">Edit Profile</h3>
                <button onClick={() => setIsEditing(false)} className="p-1.5 sm:p-2 hover:bg-white rounded-lg sm:rounded-xl transition-colors text-slate-400">
                  <X size={18} className="sm:w-5 sm:h-5" />
                </button>
              </div>
              
              <div className="overflow-y-auto flex-1">
                <form id="edit-profile-form" onSubmit={handleUpdateProfile} className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Display Name</label>
                    <input 
                      type="text" 
                      value={editForm.displayName}
                      onChange={(e) => setEditForm({...editForm, displayName: e.target.value})}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium text-sm sm:text-base"
                      placeholder="Your name"
                      required
                    />
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Profile Photo</label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center relative group flex-shrink-0">
                        {editForm.photoURL ? (
                          <img src={editForm.photoURL} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="text-slate-300 w-6 h-6 sm:w-8 sm:h-8" />
                        )}
                        <label className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                          <Upload className="text-white w-4 h-4 sm:w-5 sm:h-5" />
                          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                        </label>
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] sm:text-xs text-slate-400 mb-2">Upload a photo from your device. Recommended: Square image, max 1MB.</p>
                        <label className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-slate-200 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold text-slate-600 cursor-pointer hover:bg-slate-50 transition-colors inline-block">
                          Choose File
                          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Location</label>
                    <input 
                      type="text" 
                      value={editForm.location}
                      onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium text-sm sm:text-base"
                      placeholder="e.g. London, UK"
                    />
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Bio</label>
                    <textarea 
                      value={editForm.bio}
                      onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium h-24 sm:h-32 resize-none text-sm sm:text-base"
                      placeholder="Tell us about your research..."
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={saving}
                    className="w-full py-3 sm:py-4 bg-slate-900 text-white rounded-xl sm:rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base mt-2 sm:mt-4"
                  >
                    {saving ? 'Saving...' : <><Save size={16} className="sm:w-[18px] sm:h-[18px]" /> Save Changes</>}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
