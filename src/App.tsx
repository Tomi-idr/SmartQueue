/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import { 
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
  LayoutDashboard,
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
    id: 'inst-1', 
    name: 'Puskesmas Kecamatan Gambir', 
    type: 'Kesehatan',
    address: 'Jl. Tanah Abang I No.10, Jakarta Pusat',
    distance: '0.8 km',
    services: ['Poli Umum', 'Poli Gigi', 'Vaksinasi', 'KIA'],
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=400&q=80'
  },
  { 
    id: 'inst-2', 
    name: 'Bank BNI Cabang Jakarta', 
    type: 'Perbankan',
    address: 'Jl. Jend. Sudirman No.1, Jakarta Pusat',
    distance: '1.2 km',
    services: ['Customer Service', 'Teller', 'Pembukaan Rekening', 'Pinjaman'],
    image: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?auto=format&fit=crop&w=400&q=80'
  },
  { 
    id: 'inst-3', 
    name: 'Kantor Pajak Pratama', 
    type: 'Pemerintahan',
    address: 'Jl. Ridwan Rais No.5, Jakarta Pusat',
    distance: '2.5 km',
    services: ['Lapor SPT', 'Konsultasi Pajak', 'NPWP Baru', 'PBB'],
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=400&q=80'
  },
];

// --- Sub-components ---

const Navbar = ({ onOpenLogin }: { onOpenLogin: () => void }) => (
  <nav className="glass-nav fixed w-full z-50 px-6 py-4">
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-sky-600 rounded-xl flex items-center justify-center text-white shadow-lg">
          <Layers size={22} />
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-800">Smart<span className="text-sky-600">Queue</span></span>
      </div>
      <button 
        onClick={onOpenLogin}
        className="bg-sky-600 text-white px-6 py-2.5 rounded-full font-semibold btn-apple text-sm"
      >
        Login Pengunjung
      </button>
    </div>
  </nav>
);

const Hero = () => (
  <section className="h-screen w-full relative overflow-hidden flex items-center justify-center pt-20">
    <div className="absolute inset-0 z-0">
      <img 
        src="https://images.unsplash.com/photo-1556742044-3c52d6e88c62?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
        className="w-full h-full object-cover brightness-50"
        alt="Background"
      />
    </div>
    <div className="relative z-10 max-w-4xl text-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="backdrop-blur-md bg-white/10 p-8 md:p-16 rounded-[40px] border border-white/20 shadow-2xl"
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
          Antrean Modern,<br /><span className="text-sky-300">Pelanggan Senang.</span>
        </h1>
        <p className="text-xl md:text-2xl mb-10 font-light text-slate-100">
          Transformasi layanan publik dan UMKM Anda dengan sistem manajemen antrean berbasis cloud yang elegan.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <a href="#admin" className="bg-white text-sky-700 px-10 py-4 rounded-full text-lg font-bold btn-apple flex items-center justify-center gap-2">
            <LayoutDashboard size={20} /> Panel Operasional
          </a>
          <a href="#customer" className="bg-sky-600/80 backdrop-blur-md text-white px-10 py-4 rounded-full text-lg font-bold border border-white/30 btn-apple flex items-center justify-center gap-2">
            <QrCode size={20} /> Tiket Digital
          </a>
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
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-auto min-w-[320px] max-w-[95%] z-50">
      <div 
        ref={scrollRef}
        className="liquid-nav-pill px-6 py-4 flex justify-center items-center gap-2 sm:gap-6 overflow-x-auto custom-scrollbar cursor-grab active:cursor-grabbing"
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
    whileTap={{ scale: 0.95 }}
    className={cn(
      "relative flex flex-col items-center justify-center gap-1 transition-all duration-500 flex-shrink-0 group py-2 w-24 h-[72px]",
      active ? "text-black" : "text-slate-400 hover:text-slate-200"
    )}
  >
    {active && (
      <motion.div 
        layoutId="bubble"
        className="iridescent-bubble"
        transition={{ type: "spring", bounce: 0.45, duration: 0.8 }}
      />
    )}
    <div className={cn(
      "relative z-10 transition-all duration-500",
      active ? "scale-110 -translate-y-1" : "scale-100"
    )}>
      {icon}
    </div>
    <span className={cn(
      "relative z-10 text-[9px] font-black uppercase tracking-[0.15em] transition-all duration-500",
      active ? "opacity-100 scale-100 mt-1" : "opacity-0 scale-75 overflow-hidden h-0"
    )}>
      {label}
    </span>
  </motion.a>
);

