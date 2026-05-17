/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import { 
  ArrowRight,
  Zap,
  ShieldCheck,
  Wallet,
  Smartphone,
  CreditCard,
  HelpCircle,
  Search,
  ExternalLink,
  Play, 
  RotateCcw, 
  FastForward, 
  Monitor, 
  BarChart3, 
  User, 
  ChevronRight, 
  QrCode, 
  Clock,
  Layers,
  CheckCircle2,
  AlertCircle,
  Users,
  TrendingUp,
  Home,
  MessageSquare,
  Bell,
  X,
  Send,
  Eye,
  EyeOff
} from 'lucide-react';
import GlassCard from '@/src/components/ui/GlassCard';
import { cn } from '@/src/lib/utils';
import { getGeminiResponse } from '@/src/services/geminiService';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

// --- Types ---
type QueueStatus = 'Open' | 'Closed' | 'Break';
type Category = 'Umum' | 'Prioritas' | 'Konsultasi';

interface QueueItem {
  id: string;
  number: string;
  category: Category;
  timestamp: Date;
}

// --- Mock Data ---
const MOCK_WAITING_LIST: QueueItem[] = [
  { id: '1', number: 'A-25', category: 'Umum', timestamp: new Date() },
  { id: '2', number: 'B-08', category: 'Prioritas', timestamp: new Date() },
  { id: '3', number: 'A-26', category: 'Umum', timestamp: new Date() },
  { id: '4', number: 'C-02', category: 'Konsultasi', timestamp: new Date() },
  { id: '5', number: 'A-27', category: 'Umum', timestamp: new Date() },
];

const ANALYTICS_DATA = [
  { time: '08:00', total: 12 },
  { time: '10:00', total: 45 },
  { time: '12:00', total: 82 },
  { time: '14:00', total: 68 },
  { time: '16:00', total: 34 },
];

const STAFF_PERFORMANCE = [
  { name: 'Budi Santoso', speed: 4.5, color: '#0ea5e9' },
  { name: 'Siti Aminah', speed: 6.2, color: '#10b981' },
  { name: 'Andi Wijaya', speed: 5.8, color: '#8b5cf6' },
];

const MOCK_INSTITUTIONS = [
  { 
    id: 'inst-gacoan', 
    name: 'Mie Gacoan Pangkalpinang', 
    type: 'Kuliner',
    address: 'Jl. Ahmad Yani, Pangkalpinang',
    distance: '0.5 km',
    services: ['Dine In', 'Take Away', 'Delivery'],
    image: 'https://images.unsplash.com/photo-1552566626-52f86458a1db?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'inst-1', 
    name: 'RSUD Depati Hamzah', 
    type: 'Kesehatan',
    address: 'Jl. Soekarno Hatta, Pangkalpinang',
    distance: '1.2 km',
    services: ['UGD', 'Poli Spesialis', 'Radiologi', 'Farmasi'],
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'inst-transmart', 
    name: 'Transmart Pangkalpinang', 
    type: 'Retail',
    address: 'Jl. Jend. Sudirman, Pangkalpinang',
    distance: '2.1 km',
    services: ['Belanja', 'Trans Studio Mini', 'Food Court'],
    image: 'https://images.unsplash.com/photo-1534452203294-493d1353e124?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'inst-2', 
    name: 'BCA Cabang Pangkalpinang', 
    type: 'Perbankan',
    address: 'Jl. Jendral Sudirman No. 15, Pangkalpinang',
    distance: '0.8 km',
    services: ['Customer Service', 'Teller', 'Kredit Pembukaan'],
    image: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'inst-mcd', 
    name: 'McDonald\'s Pangkalpinang', 
    type: 'Kuliner',
    address: 'Jl. Jendral Sudirman, Pangkalpinang',
    distance: '1.5 km',
    services: ['Dine In', 'Drive Thru', 'McCafe'],
    image: 'https://images.unsplash.com/photo-1552566626-52f86458a1db?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'inst-3', 
    name: 'Disdukcapil Kota Pangkalpinang', 
    type: 'Pemerintahan',
    address: 'Jl. Rasakunda No. 1, Pangkalpinang',
    distance: '3.2 km',
    services: ['KTP-el', 'Akta Kelahiran', 'Kartu Keluarga'],
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80'
  },
];

const PLANS = [
  { 
    id: 'starter', 
    name: 'Starter', 
    price: 'Rp 20.000', 
    rawPrice: 20000,
    features: ['1 Loket Aktif', '100 Antrean / Hari', 'Support Email'],
    highlight: false
  },
  { 
    id: 'pro', 
    name: 'Pro Business', 
    price: 'Rp 50.000', 
    rawPrice: 50000,
    features: ['5 Loket Aktif', 'Antrean Tanpa Batas', 'Support 24/7', 'Custom Branding'],
    highlight: true
  },
  { 
    id: 'enterprise', 
    name: 'Enterprise', 
    price: 'Rp 100.000', 
    rawPrice: 100000,
    features: ['Unlimited Loket', 'Support Prioritas', 'API Access', 'Dedicated Manager'],
    highlight: false
  },
];

// --- Sub-components ---

const Navbar = ({ onOpenLogin }: { onOpenLogin: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed w-full z-50 px-8 transition-all duration-700",
      isScrolled ? "py-3 glass-nav shadow-2xl" : "py-6 bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex justify-between items-center text-slate-900">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-11 h-11 bg-slate-900 rounded-[14px] flex items-center justify-center text-white shadow-2xl shadow-slate-900/20">
            <Layers size={24} />
          </div>
          <span className="text-2xl font-black tracking-tighter">
            Smart<span className="text-sky-500">Queue</span>
          </span>
        </div>
        <button 
          onClick={onOpenLogin}
          className={cn(
            "px-6 py-2.5 rounded-full font-black btn-apple text-xs uppercase tracking-widest border transition-all duration-500",
            isScrolled 
              ? "bg-slate-900 text-white border-slate-900" 
              : "bg-white/30 backdrop-blur-xl text-slate-900 border-white/60 shadow-lg"
          )}
        >
          Login Pengunjung
        </button>
      </div>
    </nav>
  );
};

