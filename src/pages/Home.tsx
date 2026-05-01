import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Route, 
  ArrowRight, 
  ShieldCheck, 
  BarChart2, 
  Camera, 
  Calculator, 
  BookOpen,
  Zap,
  Globe,
  TrendingUp
} from 'lucide-react';

export default function Home({ navigate }: { navigate: (p: string) => void }) {
  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-12 px-4 sm:px-6 md:px-12 lg:px-24 bg-transparent">
      {/* Hero Section */}
      <section className="max-w-[1800px] mx-auto mb-12 sm:mb-20">
        <div className="relative rounded-[2rem] sm:rounded-[3rem] overflow-hidden bg-slate-900 text-white p-6 sm:p-8 md:p-20 min-h-[500px] sm:min-h-[650px] flex flex-col justify-center">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1545143333-636a6619f74f?auto=format&fit=crop&q=80&w=2000" 
              alt="Road" 
              className="w-full h-full object-cover opacity-40"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] sm:text-xs font-bold tracking-wider uppercase mb-4 sm:mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              The Future of Infrastructure
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-[1.1] mb-6 sm:mb-8 font-display">
              Turning Textile <span className="text-emerald-400">Waste</span> into Smarter Roads.
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-400 mb-8 sm:mb-10 leading-relaxed">
              EcoRoad leverages advanced AI and sustainable engineering to transform textile waste into high-performance asphalt, reducing environmental impact while building more durable infrastructure.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
              <button
                onClick={() => navigate('quality')}
                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 rounded-xl sm:rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 text-sm sm:text-base"
              >
                Analyze Road Quality <ArrowRight size={18} className="sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => navigate('about')}
                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl sm:rounded-2xl font-bold transition-all border border-slate-700 text-sm sm:text-base flex items-center justify-center"
              >
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-[1800px] mx-auto mb-20 sm:mb-32">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {[
            { label: 'Waste Diverted', value: '50k+', unit: 'Tons' },
            { label: 'CO2 Reduction', value: '35%', unit: 'Avg' },
            { label: 'Road Durability', value: '2.5x', unit: 'Increase' },
            { label: 'Active Projects', value: '120+', unit: 'Global' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-4 sm:p-0"
            >
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-1 sm:mb-2 font-display">{stat.value}</div>
              <div className="text-[10px] sm:text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="max-w-[1800px] mx-auto mb-20 sm:mb-32">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 sm:mb-12 gap-4 sm:gap-6">
          <div className="max-w-xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4 sm:mb-6 font-display">Innovative Solutions for a Circular Economy.</h2>
            <p className="text-base sm:text-lg text-slate-600">Our platform provides the tools needed to bridge the gap between textile waste management and road infrastructure development.</p>
          </div>
          <button onClick={() => navigate('analysis')} className="text-emerald-600 font-bold flex items-center gap-2 hover:gap-3 transition-all text-sm sm:text-base">
            Explore all tools <ArrowRight size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Large Feature */}
          <div className="md:col-span-2 bento-card p-6 sm:p-8 md:p-12 flex flex-col justify-between min-h-[300px] sm:min-h-[400px] group cursor-pointer relative overflow-hidden" onClick={() => navigate('quality')}>
            <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700">
              <img src="https://images.unsplash.com/photo-1599423300746-b62533397364?auto=format&fit=crop&q=80&w=1000" alt="Road Quality" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="relative z-10 flex justify-between items-start mb-8 sm:mb-0">
              <div className="p-3 sm:p-4 bg-emerald-50 text-emerald-600 rounded-xl sm:rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-500">
                <Camera size={24} className="sm:w-8 sm:h-8" />
              </div>
              <div className="px-3 sm:px-4 py-1 rounded-full bg-slate-100 text-slate-600 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest">AI Powered</div>
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4 font-display">Visual Road Quality Assessment</h3>
              <p className="text-sm sm:text-base text-slate-600 max-w-md">Upload images of road surfaces and our AI will detect defects, analyze severity, and suggest maintenance strategies using computer vision.</p>
            </div>
          </div>

          {/* Small Feature 1 */}
          <div className="bento-card p-6 sm:p-8 flex flex-col justify-between group cursor-pointer min-h-[250px] sm:min-h-0" onClick={() => navigate('analysis')}>
            <div className="p-3 sm:p-4 bg-blue-50 text-blue-600 rounded-xl sm:rounded-2xl w-fit group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500 mb-6 sm:mb-0">
              <BarChart2 size={24} className="sm:w-8 sm:h-8" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 font-display">Waste Resource Analysis</h3>
              <p className="text-slate-600 text-xs sm:text-sm">Evaluate different textile fibers for asphalt modification and predict performance outcomes.</p>
            </div>
          </div>

          {/* Small Feature 2 */}
          <div className="bento-card p-6 sm:p-8 flex flex-col justify-between group cursor-pointer min-h-[250px] sm:min-h-0" onClick={() => navigate('calculator')}>
            <div className="p-3 sm:p-4 bg-amber-50 text-amber-600 rounded-xl sm:rounded-2xl w-fit group-hover:bg-amber-600 group-hover:text-white transition-colors duration-500 mb-6 sm:mb-0">
              <Calculator size={24} className="sm:w-8 sm:h-8" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 font-display">Impact Calculator</h3>
              <p className="text-slate-600 text-xs sm:text-sm">Quantify the environmental benefits of your sustainable road projects in real-time.</p>
            </div>
          </div>

          {/* Medium Feature */}
          <div className="md:col-span-2 bento-card p-6 sm:p-8 md:p-12 flex flex-col md:flex-row gap-6 sm:gap-8 items-center group cursor-pointer relative overflow-hidden" onClick={() => navigate('research')}>
            <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700">
              <img src="https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&q=80&w=1000" alt="Asphalt" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="flex-1 relative z-10 w-full">
              <div className="p-3 sm:p-4 bg-purple-50 text-purple-600 rounded-xl sm:rounded-2xl w-fit mb-4 sm:mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-500">
                <BookOpen size={24} className="sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4 font-display">Research & Data Hub</h3>
              <p className="text-sm sm:text-base text-slate-600">Access our database of laboratory testing results, including Marshall Stability and Rutting Resistance analysis for various textile-asphalt mixes.</p>
            </div>
            <div className="w-full md:w-1/3 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 border border-slate-100 dark:border-slate-800 relative z-10">
              <div className="space-y-4">
                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <span>Stability</span>
                  <span>85%</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[85%]" />
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <span>Durability</span>
                  <span>60%</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[60%]" />
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <span>Resilience</span>
                  <span>75%</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-[75%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-[1800px] mx-auto">
        <div className="bg-emerald-600 rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&q=80&w=2000" 
              alt="Asphalt Texture" 
              className="w-full h-full object-cover opacity-20 mix-blend-overlay"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-40 sm:w-64 h-40 sm:h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 sm:mb-8 font-display leading-tight">Ready to build the roads of tomorrow?</h2>
            <p className="text-base sm:text-xl text-emerald-100 mb-8 sm:mb-12">Join our community of engineers and sustainability experts working to revolutionize infrastructure.</p>
            <button
              onClick={() => navigate('login')}
              className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-white text-emerald-700 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:bg-emerald-50 transition-all shadow-xl"
            >
              Get Started for Free
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
