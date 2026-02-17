import React, { useState, useEffect } from 'react';
import { User, MapPin, Calendar, Clock, Heart, ChevronRight, CheckCircle, Navigation, Info, Award, Star, MessageSquare, Loader2 } from 'lucide-react';
import { EnhancedBackground, BatikKawung, BatikParang, BatikTruntum } from './components/Background';
import MusicPlayer from './components/MusicPlayer';
import RsvpSection from './components/RSVP';
import { signIn } from './firebase';

// --- Data Aplikasi ---
const DATA = {
  candidateName: "Dr. Yusni Nuryani, S.E., M.M.",
  university: "Universitas Pasundan",
  prodi: "Program Studi Ilmu Manajemen",
  dissertation: "DETERMINAN PROFITABILITAS DAN IMPLIKASINYA TERHADAP NILAI PERUSAHAAN YANG DIMODERASI UKURAN PERUSAHAAN (Studi pada Bank Umum Devisa yang Terdaftar di Bursa Efek Indonesia pada Tahun 2016-2022)",
  date: "Selasa, 24 Februari 2026",
  time: "08:00 WIB - Selesai",
  location: "Pascasarjana Universitas Pasundan",
  address: "Jl. Sumatera No. 41, Babakan Ciamis, Kec. Sumur Bandung, Kota Bandung, Jawa Barat 40117",
  logoUrl: "https://res.cloudinary.com/drs5bj8tq/image/upload/v1771240384/LOGO_UNPAS_mzy3wk.png",
  googleMapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.835463777716!2d107.6105703758763!3d-6.910266668140321!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e63a1d943485%3A0x6305345719323868!2sPascasarjana%20Universitas%20Pasundan!5e0!3m2!1sen!2sid!4v1708320000000",
  promoters: [
    { title: "Promotor", name: "Prof. Dr. H. Azhar Affandi, S.E., M.Sc" },
    { title: "Co Promotor", name: "Assoc. Prof. Dr. Hj. Liza Laila Nurwulan, S.E., M.Si" }
  ],
  reviewers: [
    "Prof. Dr. Ir. H. Bambang Heru P, M.S.",
    "Prof. Dr. H. Jaja Suteja, S.E., M.Si.",
    "Prof. Dr. H. Sidik Priadana, M.S.",
    "Prof. Dr. H. Horas Djulius, S.E.",
    "Assoc. Prof. Dr. Masno Marjohan, S.E., M.M."
  ]
};

// --- Helper Components ---

