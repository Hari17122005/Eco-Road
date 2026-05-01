import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, limit, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { UserProfile, WasteAnalysis, RoadEvaluation } from '../types';
import { motion } from 'motion/react';
import { 
  Users, BarChart3, Camera, ShieldCheck, 
  Trash2, UserMinus, UserPlus, Settings, ExternalLink,
  TrendingUp, Recycle, AlertCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const { profile, isAdmin } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [analyses, setAnalyses] = useState<WasteAnalysis[]>([]);
  const [evaluations, setEvaluations] = useState<RoadEvaluation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) return;

    const fetchAdminData = async () => {
      try {
        const uSnap = await getDocs(collection(db, 'users'));
        const aSnap = await getDocs(query(collection(db, 'waste_analyses'), orderBy('createdAt', 'desc'), limit(50)));
        const eSnap = await getDocs(query(collection(db, 'road_evaluations'), orderBy('createdAt', 'desc'), limit(50)));

        setUsers(uSnap.docs.map(doc => doc.data() as UserProfile));
        setAnalyses(aSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as WasteAnalysis)));
        setEvaluations(eSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as RoadEvaluation)));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [isAdmin]);

  const toggleRole = async (uid: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await updateDoc(doc(db, 'users', uid), { role: newRole });
      setUsers(users.map(u => u.uid === uid ? { ...u, role: newRole as any } : u));
    } catch (error) {
      alert("Failed to update role");
    }
  };

  if (!isAdmin) return (
    <div className="max-w-[1800px] mx-auto px-6 md:px-12 lg:px-24 py-32 text-center">
      <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
        <AlertCircle size={40} />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Access Denied</h2>
      <p className="text-slate-500 dark:text-slate-400">You do not have administrator privileges to view this page.</p>
    </div>
  );

  return (
    <div className="max-w-[1800px] mx-auto px-6 md:px-12 lg:px-24 py-32 space-y-12 bg-transparent">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Admin Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">System overview and management panel</p>
        </div>
        <div className="flex gap-4">
          <div className="px-6 py-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-3">
            <Users size={20} className="text-emerald-600 dark:text-emerald-400" />
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Users</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{users.length}</p>
            </div>
          </div>
          <div className="px-6 py-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-3">
            <TrendingUp size={20} className="text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Analyses</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{analyses.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* User Management */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">User Management</h3>
              <Settings size={20} className="text-slate-400 dark:text-slate-600" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    <th className="px-8 py-4">User</th>
                    <th className="px-8 py-4">Role</th>
                    <th className="px-8 py-4">Joined</th>
                    <th className="px-8 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {users.map((u) => (
                    <tr key={u.uid} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center font-bold text-slate-500 dark:text-slate-400">
                            {u.displayName?.[0]}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-sm">{u.displayName}</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                          u.role === 'admin' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-8 py-4 text-xs text-slate-500 dark:text-slate-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-4 text-right">
                        <button 
                          onClick={() => toggleRole(u.uid, u.role)}
                          className="p-2 text-slate-400 dark:text-slate-600 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-all"
                          title="Toggle Admin Role"
                        >
                          {u.role === 'admin' ? <UserMinus size={18} /> : <UserPlus size={18} />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Recycle size={20} className="text-emerald-600 dark:text-emerald-400" /> Recent Analyses
            </h3>
            <div className="space-y-4">
              {analyses.slice(0, 5).map((a) => (
                <div key={a.id} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="w-10 h-10 bg-white dark:bg-slate-700 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm">
                    <BarChart3 size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{a.textileType}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">{new Date(a.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{a.recommendedPercentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Camera size={20} className="text-blue-600 dark:text-blue-400" /> Road Reports
            </h3>
            <div className="space-y-4">
              {evaluations.slice(0, 5).map((e) => (
                <div key={e.id} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <img src={e.imageUrl} className="w-10 h-10 rounded-xl object-cover shadow-sm" alt="Road" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{e.condition}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">{new Date(e.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-[10px] font-bold ${
                      e.condition === 'Good' ? 'text-emerald-600 dark:text-emerald-400' : 
                      e.condition === 'Moderate' ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {e.damagePercentage}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
