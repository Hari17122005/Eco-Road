import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Sparkles, Maximize2, Minimize2 } from 'lucide-react';
import { getChatResponse } from '../services/gemini';
import { ChatMessage as ChatMessageType } from '../types';
import Markdown from 'react-markdown';

import { useAuth } from '../App';

export default function Chatbot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [messages, setMessages] = useState<ChatMessageType[]>([
    { role: 'model', text: 'Hello! I am your EcoRoad Assistant. How can I help you today with sustainable asphalt or textile waste analysis?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!user) return;
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      const response = await getChatResponse(history, userMsg);
      setMessages(prev => [...prev, { role: 'model', text: response || "I'm sorry, I couldn't process that." }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "Error connecting to AI assistant." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={`fixed ${isFullScreen && isOpen ? 'inset-0 z-[100]' : 'bottom-4 right-4 sm:bottom-8 sm:right-8 z-50'} flex flex-col items-end gap-4 transition-all duration-500 pointer-events-none`}>
      <div className="pointer-events-auto w-full flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`${isFullScreen ? 'fixed inset-0 w-full h-full rounded-none border-none' : 'w-[calc(100vw-2rem)] sm:w-[380px] h-[60vh] sm:h-[520px] rounded-[2rem] sm:rounded-[2.5rem] border border-white/20 mb-2 sm:mb-4'} glass shadow-2xl flex flex-col overflow-hidden transition-all duration-500`}
          >
            <div className={`p-3 sm:p-6 bg-slate-900 text-white flex justify-between items-center ${isFullScreen ? 'px-6 py-4 sm:px-12 sm:py-8' : ''}`}>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-500 rounded-xl sm:rounded-2xl flex items-center justify-center">
                  <Sparkles size={16} className="sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm font-display">EcoRoad AI</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <button 
                  onClick={() => setIsFullScreen(!isFullScreen)} 
                  className="p-1.5 sm:p-2 hover:bg-white/10 rounded-lg sm:rounded-xl transition-colors hidden sm:block"
                  title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
                >
                  {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1.5 sm:p-2 hover:bg-white/10 rounded-lg sm:rounded-xl transition-colors">
                  <X size={18} className="sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
            
            <div className={`flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-6 scrollbar-hide ${isFullScreen ? 'px-6 sm:px-12 md:px-24' : ''}`}>
              {!user ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-4">
                    <Sparkles size={32} />
                  </div>
                  <h4 className="text-slate-900 dark:text-white font-bold mb-2">AI Assistant Locked</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                    Please sign in to chat with our AI assistant and get personalized recommendations for your road projects.
                  </p>
                </div>
              ) : (
                <>
                  {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-3 sm:p-4 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed ${
                        m.role === 'user' 
                          ? 'bg-emerald-600 text-white rounded-tr-none shadow-lg shadow-emerald-500/20' 
                          : 'bg-white/50 backdrop-blur-md text-slate-800 rounded-tl-none border border-white/20'
                      }`}>
                        <div className="markdown-body">
                          <Markdown>{m.text}</Markdown>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white/50 backdrop-blur-md p-4 rounded-2xl rounded-tl-none flex gap-1.5 border border-white/20">
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className={`p-3 sm:p-6 bg-white/30 backdrop-blur-xl border-t border-white/20 flex gap-2 sm:gap-3 ${isFullScreen ? 'px-6 sm:px-12 md:px-24 py-6 sm:py-10' : ''}`}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                disabled={!user}
                placeholder={user ? "Ask about textile asphalt..." : "Sign in to chat..."}
                className="flex-1 px-3 sm:px-5 py-2 sm:py-3 bg-white/50 border border-white/20 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-slate-900 disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={isTyping || !user}
                className="w-8 h-8 sm:w-12 sm:h-12 bg-emerald-600 text-white rounded-xl sm:rounded-2xl hover:bg-emerald-700 disabled:opacity-50 shadow-lg shadow-emerald-500/20 flex items-center justify-center transition-all active:scale-95 flex-shrink-0"
              >
                <MessageSquare size={16} className="sm:w-5 sm:h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-900 text-white rounded-xl sm:rounded-2xl shadow-2xl hover:bg-slate-800 transition-all flex items-center justify-center hover:scale-110 active:scale-95 group relative pointer-events-auto"
      >
        <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-emerald-500 rounded-full border-2 sm:border-4 border-[#FAFAFA]" />
        <MessageSquare size={20} className="sm:w-7 sm:h-7 group-hover:rotate-12 transition-transform" />
      </button>
      </div>
    </div>
  );
}
