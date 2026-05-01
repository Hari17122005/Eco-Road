import React from 'react';
import { Route } from 'lucide-react';

export default function Footer({ navigate }: { navigate: (p: string) => void }) {
  return (
    <footer className="bg-slate-900 text-slate-400 py-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-[1800px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 text-white mb-4">
            <Route size={28} className="text-emerald-500" />
            <span className="text-2xl font-bold tracking-tight">EcoRoad</span>
          </div>
          <p className="max-w-md leading-relaxed">
            Revolutionizing infrastructure with sustainable materials. We analyze textile waste to create durable, eco-friendly asphalt for the roads of tomorrow.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li><button onClick={() => navigate('home')} className="hover:text-emerald-400 transition-colors">Home</button></li>
            <li><button onClick={() => navigate('research')} className="hover:text-emerald-400 transition-colors">Research Data</button></li>
            <li><button onClick={() => navigate('learning')} className="hover:text-emerald-400 transition-colors">Learning Hub</button></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Tools</h4>
          <ul className="space-y-2">
            <li><button onClick={() => navigate('analysis')} className="hover:text-emerald-400 transition-colors">Waste Analysis</button></li>
            <li><button onClick={() => navigate('quality')} className="hover:text-emerald-400 transition-colors">Road Quality</button></li>
            <li><button onClick={() => navigate('calculator')} className="hover:text-emerald-400 transition-colors">Impact Calculator</button></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 text-sm text-center">
        © 2026 EcoRoad Project. All rights reserved. Built for Sustainable Infrastructure.
      </div>
    </footer>
  );
}