export default function App() {
  const [currentNumber, setCurrentNumber] = useState('A-24');
  const [status, setStatus] = useState<QueueStatus>('Open');
  const [waitingList, setWaitingList] = useState(MOCK_WAITING_LIST);
  const [lastCalled, setLastCalled] = useState<string | null>(null);
  const [queueStep, setQueueStep] = useState<'select' | 'ticket'>('select');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState<typeof MOCK_INSTITUTIONS[0] | null>(null);

  const filteredInstitutions = MOCK_INSTITUTIONS.filter(inst => 
    inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inst.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCallNext = () => {
    if (waitingList.length > 0) {
      const next = waitingList[0];
      setLastCalled(currentNumber);
      setCurrentNumber(next.number);
      setWaitingList(waitingList.slice(1));
    }
  };

  const handleRecall = () => {
    // Logic for recall animation/sound
    console.log('Recalling:', currentNumber);
  };

  const handleSkip = () => {
    handleCallNext();
  };

  return (
    <div className="w-full" id="hero">
      <Navbar onOpenLogin={() => setIsLoginOpen(true)} />
      <Hero />
      <BottomNav onOpenChat={() => setIsChatOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-24 pb-48 space-y-20 md:space-y-32">
        
        {/* 0. Discovery Section (New) */}
        <section id="discovery" className="scroll-mt-24 space-y-12">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-sky-600 mb-2">Cari & Temukan</h2>
            <h3 className="text-4xl font-extrabold text-slate-800 mb-6">Cari lokasi atau instansi yang ingin Anda kunjungi</h3>
            <p className="text-slate-500 font-medium">Temukan lokasi terdekat, lihat layanan tersedia, dan ambil nomor antrean secara digital dari genggaman Anda.</p>
          </div>

          <div className="relative max-w-2xl mx-auto">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400">
              <Search size={22} />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari Bank, Rumah Sakit, atau Kantor Pemerintah..." 
              className="w-full h-16 pl-16 pr-6 bg-white rounded-3xl shadow-xl border border-slate-100 text-slate-700 font-bold focus:ring-4 focus:ring-sky-500/10 focus:outline-none transition-all placeholder:text-slate-300"
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredInstitutions.map((inst) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={inst.id}
                  onClick={() => setSelectedInstitution(inst)}
                  className={cn(
                    "group bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-lg hover:shadow-2xl transition-all cursor-pointer",
                    selectedInstitution?.id === inst.id && "ring-4 ring-sky-500/20 border-sky-500"
                  )}
                >
                  <div className="h-48 relative overflow-hidden">
                    <img 
                      src={inst.image} 
                      alt={inst.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-sky-600 shadow-sm">
                      {inst.distance}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                       <span className="text-[10px] font-bold text-sky-600 uppercase tracking-widest bg-sky-50 px-2 py-0.5 rounded-md">
                        {inst.type}
                       </span>
                    </div>
                    <h4 className="text-xl font-extrabold text-slate-800 mb-2 leading-tight">{inst.name}</h4>
                    <p className="text-xs text-slate-400 font-medium mb-4 flex items-center gap-1.5 line-clamp-1">
                      <Search size={12} className="shrink-0" /> {inst.address}
                    </p>
                    
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      {inst.services.slice(0, 3).map(service => (
                        <span key={service} className="text-[10px] font-bold bg-slate-50 text-slate-500 px-2.5 py-1 rounded-lg border border-slate-100">
                          {service}
                        </span>
                      ))}
                      {inst.services.length > 3 && (
                        <span className="text-[10px] font-bold bg-slate-50 text-slate-400 px-2.5 py-1 rounded-lg border border-slate-100">
                          +{inst.services.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {selectedInstitution && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-sky-600 rounded-[40px] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-8 right-8 cursor-pointer hover:bg-white/10 p-2 rounded-full transition-colors" onClick={() => setSelectedInstitution(null)}>
                  <X size={24} />
                </div>
                <div className="relative z-10">
                  <h3 className="text-xs font-black uppercase tracking-widest text-sky-200 mb-6">3. Pilih Jenis Layanan</h3>
                  <h2 className="text-3xl font-black mb-8">Pilih layanan yang Anda perlukan di<br />{selectedInstitution.name}</h2>
                  
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {selectedInstitution.services.map((service, idx) => (
                      <motion.button
                        key={service}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setSelectedCategory(service as any);
                          setQueueStep('ticket');
                          window.location.hash = '#customer';
                        }}
                        className="p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 text-left hover:bg-white hover:text-sky-600 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4 group-hover:bg-sky-100 group-hover:text-sky-600 transition-colors">
                          {idx % 4 === 0 ? <Users size={20} /> : idx % 4 === 1 ? <User size={20} /> : idx % 4 === 2 ? <FastForward size={20} /> : <AlertCircle size={20} />}
                        </div>
                        <p className="font-extrabold text-sm uppercase tracking-wider">{service}</p>
                        <p className="text-[10px] font-bold opacity-60 mt-1 uppercase">Estimasi 15 Menit</p>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
        {/* 1. Admin/Staff Section */}
        <section id="admin" className="scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-sky-600 mb-2">Kendali Operasional</h2>
              <h3 className="text-3xl font-extrabold text-slate-800">Panel Operasional Staf</h3>
            </div>
            <div className="flex items-center gap-3">
              <span className={cn(
                "px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 border shadow-sm",
                status === 'Open' ? "bg-green-100 text-green-700 border-green-200" : 
                status === 'Break' ? "bg-amber-100 text-amber-700 border-amber-200" :
                "bg-slate-100 text-slate-700 border-slate-200"
              )}>
                <span className={cn("w-2 h-2 rounded-full", 
                  status === 'Open' ? "bg-green-500" : 
                  status === 'Break' ? "bg-amber-500" : "bg-slate-400"
                )} />
                LOKET 01: {status === 'Open' ? 'AKTIF' : status === 'Break' ? 'ISTIRAHAT' : 'TUTUP'}
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Controls */}
            <GlassCard className="flex flex-col justify-between p-7 border-white/60" hover>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-sky-600 mb-6">
                  Kontrol Antrean
                </h3>
                <div className="space-y-4">
                  <button 
                    onClick={handleCallNext}
                    className="w-full bg-sky-600 text-white h-20 rounded-2xl flex items-center justify-center gap-3 text-xl font-bold btn-apple shadow-lg shadow-sky-200"
                  >
                    PANGGIL (Next)
                  </button>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={handleRecall}
                      className="bg-amber-400 text-white h-14 rounded-2xl font-bold btn-apple"
                    >
                      ULANGI
                    </button>
                    <button 
                      onClick={handleSkip}
                      className="bg-slate-400 text-white h-14 rounded-2xl font-bold btn-apple"
                    >
                      LEWATI
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-white/40">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Status Loket</p>
                <div className="grid grid-cols-3 gap-2">
                  {(['Open', 'Break', 'Closed'] as QueueStatus[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatus(s)}
                      className={cn(
                        "py-3 rounded-xl text-[11px] font-bold transition-all",
                        status === s 
                          ? "bg-white text-sky-600 border border-sky-100 shadow-sm" 
                          : "bg-slate-200/50 text-slate-500 hover:bg-slate-200"
                      )}
                    >
                      {s === 'Open' ? 'BUKA' : s === 'Break' ? 'ISTIRAHAT' : 'TUTUP'}
                    </button>
                  ))}
                </div>
              </div>
            </GlassCard>

            {/* Active Number Display */}
            <GlassCard className="text-center flex flex-col justify-center border-t-8 border-sky-600 p-8 shadow-2xl" hover>
              <span className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Nomor Sekarang</span>
              <motion.h4 
                key={currentNumber}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-[11rem] font-black text-sky-600 leading-none my-4 tracking-tighter"
              >
                {currentNumber}
              </motion.h4>
              <div className="bg-white/40 backdrop-blur-md py-2 px-6 rounded-xl inline-block mx-auto border border-white/60">
                <p className="text-sky-700 font-extrabold text-lg uppercase tracking-tight">Loket 01</p>
              </div>
            </GlassCard>

            {/* Waiting List */}
            <GlassCard hover className="p-7">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-sky-600">Daftar Tunggu</h3>
                <span className="px-3 py-1 bg-sky-600 text-white rounded-lg text-sm font-black shadow-lg shadow-sky-100">
                  {waitingList.length}
                </span>
              </div>
              <div className="space-y-3 overflow-y-auto max-h-[380px] pr-2 custom-scrollbar">
                <AnimatePresence initial={false}>
                  {waitingList.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="bg-white/60 p-5 rounded-2xl flex justify-between items-center border border-white/80 shadow-sm hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 font-black text-lg border border-sky-100">
                          {item.number}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-700">{item.number}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Antrean #{item.id}</span>
                        </div>
                      </div>
                      <span className={cn(
                        "text-[9px] px-2.5 py-1 rounded-lg font-black uppercase tracking-widest",
                        item.category === 'Umum' ? "bg-sky-100 text-sky-600" :
                        item.category === 'Prioritas' ? "bg-purple-100 text-purple-600" :
                        "bg-emerald-100 text-emerald-600"
                      )}>
                        {item.category}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* 2. Monitoring (Public Display) */}
        <section id="monitor" className="scroll-mt-24">
          <h2 className="text-xs font-bold uppercase tracking-widest text-sky-600 mb-6">Monitoring Visual</h2>
          
          <div className="bg-slate-900 rounded-[40px] overflow-hidden flex flex-col shadow-2xl relative border border-slate-700 min-h-[500px]">
            <div className="flex flex-col lg:flex-row flex-grow">
              {/* Ad/Visual Area */}
              <div className="lg:w-1/2 bg-gradient-to-br from-indigo-950 to-slate-900 flex items-center justify-center p-8 lg:p-12 relative overflow-hidden min-h-[300px]">
                <div className="absolute inset-0 opacity-30">
                   <div className="w-full h-full bg-blue-500/20 blur-[120px] rounded-full translate-x-20 scale-150"></div>
                </div>
                <div className="text-center relative z-10">
                  <p className="text-sky-400 text-xs font-bold tracking-[0.4em] uppercase mb-4">Promosi Utama</p>
                  <h3 className="text-white font-serif italic text-3xl lg:text-5xl mb-4 leading-tight">Waktu Untuk Rehat</h3>
                  <p className="text-white/60 text-sm lg:text-lg max-w-xs mx-auto font-light">Dapatkan penawaran eksklusif khusus pelanggan Smart Queue hari ini!</p>
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="mt-8 lg:mt-12 w-16 h-16 lg:w-24 lg:h-24 bg-white/10 backdrop-blur-2xl rounded-full flex items-center justify-center mx-auto border border-white/20"
                  >
                    <Play size={24} fill="white" className="ml-1 lg:hidden" />
                    <Play size={32} fill="white" className="ml-1 hidden lg:block" />
                  </motion.div>
                </div>
              </div>
              {/* Queue Display */}
    <div className="lg:w-1/2 bg-sky-600 flex flex-col items-center justify-center text-white border-l border-white/10 shadow-inner p-8 lg:p-12">
      <p className="text-[10px] lg:text-[12px] font-bold tracking-[0.3em] text-sky-200 uppercase mb-4">Nomor Sekarang</p>
      <AnimatePresence mode="wait">
        <motion.h4 
          key={currentNumber}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-7xl sm:text-8xl lg:text-[12rem] font-black leading-none my-2 tracking-tighter drop-shadow-2xl"
        >
          {currentNumber}
        </motion.h4>
      </AnimatePresence>
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white/10 backdrop-blur-md py-3 lg:py-4 px-6 lg:px-8 rounded-2xl text-xl lg:text-3xl font-black border border-white/30 mt-6 shadow-xl"
    >
      LOKET 01
    </motion.div>
              </div>
            </div>
            {/* Running Text */}
            <div className="h-14 bg-white flex items-center overflow-hidden border-t-[6px] border-sky-400">
              <div className="whitespace-nowrap flex running-text-content">
                <span className="text-sky-950 font-black text-sm px-8 uppercase tracking-widest leading-none">
                  PENGUMUMAN: Layanan hari ini dibatasi sampai jam 16:00 WIB. Terima kasih atas pengertian Anda. • Dapatkan Tiket Digital via Aplikasi SmartQueue! • Promo UMKM: Diskon 20% khusus transaksi digital hari ini! • Smart Queue - Solusi Antrean Masa Depan • 
                </span>
                <span className="text-sky-950 font-black text-sm px-8 uppercase tracking-widest leading-none">
                  PENGUMUMAN: Layanan hari ini dibatasi sampai jam 16:00 WIB. Terima kasih atas pengertian Anda. • Dapatkan Tiket Digital via Aplikasi SmartQueue! • Promo UMKM: Diskon 20% khusus transaksi digital hari ini! • Smart Queue - Solusi Antrean Masa Depan • 
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Area Pelanggan */}
        <section id="customer" className="scroll-mt-24 max-w-lg mx-auto w-full">
          <h2 className="text-xs font-bold uppercase tracking-widest text-sky-600 mb-6 text-center">Pelayanan Mandiri</h2>
          
          <AnimatePresence mode="wait">
            {queueStep === 'select' ? (
              <motion.div
                key="select-step"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <GlassCard className="p-8 text-center bg-white/40" hover>
                  <h3 className="text-2xl font-black text-slate-800 mb-2">Ambil Antrean Baru</h3>
                  <p className="text-slate-500 text-sm mb-8">Silahkan pilih kategori layanan Anda</p>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      { id: 'umum', label: 'Layanan Umum', desc: 'Pendaftaran & Administrasi', icon: <Users size={24} />, color: 'hover:bg-sky-50' },
                      { id: 'prioritas', label: 'Layanan Prioritas', desc: 'Lansia, Ibu Hamil & Disabilitas', icon: <TrendingUp size={24} />, color: 'hover:bg-purple-50' },
                      { id: 'konsultasi', label: 'Konsultasi Ahli', desc: 'Pertemuan Tatap Muka Langsung', icon: <MessageSquare size={24} />, color: 'hover:bg-emerald-50' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setSelectedCategory(item.label);
                          setQueueStep('ticket');
                        }}
                        className={cn(
                          "flex items-center gap-5 p-5 rounded-3xl bg-white border border-slate-100 text-left transition-all hover:scale-[1.02] active:scale-95 group shadow-sm",
                          item.color
                        )}
                      >
                        <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-sky-600 transition-colors shadow-inner">
                          {item.icon}
                        </div>
                        <div>
                          <p className="font-black text-slate-800">{item.label}</p>
                          <p className="text-xs text-slate-400 font-medium">{item.desc}</p>
                        </div>
                        <FastForward className="ml-auto text-slate-200 group-hover:text-sky-300 transition-colors" size={20} />
                      </button>
                    ))}
                  </div>
                </GlassCard>
                <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest px-8">
                  Pilih sesuai kategori layanan untuk membantu efisiensi petugas
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="ticket-step"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative"
              >
                <div className="absolute -inset-4 bg-sky-500/20 blur-3xl opacity-50 rounded-full" />
                <GlassCard className="rounded-[40px] p-8 shadow-2xl relative border-[10px] border-slate-900 bg-white" hover>
                  <div className="flex justify-between items-center mb-8 px-2">
                    <div className="w-10 h-2.5 bg-slate-200 rounded-full"></div>
                    <div className="flex gap-1.5">
                      <div className="w-3.5 h-3.5 bg-slate-200 rounded-full"></div>
                      <div className="w-3.5 h-3.5 bg-slate-200 rounded-full"></div>
                    </div>
                  </div>

                  <div className="text-center mb-8">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Nomor Antrean Anda</p>
                    <motion.h3 
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", damping: 10, stiffness: 100 }}
                      className="text-8xl font-black text-slate-900 tracking-tighter"
                    >
                      A-32
                    </motion.h3>
                    <div className="mt-6 flex justify-center">
                      <div className="px-5 py-2.5 bg-sky-500 text-white rounded-full flex items-center gap-2 text-sm font-black shadow-lg shadow-sky-500/30">
                        <Clock size={16} />
                        <span>ESTIMASI: 15 MENIT</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-[32px] mb-8 flex flex-col items-center border border-slate-100 shadow-inner">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                      <QrCode size={120} className="text-slate-900" />
                    </div>
                    <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest underline decoration-2 decoration-sky-300">Scan di Loket</p>
                  </div>

                  <div className="space-y-4 px-2">
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Sisa Antrean</span>
                      <span className="text-xl font-black text-sky-600">8 Orang</span>
                    </div>
                    <div className="flex justify-between items-center py-4 border-y border-slate-100/50">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Kategori</span>
                      <span className="text-sm font-bold text-slate-800">{selectedCategory}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Ambil Tiket</span>
                      <span className="text-sm font-bold text-slate-800">12:45 WIB</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setQueueStep('select')}
                    className="w-full mt-10 py-5 bg-slate-900 text-white rounded-[24px] font-black text-sm tracking-[0.1em] btn-apple"
                  >
                    BATALKAN ANTREAN
                  </button>
                  <div className="h-1.5 w-1/3 bg-slate-900 mx-auto rounded-full mt-10 opacity-20"></div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* 4. Pusat Bantuan (Support Center) */}
        <section id="support" className="scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-sky-600 mb-2">Layanan Pelanggan</h2>
              <h3 className="text-3xl font-extrabold text-slate-800">Pusat Bantuan & AI Support</h3>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* FAQ Search */}
            <GlassCard className="lg:col-span-2 p-8 border-white/60" hover>
              <h3 className="text-xl font-black text-slate-800 mb-6">Pertanyaan Populer</h3>
              <div className="relative mb-8">
                <input 
                  type="text" 
                  placeholder="Cari kendala Anda..." 
                  className="w-full h-14 bg-white/50 backdrop-blur-md rounded-2xl px-12 text-sm font-medium border border-white/80 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              </div>
              
              <div className="space-y-4">
                {[
                  "Bagaimana cara membatalkan antrean?",
                  "Dapatkah saya mengganti kategori layanan?",
                  "Berapa lama rata-rata waktu tunggu?",
                  "Apakah tiket saya akan hangus jika terlewati?"
                ].map((q, i) => (
                  <button 
                    key={i}
                    className="w-full flex items-center justify-between p-5 bg-white/40 hover:bg-white/60 rounded-2xl border border-white/60 transition-all group"
                  >
                    <span className="text-sm font-bold text-slate-700">{q}</span>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-sky-600 transition-colors" />
                  </button>
                ))}
              </div>

              <div className="mt-8 flex items-center justify-center gap-2 text-sky-600 font-black text-xs uppercase tracking-widest cursor-pointer hover:underline">
                Lihat Semua FAQ <ExternalLink size={14} />
              </div>
            </GlassCard>

            {/* AI Assistant Chat Simulation */}
            <div className="space-y-6">
              <GlassCard className="p-8 bg-sky-600 text-white border-transparent shadow-sky-200" hover>
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 border border-white/30">
                  <MessageSquare size={24} />
                </div>
                <h3 className="text-xl font-black mb-2 tracking-tight">Smart AI Assistant</h3>
                <p className="text-sky-100 text-sm mb-8 leading-relaxed font-medium">
                  Butuh bantuan cepat? Hubungkan dengan asisten AI kami untuk menjawab kendala Anda dalam hitungan detik.
                </p>
                <button 
                  onClick={() => setIsChatOpen(true)}
                  className="w-full py-4 bg-white text-sky-600 rounded-2xl font-black text-xs uppercase tracking-widest btn-apple shadow-xl"
                >
                  Mulai Chat Sekarang
                </button>
              </GlassCard>

              <GlassCard className="p-8 border-white/60" hover>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Butuh Manusia?</h4>
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <img 
                      src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80" 
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                      alt="Agent"
                    />
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-800">Sarah Wijaya</p>
                    <p className="text-[10px] text-slate-400 font-bold">Admin Beroperasi</p>
                  </div>
                </div>
                <button className="w-full py-3 border-2 border-slate-100 text-slate-500 rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all">
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

      {/* Footer */}
      <footer className="glass-nav py-16 text-center mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-sky-600 rounded-lg flex items-center justify-center text-white">
                <Layers size={18} />
              </div>
              <span className="text-lg font-bold tracking-tight">Smart<span className="text-sky-600">Queue</span></span>
            </div>
            <div className="flex gap-8 text-sm font-bold text-slate-500 uppercase tracking-widest">
              <a href="#" className="hover:text-sky-600">Tentang Kami</a>
              <a href="#" className="hover:text-sky-600">Pusat Bantuan</a>
              <a href="#" className="hover:text-sky-600">Kebijakan Privasi</a>
            </div>
            <div className="flex gap-4">
              <SocialIcon><i className="fab fa-instagram"></i></SocialIcon>
              <SocialIcon><i className="fab fa-twitter"></i></SocialIcon>
              <SocialIcon><i className="fab fa-facebook"></i></SocialIcon>
            </div>
          </div>
          <p className="text-slate-400 text-xs font-medium border-t border-slate-200 pt-8">
            &copy; 2026 Smart Queue Digital System. Didesain dengan ❤️ untuk UMKM Indonesia.
          </p>
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
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl flex flex-col h-[600px] border border-slate-100"
      >
        <div className="p-6 bg-sky-600 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center border border-white/20">
              <MessageSquare size={22} />
            </div>
            <div>
              <p className="font-black text-sm tracking-tight">AI SUPPORT</p>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                <p className="text-[10px] font-bold text-sky-100 uppercase tracking-widest">Online Sekarang</p>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-50/50">
          {messages.map((msg, i) => (
            <motion.div
              initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
              animate={{ opacity: 1, x: 0 }}
              key={i}
              className={cn(
                "flex flex-col max-w-[85%]",
                msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
              )}
            >
              <div className={cn(
                "p-4 rounded-2xl text-sm font-medium shadow-sm",
                msg.role === 'user' 
                  ? "bg-sky-600 text-white rounded-br-none" 
                  : "bg-white text-slate-700 border border-slate-100 rounded-bl-none"
              )}>
                {msg.content}
              </div>
              <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest px-1">
                {msg.role === 'assistant' ? 'Smart Bot' : 'Anda'}
              </span>
            </motion.div>
          ))}
          {isTyping && (
            <div className="flex flex-col max-w-[85%] mr-auto items-start">
              <div className="p-4 rounded-2xl bg-white text-slate-700 border border-slate-100 rounded-bl-none shadow-sm flex gap-1">
                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-white border-t border-slate-100">
          <div className="relative flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ketik pesan Anda..."
              className="w-full h-12 bg-slate-50 rounded-2xl px-5 text-sm font-bold border border-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all"
            />
            <button 
              onClick={handleSend}
              className="bg-sky-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-sky-500/20 active:scale-95 transition-all"
            >
              <Send size={18} />
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
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-white/95 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-sm flex flex-col items-center text-center relative"
      >
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-4xl font-black text-slate-900 mb-12">
          {view === 'login' ? 'Masuk' : 'Daftar'}
        </h2>

        <form onSubmit={handleSubmit} className="w-full">
          <div className="w-full space-y-4 mb-2">
            <div className="relative">
              <input 
                required
                type="text" 
                placeholder="Email atau no. handphone" 
                className="w-full h-14 px-5 border border-slate-300 rounded-lg text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-all font-medium"
              />
            </div>
            
            <div className="relative">
              <input 
                required
                type={showPassword ? "text" : "password"}
                placeholder="Password" 
                className="w-full h-14 px-5 border border-slate-300 rounded-lg text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-all font-medium"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
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
                  className="w-full h-14 px-5 border border-slate-300 rounded-lg text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-all font-medium"
                />
              </div>
            )}
          </div>

          <div className="w-full text-left mb-16">
            {view === 'login' && (
              <button type="button" className="text-sky-600 font-bold text-sm hover:underline">
                Lupa password?
              </button>
            )}
          </div>

          <button 
            disabled={isLoading}
            className={cn(
              "w-1/2 h-14 bg-[#007AFF] text-white rounded-[40px] font-bold text-sm tracking-wide shadow-lg shadow-blue-500/20 active:scale-95 transition-all mb-6 flex items-center justify-center mx-auto",
              isLoading && "opacity-70 cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              />
            ) : (
              view === 'login' ? 'Masuk' : 'Daftar'
            )}
          </button>
        </form>

        <button 
          onClick={() => setView(view === 'login' ? 'register' : 'login')}
          className="text-[#007AFF] font-bold text-sm hover:underline"
        >
          {view === 'login' ? 'Daftar akun' : 'Sudah punya akun? Masuk'}
        </button>
      </motion.div>
    </motion.div>
  );
};
