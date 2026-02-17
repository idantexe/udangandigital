import React, { useState, useEffect } from 'react';
import { User, MapPin, Calendar, Clock, Heart, ChevronRight, CheckCircle, Info, Award, Star, MessageSquare, Loader2 } from 'lucide-react';
import { BatikKawung, BatikTruntum } from './components/BatikPatterns';
import RsvpSection from './components/RsvpSection';
import MusicPlayer from './components/MusicPlayer';
import { DataConfig } from './types';

// --- Assets & Data ---
const DATA: DataConfig = {
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

// --- Sub-Components ---

const BackgroundParticles = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-[#F1F5F9]">
    <div className="absolute inset-0 bg-gradient-to-b from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0]"></div>
    <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#1E293B] blur-[150px] opacity-[0.08] rounded-full"></div>
    <div className="absolute inset-0 opacity-[0.07]">
       <BatikTruntum color="#1E293B" className="w-full h-full" />
    </div>
  </div>
);

const Section: React.FC<{ isActive: boolean; children: React.ReactNode; className?: string }> = ({ isActive, children, className = "" }) => (
  <div className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out transform ${isActive ? 'opacity-100 translate-y-0 z-10 scale-100 blur-0' : 'opacity-0 translate-y-12 z-0 pointer-events-none scale-95 blur-sm'}`}>
    <div className={`w-full h-full overflow-y-auto custom-scrollbar flex flex-col items-center px-4 md:px-16 pt-16 pb-48 ${className}`}>
        <div className="w-full max-w-6xl my-auto flex flex-col items-center">
            {children}
        </div>
    </div>
  </div>
);

const NavigationMenu: React.FC<{ activeTab: number; setActiveTab: (i: number) => void; tabs: any[] }> = ({ activeTab, setActiveTab, tabs }) => (
    <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[100] flex items-center gap-1 md:gap-3 p-2 px-3 md:px-6 rounded-full bg-[#1E293B]/90 backdrop-blur-2xl border border-[#475569]/30 shadow-2xl w-[90%] max-w-[420px] md:w-auto justify-around md:justify-center transition-all duration-300">
      {tabs.filter((t, i) => i !== 6).map((tab, index) => {
        const originalIndex = tabs.findIndex(t => t.label === tab.label);
        return (
          <button 
            key={originalIndex} 
            onClick={() => setActiveTab(originalIndex)} 
            className={`p-3 md:p-4 rounded-full transition-all duration-300 flex-shrink-0 ${activeTab === originalIndex ? 'bg-white text-[#1E293B] shadow-xl scale-110' : 'text-[#94A3B8] hover:text-white'}`}
            title={tab.label}
          >
            {React.cloneElement(tab.icon, { size: 20 })}
          </button>
        );
      })}
    </nav>
);

const CountdownTimer = () => {
    const [time, setTime] = useState({ hari: 0, jam: 0, mnt: 0, dtk: 0 });
    useEffect(() => {
        const timer = setInterval(() => {
            const diff = new Date("2026-02-24T08:00:00").getTime() - new Date().getTime();
            setTime({
                hari: Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24))),
                jam: Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24)),
                mnt: Math.max(0, Math.floor((diff / 1000 / 60) % 60)),
                dtk: Math.max(0, Math.floor((diff / 1000) % 60))
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);
    return (
        <div className="flex gap-4 md:gap-12 justify-center">
            {Object.entries(time).map(([label, val]) => (
                <div key={label} className="flex flex-col items-center">
                    <div className="w-18 h-24 md:w-40 md:h-56 flex items-center justify-center bg-white rounded-3xl md:rounded-[3rem] shadow-2xl border border-slate-50 mb-6 group hover:scale-105 transition-transform">
                        <span className="text-4xl md:text-8xl font-bold text-[#1E293B] font-serif leading-none">{val}</span>
                    </div>
                    <span className="text-[10px] md:text-xl uppercase font-bold tracking-[0.4em] text-[#475569]">{label}</span>
                </div>
            ))}
        </div>
    );
};

const FinalThankYouSection: React.FC<{ candidateName: string; university: string }> = ({ candidateName, university }) => (
    <div className="w-full max-w-4xl text-center px-4">
        <Heart className="w-20 h-20 md:w-32 md:h-32 text-[#475569] mx-auto mb-10 animate-pulse" fill="#475569" fillOpacity={0.05} />
        
        <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif font-bold mb-10 text-[#1E293B] tracking-tight leading-tight">
            Terima Kasih
        </h1>
        
        <p className="text-[#1E293B]/80 text-lg md:text-3xl font-serif italic mb-20 leading-relaxed max-w-3xl mx-auto px-4">
            "Kehadiran dan doa restu Bapak/Ibu/Saudara/i merupakan kehormatan terbesar serta kebahagiaan yang tak terhingga bagi kami."
        </p>
        
        <div className="flex flex-col items-center gap-8">
            <div className="h-[2px] w-48 md:w-64 bg-gradient-to-r from-transparent via-[#1E293B]/20 to-transparent"></div>
            <div className="flex flex-col items-center text-center">
                <span className="text-2xl md:text-5xl font-serif font-bold text-[#1E293B] tracking-tight">{candidateName}</span>
                <p className="text-[#64748B] text-xs md:text-lg mt-4 tracking-[0.5em] uppercase font-bold font-sans">{university}</p>
            </div>
            <div className="h-[2px] w-48 md:w-64 bg-gradient-to-r from-transparent via-[#1E293B]/20 to-transparent"></div>
        </div>
    </div>
);

// --- Main App ---
const App = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isOpened, setIsOpened] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    // Prevent scrolling on body to allow internal section scrolling
    document.body.style.overflow = 'hidden'; 
    return () => { document.body.style.overflow = 'auto'; };
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

  if (!isLoaded) return <div className="bg-[#F1F5F9] h-screen w-full flex items-center justify-center"><Loader2 className="animate-spin text-[#1E293B]" /></div>;

  return (
    <div className="relative w-full h-screen bg-[#F1F5F9] text-[#1E293B] font-sans overflow-hidden">
      <BackgroundParticles />
      {isOpened && <NavigationMenu activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />}
      
      {isOpened && activeTab < 6 && (
        <button 
            onClick={() => setActiveTab(6)}
            className="fixed bottom-24 right-6 z-[110] bg-[#1E293B] text-white p-4 md:p-5 rounded-full shadow-[0_20px_50px_rgba(30,41,59,0.4)] flex items-center gap-3 hover:scale-110 transition-all border border-white/20 animate-bounce group"
        >
            <MessageSquare size={20} className="md:w-6 md:h-6" />
            <span className="hidden md:block font-bold text-xs tracking-widest uppercase">RSVP</span>
        </button>
      )}

      {/* Music Player starts playing only when isOpened is true */}
      <MusicPlayer shouldPlay={isOpened} />

      <main className="relative w-full h-full">
        {/* 1. OPENING */}
        <Section isActive={activeTab === 0}>
            <div className="text-center z-10 animate-fadeInUp flex flex-col items-center">
                <div className="mx-auto mb-6 w-32 h-32 md:w-44 md:h-44 bg-white/90 backdrop-blur-xl rounded-full border border-[#CBD5E1] flex items-center justify-center shadow-xl p-4 animate-[float_6s_ease-in-out_infinite] relative">
                    <img src={DATA.logoUrl} alt="Logo UNPAS" className="w-full h-full object-contain relative z-10" />
                </div>
                <h3 className="text-[#475569] text-sm md:text-xl font-bold tracking-[0.3em] mb-2 uppercase font-sans">Sidang Promosi Doktor</h3>
                <p className="text-[#64748B] text-xs md:text-base font-serif italic mb-8 uppercase tracking-widest">{DATA.university}</p>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#1E293B] font-serif leading-tight mb-12">{DATA.candidateName}</h1>
                <div className="bg-white/40 backdrop-blur-md border border-white/60 p-6 md:p-8 rounded-2xl shadow-lg mb-12 max-w-sm w-full mx-auto">
                    <p className="text-[#64748B] text-xs uppercase tracking-widest mb-3 font-bold">Kepada Yth.</p>
                    <h4 className="text-[#1E293B] text-lg md:text-2xl font-serif font-bold mb-1">Bapak/Ibu/Saudara/i</h4>
                    <p className="text-[#475569] text-sm italic">di tempat</p>
                </div>
                <button 
                  onClick={() => { setIsOpened(true); setActiveTab(1); }} 
                  className="group relative px-12 py-5 bg-[#1E293B] text-white rounded-full font-bold uppercase tracking-widest shadow-2xl hover:scale-105 transition-all overflow-hidden border border-white/10"
                >
                    <span className="relative z-10">Buka Undangan</span>
                    <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </button>
            </div>
        </Section>

        {/* 2. PROFIL */}
        <Section isActive={activeTab === 1}>
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24 max-w-7xl">
                <div className="w-64 h-64 md:w-[450px] md:h-[450px] rounded-full border-[12px] border-white overflow-hidden shadow-2xl bg-white shrink-0 relative group">
                    <img src="https://res.cloudinary.com/drs5bj8tq/image/upload/v1771240410/WhatsApp_Image_2026-02-16_at_16.01.48_jml9pe.jpg" alt="Foto Profil" className="w-full h-full object-cover object-top" />
                </div>
                <div className="text-center lg:text-left max-w-2xl px-4">
                    <div className="mb-6 md:mb-10 inline-flex items-center gap-3 px-6 py-2 rounded-full border border-[#94A3B8]/30 bg-white shadow-sm text-[#475569] text-xs tracking-widest uppercase font-bold">
                        <Star size={12} fill="#64748B" /> Profil Promovendus
                    </div>
                    <h2 className="text-3xl md:text-6xl font-serif font-bold text-[#1E293B] mb-6 leading-tight">{DATA.candidateName}</h2>
                    <p className="text-[#475569] text-base md:text-2xl italic border-l-4 border-[#1E293B] pl-6 mb-8 leading-relaxed">"Assalamu’alaikum Warahmatullahi Wabarakatuh"</p>
                    <div className="bg-white/80 p-8 md:p-10 rounded-[2rem] shadow-xl text-justify md:text-left text-sm md:text-lg leading-relaxed font-serif relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-32 h-32 opacity-10 -mr-10 -mt-10 rotate-45"><BatikKawung /></div>
                         Dengan segala kerendahan hati, kami memohon doa restu Bapak/Ibu/Saudara/i atas tercapainya tahapan Sidang Promosi Doktor ini. Semoga ilmu yang didapatkan menjadi keberkahan dan bermanfaat bagi masyarakat luas.
                    </div>
                </div>
            </div>
        </Section>

        {/* 3. ACARA */}
        <Section isActive={activeTab === 2}>
            <div className="bg-white/80 backdrop-blur-xl p-8 md:p-16 rounded-[3rem] shadow-2xl text-center max-w-5xl w-full border border-white relative overflow-hidden">
                <h2 className="text-[#64748B] font-bold tracking-[0.4em] text-xs md:text-base mb-10 uppercase font-sans">Pelaksanaan Sidang</h2>
                <h1 className="text-3xl md:text-6xl font-serif text-[#1E293B] mb-12 font-bold uppercase leading-tight">Sidang Terbuka Promosi Doktor</h1>
                
                <div className="bg-[#F8FAFC] p-8 md:p-10 rounded-3xl border border-slate-100 shadow-inner mb-12">
                    <h3 className="text-[#64748B] text-xs uppercase font-bold mb-4 tracking-widest italic font-sans">Judul Disertasi</h3>
                    <p className="text-[#1E293B] text-base md:text-2xl font-bold uppercase font-serif leading-relaxed">"{DATA.dissertation}"</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 text-[#1E293B] mb-12">
                    <div className="p-8 bg-white rounded-3xl shadow-sm border border-slate-50 flex flex-col items-center gap-2">
                        <Calendar className="text-slate-400 mb-2" size={24} />
                        <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest font-sans">Tanggal</span>
                        <span className="font-bold text-xl md:text-2xl font-serif">{DATA.date}</span>
                    </div>
                    <div className="p-8 bg-white rounded-3xl shadow-sm border border-slate-50 flex flex-col items-center gap-2">
                        <Clock className="text-slate-400 mb-2" size={24} />
                        <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest font-sans">Waktu</span>
                        <span className="font-bold text-xl md:text-2xl font-serif">{DATA.time}</span>
                    </div>
                </div>

                <div className="p-8 bg-white rounded-3xl shadow-sm border border-slate-50 mb-10 group hover:shadow-md transition-all">
                    <MapPin className="mx-auto mb-4 text-[#1E293B] group-hover:scale-110 transition-transform" size={32} />
                    <span className="block text-xs font-bold uppercase text-slate-400 mb-3 tracking-[0.2em] font-sans">Lokasi</span>
                    <span className="font-bold text-xl md:text-2xl font-serif block mb-2">{DATA.location}</span>
                    <p className="text-sm md:text-lg text-[#475569] leading-relaxed italic font-serif">{DATA.address}</p>
                </div>
                
                <button 
                    onClick={() => setActiveTab(6)} 
                    className="px-12 py-5 bg-[#1E293B] text-white rounded-full font-bold uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-4 mx-auto group ring-4 ring-[#1E293B]/5 font-sans"
                >
                    Konfirmasi Kehadiran <ChevronRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </button>
            </div>
        </Section>

        {/* 4. COUNTDOWN */}
        <Section isActive={activeTab === 3}>
            <div className="text-center px-4 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-40 opacity-[0.05] pointer-events-none"><BatikKawung /></div>
                <h3 className="text-[#475569] text-sm md:text-xl tracking-[0.5em] mb-10 uppercase font-bold font-sans">Momen Bersejarah</h3>
                <h1 className="text-5xl md:text-9xl font-serif text-[#1E293B] mb-16 italic font-bold">The Victorious Day</h1>
                <CountdownTimer />
            </div>
        </Section>

        {/* 5. MAPS */}
        <Section isActive={activeTab === 4}>
            <div className="w-full max-w-7xl h-auto md:h-[70vh] flex flex-col md:flex-row gap-8 md:gap-12">
                <div className="flex-1 rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl min-h-[300px]">
                    <iframe src={DATA.googleMapUrl} className="w-full h-full grayscale-[0.2]" loading="lazy" title="Location Map"></iframe>
                </div>
                <div className="w-full md:w-1/3 bg-white p-10 md:p-14 rounded-[2.5rem] shadow-xl flex flex-col justify-center relative overflow-hidden border border-slate-100 text-center md:text-left">
                    <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.05] -mr-10 -mt-10"><BatikTruntum /></div>
                    <MapPin className="text-[#1E293B] mb-8 mx-auto md:mx-0" size={60} strokeWidth={1} />
                    <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Navigasi Lokasi</h2>
                    <p className="text-xl md:text-2xl font-bold mb-3 text-[#1E293B]">{DATA.location}</p>
                    <p className="text-[#64748B] text-base md:text-lg mb-10 font-serif italic leading-relaxed">{DATA.address}</p>
                    <a href="https://goo.gl/maps/xyz" target="_blank" rel="noopener noreferrer" className="block text-center py-4 bg-slate-100 text-[#1E293B] rounded-2xl font-bold shadow-sm tracking-widest hover:bg-slate-200 transition-all uppercase font-sans">Lihat di Google Maps</a>
                </div>
            </div>
        </Section>

        {/* 6. PROMOTOR */}
        <Section isActive={activeTab === 5}>
            <div className="w-full max-w-6xl px-4 flex flex-col gap-12">
                <h2 className="text-center text-3xl md:text-6xl font-serif font-bold text-[#1E293B] uppercase tracking-widest">Dewan Akademik</h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                    {DATA.promoters.map((p, idx) => (
                        <div key={idx} className="bg-white p-10 rounded-[2rem] shadow-lg border border-slate-50 relative group overflow-hidden">
                            <div className="absolute bottom-0 right-0 w-24 h-24 opacity-[0.03] -mr-8 -mb-8 group-hover:rotate-12 transition-transform"><BatikKawung /></div>
                            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-[0.3em] mb-3 font-sans">{p.title}</h3>
                            <p className="text-2xl md:text-3xl font-serif font-bold text-[#1E293B]">{p.name}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white/90 backdrop-blur-md p-8 md:p-14 rounded-[3rem] shadow-2xl border border-white relative overflow-hidden">
                    <h3 className="text-center text-2xl md:text-4xl font-serif font-bold mb-12 text-[#1E293B] uppercase tracking-widest font-sans">Dewan Penelaah</h3>
                    <div className="grid md:grid-cols-2 gap-x-12 gap-y-6 text-left">
                        {DATA.reviewers.map((name, idx) => (
                            <div key={idx} className="flex items-start gap-5 py-5 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors px-4 rounded-xl">
                                <CheckCircle className="text-blue-700 shrink-0 mt-1" size={24} strokeWidth={1.5} />
                                <span className="font-serif text-lg md:text-2xl text-[#1E293B] leading-snug">{name}</span>
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

        {/* 8. THANK YOU */}
        <Section isActive={activeTab === 7}>
            <FinalThankYouSection candidateName={DATA.candidateName} university={DATA.university} />
        </Section>
      </main>
    </div>
  );
};

export default App;