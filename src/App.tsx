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
  EyeOff,
  PlusCircle,
  Briefcase,
  MapPin
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
    image: 'https://rricoid-assets.obs.ap-southeast-4.myhuaweicloud.com/berita/Sungailiat/o/1713792346267-5FB4CD23-E465-465E-B1C6-D017C593E3B3/wabadwvkh8hii8f.jpeg'
  },
  { 
    id: 'inst-1', 
    name: 'RSUD Depati Hamzah', 
    type: 'Kesehatan',
    address: 'Jl. Soekarno Hatta, Pangkalpinang',
    distance: '1.2 km',
    services: ['UGD', 'Poli Spesialis', 'Radiologi', 'Farmasi'],
    image: 'https://medicastore.com/images/faskes/RUMAH-SAKIT-UMUM-DAERAH-DEPATI-HAMZAH-PANGKALPINANG-MEDICASTORE.jpg'
  },
  { 
    id: 'inst-transmart', 
    name: 'Transmart Pangkalpinang', 
    type: 'Retail',
    address: 'Jl. Jend. Sudirman, Pangkalpinang',
    distance: '2.1 km',
    services: ['Belanja', 'Trans Studio Mini', 'Food Court'],
    image: 'https://asset.tribunnews.com/8TSdcDL9fnsnIsu_qupdPbE7MLo=/1200x675/filters:upscale():quality(30):format(webp):focal(0.5x0.5:0.5x0.5)/bangka/foto/bank/originals/20230619-Suasana-di-loby-depan-Transmart-Pangkalpinang-Senin-1962023.jpg'
  },
  { 
    id: 'inst-2', 
    name: 'BCA Cabang Pangkalpinang', 
    type: 'Perbankan',
    address: 'Jl. Jendral Sudirman No. 15, Pangkalpinang',
    distance: '0.8 km',
    services: ['Customer Service', 'Teller', 'Kredit Pembukaan'],
    image: 'https://asset.tribunnews.com/5V-FFtjl8VW8nEFIjMD1sqDU2CE=/1200x675/filters:upscale():quality(30):format(webp):focal(0.5x0.5:0.5x0.5)/bangka/foto/bank/originals/situasi-bank-bca-cabang-sungailiat-terlihat-lengang.jpg'
  },
  { 
    id: 'inst-mcd', 
    name: 'McDonald\'s Pangkalpinang', 
    type: 'Kuliner',
    address: 'Jl. Jendral Sudirman, Pangkalpinang',
    distance: '1.5 km',
    services: ['Dine In', 'Drive Thru', 'McCafe'],
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=800&q=80'
  },
  { 
    id: 'inst-3', 
    name: 'Disdukcapil Kota Pangkalpinang', 
    type: 'Pemerintahan',
    address: 'Jl. Rasakunda No. 1, Pangkalpinang',
    distance: '3.2 km',
    services: ['KTP-el', 'Akta Kelahiran', 'Kartu Keluarga'],
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'
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

const Navbar = ({ isLoggedIn, onOpenLogin, onLogout }: { isLoggedIn: boolean, onOpenLogin: () => void, onLogout: () => void }) => {
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
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => {
          const el = document.getElementById('hero');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}>
          <div className="w-11 h-11 bg-slate-900 rounded-[14px] flex items-center justify-center text-white shadow-2xl shadow-slate-900/20">
            <Layers size={24} />
          </div>
          <span className="text-2xl font-black tracking-tighter">
            Smart<span className="text-sky-500">Queue</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <div className="flex items-center gap-3 bg-white/40 backdrop-blur-xl border border-white/60 pl-4 pr-1.5 py-1.5 rounded-full shadow-lg">
              <span className="text-[10px] font-black uppercase text-slate-700 tracking-wider">User Aktif</span>
              <button 
                onClick={onLogout}
                className="px-4 py-1.5 bg-rose-500 hover:bg-rose-600 active:scale-95 text-white rounded-full font-black text-[9px] uppercase tracking-widest transition-all shadow-sm"
              >
                Logout
              </button>
            </div>
          ) : (
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
          )}
        </div>
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
          Hadirkan pengalaman tunggu yang <span className="text-slate-900">elegan & bebas stres</span>.
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
  const [initialChatQuery, setInitialChatQuery] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubscribedWarningOpen, setIsSubscribedWarningOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<typeof PLANS[0] | null>(null);
  const [pendingPlanAfterLogin, setPendingPlanAfterLogin] = useState<typeof PLANS[0] | null>(null);
  const [institutions, setInstitutions] = useState(MOCK_INSTITUTIONS);
  const [isAddUMKMOpen, setIsAddUMKMOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState<typeof MOCK_INSTITUTIONS[0] | null>(null);

  const filteredInstitutions = institutions.filter(inst => 
    inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inst.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full" id="hero">
      <Navbar 
        isLoggedIn={isLoggedIn} 
        onOpenLogin={() => setIsLoginOpen(true)} 
        onLogout={() => {
          setIsLoggedIn(false);
          setIsSubscribed(false);
          setPendingPlanAfterLogin(null);
        }} 
      />
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

          {/* Section: Perusahaan Tambah UMKM */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative max-w-3xl mx-auto"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-tr from-sky-400 to-emerald-400 rounded-[2rem] opacity-20 blur-xl"></div>
            <div className="relative bg-white/50 backdrop-blur-3xl border border-white/80 p-8 sm:p-10 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-8 shadow-xl">
              <div className="flex items-start gap-5 text-left">
                <div className="p-4 bg-sky-500/10 text-sky-600 rounded-2xl shrink-0">
                  <Briefcase size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-900 tracking-tight leading-snug">Kemitraan UMKM & Perusahaan</h4>
                  <p className="text-xs text-slate-500 font-bold mt-2 leading-relaxed">Punya UMKM atau bisnis lokal? Daftarkan usaha Anda sekarang ke platform Smart Queue untuk menghadirkan sistem antrean terintegrasi premium.</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  if (isLoggedIn) {
                    setIsAddUMKMOpen(true);
                  } else {
                    alert('Silakan login terlebih dahulu untuk mendaftarkan UMKM Anda.');
                    setIsLoginOpen(true);
                  }
                }}
                className="w-full md:w-auto px-8 py-4 bg-slate-900 hover:bg-sky-600 font-black text-xs uppercase tracking-widest text-white rounded-2xl shadow-xl transition-all active:scale-95 shrink-0 btn-apple flex items-center justify-center gap-3"
              >
                <PlusCircle size={16} />
                Tambah UMKM
              </button>
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
                        if (!isSubscribed) {
                          setIsSubscribedWarningOpen(true);
                          return;
                        }
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
                          if (!isSubscribed) {
                            setIsSubscribedWarningOpen(true);
                            return;
                          }
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
                    if (isLoggedIn) {
                      setSelectedPlan(plan);
                      setIsPaymentOpen(true);
                    } else {
                      setPendingPlanAfterLogin(plan);
                      setIsLoginOpen(true);
                    }
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
                  <p className="text-sky-400 text-xs font-black tracking-[0.5em] uppercase mb-6">Informasi & Hiburan</p>
                  <h3 className="text-white font-serif italic text-4xl lg:text-6xl mb-6 leading-tight tracking-tight uppercase">Hiburan untuk Menunggu Antrean</h3>
                  <p className="text-white/50 text-sm lg:text-xl max-w-sm mx-auto font-medium leading-relaxed">Nikmati konten hiburan pilihan selagi menunggu giliran Anda.</p>
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsVideoOpen(true)}
                    className="mt-12 w-20 h-20 bg-white/10 backdrop-blur-3xl rounded-[2rem] flex items-center justify-center mx-auto border border-white/20 shadow-2xl cursor-pointer hover:bg-sky-500 transition-colors group"
                  >
                    <Play size={32} fill="white" className="ml-1 text-white group-hover:fill-white" />
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
                          if (!isSubscribed) {
                            setIsSubscribedWarningOpen(true);
                            return;
                          }
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
                    onClick={() => {
                      setInitialChatQuery(q);
                      setIsChatOpen(true);
                    }}
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
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=crop&w=100&h=100&q=80" 
                      className="w-14 h-14 rounded-full object-cover border-4 border-white shadow-xl"
                      alt="Agent"
                    />
                    <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                  </div>
                  <div>
                    <p className="text-lg font-black text-slate-900 tracking-tight">Tomi Indra Saputra</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Admin Beroperasi</p>
                  </div>
                </div>
                <a 
                  href="https://wa.me/6285783241598" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-white/50 border border-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-sm flex items-center justify-center"
                >
                  Hubungi Admin
                </a>
              </GlassCard>
            </div>
          </div>
        </section>
      </main>

      <AnimatePresence>
        {isChatOpen && (
          <AIChatModal 
            isOpen={isChatOpen} 
            onClose={() => {
              setIsChatOpen(false);
              setInitialChatQuery(null);
            }} 
            initialMessage={initialChatQuery || undefined}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isLoginOpen && (
          <LoginModal 
            isOpen={isLoginOpen} 
            onClose={() => {
              setIsLoginOpen(false);
              setPendingPlanAfterLogin(null);
            }} 
            onLoginSuccess={() => {
              setIsLoggedIn(true);
              if (pendingPlanAfterLogin) {
                setSelectedPlan(pendingPlanAfterLogin);
                setIsPaymentOpen(true);
                setPendingPlanAfterLogin(null);
              }
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isVideoOpen && (
          <VideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isPaymentOpen && selectedPlan && (
          <PaymentModal 
            isOpen={isPaymentOpen} 
            onClose={() => setIsPaymentOpen(false)} 
            onPaymentSuccess={() => setIsSubscribed(true)}
            plan={selectedPlan}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSubscribedWarningOpen && (
          <SubscriptionWarningModal
            isOpen={isSubscribedWarningOpen}
            onClose={() => setIsSubscribedWarningOpen(false)}
            isLoggedIn={isLoggedIn}
            onOpenLogin={() => setIsLoginOpen(true)}
            onGoToPricing={() => {
              const el = document.getElementById('pricing');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAddUMKMOpen && (
          <AddUMKMModal
            isOpen={isAddUMKMOpen}
            onClose={() => setIsAddUMKMOpen(false)}
            onAddSuccess={(newUMKM) => {
              setInstitutions([newUMKM, ...institutions]);
              // Option text: Successfully added
              alert(`Berhasil mendaftarkan ${newUMKM.name}!`);
            }}
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

const AIChatModal = ({ isOpen, onClose, initialMessage }: { isOpen: boolean, onClose: () => void, initialMessage?: string }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Halo! Saya asisten Smart Queue. Ada yang bisa saya bantu terkait antrean Anda?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (initialMessage && messages.length === 1) {
      handleInitialQuery(initialMessage);
    }
  }, [initialMessage]);

  const handleInitialQuery = async (query: string) => {
    const userMessage = query;
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setIsTyping(true);
    
    const response = await getGeminiResponse(userMessage, messages as any);
    
    setMessages([...newMessages, { 
      role: 'assistant', 
      content: response 
    }]);
    setIsTyping(false);
  };
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

const SubscriptionWarningModal = ({ 
  isOpen, 
  onClose, 
  isLoggedIn, 
  onOpenLogin, 
  onGoToPricing 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  isLoggedIn: boolean, 
  onOpenLogin: () => void, 
  onGoToPricing: () => void 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-xl flex justify-center items-center p-4 sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="w-full max-w-sm glass-card p-8 sm:p-10 flex flex-col items-center text-center relative border-white/80 rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] bg-white/70"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-slate-900/5 hover:bg-slate-900/10 rounded-full text-slate-900 transition-all active:scale-90"
        >
          <X size={18} />
        </button>

        <div className="w-16 h-16 bg-amber-500 rounded-3xl flex items-center justify-center text-white mb-6 shadow-xl shadow-amber-500/20">
          <AlertCircle size={32} />
        </div>

        <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
          Berlangganan Diperlukan
        </h3>
        
        <p className="text-slate-500 font-bold text-sm leading-relaxed mb-8">
          Fitur pengambilan nomor antrean hanya tersedia bagi pengguna yang berlangganan paket premium aktif. Hadirkan kepuasan pelanggan terbaik sekarang.
        </p>

        <div className="flex flex-col gap-3 w-full">
          {isLoggedIn ? (
            <button
              onClick={() => {
                onClose();
                onGoToPricing();
              }}
              className="w-full py-4 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-sky-600/20 active:scale-95 transition-all"
            >
              Lihat Paket Berlangganan
            </button>
          ) : (
            <button
              onClick={() => {
                onClose();
                onOpenLogin();
              }}
              className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-slate-900/20 active:scale-95 transition-all"
            >
              Login & Berlangganan
            </button>
          )}
          
          <button
            onClick={onClose}
            className="w-full py-3 text-slate-400 hover:text-slate-600 font-black text-[10px] uppercase tracking-widest transition-colors"
          >
            Nanti Saja
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const AddUMKMModal = ({ isOpen, onClose, onAddSuccess }: { isOpen: boolean, onClose: () => void, onAddSuccess: (newUMKM: any) => void }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('Kuliner');
  const [address, setAddress] = useState('');
  const [servicesInput, setServicesInput] = useState('');
  const [distance, setDistance] = useState('0.1 km');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const DEFAULT_IMAGES: Record<string, string> = {
    'Kuliner': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    'Retail': 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80',
    'Kesehatan': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    'Perbankan': 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?auto=format&fit=crop&w=800&q=80',
    'Jasa': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    'Lainnya': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      
      const parsedServices = servicesInput
        ? servicesInput.split(',').map(s => s.trim()).filter(Boolean)
        : ['Layanan Umum'];

      const finalImage = imageUrl.trim() || DEFAULT_IMAGES[type] || DEFAULT_IMAGES['Lainnya'];

      const newUMKM = {
        id: `inst-custom-${Date.now()}`,
        name,
        type,
        address,
        distance: distance || '0.1 km',
        services: parsedServices,
        image: finalImage
      };

      onAddSuccess(newUMKM);
      onClose();
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] overflow-y-auto bg-slate-900/60 backdrop-blur-xl flex justify-center items-start sm:items-center p-4 sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="w-full max-w-lg glass-card p-8 sm:p-10 flex flex-col relative border-white/80 rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] bg-white/70 my-auto shrink-0"
      >
        <button 
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-slate-900/5 hover:bg-slate-900/10 rounded-full text-slate-900 transition-all active:scale-90"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-4 mb-6 text-left">
          <div className="w-12 h-12 bg-sky-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-sky-500/20 shrink-0">
            <Briefcase size={22} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Daftarkan UMKM Baru</h3>
            <p className="text-xs text-slate-500 font-bold mt-0.5">Integrasikan bisnis Anda ke sistem Smart Queue</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-4 text-left">
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-700 tracking-wider mb-2">Nama Bisnis / UMKM</label>
            <input 
              required
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Kopi Cantik Pangkalpinang" 
              className="w-full h-12 px-5 bg-white/60 backdrop-blur-md rounded-[1rem] border border-white focus:outline-none focus:ring-4 focus:ring-sky-500/10 transition-all font-bold text-slate-900 shadow-sm placeholder:text-slate-400 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-700 tracking-wider mb-2">Kategori Bisnis</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full h-12 px-5 bg-white/60 backdrop-blur-md rounded-[1rem] border border-white focus:outline-none focus:ring-4 focus:ring-sky-500/10 transition-all font-bold text-slate-900 shadow-sm text-sm"
              >
                <option value="Kuliner">Kuliner</option>
                <option value="Kesehatan">Kesehatan</option>
                <option value="Retail">Retail</option>
                <option value="Perbankan">Perbankan</option>
                <option value="Jasa">Jasa Layanan</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-slate-700 tracking-wider mb-2">Jarak Estimasi</label>
              <input 
                required
                type="text" 
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="Contoh: 0.5 km" 
                className="w-full h-12 px-5 bg-white/60 backdrop-blur-md rounded-[1rem] border border-white focus:outline-none focus:ring-4 focus:ring-sky-500/10 transition-all font-bold text-slate-900 shadow-sm placeholder:text-slate-400 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-700 tracking-wider mb-2">Alamat Lengkap</label>
            <textarea 
              required
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Contoh: Jl. Sudirman No 12, Pangkalpinang" 
              className="w-full py-3 px-5 bg-white/60 backdrop-blur-md rounded-[1rem] border border-white focus:outline-none focus:ring-4 focus:ring-sky-500/10 transition-all font-bold text-slate-900 shadow-sm placeholder:text-slate-400 text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-700 tracking-wider mb-2">Layanan yang Ditawarkan</label>
            <input 
              required
              type="text" 
              value={servicesInput}
              onChange={(e) => setServicesInput(e.target.value)}
              placeholder="Pisahkan dengan koma (contoh: Dine In, Take Away, Delivery)" 
              className="w-full h-12 px-5 bg-white/60 backdrop-blur-md rounded-[1rem] border border-white focus:outline-none focus:ring-4 focus:ring-sky-500/10 transition-all font-bold text-slate-900 shadow-sm placeholder:text-slate-400 text-sm"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-700 tracking-wider mb-2">URL Foto UMKM (Opsional)</label>
            <input 
              type="url" 
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/foto.jpg" 
              className="w-full h-12 px-5 bg-white/60 backdrop-blur-md rounded-[1rem] border border-white focus:outline-none focus:ring-4 focus:ring-sky-500/10 transition-all font-bold text-slate-900 shadow-sm placeholder:text-slate-400 text-sm"
            />
            <span className="text-[9px] text-slate-400 font-bold block mt-1">
              Biarkan kosong untuk menggunakan foto ilustrasi premium otomatis dari kategori produk Anda.
            </span>
          </div>

          <button 
            disabled={isLoading}
            type="submit"
            className="w-full h-14 bg-slate-900 text-white rounded-[1.2rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-slate-900/20 active:scale-95 transition-all mt-6 flex items-center justify-center border border-white/20"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Daftarkan Bisnis Sekarang'
            )}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

const LoginModal = ({ isOpen, onClose, onLoginSuccess }: { isOpen: boolean, onClose: () => void, onLoginSuccess: () => void }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [view, setView] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mocking an API call
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
      onClose();
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] overflow-y-auto bg-white/60 backdrop-blur-xl flex justify-center items-start sm:items-center p-4 sm:p-6 md:p-10"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="w-full max-w-sm glass-card p-8 sm:p-12 flex flex-col items-center text-center relative border-white/80 rounded-[2.5rem] sm:rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] bg-white/40 my-auto shrink-0"
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

        <form onSubmit={handleSubmit} className="w-full space-y-4">
            {view === 'register' && (
              <>
                <div className="relative">
                  <input 
                    required
                    type="text" 
                    placeholder="Nama Lengkap" 
                    className="w-full h-14 px-6 bg-white/60 backdrop-blur-md rounded-[1.2rem] border border-white focus:outline-none focus:ring-4 focus:ring-sky-500/10 transition-all font-bold text-slate-900 shadow-sm placeholder:text-slate-400 text-sm"
                  />
                </div>

                <div className="relative">
                  <input 
                    required
                    type="tel" 
                    placeholder="No. WhatsApp (WA)" 
                    className="w-full h-14 px-6 bg-white/60 backdrop-blur-md rounded-[1.2rem] border border-white focus:outline-none focus:ring-4 focus:ring-sky-500/10 transition-all font-bold text-slate-900 shadow-sm placeholder:text-slate-400 text-sm"
                  />
                </div>

                <div className="relative">
                  <textarea 
                    required
                    rows={2}
                    placeholder="Alamat Lengkap" 
                    className="w-full py-4 px-6 bg-white/60 backdrop-blur-md rounded-[1.2rem] border border-white focus:outline-none focus:ring-4 focus:ring-sky-500/10 transition-all font-bold text-slate-900 shadow-sm placeholder:text-slate-400 text-sm resize-none"
                  />
                </div>
              </>
            )}

            <div className="relative">
              <input 
                required
                type="text" 
                placeholder={view === 'login' ? "Email atau No. Handphone" : "Email atau Username"} 
                className="w-full h-14 px-6 bg-white/60 backdrop-blur-md rounded-[1.2rem] border border-white focus:outline-none focus:ring-4 focus:ring-sky-500/10 transition-all font-bold text-slate-900 shadow-sm placeholder:text-slate-400 text-sm"
              />
            </div>
            
            <div className="relative">
              <input 
                required
                type={showPassword ? "text" : "password"}
                placeholder="Password" 
                className="w-full h-14 px-6 bg-white/60 backdrop-blur-md rounded-[1.2rem] border border-white focus:outline-none focus:ring-4 focus:ring-sky-500/10 transition-all font-bold text-slate-900 shadow-sm placeholder:text-slate-400 text-sm"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {view === 'register' && (
              <div className="relative">
                <input 
                  required
                  type="password"
                  placeholder="Konfirmasi Password" 
                  className="w-full h-14 px-6 bg-white/60 backdrop-blur-md rounded-[1.2rem] border border-white focus:outline-none focus:ring-4 focus:ring-sky-500/10 transition-all font-bold text-slate-900 shadow-sm placeholder:text-slate-400 text-sm"
                />
              </div>
            )}

            {view === 'login' && (
              <div className="text-right">
                <button type="button" className="text-sky-600 font-black text-[11px] uppercase tracking-widest hover:underline px-2">
                  Lupa password?
                </button>
              </div>
            )}

           <button 
            disabled={isLoading}
            className={cn(
              "w-full h-14 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-slate-900/20 active:scale-95 transition-all mt-4 flex items-center justify-center",
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
                view === 'login' ? 'LOGIN' : 'DAFTAR'
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

const PaymentModal = ({ isOpen, onClose, plan, onPaymentSuccess }: { isOpen: boolean, onClose: () => void, plan: typeof PLANS[0], onPaymentSuccess: () => void }) => {
  const [step, setStep] = useState<'checkout' | 'qris_pay' | 'midtrans_snap' | 'processing' | 'success'>('checkout');
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [qrisTimer, setQrisTimer] = useState(900); // 15 mins in seconds
  const [midtransSubStep, setMidtransSubStep] = useState<'select' | 'gopay' | 'va' | 'card'>('select');
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardError, setCardError] = useState('');

  const [orderId] = useState(() => `SQ-${Math.floor(100000 + Math.random() * 900000)}`);

  // QRIS Countdown Timer
  useEffect(() => {
    let interval: any;
    if (step === 'qris_pay') {
      interval = setInterval(() => {
        setQrisTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyVa = (vaNumber: string) => {
    navigator.clipboard.writeText(vaNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const methods = [
    { id: 'qris', name: 'QRIS (GoPay/Shopee/Dana)', icon: <QrCode size={24} /> },
    { id: 'midtrans', name: 'Midtrans Payment Gateway', icon: <Layers size={24} /> },
    { id: 'va', name: 'Virtual Account', icon: <Zap size={24} /> },
    { id: 'card', name: 'Kartu Kredit', icon: <CreditCard size={24} /> },
  ];

  const handlePayment = () => {
    if (!paymentMethod) return;
    if (paymentMethod === 'qris') {
      setQrisTimer(900);
      setStep('qris_pay');
    } else if (paymentMethod === 'midtrans') {
      setMidtransSubStep('select');
      setStep('midtrans_snap');
    } else {
      setStep('processing');
      setTimeout(() => {
        setStep('success');
        onPaymentSuccess();
      }, 3000);
    }
  };

  const triggerMockSuccess = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      onPaymentSuccess();
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] overflow-y-auto bg-slate-900/65 backdrop-blur-xl flex justify-center items-start sm:items-center p-4 sm:p-6 md:p-10"
      onClick={(e) => {
        // Only trigger onClose when clicking directly on the backdrop container, not on grandchildren
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 20, opacity: 0 }}
        className="w-full max-w-3xl glass-card overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.35)] bg-white/60 border-white/80 rounded-[2rem] sm:rounded-[2.5rem] my-auto relative shrink-0"
      >
        <div className="flex flex-col md:flex-row min-h-[480px]">
          {/* Sidebar / Plan Info */}
          <div className={cn(
            "md:w-2/5 p-6 sm:p-8 md:p-10 flex flex-col justify-between relative overflow-hidden transition-colors duration-1000 shrink-0",
            step === 'success' ? "bg-emerald-600 text-white" : "bg-slate-900 text-white"
          )}>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8 md:mb-12">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center border border-white/20 backdrop-blur-3xl">
                  <Layers size={20} className="md:size-6" />
                </div>
                <span className="font-black tracking-tighter text-xl md:text-2xl uppercase">Smart<span className="text-sky-400">Queue</span></span>
              </div>

              <div className="mb-8 md:mb-10">
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-2 md:mb-3">Paket Konfirmasi</p>
                <h3 className="text-3xl md:text-4xl font-black tracking-tighter leading-none">{plan.name}</h3>
              </div>

              <div className="space-y-4 md:space-y-5">
                {plan.features.map(f => (
                  <div key={f} className="flex items-center gap-3 text-xs md:text-sm font-bold text-white/70">
                    <CheckCircle2 size={18} className={cn(step === 'success' ? "text-white" : "text-sky-400")} /> {f}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 pt-8 border-t border-white/10 mt-8 md:mt-12">
              <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-1 lg:mb-2">Total Penagihan</p>
              <div className="flex items-baseline gap-1.5 md:gap-2">
                <span className="text-4xl md:text-5xl font-black tracking-tighter">{plan.price}</span>
                <span className="text-white/40 text-xs md:text-sm font-bold">/ bln</span>
              </div>
              <p className="text-[8px] md:text-[9px] font-bold text-white/30 mt-2 md:mt-3">*Harga sudah termasuk PPN 11%</p>
            </div>

            <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/30 blur-[120px] rounded-full -mr-40 -mt-40" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/20 blur-[120px] rounded-full -ml-40 -mb-40" />
          </div>

          {/* Main Content Area */}
          <div className="md:w-3/5 p-6 sm:p-8 md:p-10 bg-white/50 relative flex flex-col justify-center">
            {step === 'checkout' && (
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 md:top-8 md:right-8 p-2 md:p-3 bg-slate-900/5 hover:bg-slate-900/10 rounded-full transition-all active:scale-90 z-20"
              >
                <X size={20} className="text-slate-900 md:size-6" />
              </button>
            )}

            <AnimatePresence mode="wait">
              {step === 'checkout' && (
                <motion.div
                  key="checkout"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-full flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-1.5 tracking-tight">Metode Pembayaran</h3>
                    <p className="text-slate-400 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mb-8 md:mb-10">Pilih salah satu akses Anda untuk memproses</p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:gap-4 flex-grow">
                    {methods.map(m => (
                      <button
                        key={m.id}
                        onClick={() => setPaymentMethod(m.id)}
                        className={cn(
                          "w-full p-4 md:p-5 rounded-[1.5rem] md:rounded-[2rem] border-2 flex items-center gap-4 md:gap-6 transition-all group overflow-hidden relative",
                          paymentMethod === m.id 
                            ? "bg-white border-sky-500 shadow-xl ring-8 ring-sky-500/5 scale-[1.01]" 
                            : "bg-white/40 border-white hover:bg-white hover:border-slate-200"
                        )}
                      >
                        <div className={cn(
                          "w-11 h-11 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-700 shadow-inner shrink-0",
                          paymentMethod === m.id ? "bg-sky-500 text-white" : "bg-slate-50 text-slate-400"
                        )}>
                          {React.cloneElement(m.icon as React.ReactElement, { className: paymentMethod === m.id ? "text-white" : "" })}
                        </div>
                        <span className={cn("font-black text-sm md:text-base tracking-tight uppercase", paymentMethod === m.id ? "text-slate-900" : "text-slate-400")}>
                          {m.name}
                        </span>
                        {paymentMethod === m.id && (
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-auto w-6 h-6 md:w-8 md:h-8 rounded-full bg-sky-500 flex items-center justify-center text-white shadow-lg shrink-0"
                          >
                            <CheckCircle2 size={14} className="md:size-4" />
                          </motion.div>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 md:mt-8 p-4 md:p-5 bg-slate-900/5 rounded-[1.5rem] md:rounded-[2rem] border border-white flex items-center gap-3 md:gap-4">
                    <ShieldCheck size={20} className="text-sky-500 shrink-0 md:size-6" />
                    <p className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">
                      Transaksi Anda dienkripsi dengan standar keamanan 256-bit SSL untuk perlindungan maksimal.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 mt-6">
                    <button 
                      disabled={!paymentMethod}
                      onClick={handlePayment}
                      className={cn(
                        "w-full py-4 md:py-5 rounded-[1.5rem] md:rounded-[2rem] font-black text-xs md:text-sm uppercase tracking-[0.2em] md:tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-xl",
                        paymentMethod 
                          ? "bg-slate-900 text-white shadow-slate-900/20 active:scale-95 btn-apple" 
                          : "bg-slate-100 text-slate-300 cursor-not-allowed"
                      )}
                    >
                      Proses Pembayaran <ArrowRight size={18} />
                    </button>
                    
                    <button 
                      onClick={onClose}
                      className="w-full py-2 text-slate-400 font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] hover:text-slate-900 transition-colors"
                    >
                      Kembali ke Beranda
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 'qris_pay' && (
                <motion.div
                  key="qris_pay"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-full flex flex-col"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight">Pembayaran QRIS</h3>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Scan kode QR di bawah</p>
                    </div>
                    <button 
                      onClick={() => setStep('checkout')}
                      className="text-sky-500 hover:text-sky-600 transition-colors text-xs font-black uppercase tracking-wider"
                    >
                      Ubah Metode
                    </button>
                  </div>

                  <div className="flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-100 rounded-[2rem] shadow-inner mb-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">DI-SUPPORT OLEH</span>
                      <span className="text-sm font-black text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-100">QRIS</span>
                    </div>

                    <div className="w-[180px] h-[180px] bg-white p-3 rounded-2xl shadow-md border border-slate-200/55 flex items-center justify-center">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=SMARTQUEUE-QRIS-${plan.name.replace(/\s+/g, '-')}-${orderId}`} 
                        alt="QRIS QR Code" 
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="text-center mt-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Batas Waktu Pembayaran</p>
                      <p className="text-2xl font-mono font-extrabold text-rose-500 tracking-tight">{formatTimer(qrisTimer)}</p>
                    </div>
                  </div>

                  <div className="space-y-3 bg-white/40 p-5 rounded-2xl border border-white mb-6 text-xs text-slate-600 font-medium">
                    <div className="flex gap-2">
                      <span className="font-extrabold text-sky-500">1.</span>
                      <p>Buka aplikasi e-wallet Anda (GoPay, DANA, OVO, ShopeePay) atau Mobile Banking Anda.</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-extrabold text-sky-500">2.</span>
                      <p>Pilih menu <span className="font-bold text-slate-800">Bayar / Scan / Pindai QR</span>.</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-extrabold text-sky-500">3.</span>
                      <p>Pindai Kode QR di atas dan lakukan pembayaran sebesar <span className="font-extrabold text-slate-800">{plan.price}</span>.</p>
                    </div>
                  </div>

                  <button 
                    onClick={triggerMockSuccess}
                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 mt-auto"
                  >
                    <CheckCircle2 size={16} /> Konfirmasi Pembayaran Berhasil
                  </button>
                </motion.div>
              )}

              {step === 'midtrans_snap' && (
                <motion.div
                  key="midtrans_snap"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-full flex flex-col"
                >
                  <div className="border border-slate-200 shadow-2xl rounded-3xl overflow-hidden bg-white flex flex-col h-full min-h-[460px]">
                    <div className="bg-slate-50 border-b border-slate-100 p-5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sky-600 font-extrabold uppercase tracking-tight text-base">mid<span className="text-slate-800">trans</span></span>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[8px] font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200/50 uppercase tracking-wide">SECURE COUPLING</span>
                      </div>
                      <button 
                        onClick={() => setStep('checkout')}
                        className="text-[10px] font-black text-rose-500 hover:text-rose-600 uppercase tracking-widest block"
                      >
                        Batal
                      </button>
                    </div>

                    <div className="bg-sky-50/50 p-6 flex justify-between items-center border-b border-sky-100">
                      <div>
                        <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-tight">Layanan SmartQueue</h4>
                        <p className="text-[10px] text-slate-400 font-bold mt-0.5">Paket {plan.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[12px] font-black text-sky-600">{plan.price}</p>
                        <p className="text-[9px] text-slate-400 font-bold mt-0.5">Order ID: {orderId}</p>
                      </div>
                    </div>

                    <div className="p-6 flex-grow overflow-y-auto max-h-[280px] custom-scrollbar">
                      {midtransSubStep === 'select' && (
                        <div className="space-y-3">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Pilih Metode Pembayaran Midtrans</p>
                          
                          <button 
                            onClick={() => setMidtransSubStep('gopay')}
                            className="w-full flex items-center justify-between p-4 border border-slate-100 hover:border-sky-300 hover:bg-sky-50/20 rounded-2xl transition-all text-left"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-9 h-9 bg-sky-50 rounded-xl flex items-center justify-center text-sky-600">
                                <QrCode size={18} />
                              </div>
                              <div>
                                <p className="font-black text-xs text-slate-800 uppercase tracking-tight">QRIS / GoPay</p>
                                <p className="text-[9px] text-slate-400 font-bold mt-0.5">DANA, ShopeePay, LinkAja, QR Apps</p>
                              </div>
                            </div>
                            <ChevronRight size={16} className="text-slate-400" />
                          </button>

                          <button 
                            onClick={() => setMidtransSubStep('va')}
                            className="w-full flex items-center justify-between p-4 border border-slate-100 hover:border-sky-300 hover:bg-sky-50/20 rounded-2xl transition-all text-left"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                <Zap size={18} />
                              </div>
                              <div>
                                <p className="font-black text-xs text-slate-800 uppercase tracking-tight">Virtual Account Transfer</p>
                                <p className="text-[9px] text-slate-400 font-bold mt-0.5">BCA, Mandiri, BNI, BRI, Permata</p>
                              </div>
                            </div>
                            <ChevronRight size={16} className="text-slate-400" />
                          </button>

                          <button 
                            onClick={() => setMidtransSubStep('card')}
                            className="w-full flex items-center justify-between p-4 border border-slate-100 hover:border-sky-300 hover:bg-sky-50/20 rounded-2xl transition-all text-left"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                                <CreditCard size={18} />
                              </div>
                              <div>
                                <p className="font-black text-xs text-slate-800 uppercase tracking-tight">Kartu Kredit / Debit</p>
                                <p className="text-[9px] text-slate-400 font-bold mt-0.5">Visa, Mastercard, JCB, Amex</p>
                              </div>
                            </div>
                            <ChevronRight size={16} className="text-slate-400" />
                          </button>
                        </div>
                      )}

                      {midtransSubStep === 'gopay' && (
                        <div className="flex flex-col items-center py-2 text-center">
                          <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=MIDTRANS-SNAP-QRIS-${orderId}`} 
                            alt="Snap Gopay / QRIS" 
                            className="w-32 h-32 border border-slate-200 rounded-xl p-2 mb-3"
                          />
                          <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-4">Pindai QR Code di atas dengan aplikasi pembayaran Anda</p>
                          <div className="flex gap-3 w-full">
                            <button 
                              onClick={() => setMidtransSubStep('select')}
                              className="w-1/2 py-3 border border-slate-200 text-slate-500 hover:border-slate-300 font-black text-[9px] uppercase tracking-wider rounded-xl transition-all"
                            >
                              Kembali
                            </button>
                            <button 
                              onClick={triggerMockSuccess}
                              className="w-1/2 py-3 bg-sky-500 text-white font-black text-[9px] uppercase tracking-wider rounded-xl transition-all hover:bg-sky-600 shadow-lg shadow-sky-500/20"
                            >
                              Simulasi Selesai
                            </button>
                          </div>
                        </div>
                      )}

                      {midtransSubStep === 'va' && (
                        <div>
                          {!selectedBank ? (
                            <div className="space-y-2">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Pilih Bank Bank Transfer</p>
                              {['BCA', 'Mandiri', 'BNI', 'BRI'].map(bank => (
                                <button 
                                  key={bank}
                                  onClick={() => setSelectedBank(bank)}
                                  className="w-full flex items-center justify-between p-3 border border-slate-100 hover:border-sky-300 hover:bg-sky-50/20 rounded-xl transition-all"
                                >
                                  <span className="font-extrabold text-xs text-slate-700">{bank} Virtual Account</span>
                                  <ChevronRight size={14} className="text-slate-400" />
                                </button>
                              ))}
                              <button 
                                onClick={() => setMidtransSubStep('select')}
                                className="w-full mt-4 py-3 border border-slate-200 text-slate-500 font-black text-[9px] uppercase tracking-wider rounded-xl hover:bg-slate-50 transition-all text-center"
                              >
                                Kembali
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-4 py-1">
                              <div>
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Bank Penerima</p>
                                <p className="font-black text-xs text-slate-800">{selectedBank} Virtual Account</p>
                              </div>
                              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                                <div>
                                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">NOMOR VIRTUAL ACCOUNT</p>
                                  <p className="font-mono font-extrabold text-sm text-slate-800 tracking-wider">8830185783241598</p>
                                </div>
                                <button 
                                  onClick={() => handleCopyVa('8830185783241598')}
                                  className="text-[9px] font-black uppercase text-sky-500 bg-sky-50 border border-sky-100 px-3 py-1.5 rounded-lg active:scale-95 transition-all"
                                >
                                  {copied ? 'Tersalin' : 'Salin'}
                                </button>
                              </div>

                              <p className="text-[9px] text-slate-400 font-bold leading-relaxed bg-amber-50/50 border border-amber-100 p-3 rounded-xl">
                                Transfer dari ATM, Mobile Banking, atau internet banking sebelum melanjutkan.
                              </p>

                              <div className="flex gap-3 pt-2">
                                <button 
                                  onClick={() => setSelectedBank(null)}
                                  className="w-1/2 py-3 border border-slate-200 text-slate-500 hover:border-slate-300 font-black text-[9px] uppercase tracking-wider rounded-xl transition-all"
                                >
                                  Ubah Bank
                                </button>
                                <button 
                                  onClick={triggerMockSuccess}
                                  className="w-1/2 py-3 bg-sky-500 text-white font-black text-[9px] uppercase tracking-wider rounded-xl transition-all hover:bg-sky-600 shadow-lg"
                                >
                                  Saya Sudah Bayar
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {midtransSubStep === 'card' && (
                        <div className="space-y-4">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Informasi Kartu Kredit / Debit</p>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-[8px] font-black text-slate-400 uppercase tracking-wider mb-1">Nomor Kartu</label>
                              <input 
                                type="text"
                                maxLength={19}
                                placeholder="4111 1111 2222 3333"
                                value={cardNumber}
                                onChange={(e) => {
                                  const val = e.target.value.replace(/\D/g, '');
                                  const formatted = val.replace(/(.{4})/g, '$1 ').trim();
                                  setCardNumber(formatted);
                                }}
                                className="w-full p-3 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-sky-500"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[8px] font-black text-slate-400 uppercase tracking-wider mb-1">Exp Date (MM/YY)</label>
                                <input 
                                  type="text"
                                  maxLength={5}
                                  placeholder="12/28"
                                  value={cardExpiry}
                                  onChange={(e) => {
                                    let val = e.target.value.replace(/\D/g, '');
                                    if (val.length >= 2) {
                                      val = val.substring(0,2) + '/' + val.substring(2,4);
                                    }
                                    setCardExpiry(val);
                                  }}
                                  className="w-full p-3 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-sky-500 text-center"
                                />
                              </div>
                              <div>
                                <label className="block text-[8px] font-black text-slate-400 uppercase tracking-wider mb-1">CVV</label>
                                <input 
                                  type="text"
                                  maxLength={3}
                                  placeholder="123"
                                  value={cardCvv}
                                  onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                                  className="w-full p-3 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-sky-500 text-center"
                                />
                              </div>
                            </div>
                          </div>

                          {cardError && <p className="text-[10px] text-red-500 font-extrabold uppercase">{cardError}</p>}

                          <div className="flex gap-3 pt-1">
                            <button 
                              onClick={() => setMidtransSubStep('select')}
                              className="w-1/2 py-3 border border-slate-200 text-slate-500 hover:border-slate-300 font-black text-[9px] uppercase tracking-wider rounded-xl transition-all"
                            >
                              Kembali
                            </button>
                            <button 
                              onClick={() => {
                                if (cardNumber.replace(/\s/g,'').length < 16) {
                                  setCardError('Nomor kartu harus 16 digit');
                                  return;
                                }
                                if (cardExpiry.length < 5) {
                                  setCardError('Batas waktu exp date MM/YY');
                                  return;
                                }
                                if (cardCvv.length < 3) {
                                  setCardError('CVV salah');
                                  return;
                                }
                                setCardError('');
                                triggerMockSuccess();
                              }}
                              className="w-1/2 py-3 bg-sky-500 text-white font-black text-[9px] uppercase tracking-wider rounded-xl transition-all hover:bg-sky-600 shadow-lg shadow-sky-500/20"
                            >
                              Bayar Sekarang
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-slate-50 border-t border-slate-100 p-4 text-center">
                      <p className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1.5">
                        <ShieldCheck size={12} className="text-emerald-500" /> SECURE INTEGRATOR SYSTEM BY MIDTRANS
                      </p>
                    </div>
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
                      <p className="text-sm font-black text-slate-900 tracking-tight">{orderId}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Metode</p>
                      <p className="text-sm font-black text-sky-600 tracking-tight uppercase">{paymentMethod || 'Lunas'}</p>
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

const VideoModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-3xl"
      onClick={onClose}
    >
      <div className="absolute top-8 right-8 text-white cursor-pointer hover:scale-110 transition-transform">
        <X size={40} />
      </div>
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-5xl aspect-video glass-card overflow-hidden bg-black border-white/20 rounded-[2rem] shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <iframe 
          className="w-full h-full"
          src="https://www.youtube.com/embed/YjVJLlEK-nE?autoplay=1" 
          title="Video Hiburan" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowFullScreen
        ></iframe>
      </motion.div>
    </motion.div>
  );
};