const FloatingElement = ({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) => (
  <motion.div
    animate={{ 
      y: [0, -20, 0],
      rotate: [0, 5, -5, 0]
    }}
    transition={{ 
      duration: 6, 
      repeat: Infinity, 
      delay,
      ease: "easeInOut" 
    }}
    className={cn("absolute pointer-events-none", className)}
  >
    {children}
  </motion.div>
);

const Hero = () => (
  <section className="min-h-screen w-full relative overflow-hidden flex items-center justify-center pt-20 bg-[#f8fafc]">
    {/* Liquid Background Blobs */}
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <motion.div 
        animate={{ 
          x: [0, 80, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
          rotate: [0, 10, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-sky-300/30 rounded-full blur-[130px] opacity-70"
      />
      <motion.div 
        animate={{ 
          x: [0, -60, 0],
          y: [0, 80, 0],
          scale: [1, 1.2, 1],
          rotate: [0, -15, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] bg-indigo-300/30 rounded-full blur-[150px] opacity-70"
      />
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,1)_0%,rgba(255,255,255,0)_70%)]" />
    </div>

    {/* Floating Glass Elements */}
    <FloatingElement delay={0} className="top-[20%] left-[10%] hidden lg:block">
      <div className="w-32 h-32 glass-card bg-white/40 rotate-12 flex items-center justify-center border-white/60">
        <Users size={40} className="text-sky-500 opacity-40" />
      </div>
    </FloatingElement>
    <FloatingElement delay={1} className="bottom-[25%] right-[15%] hidden lg:block">
      <div className="w-24 h-24 glass-card bg-white/40 -rotate-12 flex items-center justify-center border-white/60">
        <Clock size={32} className="text-indigo-500 opacity-40" />
      </div>
    </FloatingElement>
    <FloatingElement delay={2} className="top-[30%] right-[10%] hidden lg:block">
      <div className="w-20 h-20 glass-card bg-white/30 rotate-45 flex items-center justify-center border-white/60">
        <BarChart3 size={28} className="text-emerald-500 opacity-40" />
      </div>
    </FloatingElement>
    
    <div className="relative z-10 max-w-5xl text-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="inline-block px-5 py-2 glass-card bg-white/50 border-white/80 mb-8 shadow-sm">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-600">Terpercaya oleh +500 UMKM</span>
        </div>
        <h1 className="text-6xl md:text-[7.5rem] font-black mb-8 text-slate-900 leading-[0.9] tracking-tighter">
          Antrean <span className="text-transparent bg-clip-text bg-gradient-to-b from-sky-400 to-sky-600">Revolusioner.</span>
        </h1>
        <p className="text-xl md:text-2xl mb-12 font-bold text-slate-500 max-w-3xl mx-auto leading-relaxed px-4">
          Hadirkan pengalaman tunggu yang <span className="text-slate-900">elegan & bebas stres</span> dengan sistem manajemen antrean berbasis Liquid Design tercanggih.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <motion.a 
            href="#discovery" 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto bg-slate-900 text-white px-12 py-5 rounded-3xl text-lg font-black btn-apple flex items-center justify-center gap-2 shadow-2xl shadow-slate-900/30"
          >
            Mulai Sekarang
          </motion.a>
          <motion.a 
            href="#customer" 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto bg-white/40 backdrop-blur-md text-slate-900 px-12 py-5 rounded-3xl text-lg font-black border border-white/80 btn-apple flex items-center justify-center gap-3 shadow-xl"
          >
            <QrCode size={22} className="text-sky-600" /> Cek Antrean
          </motion.a>
        </div>
      </motion.div>
    </div>
  </section>
);

const BottomNav = ({ onOpenChat }: { onOpenChat: () => void }) => {
  const [active, setActive] = useState('#monitor');
  const scrollRef = useRef<HTMLDivElement>(null);

  const items = [
    { href: '#hero', icon: <Home size={22} />, label: 'Beranda' },
    { href: '#discovery', icon: <Search size={22} />, label: 'Cari' },
    { href: '#pricing', icon: <BarChart3 size={22} />, label: 'Langganan' },
    { href: '#monitor', icon: <Monitor size={22} />, label: 'Monitor' },
    { href: '#customer', icon: <QrCode size={22} />, label: 'Tiket' },
    { href: '#support', icon: <HelpCircle size={22} />, label: 'Bantuan' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = items.map(item => document.querySelector(item.href));
      const scrollPos = window.scrollY + 200;

      sections.forEach((section, i) => {
        if (section && section instanceof HTMLElement) {
          if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
            setActive(items[i].href);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 w-auto min-w-0 max-w-[95%] z-50">
      <div 
        ref={scrollRef}
        className="liquid-nav-pill px-3 py-2 sm:px-6 sm:py-4 flex justify-center items-center gap-1 sm:gap-6 overflow-x-auto custom-scrollbar cursor-grab active:cursor-grabbing"
      >
        {items.map((item) => (
          <BottomNavItem 
            key={item.href}
            active={active === item.href}
            onClick={() => {
              setActive(item.href);
              if (item.href === '#support') {
                onOpenChat();
              }
            }}
            href={item.href}
            icon={item.icon}
            label={item.label}
          />
        ))}
      </div>
    </nav>
  );
};

const BottomNavItem = ({ href, icon, label, active, onClick }: { href: string; icon: ReactNode; label: string; active: boolean; onClick: () => void; key?: any }) => (
  <motion.a 
    href={href} 
    onClick={onClick}
    whileTap={{ scale: 0.92 }}
    className={cn(
      "relative flex flex-col items-center justify-center gap-0.5 transition-all duration-500 flex-shrink-0 group py-1 w-16 sm:w-20 h-12 sm:h-14",
      active ? "text-slate-950 font-black" : "text-sky-400 hover:text-sky-300"
    )}
  >
    {active && (
      <motion.div 
        layoutId="bubble"
        className="iridescent-bubble"
        transition={{ 
          type: "spring", 
          bounce: 0.5, 
          stiffness: 120,
          damping: 15,
          mass: 0.8,
          duration: 0.6 
        }}
      />
    )}
    <div className={cn(
      "relative z-10 transition-all duration-500 flex items-center justify-center",
      active ? "scale-100 -translate-y-0.5" : "scale-90"
    )}>
      {React.cloneElement(icon as React.ReactElement, { size: active ? 20 : 18, strokeWidth: active ? 2.5 : 2 })}
    </div>
    <span className={cn(
      "relative z-10 text-[8px] sm:text-[9px] font-black uppercase tracking-wider transition-all duration-500",
      active ? "opacity-100 scale-100 mt-0.5" : "opacity-0 scale-75 h-0 overflow-hidden"
    )}>
      {label}
    </span>
  </motion.a>
);

export default function App() {
  const [currentNumber, setCurrentNumber] = useState('A-24');
  const [waitingList, setWaitingList] = useState(MOCK_WAITING_LIST);
  const [queueStep, setQueueStep] = useState<'select' | 'ticket'>('select');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<typeof PLANS[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState<typeof MOCK_INSTITUTIONS[0] | null>(null);

  const filteredInstitutions = MOCK_INSTITUTIONS.filter(inst => 
    inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inst.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full" id="hero">
      <Navbar onOpenLogin={() => setIsLoginOpen(true)} />
      <Hero />
      <BottomNav onOpenChat={() => setIsChatOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-24 pb-48 space-y-20 md:space-y-32">
        
        {/* 0. Discovery Section (New) */}
        <section id="discovery" className="scroll-mt-32 space-y-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-sky-500 mb-6 bg-sky-500/10 inline-block px-4 py-1.5 rounded-full">Eksplorasi Lokasi</h2>
            <h3 className="text-5xl md:text-6xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">Temukan Lokasi & Layanan Terdekat</h3>
            <p className="text-slate-500 font-bold text-lg md:text-xl leading-relaxed">Pilih instansi tujuan Anda, lihat ketersediaan layanan, dan dapatkan tiket Anda secara instan.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative max-w-3xl mx-auto group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-sky-400 to-indigo-500 rounded-[3rem] blur opacity-10 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative">
              <div className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors">
                <Search size={26} />
              </div>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari Bank, Rumah Sakit, atau Kantor Pemerintah..." 
                className="w-full h-20 pl-20 pr-10 bg-white/60 backdrop-blur-3xl rounded-[2.8rem] shadow-2xl border border-white/80 text-slate-900 font-black focus:ring-12 focus:ring-sky-500/10 focus:outline-none transition-all placeholder:text-slate-400 text-xl tracking-tight"
              />
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence mode="popLayout">
              {filteredInstitutions.map((inst, idx) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  key={inst.id}
                  onClick={() => setSelectedInstitution(inst)}
                  className={cn(
                    "group glass-card overflow-hidden transition-all cursor-pointer border-white/60 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)]",
                    selectedInstitution?.id === inst.id && "ring-4 ring-sky-500/40 border-white"
                  )}
                >
                  <div className="h-64 relative overflow-hidden">
                    <img 
                      src={inst.image} 
                      alt={inst.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-xl px-4 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] text-white border border-white/30 shadow-2xl">
                      {inst.distance}
                    </div>
                    <div className="absolute bottom-6 left-6 right-6">
                       <span className="text-[10px] font-black text-sky-400 uppercase tracking-[0.3em] bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 mb-3 inline-block">
                        {inst.type}
                       </span>
                    </div>
                  </div>
                  <div className="p-8 relative bg-white/10 backdrop-blur-sm flex-grow flex flex-col">
                    <h4 className="text-2xl font-black text-slate-900 mb-4 leading-tight tracking-tight group-hover:text-sky-600 transition-colors uppercase">{inst.name}</h4>
                    <p className="text-xs text-slate-500 font-bold mb-6 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-900/5 flex items-center justify-center shrink-0">
                        <Search size={14} className="text-slate-400" />
                      </div>
                      <span className="line-clamp-1">{inst.address}</span>
                    </p>
                    
                    <div className="flex flex-wrap gap-2.5 mb-8">
                      {inst.services.slice(0, 2).map(service => (
                        <span key={service} className="text-[9px] font-black bg-white/80 text-slate-600 px-3 py-1.5 rounded-xl border border-white shadow-sm uppercase tracking-wider">
                          {service}
                        </span>
                      ))}
                      {inst.services.length > 2 && (
                        <span className="text-[9px] font-black bg-sky-500/10 text-sky-600 px-2 py-1.5 rounded-xl border border-sky-500/20 uppercase tracking-wider">
                          +{inst.services.length - 2}
                        </span>
                      )}
                    </div>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedInstitution(inst);
                        // Scroll to the detail view if needed
                        const el = document.getElementById('institution-detail');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-slate-900/10 group-hover:bg-sky-600 group-hover:shadow-sky-600/30 transition-all active:scale-95 btn-apple mt-auto"
                    >
                      Ambil Antrean
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>


          <AnimatePresence>
            {selectedInstitution && (
              <motion.div
                id="institution-detail"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card p-8 md:p-14 text-slate-900 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] relative overflow-hidden border-white/60 scroll-mt-48"
              >
                <div className="absolute top-8 right-8 cursor-pointer bg-slate-900/5 hover:bg-slate-900/10 p-3 rounded-full transition-colors" onClick={() => setSelectedInstitution(null)}>
                  <X size={24} />
                </div>
                <div className="relative z-10">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-sky-600 mb-8">Pilih Kategori Layanan</h3>
                  <h2 className="text-4xl font-black mb-12 tracking-tight">Apa yang bisa kami bantu di<br /><span className="text-sky-600">{selectedInstitution.name}?</span></h2>
                  
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {selectedInstitution.services.map((service, idx) => (
                      <motion.button
                        key={service}
                        whileHover={{ y: -5, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setSelectedCategory(service as any);
                          setQueueStep('ticket');
                          window.location.hash = '#customer';
                        }}
                        className="p-8 bg-white/40 backdrop-blur-xl rounded-[2.5rem] border border-white/80 text-left hover:bg-white transition-all group shadow-sm hover:shadow-2xl"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-sky-500/10 flex items-center justify-center mb-6 group-hover:bg-sky-500 group-hover:text-white transition-all duration-500 shadow-inner">
                          {idx % 4 === 0 ? <Users size={24} /> : idx % 4 === 1 ? <User size={24} /> : idx % 4 === 2 ? <FastForward size={24} /> : <AlertCircle size={24} />}
                        </div>
                        <p className="font-black text-lg text-slate-900 leading-tight mb-2">{service}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Estimasi 15 Menit</p>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* 0.5. Subscription Section (New) */}
        <section id="pricing" className="scroll-mt-32 space-y-16">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-sky-500 mb-4 px-4 py-1.5 bg-sky-500/10 rounded-full inline-block">Paket Layanan</h2>
            <h3 className="text-5xl md:text-6xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">Investasi Untuk Efisiensi Bisnis Anda</h3>
            <p className="text-slate-500 font-medium text-xl leading-relaxed">Pengelolaan antrean profesional dengan sentuhan teknologi modern.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {PLANS.map((plan) => (
              <GlassCard 
                key={plan.id}
                className={cn(
                  "p-10 flex flex-col items-center relative overflow-hidden group transition-all duration-700",
                  plan.highlight 
                    ? "border-white/80 ring-2 ring-sky-500/20 bg-white/40 shadow-2xl shadow-sky-500/10" 
                    : "border-white/60 shadow-none hover:shadow-2xl"
                )} 
                hover
              >
                {plan.highlight && (
                  <div className="absolute top-0 right-0 bg-sky-500 text-white px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] rounded-bl-3xl">
                    Terpopuler
                  </div>
                )}
                <h4 className={cn(
                  "text-sm font-black uppercase tracking-[0.2em] mb-6",
                  plan.highlight ? "text-sky-600" : "text-slate-400"
                )}>
                  {plan.name}
                </h4>
                <div className="flex items-baseline gap-1 mb-10">
                  <span className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter">{plan.price.replace('.000', 'k')}</span>
                  <span className="text-slate-400 text-sm font-bold">/ bln</span>
                </div>
                <ul className="space-y-6 mb-12 w-full">
                  {plan.features.map((feature) => (
                    <li key={feature} className={cn(
                        "flex items-center gap-4 text-sm font-bold",
                        plan.highlight ? "text-slate-800" : "text-slate-600"
                      )}>
                      <CheckCircle2 size={20} className="text-sky-500 shrink-0" /> {feature}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => {
                    setSelectedPlan(plan);
                    setIsPaymentOpen(true);
                  }}
                  className={cn(
                    "w-full py-5 rounded-[24px] font-black text-xs uppercase tracking-widest btn-apple mt-auto",
                    plan.highlight 
                      ? "bg-sky-600 text-white shadow-2xl shadow-sky-600/30" 
                      : "bg-slate-900 text-white shadow-2xl shadow-slate-900/20"
                  )}
                >
                  Mulai Berlangganan
                </button>
              </GlassCard>
            ))}
          </div>
        </section>


        {/* 2. Monitoring (Public Display) */}
        <section id="monitor" className="scroll-mt-32">
          <div className="text-center md:text-left mb-12">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-sky-500 mb-4 px-4 py-1.5 bg-sky-500/10 rounded-full inline-block">Sistem Monitoring</h2>
            <h3 className="text-4xl font-black text-slate-800 tracking-tight">Display Monitor Publik</h3>
          </div>
          
          <div className="glass-card bg-slate-900 overflow-hidden flex flex-col shadow-2xl relative border-slate-700 min-h-[500px]">
            <div className="flex flex-col lg:flex-row flex-grow">
              {/* Ad/Visual Area */}
              <div className="lg:w-1/2 bg-gradient-to-br from-indigo-950 to-slate-900 flex items-center justify-center p-8 lg:p-14 relative overflow-hidden min-h-[350px]">
                <div className="absolute inset-0 opacity-40">
                   <motion.div 
                     animate={{ rotate: 360 }}
                     transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                     className="w-full h-full bg-blue-500/20 blur-[140px] rounded-full translate-x-20 scale-150"
                   />
                </div>
                <div className="text-center relative z-10">
                  <p className="text-sky-400 text-xs font-black tracking-[0.5em] uppercase mb-6">Informasi & Edukasi</p>
                  <h3 className="text-white font-serif italic text-4xl lg:text-6xl mb-6 leading-tight tracking-tight">Layanan Dengan Hati</h3>
                  <p className="text-white/50 text-sm lg:text-xl max-w-sm mx-auto font-medium leading-relaxed">Nikmati kemudahan bertransaksi digital bersama Smart Queue.</p>
                  <motion.div 
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="mt-12 w-20 h-20 bg-white/10 backdrop-blur-3xl rounded-[2rem] flex items-center justify-center mx-auto border border-white/20 shadow-2xl"
                  >
                    <Play size={32} fill="white" className="ml-1 text-white" />
                  </motion.div>
                </div>
              </div>
              {/* Queue Display */}
              <div className="lg:w-1/2 bg-sky-600 flex flex-col items-center justify-center text-white border-l border-white/10 p-12 lg:p-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full -mr-32 -mt-32"></div>
                <p className="text-xs font-black tracking-[0.4em] text-sky-200 uppercase mb-8 relative z-10">ANTREAN SEKARANG</p>
                <AnimatePresence mode="wait">
                  <motion.h4 
                    key={currentNumber}
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="text-8xl sm:text-9xl lg:text-[14rem] font-black leading-none my-4 tracking-tighter drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative z-10"
                  >
                    {currentNumber}
                  </motion.h4>
                </AnimatePresence>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white/20 backdrop-blur-2xl py-4 px-10 rounded-[2rem] text-2xl lg:text-4xl font-black border border-white/40 mt-12 shadow-2xl relative z-10"
                >
                  LOKET 01
                </motion.div>
              </div>
            </div>
            {/* Running Text */}
            <div className="h-16 bg-white flex items-center overflow-hidden border-t-[8px] border-sky-500 shadow-inner">
              <div className="whitespace-nowrap flex running-text-content">
                <span className="text-slate-900 font-black text-sm px-12 uppercase tracking-[0.2em] leading-none py-2">
                  PENGUMUMAN: Layanan hari ini dibatasi sampai jam 16:00 WIB • Ambil nomor antrean online untuk mendapatkan prioritas layanan • Smart Queue - Revolusi Digital Operasional Bisnis Anda • 
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Area Pelanggan */}
        <section id="customer" className="scroll-mt-32 max-w-lg mx-auto w-full">
          <div className="text-center mb-12">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-sky-500 mb-4 px-4 py-1.5 bg-sky-500/10 rounded-full inline-block">Pelayanan Mandiri</h2>
            <h3 className="text-3xl font-black text-slate-800 tracking-tight">Ambil Nomor Antrean</h3>
          </div>
          
          <AnimatePresence mode="wait">
            {queueStep === 'select' ? (
              <motion.div
                key="select-step"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6"
              >
                <GlassCard className="p-10 text-center bg-white/40 border-white/80" hover shadow="2xl">
                  <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Kategori Layanan</h3>
                  <p className="text-slate-500 font-bold text-sm mb-10 uppercase tracking-widest">Sentuh untuk memproses</p>
                  
                  <div className="grid grid-cols-1 gap-5">
                    {[
                      { id: 'umum', label: 'Layanan Umum', desc: 'Pendaftaran & Administrasi', icon: <Users size={28} />, color: 'hover:bg-sky-500/10' },
                      { id: 'prioritas', label: 'Layanan Prioritas', desc: 'Lansia & Ibu Hamil', icon: <TrendingUp size={28} />, color: 'hover:bg-purple-500/10' },
                      { id: 'konsultasi', label: 'Konsultasi Ahli', desc: 'Tatatap Muka Langsung', icon: <MessageSquare size={28} />, color: 'hover:bg-emerald-500/10' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setSelectedCategory(item.label);
                          setQueueStep('ticket');
                        }}
                        className={cn(
                          "flex items-center gap-6 p-6 rounded-[2rem] bg-white border border-white text-left transition-all hover:scale-[1.02] active:scale-95 group shadow-sm",
                          item.color
                        )}
                      >
                        <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-sky-500 group-hover:text-white transition-all duration-500 shadow-inner">
                          {item.icon}
                        </div>
                        <div>
                          <p className="font-black text-xl text-slate-900 tracking-tight">{item.label}</p>
                          <p className="text-xs text-slate-400 font-black uppercase tracking-widest mt-1">{item.desc}</p>
                        </div>
                        <ChevronRight className="ml-auto text-slate-200 group-hover:text-sky-500 group-hover:translate-x-1 transition-all" size={24} />
                      </button>
                    ))}
                  </div>
                </GlassCard>
                <p className="text-center text-[10px] text-slate-400 font-black uppercase tracking-widest px-8">
                  Pilih sesuai kebutuhan layanan Anda untuk mempercepat proses antrean
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="ticket-step"
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                className="relative"
              >
                <div className="absolute -inset-10 bg-sky-400/20 blur-[120px] rounded-full" />
                <GlassCard className="rounded-[4rem] p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] bg-white/80 border-white relative overflow-hidden" hover>
                  <div className="absolute top-0 left-0 w-full h-3 bg-sky-500" />
                  
                  <div className="text-center mb-12">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6">Nomor Antrean Anda</p>
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h3 className="text-9xl font-black text-slate-900 tracking-tighter mb-4">A-32</h3>
                      <div className="inline-flex items-center gap-3 px-6 py-3 bg-sky-500 text-white rounded-full font-black text-sm shadow-2xl shadow-sky-500/40">
                        <Clock size={18} />
                        <span>ESTIMASI: 15 MENIT</span>
                      </div>
                    </motion.div>
                  </div>
                  <div className="bg-white/40 backdrop-blur-3xl p-8 rounded-[3rem] mb-12 flex flex-col items-center border border-white shadow-xl relative group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[3rem]" />
                    <div className="bg-white p-6 rounded-3xl shadow-2xl shadow-slate-900/10 border border-white relative">
                      <QrCode size={140} className="text-slate-900" />
                    </div>
                    <p className="mt-8 text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] bg-white/50 px-5 py-2 rounded-full border border-white">Scan di Loket</p>
                  </div>

                  <div className="space-y-6 px-4">
                    <div className="flex justify-between items-center bg-white/30 p-4 rounded-2xl border border-white/40">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sisa Antrean</span>
                      <span className="text-2xl font-black text-sky-600">8 Orang</span>
                    </div>
                    <div className="flex justify-between items-center py-4 border-y border-white/20">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kategori</span>
                      <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{selectedCategory}</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => setQueueStep('select')}
                    className="w-full mt-12 py-6 bg-slate-900 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] btn-apple shadow-2xl shadow-slate-900/20"
                  >
                    Batalkan Antrean
                  </button>
                  <div className="h-1.5 w-1/3 bg-slate-900 mx-auto rounded-full mt-10 opacity-20"></div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* 4. Pusat Bantuan (Support Center) */}
        <section id="support" className="scroll-mt-32">
          <div className="text-center md:text-left mb-16">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-sky-500 mb-4 px-4 py-1.5 bg-sky-500/10 rounded-full inline-block">Support Center</h2>
            <h3 className="text-5xl font-black text-slate-900 tracking-tight leading-tight">Solusi di Ujung Jari Anda</h3>
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            {/* FAQ Search */}
            <GlassCard className="lg:col-span-2 p-10 border-white/60 relative overflow-hidden group shadow-none hover:shadow-2xl transition-all duration-700" hover shadow="none">
              <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 blur-[100px] rounded-full -mr-32 -mt-32" />
              <h3 className="text-2xl font-black text-slate-900 mb-10 tracking-tight">Pertanyaan Populer</h3>
              <div className="relative mb-12">
                <input 
                  type="text" 
                  placeholder="Cari kendala atau bantuan..." 
                  className="w-full h-16 bg-white/60 backdrop-blur-xl rounded-[1.5rem] px-14 text-sm font-bold border border-white focus:outline-none focus:ring-4 focus:ring-sky-500/10 transition-all placeholder:text-slate-400 shadow-sm"
                />
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Bagaimana membatalkan antrean?",
                  "Dapatkah mengganti kategori?",
                  "Rata-rata waktu tunggu?",
                  "Apakah tiket akan hangus?"
                ].map((q, i) => (
                  <button 
                    key={i}
                    className="flex items-center justify-between p-6 bg-white/40 hover:bg-white rounded-[2rem] border border-white/80 transition-all group hover:scale-[1.02] shadow-sm active:scale-95"
                  >
                    <span className="text-xs font-black text-slate-700 uppercase tracking-tight text-left pr-4">{q}</span>
                    <div className="shrink-0 w-8 h-8 rounded-full bg-slate-900/5 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
                      <ChevronRight size={16} />
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-12 flex items-center justify-center gap-2 text-sky-600 font-black text-[10px] uppercase tracking-widest cursor-pointer hover:scale-105 transition-transform bg-white/50 border border-white px-8 py-3 rounded-full mx-auto w-fit">
                Eksplorasi Semua Bantuan <ExternalLink size={14} />
              </div>
            </GlassCard>

            {/* AI Assistant Chat Card */}
            <div className="space-y-8">
              <GlassCard className="p-10 bg-slate-900 text-white border-white/20 relative overflow-hidden group shadow-2xl" hover shadow="none">
                <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/20 blur-[80px] rounded-full -mr-24 -mt-24 group-hover:bg-sky-500/40 transition-colors" />
                <div className="w-14 h-14 bg-white/10 rounded-[1.2rem] flex items-center justify-center mb-8 border border-white/30 backdrop-blur-3xl shadow-xl">
                  <MessageSquare size={28} className="text-sky-400" />
                </div>
                <h3 className="text-2xl font-black mb-4 tracking-tight">Liquid AI Support</h3>
                <p className="text-white/60 text-sm mb-10 leading-relaxed font-bold">
                  Butuh bantuan instan? Chat dengan asisten pintar kami untuk solusi dalam hitungan detik secara 24/7.
                </p>
                <button 
                  onClick={() => setIsChatOpen(true)}
                  className="w-full py-5 bg-white text-slate-900 rounded-[1.5rem] font-black text-xs uppercase tracking-widest btn-apple shadow-2xl shadow-sky-500/20"
                >
                  Mulai Chat Sekarang
                </button>
              </GlassCard>

              <GlassCard className="p-10 border-white/60" hover shadow="none">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Butuh Manusia?</h4>
                <div className="flex items-center gap-5 mb-8">
                  <div className="relative">
                    <img 
                      src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80" 
                      className="w-14 h-14 rounded-full object-cover border-4 border-white shadow-xl"
                      alt="Agent"
                    />
                    <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                  </div>
                  <div>
                    <p className="text-lg font-black text-slate-900 tracking-tight">Sarah Wijaya</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Admin Beroperasi</p>
                  </div>
                </div>
                <button className="w-full py-4 bg-white/50 border border-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-sm">
                  Hubungi Admin
                </button>
              </GlassCard>
            </div>
          </div>
        </section>
      </main>

      <AnimatePresence>
        {isChatOpen && (
          <AIChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isLoginOpen && (
          <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isPaymentOpen && selectedPlan && (
          <PaymentModal 
            isOpen={isPaymentOpen} 
            onClose={() => setIsPaymentOpen(false)} 
            plan={selectedPlan}
          />
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="glass-nav py-20 mt-32 border-t border-white/20">
        <div className="max-w-7xl mx-auto px-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12 mb-20">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-11 h-11 bg-slate-900 rounded-[14px] flex items-center justify-center text-white shadow-2xl transition-transform duration-500">
                <Layers size={22} />
              </div>
              <span className="text-2xl font-black tracking-tighter text-slate-900">Smart<span className="text-sky-500">Queue</span></span>
            </div>
            <div className="flex flex-wrap justify-center gap-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              <a href="#" className="hover:text-sky-600 transition-colors">Tentang Kami</a>
              <a href="#" className="hover:text-sky-600 transition-colors">Pusat Bantuan</a>
              <a href="#" className="hover:text-sky-600 transition-colors">Kebijakan Privasi</a>
            </div>
            <div className="flex gap-5">
              <SocialIcon><i className="fab fa-instagram"></i></SocialIcon>
              <SocialIcon><i className="fab fa-twitter"></i></SocialIcon>
              <SocialIcon><i className="fab fa-facebook"></i></SocialIcon>
            </div>
          </div>
          <div className="pt-10 border-t border-slate-900/5">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">
              &copy; 2026 Smart Queue Digital System • Crafting Premium Experience for Modern Business
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- Icons & Helpers ---

const SocialIcon = ({ children }: { children: ReactNode }) => (
  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 hover:bg-sky-600 hover:text-white transition-all cursor-pointer shadow-sm border border-slate-100">
    {children}
  </div>
);

const NotificationIcon = ({ isActive }: { isActive: boolean }) => (
  <div className="relative">
    <motion.div 
      animate={isActive ? { rotate: [0, 10, -10, 0] } : {}}
      transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
    >
      <CheckCircle2 size={18} />
    </motion.div>
  </div>
);

const AIChatModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Halo! Saya asisten Smart Queue. Ada yang bisa saya bantu terkait antrean Anda?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMessage = input.trim();
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);
    
    const response = await getGeminiResponse(userMessage, messages as any);
    
    setMessages([...newMessages, { 
      role: 'assistant', 
      content: response 
    }]);
    setIsTyping(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="glass-card w-full max-w-md rounded-[3rem] overflow-hidden flex flex-col h-[650px] border-white/60"
      >
        <div className="p-8 bg-slate-900/10 backdrop-blur-xl flex justify-between items-center shrink-0 border-b border-white/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-900 rounded-[14px] flex items-center justify-center text-white">
              <MessageSquare size={22} />
            </div>
            <div>
              <p className="font-black text-sm tracking-tight text-slate-900 px-3 py-1 bg-white/50 rounded-full inline-block">AI SUPPORT</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Liquid Assistant</p>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="bg-slate-900/5 hover:bg-slate-900/10 p-3 rounded-2xl transition-all">
            <X size={20} className="text-slate-900" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-8 space-y-6 custom-scrollbar bg-white/10">
          {messages.map((msg, i) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={i}
              className={cn(
                "flex flex-col max-w-[85%]",
                msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
              )}
            >
              <div className={cn(
                "p-5 rounded-[2rem] text-sm font-bold shadow-sm backdrop-blur-xl",
                msg.role === 'user' 
                  ? "bg-slate-900 text-white rounded-br-none" 
                  : "bg-white/60 text-slate-800 border border-white/80 rounded-bl-none shadow-xl"
              )}>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="p-8 bg-white/30 backdrop-blur-2xl border-t border-white/20">
          <div className="relative flex items-center gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Apa yang ingin Anda tanyakan?"
              className="w-full h-14 bg-white/60 backdrop-blur-md rounded-[1.5rem] px-6 text-sm font-bold border border-white focus:outline-none focus:ring-4 focus:ring-sky-500/10 transition-all placeholder:text-slate-400"
            />
            <button 
              onClick={handleSend}
              className="bg-slate-900 text-white w-14 h-14 rounded-[1.5rem] flex items-center justify-center shrink-0 shadow-2xl shadow-slate-900/20 active:scale-90 transition-all"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const LoginModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [view, setView] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mocking an API call
    setTimeout(() => {
      setIsLoading(false);
      onClose();
      alert(view === 'login' ? 'Berhasil Masuk!' : 'Pendaftaran Berhasil!');
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-white/60 backdrop-blur-xl"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="w-full max-w-sm glass-card p-12 flex flex-col items-center text-center relative border-white/80 rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] bg-white/40"
      >
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-3 bg-slate-900/5 hover:bg-slate-900/10 rounded-full text-slate-900 transition-all active:scale-90"
        >
          <X size={20} />
        </button>

        <div className="w-16 h-16 bg-slate-900 rounded-[1.2rem] flex items-center justify-center text-white mb-8 shadow-2xl">
          <User size={32} />
        </div>

        <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">
          {view === 'login' ? 'Masuk' : 'Daftar'}
        </h2>
        <p className="text-slate-500 font-bold text-sm mb-12 uppercase tracking-widest">Akses Akun Smart Queue</p>

        <form onSubmit={handleSubmit} className="w-full space-y-5">
            <div className="relative">
              <input 
                required
                type="text" 
                placeholder="Email atau No. Handphone" 
                className="w-full h-16 px-6 bg-white/60 backdrop-blur-md rounded-[1.2rem] border border-white focus:outline-none focus:ring-4 focus:ring-sky-500/10 transition-all font-bold text-slate-900 shadow-sm placeholder:text-slate-400"
              />
            </div>
            
            <div className="relative">
              <input 
                required
                type={showPassword ? "text" : "password"}
                placeholder="Password" 
                className="w-full h-16 px-6 bg-white/60 backdrop-blur-md rounded-[1.2rem] border border-white focus:outline-none focus:ring-4 focus:ring-sky-500/10 transition-all font-bold text-slate-900 shadow-sm placeholder:text-slate-400"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {view === 'register' && (
              <div className="relative">
                <input 
                  required
                  type="password"
                  placeholder="Konfirmasi Password" 
                  className="w-full h-16 px-6 bg-white/60 backdrop-blur-md rounded-[1.2rem] border border-white focus:outline-none focus:ring-4 focus:ring-sky-500/10 transition-all font-bold text-slate-900 shadow-sm placeholder:text-slate-400"
                />
              </div>
            )}

            <div className="text-right">
                <button type="button" className="text-sky-600 font-black text-[11px] uppercase tracking-widest hover:underline px-2">
                    Lupa password?
                </button>
            </div>

           <button 
            disabled={isLoading}
            className={cn(
              "w-full h-16 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-slate-900/20 active:scale-95 transition-all mt-6 flex items-center justify-center",
              isLoading && "opacity-70 cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full"
              />
            ) : (
                view === 'login' ? 'MULAI SEKARANG' : 'DAFTAR SEKARANG'
            )}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-900/5 w-full">
            <button 
                onClick={() => setView(view === 'login' ? 'register' : 'login')}
                className="text-slate-500 font-bold text-xs uppercase tracking-widest hover:text-sky-600 transition-colors"
            >
                {view === 'login' ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Masuk'}
            </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const PaymentModal = ({ isOpen, onClose, plan }: { isOpen: boolean, onClose: () => void, plan: typeof PLANS[0] }) => {
  const [step, setStep] = useState<'checkout' | 'processing' | 'success'>('checkout');
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);

  const methods = [
    { id: 'gopay', name: 'GoPay', icon: <Smartphone size={24} /> },
    { id: 'ovo', name: 'OVO', icon: <Smartphone size={24} /> },
    { id: 'va', name: 'Virtual Account', icon: <Zap size={24} /> },
    { id: 'card', name: 'Kartu Kredit', icon: <CreditCard size={24} /> },
  ];

  const handlePayment = () => {
    if (!paymentMethod) return;
    setStep('processing');
    setTimeout(() => {
      setStep('success');
    }, 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-xl"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 30, opacity: 0 }}
        className="w-full max-w-3xl glass-card overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] bg-white/60 border-white/80 rounded-[2.5rem]"
      >
        <div className="flex flex-col md:flex-row min-h-[500px]">
          {/* Sidebar / Plan Info */}
          <div className={cn(
            "md:w-2/5 p-12 flex flex-col justify-between relative overflow-hidden transition-colors duration-1000 shrink-0",
            step === 'success' ? "bg-emerald-600 text-white" : "bg-slate-900 text-white"
          )}>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-16">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 backdrop-blur-3xl">
                  <Layers size={24} />
                </div>
                <span className="font-black tracking-tighter text-2xl uppercase">Smart<span className="text-sky-400">Queue</span></span>
              </div>

              <div className="mb-12">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-3">Paket Konfirmasi</p>
                <h3 className="text-4xl font-black tracking-tighter leading-none">{plan.name}</h3>
              </div>

              <div className="space-y-6">
                {plan.features.map(f => (
                  <div key={f} className="flex items-center gap-4 text-sm font-bold text-white/70">
                    <CheckCircle2 size={20} className={cn(step === 'success' ? "text-white" : "text-sky-400")} /> {f}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 pt-12 border-t border-white/10 mt-12">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-2">Total Penagihan</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black tracking-tighter">{plan.price}</span>
                <span className="text-white/40 text-sm font-bold">/ bln</span>
              </div>
              <p className="text-[9px] font-bold text-white/30 mt-3">*Harga sudah termasuk PPN 11%</p>
            </div>

            <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/30 blur-[120px] rounded-full -mr-40 -mt-40" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/20 blur-[120px] rounded-full -ml-40 -mb-40" />
          </div>

          {/* Main Content Area */}
          <div className="md:w-3/5 p-12 bg-white/50 relative flex flex-col">
            {step === 'checkout' && (
              <button 
                onClick={onClose}
                className="absolute top-10 right-10 p-3 bg-slate-900/5 hover:bg-slate-900/10 rounded-full transition-all active:scale-90"
              >
                <X size={24} className="text-slate-900" />
              </button>
            )}

            <AnimatePresence mode="wait">
              {step === 'checkout' && (
                <motion.div
                  key="checkout"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-full flex flex-col"
                >
                  <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Metode Pembayaran</h3>
                  <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-12">Pilih salah satu akses Anda untuk memproses</p>

                  <div className="grid grid-cols-1 gap-5 flex-grow">
                    {methods.map(m => (
                      <button
                        key={m.id}
                        onClick={() => setPaymentMethod(m.id)}
                        className={cn(
                          "w-full p-6 rounded-[2rem] border-2 flex items-center gap-6 transition-all group overflow-hidden relative",
                          paymentMethod === m.id 
                            ? "bg-white border-sky-500 shadow-2xl ring-8 ring-sky-500/5 scale-[1.02]" 
                            : "bg-white/40 border-white hover:bg-white hover:border-slate-200"
                        )}
                      >
                        <div className={cn(
                          "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-700 shadow-inner",
                          paymentMethod === m.id ? "bg-sky-500 text-white" : "bg-slate-50 text-slate-400"
                        )}>
                          {React.cloneElement(m.icon as React.ReactElement, { className: paymentMethod === m.id ? "text-white" : "" })}
                        </div>
                        <span className={cn("font-black text-lg tracking-tight uppercase", paymentMethod === m.id ? "text-slate-900" : "text-slate-400")}>
                          {m.name}
                        </span>
                        {paymentMethod === m.id && (
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-auto w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white shadow-lg"
                          >
                            <CheckCircle2 size={16} />
                          </motion.div>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="mt-12 p-6 bg-slate-900/5 rounded-[2rem] border border-white flex items-center gap-4">
                    <ShieldCheck size={24} className="text-sky-500 shrink-0" />
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">
                      Transaksi Anda dienkripsi dengan standar keamanan 256-bit SSL untuk perlindungan maksimal.
                    </p>
                  </div>

                  <div className="flex flex-col gap-4 mt-8">
                    <button 
                      disabled={!paymentMethod}
                      onClick={handlePayment}
                      className={cn(
                        "w-full py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-2xl",
                        paymentMethod 
                          ? "bg-slate-900 text-white shadow-slate-900/30 active:scale-95 btn-apple" 
                          : "bg-slate-100 text-slate-300 cursor-not-allowed"
                      )}
                    >
                      Proses Pembayaran <ArrowRight size={20} />
                    </button>
                    
                    <button 
                      onClick={onClose}
                      className="w-full py-4 text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] hover:text-slate-900 transition-colors"
                    >
                      Kembali ke Beranda
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 'processing' && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  className="h-full flex flex-col items-center justify-center text-center py-20"
                >
                  <div className="relative w-40 h-40 mb-12">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-[6px] border-slate-100 border-t-sky-500 rounded-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                         <ShieldCheck size={64} className="text-sky-500" />
                      </motion.div>
                    </div>
                  </div>
                  <h3 className="text-4xl font-black text-slate-900 mb-6 tracking-tight uppercase">Mengamankan Transaksi</h3>
                  <p className="text-slate-500 font-bold text-lg max-w-sm leading-relaxed">Kami sedang mengomunikasikan detail pembayaran Anda dengan gerbang pembayaran yang aman...</p>
                </motion.div>
              )}

              {step === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center py-10"
                >
                  <motion.div 
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                    className="w-32 h-32 bg-emerald-500 text-white rounded-[2.5rem] flex items-center justify-center mb-12 shadow-[0_30px_60px_rgba(16,185,129,0.3)] rotate-12"
                  >
                    <CheckCircle2 size={64} />
                  </motion.div>
                  <h3 className="text-5xl font-black text-slate-900 mb-6 tracking-tighter uppercase leading-none">Pembayaran<br />Berhasil!</h3>
                  <p className="text-slate-500 font-bold text-lg mb-14 max-w-sm leading-relaxed">
                    Selamat! Akun bisnis Anda telah aktif dengan paket <span className="text-sky-600 font-black uppercase">{plan.name}</span>. Nikmati kendali penuh sekarang.
                  </p>
                  
                  <div className="flex flex-col gap-4 w-full max-w-sm">
                    <button 
                      onClick={onClose}
                      className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-slate-900/30 active:scale-95 btn-apple"
                    >
                      Masuk ke Dashboard Bisnis
                    </button>
                    <button 
                      onClick={onClose}
                      className="w-full py-4 text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] hover:text-slate-900 transition-colors"
                    >
                      Kembali ke Beranda
                    </button>
                  </div>
                  
                  <div className="mt-12 pt-10 border-t border-slate-200/50 w-full flex justify-center gap-12">
                    <div className="text-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Invoice</p>
                      <p className="text-sm font-black text-slate-900 tracking-tight">INV-SQ-0092</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Metode</p>
                      <p className="text-sm font-black text-sky-600 tracking-tight uppercase">{paymentMethod}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Waktu (WIB)</p>
                      <p className="text-sm font-black text-slate-900 tracking-tight">Baru Saja</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
