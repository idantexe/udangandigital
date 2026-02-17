import React, { useState, useEffect } from 'react';
import { Send, RefreshCw, Sparkles, MessageSquare, AlertTriangle, PenTool } from 'lucide-react';
import { collection, addDoc, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { generateWish } from '../services/geminiService';
import { BatikTruntum } from './Background';

interface RsvpSectionProps {
  onFinish: () => void;
}

interface Wish {
  id?: string;
  nama: string;
  group: string;
  ucapan: string;
  kehadiran: string;
  timestamp: any;
}

const RsvpSection: React.FC<RsvpSectionProps> = ({ onFinish }) => {
  const [name, setName] = useState("");
  const [group, setGroup] = useState("");
  const [phone, setPhone] = useState("");
  const [attendance, setAttendance] = useState("Hadir");
  const [msg, setMsg] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [isLoadingWishes, setIsLoadingWishes] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "rsvps"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const loadedWishes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Wish[];
        setWishes(loadedWishes);
        setIsLoadingWishes(false);
        setError(null);
      },
      (err) => {
        console.error("Firestore Read Error:", err.code);
        if (err.code === 'permission-denied') {
          setError("Izin database ditolak. Mohon cek konfigurasi Firebase.");
        } else {
          setError("Gagal memuat data ucapan.");
        }
        setIsLoadingWishes(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleGenerateAI = async () => {
    if (!name) { alert("Mohon isi nama terlebih dahulu"); return; }
    setIsGenerating(true);
    try {
      const generatedMsg = await generateWish(name);
      setMsg(generatedMsg);
    } catch (e) { console.error(e); alert("Gagal membuat ucapan."); } finally { setIsGenerating(false); }
  };

  const handleSend = async () => {
    if (!name || !msg) { alert("Mohon lengkapi Nama dan Ucapan."); return; }
    try {
      await addDoc(collection(db, "rsvps"), {
        nama: name, group: group || "Umum", phone: phone, kehadiran: attendance, ucapan: msg, timestamp: Timestamp.now()
      });
      setName(""); setGroup(""); setPhone(""); setMsg("");
      setTimeout(() => { onFinish(); }, 1000);
    } catch (error: any) {
      console.error("Error adding document: ", error);
      alert("Gagal mengirim konfirmasi.");
    }
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return "";
    try {
      const date = timestamp.toDate();
      const now = new Date();
      const diff = Math.floor((now.getTime() - date.getTime()) / 60000);
      if (diff < 1) return "Baru saja";
      if (diff < 60) return `${diff}m lalu`;
      if (diff < 1440) return `${Math.floor(diff / 60)}j lalu`;
      return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    } catch (e) { return ""; }
  };

  return (
    <div className="w-full max-w-5xl px-2 md:px-4 flex flex-col items-center pb-32">
      <div className="text-center mb-8 md:mb-10">
        <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] md:tracking-[0.4em] text-amber-600 uppercase mb-2 block font-cinzel">Reservasi</span>
        <h2 className="text-2xl md:text-5xl font-cinzel text-[#0F172A]">Konfirmasi Kehadiran</h2>
        <div className="w-16 md:w-24 h-1 bg-amber-500 mx-auto mt-4 rounded-full"></div>
      </div>
      
      <div className="w-full grid lg:grid-cols-5 gap-6 md:gap-8 items-start">
        {/* Form Section */}
        <div className="lg:col-span-3 glass-panel p-6 md:p-12 rounded-t-[2rem] rounded-bl-[2rem] relative overflow-hidden group hover:shadow-lg transition-all duration-500 bg-white/80">
          <div className="absolute top-0 right-0 w-32 h-32 md:w-40 md:h-40 opacity-[0.05] -mr-8 -mt-8 md:-mr-10 md:-mt-10 rotate-12 pointer-events-none"><BatikTruntum /></div>
          
          <div className="space-y-6 md:space-y-8 relative z-10">
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              <div className="relative group pt-2">
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full py-2.5 md:py-3 bg-transparent border-b border-slate-300 focus:border-amber-600 outline-none transition-colors font-serif text-base md:text-lg text-slate-800 placeholder-transparent peer" placeholder="Nama" id="name" autoComplete="off" />
                <label htmlFor="name" className="absolute left-0 -top-3.5 text-slate-500 text-[10px] md:text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-slate-600 peer-focus:text-[10px] md:peer-focus:text-xs uppercase tracking-wider">Nama Lengkap & Gelar</label>
              </div>
              <div className="relative group pt-2">
                <input value={group} onChange={(e) => setGroup(e.target.value)} className="w-full py-2.5 md:py-3 bg-transparent border-b border-slate-300 focus:border-amber-600 outline-none transition-colors font-serif text-base md:text-lg text-slate-800 placeholder-transparent peer" placeholder="Instansi" id="instansi" autoComplete="off" />
                <label htmlFor="instansi" className="absolute left-0 -top-3.5 text-slate-500 text-[10px] md:text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-slate-600 peer-focus:text-[10px] md:peer-focus:text-xs uppercase tracking-wider">Instansi / Hubungan</label>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              <div className="relative group pt-2">
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full py-2.5 md:py-3 bg-transparent border-b border-slate-300 focus:border-amber-600 outline-none transition-colors font-serif text-base md:text-lg text-slate-800 placeholder-transparent peer" placeholder="WhatsApp" id="wa" autoComplete="off" />
                <label htmlFor="wa" className="absolute left-0 -top-3.5 text-slate-500 text-[10px] md:text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-slate-600 peer-focus:text-[10px] md:peer-focus:text-xs uppercase tracking-wider">Nomor WhatsApp</label>
              </div>
               <div>
                  <label className="block text-[9px] md:text-[10px] font-bold uppercase text-slate-400 mb-2 tracking-widest">Status Kehadiran</label>
                  <div className="flex bg-slate-100/50 p-1 rounded-full border border-slate-200">
                    {['Hadir', 'Tidak Hadir'].map(opt => (
                      <button key={opt} onClick={() => setAttendance(opt)} className={`flex-1 py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all duration-300 ${attendance === opt ? 'bg-[#0F172A] text-amber-50 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>{opt}</button>
                    ))}
                  </div>
               </div>
            </div>

            <div className="relative pt-4">
               <div className="flex justify-between items-end mb-2">
                 <label className="text-[10px] md:text-xs font-bold uppercase text-slate-500 tracking-widest">Ucapan & Doa</label>
                 <button onClick={handleGenerateAI} disabled={!name || isGenerating} className={`text-[9px] md:text-[10px] flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100 transition-all ${(!name || isGenerating) && 'opacity-50 grayscale'}`}>
                    {isGenerating ? <RefreshCw className="animate-spin" size={10}/> : <Sparkles size={10}/>} {isGenerating ? 'Merangkai Kata...' : 'Buatkan via AI'}
                 </button>
               </div>
               <textarea value={msg} onChange={(e) => setMsg(e.target.value)} rows={3} className="w-full p-4 bg-slate-50/50 border border-slate-200 focus:border-amber-500 rounded-xl font-serif text-sm md:text-base text-slate-700 outline-none transition-all resize-none italic" placeholder="Tuliskan doa restu Anda di sini..."></textarea>
            </div>

            <button onClick={handleSend} className="w-full py-3.5 md:py-4 bg-[#0F172A] hover:bg-slate-800 text-white rounded-xl font-cinzel font-bold tracking-[0.2em] shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 border border-slate-700/50 text-xs md:text-sm">
              <span>Kirim Konfirmasi</span> <Send size={16} />
            </button>
          </div>
        </div>

        {/* Wishes Feed */}
        <div className="lg:col-span-2 h-full min-h-[300px] md:min-h-[400px] flex flex-col mt-4 lg:mt-0">
          <div className="flex items-center gap-3 mb-4 md:mb-6 px-2">
             <div className="bg-amber-100 p-2 rounded-full text-amber-800"><MessageSquare size={16} /></div>
             <h3 className="font-cinzel text-base md:text-lg font-bold text-slate-800">Ucapan Masuk <span className="text-slate-400 text-xs md:text-sm font-sans ml-1">({wishes.length})</span></h3>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3 md:space-y-4 max-h-[500px] md:max-h-[600px]">
             {isLoadingWishes ? (
               <div className="text-center py-10 text-slate-400 text-xs md:text-sm animate-pulse">Mengambil data...</div>
             ) : wishes.length === 0 ? (
               <div className="text-center py-10 border border-dashed border-slate-300 rounded-xl text-slate-400 text-xs md:text-sm italic">Jadilah yang pertama memberikan ucapan.</div>
             ) : (
               wishes.map((wish) => (
                 <div key={wish.id} className="bg-white p-4 md:p-5 rounded-xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-slate-100 hover:border-amber-100 transition-all group">
                    <div className="flex justify-between items-start mb-2">
                       <div>
                          <h4 className="font-serif font-bold text-slate-800 text-sm md:text-base">{wish.nama}</h4>
                          <span className="text-[9px] md:text-[10px] text-amber-700 uppercase tracking-wider font-bold">{wish.group}</span>
                       </div>
                       <span className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${wish.kehadiran === 'Hadir' ? 'bg-emerald-500' : 'bg-rose-500'}`} title={wish.kehadiran}></span>
                    </div>
                    <p className="font-serif italic text-slate-600 text-xs md:text-sm leading-relaxed border-l-2 border-slate-100 pl-3 group-hover:border-amber-300 transition-colors">"{wish.ucapan}"</p>
                    <div className="mt-2 md:mt-3 flex justify-end">
                       <span className="text-[9px] text-slate-400 uppercase tracking-widest">{formatTime(wish.timestamp)}</span>
                    </div>
                 </div>
               ))
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RsvpSection;