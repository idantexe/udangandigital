import React, { useState, useEffect } from 'react';
import { User, MapPin, Calendar, Clock, Heart, ChevronRight, CheckCircle, Info, Award, MessageSquare, Loader2, ArrowDown } from 'lucide-react';
import { EnhancedBackground, BatikKawung, BatikParang, BatikTruntum } from './components/Background';
import MusicPlayer from './components/MusicPlayer';
import RsvpSection from './components/RSVP';
import { signIn } from './firebase';

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
  mapLink: "https://maps.app.goo.gl/3U231U2mEd7mTHs87",
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

const Section: React.FC<{ isActive: boolean; children: React.ReactNode; className?: string }> = ({ isActive, children, className = "" }) => (
  <div className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out transform ${isActive ? 'opacity-100 translate-y-0 z-10 scale-100 blur-0' : 'opacity-0 translate-y-8 z-0 pointer-events-none scale-95 blur-sm'}`}>
    <div className={`w-full h-full overflow-y-auto custom-scrollbar flex flex-col items-center px-3 md:px-12 pt-16 md:pt-20 pb-32 md:pb-36 ${className}`}>
        <div className="w-full max-w-6xl my-auto flex flex-col items-center flex-grow justify-center min-h-[50vh] md:min-h-[60vh]">
            {children}
        </div>
    </div>
  </div>
);

const NavigationMenu: React.FC<{ activeTab: number; setActiveTab: (i: number) => void; tabs: any[] }> = ({ activeTab, setActiveTab, tabs }) => (
    <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[100] flex items-center gap-2 p-2 px-3 md:px-4 rounded-full bg-[#0F172A]/90 backdrop-blur-xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.3)] w-auto max-w-[95vw] overflow-x-auto custom-scrollbar ring-1 ring-white/20 touch-pan-x">
      {tabs.filter((t, i) => i !== 6).map((tab) => {
        const originalIndex = tabs.findIndex(t => t.label === tab.label);
        const isActive = activeTab === originalIndex;
        return (
          <button 
            key={originalIndex} 
            onClick={() => setActiveTab(originalIndex)} 
            className={`relative px-3 py-2 md:px-4 md:py-2.5 rounded-full transition-all duration-500 flex items-center gap-2 flex-shrink-0 group overflow-hidden ${isActive ? 'text-[#0F172A]' : 'text-slate-400 hover:text-white'}`}
          >
            {isActive && <div className="absolute inset-0 bg-white shadow-md rounded-full transition-all"></div>}
            <span className="relative z-10 flex items-center justify-center">
               {React.cloneElement(tab.icon, { size: 16, strokeWidth: isActive ? 2.5 : 1.5 })}
            </span>
            {isActive && <span className="relative z-10 text-[10px] font-bold uppercase tracking-widest hidden md:block animate-fadeIn">{tab.label}</span>}
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
            } else { clearInterval(timer); }
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex flex-wrap justify-center gap-3 md:gap-12 w-full max-w-4xl px-2 relative z-10">
            {Object.entries(time).map(([label, val]) => (
                <div key={label} className="flex flex-col items-center bg-white/30 backdrop-blur-sm p-3 md:p-0 rounded-xl md:bg-transparent md:backdrop-blur-none min-w-[70px] md:min-w-0 border border-white/40 md:border-none shadow-sm md:shadow-none">
                    <span className="text-3xl sm:text-4xl md:text-8xl font-cinzel font-bold text-[#0F172A] gold-text drop-shadow-sm tabular-nums leading-none mb-1 md:mb-2">{val.toString().padStart(2, '0')}</span>
                    <span className="text-[9px] md:text-sm uppercase font-bold tracking-[0.2em] md:tracking-[0.4em] text-slate-600 md:text-slate-500 md:border-t md:border-slate-300 pt-1 md:pt-2 w-full text-center">{label}</span>
                </div>
            ))}
        </div>
    );
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isOpened, setIsOpened] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    signIn().catch(err => console.error("Auth failed:", err));
    setTimeout(() => setIsLoaded(true), 1500);
  }, []);

  const tabs = [
    { label: "Pembukaan", icon: <Award /> },
    { label: "Profil", icon: <User /> },
    { label: "Acara", icon: <Info /> },
    { label: "Waktu", icon: <Clock /> },
    { label: "Lokasi", icon: <MapPin /> },
    { label: "Promotor", icon: <CheckCircle /> },
    { label: "RSVP", icon: <MessageSquare /> }, 
    { label: "Penutup", icon: <Heart /> },
  ];

  if (!isLoaded) return (
    <div className="bg-[#FDFBF7] h-screen w-full flex flex-col items-center justify-center gap-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"><BatikKawung /></div>
        <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-[#0F172A] border-t-transparent rounded-full animate-spin mb-4"></div>
            <img src={DATA.logoUrl} className="w-12 h-12 md:w-16 md:h-16 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -mt-2 grayscale opacity-50" />
            <span className="font-cinzel text-[#0F172A] tracking-[0.3em] text-xs md:text-sm font-bold animate-pulse">MEMUAT UNDANGAN</span>
        </div>
    </div>
  );

  return (
    <div className="relative w-full h-screen bg-[#FDFBF7] text-[#0F172A] font-sans overflow-hidden selection:bg-[#0F172A] selection:text-amber-50">
      <EnhancedBackground />
      {isOpened && <NavigationMenu activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />}
      
      {isOpened && activeTab < 6 && (
        <button 
            onClick={() => setActiveTab(6)}
            className="fixed bottom-24 right-4 md:bottom-28 md:right-8 z-[110] bg-[#0F172A] text-amber-50 p-3 md:p-4 rounded-full shadow-[0_10px_30px_rgba(15,23,42,0.4)] hover:scale-110 transition-all border border-amber-500/30 group overflow-hidden"
        >
            <div className="absolute inset-0 bg-amber-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <MessageSquare size={20} className="relative z-10" />
        </button>
      )}

      <MusicPlayer autoStart={isOpened} />

      <main className="relative w-full h-full">
        {/* 1. OPENING - HERO */}
        <Section isActive={activeTab === 0} className="justify-center">
            <div className="text-center z-10 flex flex-col items-center w-full px-4 max-w-5xl">
                <div className="mb-6 animate-[fadeInUp_1s_ease-out]">
                    <div className="w-20 h-20 md:w-32 md:h-32 mx-auto mb-4 md:mb-6 relative">
                         <img src={DATA.logoUrl} alt="Logo" className="w-full h-full object-contain drop-shadow-md" />
                    </div>
                    <span className="inline-block py-1 px-4 border border-[#0F172A]/20 rounded-full text-[9px] md:text-xs font-bold tracking-[0.3em] uppercase text-slate-500 bg-white/50 backdrop-blur-sm mb-3 md:mb-4">Sidang Terbuka</span>
                    <h2 className="text-xs md:text-xl font-cinzel font-bold text-[#0F172A] tracking-[0.2em] mb-2">{DATA.university}</h2>
                </div>
                
                <div className="mb-10 md:mb-16 relative w-full">
                    <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-cinzel font-bold text-[#0F172A] leading-tight mb-2 gold-text drop-shadow-sm break-words">
                        {DATA.candidateName}
                    </h1>
                    <div className="h-px w-24 md:w-48 bg-gradient-to-r from-transparent via-[#0F172A] to-transparent mx-auto my-4 md:my-6 opacity-30"></div>
                    <p className="font-serif italic text-slate-600 text-sm md:text-xl max-w-xl md:max-w-2xl mx-auto leading-relaxed px-2">
                        Dengan penuh hormat mengundang Bapak/Ibu/Saudara/i untuk menghadiri Sidang Promosi Doktor.
                    </p>
                </div>

                <button 
                    onClick={() => { setIsOpened(true); setActiveTab(1); }} 
                    className="group relative px-8 py-3 md:px-10 md:py-4 bg-[#0F172A] text-white overflow-hidden shadow-2xl transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(15,23,42,0.3)] rounded-sm"
                >
                    <div className="absolute inset-0 border border-white/10 m-1"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    <span className="relative z-10 flex items-center gap-3 font-cinzel font-bold tracking-[0.2em] text-[10px] md:text-sm">
                        Buka Undangan <ChevronRight size={14} />
                    </span>
                </button>
            </div>
        </Section>

        {/* 2. PROFIL */}
        <Section isActive={activeTab === 1} className="justify-center">
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 md:gap-12 items-center w-full max-w-6xl">
                {/* Profile Image Fixed Structure */}
                <div className="order-1 relative flex justify-center w-full">
                     <div className="relative w-[280px] h-[350px] md:w-[400px] md:h-[500px]">
                        {/* Shadow Layer - Aligned with minimal offset */}
                        <div className="absolute inset-0 bg-[#0F172A] rounded-t-[8rem] rounded-b-[2rem] md:rounded-t-[10rem] md:rounded-b-[2rem] translate-x-3 translate-y-3 md:translate-x-5 md:translate-y-5 opacity-90"></div>
                        
                        {/* Image Layer */}
                        <div className="relative w-full h-full rounded-t-[8rem] rounded-b-[2rem] md:rounded-t-[10rem] md:rounded-b-[2rem] overflow-hidden border border-white/50 shadow-2xl bg-slate-200">
                           <img src="https://res.cloudinary.com/drs5bj8tq/image/upload/v1771240410/WhatsApp_Image_2026-02-16_at_16.01.48_jml9pe.jpg" alt="Foto Profil" className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105" />
                           <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-transparent to-transparent opacity-60"></div>
                           <div className="absolute bottom-4 md:bottom-6 left-0 w-full text-center text-white">
                               <div className="inline-block px-4 py-1 border border-white/30 rounded-full backdrop-blur-md bg-white/10 text-[9px] md:text-[10px] font-bold tracking-[0.2em] uppercase">Promovendus</div>
                           </div>
                        </div>
                     </div>
                </div>
                
                <div className="order-2 text-center lg:text-left mt-4 md:mt-0">
                    <BatikKawung opacity={0.05} />
                    <h2 className="text-2xl md:text-5xl lg:text-6xl font-cinzel font-bold text-[#0F172A] mb-4 md:mb-6 gold-text leading-tight">{DATA.candidateName}</h2>
                    <div className="w-16 md:w-20 h-1 bg-amber-500 mb-6 md:mb-8 mx-auto lg:mx-0"></div>
                    
                    <div className="glass-panel p-6 md:p-10 rounded-xl relative mb-6 md:mb-8 mx-2 md:mx-0">
                         <span className="absolute -top-4 -left-2 text-4xl md:text-6xl text-amber-200 font-serif opacity-50">"</span>
                         <p className="text-sm md:text-xl font-serif italic text-slate-700 leading-relaxed relative z-10">
                            Assalamu’alaikum Warahmatullahi Wabarakatuh. Dengan kerendahan hati, kami memohon doa restu agar ilmu yang didapatkan menjadi keberkahan bagi masyarakat luas.
                         </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 px-2 md:px-0">
                        <div className="p-3 md:p-4 border border-slate-200 rounded-lg bg-white/50">
                            <span className="block text-[9px] md:text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-1">Program Studi</span>
                            <span className="font-serif font-bold text-sm md:text-base text-[#0F172A]">{DATA.prodi}</span>
                        </div>
                         <div className="p-3 md:p-4 border border-slate-200 rounded-lg bg-white/50">
                            <span className="block text-[9px] md:text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-1">Institusi</span>
                            <span className="font-serif font-bold text-sm md:text-base text-[#0F172A]">UNPAS</span>
                        </div>
                    </div>
                </div>
            </div>
        </Section>

        {/* 3. ACARA */}
        <Section isActive={activeTab === 2} className="justify-center">
            <div className="max-w-5xl w-full text-center relative">
                <div className="mb-8 md:mb-12">
                   <span className="text-[10px] md:text-xs font-bold tracking-[0.4em] md:tracking-[0.5em] text-slate-400 uppercase mb-3 md:mb-4 block">Agenda Akademik</span>
                   <h1 className="text-2xl md:text-6xl font-cinzel font-bold text-[#0F172A] mb-4 md:mb-6">Sidang Terbuka</h1>
                   <div className="h-px w-32 md:w-full max-w-xs bg-slate-200 mx-auto"></div>
                </div>

                <div className="glass-panel p-6 md:p-14 rounded-2xl border-t-4 border-t-[#0F172A] shadow-xl mb-8 md:mb-12 relative overflow-hidden mx-2 md:mx-0">
                    <div className="absolute top-0 right-0 opacity-[0.03] w-32 h-32 md:w-48 md:h-48"><BatikParang /></div>
                    <span className="inline-block px-3 py-1 bg-amber-50 text-amber-700 text-[9px] md:text-[10px] font-bold tracking-widest uppercase rounded mb-3 md:mb-4 border border-amber-100">Disertasi</span>
                    <h3 className="text-sm md:text-3xl font-serif font-bold text-[#0F172A] leading-relaxed italic">
                        "{DATA.dissertation}"
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 px-2 md:px-0">
                    {[
                        { icon: Calendar, label: "Hari & Tanggal", val: DATA.date },
                        { icon: Clock, label: "Pukul", val: DATA.time },
                        { icon: MapPin, label: "Lokasi", val: DATA.location, sub: "Bandung" }
                    ].map((item, i) => (
                        <div key={i} className={`p-6 md:p-8 bg-white border border-slate-100 rounded-xl hover:border-[#0F172A] transition-all group ${i === 2 ? 'md:col-span-2' : ''}`}>
                            <item.icon className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-3 md:mb-4 text-slate-300 group-hover:text-amber-600 transition-colors" strokeWidth={1} />
                            <span className="block text-[9px] md:text-[10px] font-bold uppercase text-slate-400 tracking-[0.2em] mb-1 md:mb-2">{item.label}</span>
                            <span className="block font-cinzel font-bold text-base md:text-xl text-[#0F172A]">{item.val}</span>
                            {item.sub && <span className="text-xs md:text-sm text-slate-500 font-serif italic">{item.sub}</span>}
                        </div>
                    ))}
                </div>
            </div>
        </Section>

        {/* 4. COUNTDOWN */}
        <Section isActive={activeTab === 3} className="justify-center">
            <div className="text-center w-full relative px-2 flex flex-col items-center">
                {/* Background text optimized for mobile */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none overflow-hidden z-0">
                    <span className="text-[8rem] md:text-[20rem] font-cinzel font-bold whitespace-nowrap">2026</span>
                </div>
                
                <div className="relative z-10 flex flex-col items-center">
                    <h3 className="text-xs md:text-base tracking-[0.3em] md:tracking-[0.5em] mb-6 md:mb-10 uppercase font-bold text-slate-500 font-cinzel">Menuju Hari Penganugerahan</h3>
                    <CountdownTimer />
                </div>

                <div className="mt-12 md:mt-16 animate-bounce relative z-10">
                    <ArrowDown className="mx-auto text-slate-300 w-5 h-5 md:w-6 md:h-6" />
                </div>
            </div>
        </Section>

        {/* 5. LOKASI */}
        <Section isActive={activeTab === 4} className="justify-center">
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-0 w-full max-w-6xl shadow-2xl rounded-2xl md:rounded-3xl overflow-hidden border border-white">
                <div className="bg-[#0F172A] p-8 md:p-16 text-white flex flex-col justify-center relative overflow-hidden order-2 lg:order-1">
                    <div className="absolute inset-0 opacity-10"><BatikTruntum color="#ffffff" /></div>
                    <div className="relative z-10">
                        <MapPin className="w-8 h-8 md:w-12 md:h-12 text-amber-400 mb-6 md:mb-8" strokeWidth={1} />
                        <h2 className="text-2xl md:text-5xl font-cinzel font-bold mb-4 md:mb-6">Petunjuk Lokasi</h2>
                        <p className="text-base md:text-xl font-bold mb-2">{DATA.location}</p>
                        <p className="text-sm md:text-base text-slate-400 font-serif italic mb-8 md:mb-10 leading-relaxed border-l border-slate-600 pl-4">{DATA.address}</p>
                        <a href={DATA.mapLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 text-amber-400 hover:text-amber-300 transition-colors uppercase text-[10px] md:text-xs font-bold tracking-[0.2em] border border-amber-400/30 px-4 py-2 rounded-full hover:bg-amber-400/10">
                            Buka Google Maps <ChevronRight size={14} />
                        </a>
                    </div>
                </div>
                <div className="h-[250px] md:h-[400px] lg:h-auto bg-slate-200 relative order-1 lg:order-2">
                    <iframe src={DATA.googleMapUrl} className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700" loading="lazy"></iframe>
                </div>
            </div>
        </Section>

        {/* 6. PROMOTOR */}
        <Section isActive={activeTab === 5}>
            <div className="w-full max-w-5xl text-center">
                <span className="text-[10px] md:text-xs font-bold tracking-[0.4em] text-slate-400 uppercase mb-3 md:mb-4 block">Struktur Akademik</span>
                <h2 className="text-2xl md:text-5xl font-cinzel font-bold text-[#0F172A] mb-8 md:mb-16">Dewan Penguji & Promotor</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-8 md:mb-16 px-2 md:px-0">
                    {DATA.promoters.map((p, idx) => (
                        <div key={idx} className="bg-white p-6 md:p-10 border-t-4 border-t-amber-500 shadow-[0_5px_30px_rgba(0,0,0,0.05)] hover:shadow-xl transition-all group text-left rounded-xl">
                            <span className="inline-block px-3 py-1 bg-amber-50 text-amber-800 text-[9px] font-bold tracking-widest uppercase rounded mb-3 md:mb-4">{p.title}</span>
                            <h3 className="text-lg md:text-2xl font-serif font-bold text-[#0F172A] group-hover:text-amber-600 transition-colors leading-tight">{p.name}</h3>
                        </div>
                    ))}
                </div>

                <div className="bg-white/60 backdrop-blur-md border border-white p-6 md:p-12 rounded-3xl mx-2 md:mx-0">
                    <h3 className="text-sm md:text-lg font-cinzel font-bold text-[#0F172A] mb-6 md:mb-8 uppercase tracking-widest border-b border-slate-200 pb-4 inline-block">Tim Penelaah</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 md:gap-y-6 gap-x-12 text-left">
                        {DATA.reviewers.map((name, idx) => (
                            <div key={idx} className="flex items-start md:items-center gap-3 md:gap-4 group">
                                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-slate-300 rounded-full group-hover:bg-amber-500 transition-colors mt-2 md:mt-0 flex-shrink-0"></div>
                                <span className="font-serif text-slate-700 text-sm md:text-lg italic leading-tight">{name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Section>

        {/* 7. RSVP */}
        <Section isActive={activeTab === 6}>
            <RsvpSection onFinish={() => setActiveTab(7)} />
        </Section>

        {/* 8. PENUTUP */}
        <Section isActive={activeTab === 7} className="justify-center">
             <div className="w-full max-w-3xl text-center relative p-8 md:p-20 border-[1px] border-[#0F172A]/10 outline outline-offset-8 outline-1 outline-[#0F172A]/5 mx-4 md:mx-0 bg-white/40 backdrop-blur-sm rounded-lg">
                <div className="absolute top-4 left-4 w-12 h-12 md:w-16 md:h-16 border-t border-l border-[#0F172A] opacity-20"></div>
                <div className="absolute bottom-4 right-4 w-12 h-12 md:w-16 md:h-16 border-b border-r border-[#0F172A] opacity-20"></div>
                
                <BatikKawung opacity={0.03} />
                <h1 className="text-3xl md:text-6xl font-cinzel font-bold text-[#0F172A] mb-6 md:mb-8">Terima Kasih</h1>
                <p className="font-serif italic text-base md:text-2xl text-slate-600 mb-8 md:mb-12 leading-relaxed">
                    "Kehadiran dan doa restu Bapak/Ibu/Saudara/i merupakan kehormatan terbesar bagi kami."
                </p>
                <div className="text-center">
                    <span className="block text-[10px] md:text-sm font-bold tracking-[0.3em] uppercase text-slate-400 mb-2">Hormat Kami</span>
                    <span className="block text-lg md:text-3xl font-cinzel font-bold text-[#0F172A]">{DATA.candidateName}</span>
                </div>
             </div>
        </Section>

      </main>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      ` }} />
    </div>
  );
};

export default App;