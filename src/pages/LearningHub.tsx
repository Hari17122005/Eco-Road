import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, GraduationCap, Lightbulb, ArrowRight, FileText, PlayCircle, Recycle, CheckCircle2 } from 'lucide-react';

const topics = [
  {
    title: 'Basics of Asphalt Engineering',
    desc: 'Understanding the composition of bitumen, aggregates, and the physics of pavement design.',
    icon: GraduationCap,
    color: 'blue'
  },
  {
    title: 'Recycled Materials in Infrastructure',
    desc: 'How plastic, rubber, and textiles are being integrated into modern road construction.',
    icon: Recycle,
    color: 'emerald'
  },
  {
    title: 'Textile Fiber Reinforcement',
    desc: 'Deep dive into the chemical and physical bonding between fibers and asphalt binders.',
    icon: Lightbulb,
    color: 'amber'
  },
  {
    title: 'Sustainable Construction Techniques',
    desc: 'Cold-mix vs Hot-mix asphalt and the energy footprint of road building.',
    icon: BookOpen,
    color: 'purple'
  }
];

export default function LearningHub() {
  const handleDownloadSyllabus = () => {
    const syllabusContent = `EcoRoad Sustainable Road Construction Course Syllabus

1. Introduction to Bitumen and Asphalt Engineering
2. The Environmental Impact of Traditional Infrastructure
3. Recycled Materials in Modern Construction
4. Textile Fiber Properties and Behavior
5. Chemical and Physical Bonding in Asphalt Binders
6. Mixing and Compaction Techniques
7. Cold-mix vs. Hot-mix Asphalt
8. Quality Control and Testing Methods
9. Case Studies: Successful EcoRoad Implementations
10. Future Trends in Circular Infrastructure`;

    const blob = new Blob([syllabusContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'EcoRoad_Syllabus.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-[1800px] mx-auto px-6 md:px-12 lg:px-24 py-32 space-y-16">
      <section className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Learning Hub</h1>
        <p className="text-lg text-slate-600">
          Expand your knowledge on sustainable engineering and the future of recycled infrastructure.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {topics.map((topic, i) => (
          <motion.div 
            key={i}
            whileHover={{ scale: 1.02 }}
            className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 flex flex-col h-full"
          >
            <div className={`w-14 h-14 bg-${topic.color}-100 text-${topic.color}-600 rounded-2xl flex items-center justify-center mb-6`}>
              <topic.icon size={28} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">{topic.title}</h3>
            <p className="text-slate-600 mb-8 flex-1 leading-relaxed">{topic.desc}</p>
            <button className="flex items-center gap-2 text-emerald-600 font-bold hover:gap-3 transition-all">
              Read Article <ArrowRight size={18} />
            </button>
          </motion.div>
        ))}
      </div>

      <section className="bg-emerald-600 rounded-[4rem] p-12 sm:p-20 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-2/3">
            <h2 className="text-4xl font-bold mb-6">Sustainable Road Construction Course</h2>
            <p className="text-emerald-100 text-lg mb-8 leading-relaxed">
              Enroll in our free introductory course to learn about the technical specifications and environmental benefits of using recycled materials in asphalt.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-white text-emerald-700 rounded-2xl font-bold flex items-center gap-2 shadow-xl">
                <PlayCircle size={20} /> Start Learning
              </button>
              <button 
                onClick={handleDownloadSyllabus}
                className="px-8 py-4 bg-emerald-700 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-emerald-800 transition-colors"
              >
                <FileText size={20} /> Download Syllabus
              </button>
            </div>
          </div>
          <div className="lg:w-1/3">
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <span className="font-bold">Course Progress</span>
                <span className="text-sm opacity-80">4 of 12 Lessons</span>
              </div>
              <div className="w-full h-2 bg-white/20 rounded-full mb-8">
                <div className="w-1/3 h-full bg-white rounded-full" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle2 size={16} className="text-emerald-300" />
                  <span>Introduction to Bitumen</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle2 size={16} className="text-emerald-300" />
                  <span>Textile Fiber Properties</span>
                </div>
                <div className="flex items-center gap-3 text-sm opacity-50">
                  <div className="w-4 h-4 border border-white rounded-full" />
                  <span>Mixing & Compaction</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