const Section: React.FC<{ isActive: boolean; children: React.ReactNode; className?: string }> = ({ isActive, children, className = "" }) => (
  <div className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out transform ${isActive ? 'opacity-100 translate-y-0 z-10 scale-100 blur-0' : 'opacity-0 translate-y-12 z-0 pointer-events-none scale-95 blur-sm'}`}>
    <div className={`w-full h-full overflow-y-auto custom-scrollbar flex flex-col items-center px-4 md:px-12 pt-8 pb-36 md:pt-16 md:pb-48 ${className}`}>
        <div className="w-full max-w-6xl my-auto flex flex-col items-center flex-grow">
            {children}
        </div>
    </div>
  </div>
);

const NavigationMenu: React.FC<{ activeTab: number; setActiveTab: (i: number) => void; tabs: any[] }> = ({ activeTab, setActiveTab, tabs }) => (
    <nav className="fixed bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 z-[100] flex items-center gap-1 md:gap-3 p-1.5 md:p-2.5 px-3 md:px-8 rounded-full bg-[#1E293B]/95 backdrop-blur-3xl border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.5)] w-[92%] max-w-[500px] md:w-auto justify-around md:justify-center transition-all duration-300 ring-1 ring-white/10">
      {tabs.filter((t, i) => i !== 6).map((tab) => {
        const originalIndex = tabs.findIndex(t => t.label === tab.label);
        return (
          <button 
            key={originalIndex} 
            onClick={() => setActiveTab(originalIndex)} 
            className={`p-2.5 md:p-4 rounded-full transition-all duration-300 flex-shrink-0 ${activeTab === originalIndex ? 'bg-white text-[#1E293B] shadow-2xl scale-110' : 'text-white/40 hover:text-white'}`}
            title={tab.label}
          >
            {React.cloneElement(tab.icon, { size: 18, strokeWidth: activeTab === originalIndex ? 2.5 : 2 })}
          </button>
        );
      })}
    </nav>
);

const CountdownTimer = () => {
    const [time, setTime] = useState({ hari: 0, jam: 0, mnt: 0, dtk: 0 });
    useEffect(() => {
        const targetDate = new Date("2026-02-24T08:00:00").getTime();
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const diff = targetDate - now;
            
            if (diff > 0) {
                setTime({
                    hari: Math.floor(diff / (1000 * 60 * 60 * 24)),
                    jam: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    mnt: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                    dtk: Math.floor((diff % (1000 * 60)) / 1000)
                });
            } else {
                clearInterval(timer);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 lg:gap-12 w-full max-w-5xl px-2">
            {Object.entries(time).map(([label, val]) => (
                <div key={label} className="flex flex-col items-center group">
                    <div className="w-full aspect-[3/4] md:aspect-[4/5] flex items-center justify-center bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-white mb-3 md:mb-6 group-hover:-translate-y-2 transition-transform duration-500 overflow-hidden relative">
                        <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity"><BatikKawung color="#1E293B" /></div>
                        <span className="text-4xl md:text-7xl lg:text-8xl font-bold text-[#1E293B] font-serif relative z-10 leading-none">{val}</span>
                    </div>
                    <span className="text-[11px] md:text-base lg:text-lg uppercase font-bold tracking-[0.3em] text-[#475569] group-hover:text-[#1E293B] transition-colors">{label}</span>
                </div>
            ))}
        </div>
    );
};

const FinalThankYouSection: React.FC<{ candidateName: string; university: string }> = ({ candidateName, university }) => (
    <div className="w-full max-w-4xl text-center px-4 relative flex flex-col items-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] opacity-[0.02] -z-10 rotate-45">
            <BatikKawung color="#1E293B" />
        </div>
        <Heart className="w-20 h-20 md:w-32 md:h-32 text-[#475569] mx-auto mb-10 animate-pulse" fill="#475569" fillOpacity={0.05} />
        <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif font-bold mb-10 text-[#1E293B] tracking-tight leading-tight">Terima Kasih</h1>
        <p className="text-[#1E293B]/80 text-lg md:text-3xl font-serif italic mb-20 leading-relaxed max-w-3xl mx-auto px-4 drop-shadow-sm">
            "Kehadiran dan doa restu Bapak/Ibu/Saudara/i merupakan kehormatan terbesar serta kebahagiaan yang tak terhingga bagi kami."
        </p>
        <div className="flex flex-col items-center gap-8 relative">
            <div className="h-[1px] w-48 md:w-64 bg-gradient-to-r from-transparent via-[#1E293B]/20 to-transparent"></div>
            <div className="flex flex-col items-center text-center">
                <span className="text-2xl md:text-5xl font-serif font-bold text-[#1E293B] tracking-tight mb-2">{candidateName}</span>
                <p className="text-[#64748B] text-xs md:text-lg mt-2 tracking-[0.5em] uppercase font-bold font-sans">{university}</p>
            </div>
            <div className="h-[1px] w-48 md:w-64 bg-gradient-to-r from-transparent via-[#1E293B]/20 to-transparent"></div>
            <div className="mt-12 w-16 h-16 opacity-10">
                <BatikTruntum color="#1E293B" />
            </div>
        </div>
    </div>
);

// --- Main App Component ---

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isOpened, setIsOpened] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Authenticate anonymously to fix Firestore permission errors
    signIn().catch(err => console.error("Auth failed:", err));
    
    // Simulate loading delay for aesthetic
    setTimeout(() => setIsLoaded(true), 1000);
  }, []);

  const tabs = [
    { label: "Opening", icon: <Award /> },
    { label: "Profil", icon: <User /> },
    { label: "Acara", icon: <Info /> },
    { label: "Waktu", icon: <Clock /> },
    { label: "Peta", icon: <MapPin /> },
    { label: "Promotor", icon: <CheckCircle /> },
    { label: "RSVP", icon: <MessageSquare /> }, 
    { label: "Penutup", icon: <Heart /> },
  ];

  if (!isLoaded) return <div className="bg-[#F8FAFC] h-screen w-full flex items-center justify-center"><Loader2 className="animate-spin text-[#1E293B] w-12 h-12" /></div>;

  return (
    <div className="relative w-full h-screen bg-[#F1F5F9] text-[#1E293B] font-sans overflow-hidden selection:bg-[#1E293B] selection:text-white">
      <EnhancedBackground />
      {isOpened && <NavigationMenu activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />}
      
      {isOpened && activeTab < 6 && (
        <button 
            onClick={() => setActiveTab(6)}
            className="fixed bottom-24 right-4 md:bottom-28 md:right-8 z-[110] bg-[#1E293B] text-white p-3.5 md:p-5 rounded-full shadow-[0_20px_50px_rgba(30,41,59,0.4)] flex items-center gap-2 hover:scale-110 transition-all border border-white/20 animate-bounce group"
        >
            <MessageSquare size={18} className="md:w-6 md:h-6" />
            <span className="hidden md:block font-bold text-xs tracking-[0.2em] uppercase">RSVP</span>
        </button>
      )}

      {/* Music Player handles the MP3 Audio */}
      <MusicPlayer autoStart={isOpened} />

      <main className="relative w-full h-full">
        {/* 1. OPENING */}
        <Section isActive={activeTab === 0} className="justify-center">
            <div className="text-center z-10 animate-fadeInUp flex flex-col items-center w-full px-2">
                <div className="mx-auto mb-8 w-32 h-32 md:w-52 md:h-52 bg-white/95 backdrop-blur-xl rounded-full border border-[#CBD5E1] flex items-center justify-center shadow-2xl p-4 animate-[float_6s_ease-in-out_infinite] relative group">
                    <img src={DATA.logoUrl} alt="Logo" className="w-full h-full object-contain relative z-10 scale-90" />
                    <div className="absolute inset-0 opacity-[0.1] rounded-full overflow-hidden"><BatikKawung /></div>
                </div>
                <h3 className="text-[#475569] text-[10px] md:text-xl font-bold tracking-[0.4em] mb-3 uppercase font-sans opacity-80">Sidang Promosi Doktor</h3>
                <p className="text-[#64748B] text-[9px] md:text-lg font-serif italic mb-10 uppercase tracking-widest">{DATA.university}</p>
                <h1 className="text-2xl md:text-6xl lg:text-7xl font-bold text-[#1E293B] font-serif leading-tight mb-12 drop-shadow-sm">{DATA.candidateName}</h1>
                <div className="bg-white/60 backdrop-blur-xl border border-white p-6 md:p-10 rounded-[2rem] shadow-2xl mb-12 max-w-sm md:max-w-md w-full mx-auto relative overflow-hidden group hover:scale-[1.02] transition-transform">
                    <div className="absolute top-0 right-0 w-24 h-24 opacity-[0.04] rotate-45"><BatikKawung /></div>
                    <p className="text-[#64748B] text-[10px] md:text-sm uppercase tracking-widest mb-3 font-bold opacity-70">Kepada Yth.</p>
                    <h4 className="text-[#1E293B] text-xl md:text-4xl font-serif font-bold mb-2 leading-tight">Bapak/Ibu/Saudara/i</h4>
                    <p className="text-[#475569] text-[10px] md:text-lg italic font-serif">di tempat</p>
                </div>
                <button onClick={() => { setIsOpened(true); setActiveTab(1); }} className="group relative px-10 py-4 md:px-20 md:py-7 bg-[#1E293B] text-white rounded-full font-bold uppercase tracking-widest shadow-2xl hover:scale-105 transition-all overflow-hidden border border-white/10 text-[10px] md:text-2xl">
                    <span className="relative z-10 flex items-center gap-3 md:gap-6">Buka Undangan <ChevronRight size={24} /></span>
                    <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </button>
            </div>
        </Section>

        {/* 2. PROFIL */}
        <Section isActive={activeTab === 1} className="justify-center">
            <div className="flex flex-col lg:flex-row items-center gap-10 md:gap-24 max-w-7xl w-full">
                <div className="w-52 h-52 md:w-[450px] md:h-[450px] lg:w-[580px] lg:h-[580px] rounded-full border-[10px] md:border-[20px] border-white overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.3)] bg-white shrink-0 relative group">
                    <img src="https://res.cloudinary.com/drs5bj8tq/image/upload/v1771240410/WhatsApp_Image_2026-02-16_at_16.01.48_jml9pe.jpg" alt="Foto Profil" className="w-full h-full object-cover object-top transition-transform duration-[5s] group-hover:scale-110" />
                </div>
                <div className="text-center lg:text-left max-w-3xl px-2 flex flex-col items-center lg:items-start">
                    <div className="mb-6 md:mb-12 inline-flex items-center gap-3 px-6 py-2 md:py-4 rounded-full border border-[#94A3B8]/30 bg-white/80 shadow-md text-[#475569] text-[9px] md:text-sm tracking-[0.3em] font-sans uppercase font-bold">
                        <Star size={14} fill="#64748B" className="animate-spin-slow" /> Profil Promovendus
                    </div>
                    <h2 className="text-3xl md:text-7xl font-serif font-bold text-[#1E293B] mb-6 leading-tight drop-shadow-sm">{DATA.candidateName}</h2>
                    <p className="text-[#475569] text-sm md:text-3xl italic border-l-0 lg:border-l-8 border-[#1E293B] lg:pl-10 mb-8 md:mb-16 leading-relaxed font-serif text-center lg:text-left">"Assalamu’alaikum Warahmatullahi Wabarakatuh"</p>
                    <div className="bg-white/85 backdrop-blur-2xl p-6 md:p-14 rounded-[2.5rem] md:rounded-[4rem] shadow-2xl text-justify md:text-left text-sm md:text-2xl leading-relaxed font-serif relative overflow-hidden border border-white">
                         <div className="absolute top-0 right-0 w-32 h-32 opacity-10 -mr-10 -mt-10 rotate-45"><BatikKawung /></div>
                         Dengan segala kerendahan hati, kami memohon doa restu Bapak/Ibu/Saudara/i atas tercapainya tahapan Sidang Promosi Doktor ini. Semoga ilmu yang didapatkan menjadi keberkahan dan bermanfaat bagi masyarakat luas.
                    </div>
                </div>
            </div>
        </Section>

        {/* 3. ACARA */}
        <Section isActive={activeTab === 2} className="justify-center">
            <div className="bg-white/90 backdrop-blur-xl p-6 md:p-20 rounded-[2.5rem] md:rounded-[5rem] shadow-[0_50px_120px_rgba(0,0,0,0.2)] text-center max-w-6xl w-full border border-white relative overflow-hidden">
                <h2 className="text-[#64748B] font-bold tracking-[0.5em] text-[10px] md:text-lg mb-8 uppercase font-sans opacity-70">Jadwal Sidang</h2>
                <h1 className="text-2xl md:text-7xl font-serif text-[#1E293B] mb-12 md:mb-20 font-bold uppercase leading-none tracking-tighter">Sidang Terbuka Promosi Doktor</h1>
                <div className="bg-[#F1F5F9]/70 p-6 md:p-16 rounded-3xl md:rounded-[4rem] border border-slate-100 shadow-inner mb-12 md:mb-20 relative overflow-hidden group">
                    <div className="absolute inset-0 opacity-[0.03]"><BatikKawung /></div>
                    <h3 className="text-[#64748B] text-[10px] md:text-sm uppercase font-bold mb-5 tracking-widest italic font-sans opacity-70">Judul Disertasi</h3>
                    <p className="text-[#1E293B] text-sm md:text-4xl font-bold uppercase font-serif leading-tight px-1 relative z-10">"{DATA.dissertation}"</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 mb-12 md:mb-20 px-2">
                    {[
                        { icon: Calendar, label: "Tanggal", val: DATA.date },
                        { icon: Clock, label: "Waktu", val: DATA.time }
                    ].map((item, i) => (
                        <div key={i} className="p-8 md:p-16 bg-white/80 rounded-[2rem] md:rounded-[4rem] shadow-xl border border-white flex items-center md:flex-col gap-6 md:gap-8 text-left md:text-center transition-all hover:-translate-y-2 group">
                            <div className="w-14 h-14 md:w-24 md:h-24 rounded-2xl md:rounded-[2rem] bg-blue-50 flex items-center justify-center text-[#1E293B] group-hover:bg-[#1E293B] group-hover:text-white transition-colors duration-500">
                                <item.icon size={32} className="md:w-12 md:h-12" strokeWidth={1} />
                            </div>
                            <div>
                                <span className="block text-[10px] md:text-sm font-bold uppercase text-slate-400 tracking-[0.3em] font-sans mb-1 md:mb-3"> {item.label} </span>
                                <span className="font-bold text-lg md:text-4xl font-serif leading-none"> {item.val} </span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-8 md:p-20 bg-white/60 rounded-[3rem] shadow-2xl border border-white mb-14 transition-all duration-700 relative overflow-hidden text-center">
                    <div className="absolute bottom-0 right-0 w-40 h-40 opacity-[0.04] rotate-12"><BatikParang /></div>
                    <MapPin className="mx-auto mb-8 text-[#1E293B] md:w-16 md:h-16" size={40} strokeWidth={1} />
                    <span className="block text-xs md:text-sm font-bold uppercase text-slate-400 mb-4 tracking-[0.4em] font-sans">Tempat Pelaksanaan</span>
                    <span className="font-bold text-xl md:text-5xl lg:text-6xl font-serif block mb-4 leading-tight">{DATA.location}</span>
                    <p className="text-sm md:text-2xl text-[#475569] leading-relaxed italic font-serif px-2 max-w-4xl mx-auto">{DATA.address}</p>
                </div>
                <button 
                    onClick={() => setActiveTab(6)} 
                    className="px-12 py-5 md:px-32 md:py-10 bg-[#1E293B] text-white rounded-full font-bold uppercase tracking-[0.5em] shadow-[0_20px_60px_rgba(0,0,0,0.4)] hover:bg-slate-800 transition-all flex items-center justify-center gap-6 md:gap-10 mx-auto group text-xs md:text-3xl"
                >
                    Konfirmasi Kehadiran <ChevronRight size={28} className="group-hover:translate-x-4 transition-transform" />
                </button>
            </div>
        </Section>

        {/* 4. COUNTDOWN */}
        <Section isActive={activeTab === 3} className="justify-center">
            <div className="text-center px-4 relative flex flex-col items-center w-full">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-80 opacity-[0.08] pointer-events-none -rotate-6 scale-150"><BatikParang /></div>
                <h3 className="text-[#475569] text-xs md:text-2xl tracking-[0.5em] md:tracking-[0.8em] mb-12 md:mb-16 uppercase font-bold font-sans opacity-70 relative z-10">Hitung Mundur Acara</h3>
                <h1 className="text-4xl md:text-8xl lg:text-9xl font-serif text-[#1E293B] mb-16 md:mb-24 italic font-bold relative z-10 drop-shadow-2xl">The Victorious Day</h1>
                <div className="relative z-10 w-full flex justify-center">
                   <CountdownTimer />
                </div>
            </div>
        </Section>

        {/* 5. MAPS */}
        <Section isActive={activeTab === 4} className="justify-center">
            <div className="w-full max-w-[1500px] h-auto md:h-[80vh] flex flex-col md:flex-row gap-10 md:gap-24 items-center px-2">
                <div className="w-full md:flex-1 h-80 md:h-full rounded-[2.5rem] md:rounded-[5rem] overflow-hidden border-8 md:border-[24px] border-white shadow-[0_50px_100px_rgba(0,0,0,0.3)] relative">
                    <iframe src={DATA.googleMapUrl} className="w-full h-full grayscale-[0.4] hover:grayscale-0 transition-all duration-1000" loading="lazy"></iframe>
                </div>
                <div className="w-full md:w-[450px] lg:w-[650px] bg-white/95 backdrop-blur-3xl p-8 md:p-24 rounded-[3rem] md:rounded-[6rem] shadow-2xl flex flex-col justify-center relative overflow-hidden border border-white text-center md:text-left">
                    <div className="absolute top-0 right-0 w-48 h-48 opacity-[0.08] -mr-16 -mt-16 rotate-12"><BatikTruntum color="#1E293B" /></div>
                    <MapPin className="text-slate-400 mb-10 mx-auto md:mx-0 md:w-24 md:h-24" size={60} strokeWidth={0.5} />
                    <h2 className="text-3xl md:text-7xl font-serif font-bold mb-8 md:mb-12 tracking-tighter">Navigasi Digital</h2>
                    <p className="text-xl md:text-5xl font-bold mb-4 md:mb-8 text-[#1E293B] leading-tight">{DATA.location}</p>
                    <p className="text-[#64748B] text-sm md:text-3xl mb-12 md:mb-24 font-serif italic leading-relaxed">{DATA.address}</p>
                    <a href="https://goo.gl/maps/xyz" target="_blank" rel="noreferrer" className="block text-center py-6 md:py-12 bg-[#1E293B] text-white rounded-[1.5rem] md:rounded-[3rem] font-bold shadow-2xl tracking-[0.3em] hover:bg-slate-800 transition-all uppercase font-sans text-xs md:text-3xl border border-white/10">Buka Panduan Maps</a>
                </div>
            </div>
        </Section>

        {/* 6. PROMOTOR */}
        <Section isActive={activeTab === 5}>
            <div className="w-full max-w-7xl px-2 flex flex-col gap-16 md:gap-32 relative pt-4">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] -z-10"><BatikKawung /></div>
                <h2 className="text-center text-3xl md:text-8xl lg:text-9xl font-serif font-bold text-[#1E293B] uppercase tracking-widest mb-10 md:mb-20">Dewan Akademik</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-24 mb-10 md:mb-24">
                    {DATA.promoters.map((p, idx) => (
                        <div key={idx} className="bg-white/80 backdrop-blur-2xl p-8 md:p-20 rounded-[3rem] md:rounded-[5rem] shadow-2xl border border-white relative group overflow-hidden hover:bg-white transition-all duration-700 text-left hover:-translate-y-4">
                            <div className="absolute bottom-0 right-0 w-40 h-40 opacity-[0.04] rotate-12 -mr-16 -mb-16 group-hover:rotate-45 transition-transform duration-1000"><BatikKawung /></div>
                            <div className="w-24 h-1 bg-[#1E293B]/10 mb-10 group-hover:w-48 group-hover:bg-[#1E293B] transition-all duration-1000"></div>
                            <h3 className="text-[#94A3B8] text-[10px] md:text-2xl font-bold uppercase tracking-[0.4em] mb-4 md:mb-10 font-sans"> {p.title} </h3>
                            <p className="text-2xl md:text-6xl font-serif font-bold text-[#1E293B] leading-[1.1]"> {p.name} </p>
                        </div>
                    ))}
                </div>
                <div className="bg-white/95 backdrop-blur-3xl p-8 md:p-32 rounded-[3.5rem] md:rounded-[7rem] shadow-[0_50px_150px_rgba(0,0,0,0.2)] border border-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.04] pointer-events-none"><BatikParang /></div>
                    <h3 className="text-center text-2xl md:text-6xl font-serif font-bold mb-16 md:mb-40 text-[#1E293B] uppercase tracking-[0.5em] font-sans">Tim Penelaah Disertasi</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 md:gap-x-32 gap-y-10 md:gap-y-24 text-left relative z-10 px-4 md:px-0">
                        {DATA.reviewers.map((name, idx) => (
                            <div key={idx} className="flex items-start gap-8 md:gap-12 py-6 md:py-16 border-b border-slate-100 last:border-0 hover:bg-[#F8FAFC]/50 transition-all rounded-[3rem] px-6 md:px-12 hover:-translate-x-4 group">
                                <div className="p-5 md:p-8 bg-blue-50 rounded-[1.5rem] md:rounded-[2.5rem] group-hover:bg-[#1E293B] group-hover:text-white transition-colors shadow-lg">
                                    <CheckCircle size={32} className="md:w-16 md:h-16" strokeWidth={1} />
                                </div>
                                <span className="font-serif text-lg md:text-4xl lg:text-5xl text-[#1E293B] leading-snug font-medium pt-3">{name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Section>

        {/* 7. RSVP (Realtime Firebase) */}
        <Section isActive={activeTab === 6}>
            <RsvpSection onFinish={() => setActiveTab(7)} />
        </Section>

        {/* 8. THANK YOU */}
        <Section isActive={activeTab === 7} className="justify-center">
            <FinalThankYouSection candidateName={DATA.candidateName} university={DATA.university} />
        </Section>
      </main>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-25px); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeInUp { animation: fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .animate-spin-slow { animation: spin 15s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      ` }} />
    </div>
  );
};

export default App;