import React, { useState, useEffect, createContext, useContext } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { UserProfile, UserRole } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, Info, BarChart2, Camera, Calculator, BookOpen, 
  LayoutDashboard, LogIn, LogOut, Menu, X, MessageSquare,
  ShieldCheck, Leaf, Recycle, Route, Sparkles, Maximize2, Minimize2
} from 'lucide-react';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';

// Pages (to be created)
import HomePage from './pages/Home';
import AnalysisToolPage from './pages/AnalysisTool';
import RoadQualityPage from './pages/RoadQuality';
import ImpactCalculatorPage from './pages/ImpactCalculator';
import ResearchPage from './pages/Research';
import LearningHubPage from './pages/LearningHub';
import DashboardPage from './pages/Dashboard';
import AdminDashboardPage from './pages/AdminDashboard';
import LoginPage from './pages/Login';

// Context
interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  profile: null, 
  loading: true, 
  isAdmin: false,
  updateProfile: async () => {} 
});

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {}
});

export const useAuth = () => useContext(AuthContext);
export const useTheme = () => useContext(ThemeContext);

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const docRef = doc(db, 'users', firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        } else {
          // Create default profile for new users
          const newProfile: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || 'User',
            role: 'user',
            createdAt: new Date().toISOString()
          };
          await setDoc(docRef, newProfile);
          setProfile(newProfile);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const navigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const docRef = doc(db, 'users', user.uid);
    await setDoc(docRef, data, { merge: true });
    setProfile(prev => prev ? { ...prev, ...data } : null);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage navigate={navigate} />;
      case 'analysis': return <AnalysisToolPage navigate={navigate} />;
      case 'quality': return <RoadQualityPage navigate={navigate} />;
      case 'calculator': return <ImpactCalculatorPage navigate={navigate} />;
      case 'research': return <ResearchPage />;
      case 'learning': return <LearningHubPage />;
      case 'dashboard': return <DashboardPage navigate={navigate} />;
      case 'admin': return <AdminDashboardPage />;
      case 'login': return <LoginPage navigate={navigate} />;
      default: return <HomePage navigate={navigate} />;
    }
  };

  const pageBackgrounds: Record<string, string> = {
    home: 'https://images.unsplash.com/photo-1545143333-636a6619f74f?auto=format&fit=crop&q=80&w=2000',
    analysis: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2000',
    quality: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=2000',
    calculator: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2000',
    research: 'https://images.unsplash.com/photo-1454165833767-027ffea9e778?auto=format&fit=crop&q=80&w=2000',
    learning: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=2000',
    dashboard: 'https://images.unsplash.com/photo-1551288049-bbda64626744?auto=format&fit=crop&q=80&w=2000',
    admin: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=2000',
    login: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000',
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin: profile?.role === 'admin', updateProfile }}>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-emerald-100 selection:text-emerald-900 relative transition-colors duration-300">
          {/* Global Background Image with Blur */}
          <div className="fixed inset-0 -z-10 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img 
                key={currentPage}
                src={pageBackgrounds[currentPage] || pageBackgrounds.home} 
                alt="Background" 
                initial={{ opacity: 0, scale: 1.2 }}
                animate={{ opacity: theme === 'dark' ? 0.05 : 0.15, scale: 1.1 }}
                exit={{ opacity: 0, scale: 1.2 }}
                transition={{ duration: 1 }}
                className="w-full h-full object-cover blur-[100px]"
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>
          </div>
          
          <Navbar currentPage={currentPage} navigate={navigate} />
          <main className="pt-20 pb-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {renderPage()}
              </motion.div>
            </AnimatePresence>
          </main>
          <Chatbot />
          <Footer navigate={navigate} />
        </div>
      </ThemeContext.Provider>
    </AuthContext.Provider>
  );
}






