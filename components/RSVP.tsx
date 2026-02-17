import React, { useState, useEffect } from 'react';
import { Send, RefreshCw, Sparkles, MessageSquare, AlertTriangle, WifiOff } from 'lucide-react';
import { collection, addDoc, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { generateWish } from '../services/geminiService';
import { BatikKawung } from './Background';

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

  // Fetch wishes from Firebase
  useEffect(() => {
    const q = query(collection(db, "rsvps"), orderBy("timestamp", "desc"));
    
    // onSnapshot dengan error handling callback
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const loadedWishes = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Wish[];
        setWishes(loadedWishes);
        setIsLoadingWishes(false);
        setError(null);
      },
      (err) => {
        console.error("Firestore Read Error:", err.code);
        
        if (err.code === 'permission-denied') {
          setError("Izin database ditolak. Mohon cek konfigurasi 'Firestore Rules' di Firebase Console.");
        } else if (err.code === 'unavailable') {
          setError("Koneksi offline. Mohon periksa internet Anda.");
        } else {
          setError("Gagal memuat data ucapan.");
        }
        setIsLoadingWishes(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleGenerateAI = async () => {
    if (!name) {
      alert("Mohon isi nama terlebih dahulu");
      return;
    }
    setIsGenerating(true);
    try {
      const generatedMsg = await generateWish(name);
      setMsg(generatedMsg);
    } catch (e) {
      console.error(e);
      alert("Gagal membuat ucapan. Silakan coba lagi.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSend = async () => {
    if (!name || !msg) {
      alert("Mohon lengkapi Nama dan Ucapan.");
      return;
    }

    try {
      await addDoc(collection(db, "rsvps"), {
        nama: name,
        group: group || "Umum",
        phone: phone,
        kehadiran: attendance,
        ucapan: msg,
        timestamp: Timestamp.now()
      });
      
      // Clear form
      setName("");
      setGroup("");
      setPhone("");
      setMsg("");
      
      // Navigate to next tab after short delay
      setTimeout(() => {
        onFinish();
      }, 1000);
    } catch (error: any) {
      console.error("Error adding document: ", error);
      if (error.code === 'permission-denied') {
        alert("GAGAL KIRIM: Database terkunci. Pastikan Rules Firestore sudah diatur ke 'public' atau Auth Anonymous aktif.");
      } else {
        alert("Gagal mengirim konfirmasi. Silakan periksa koneksi internet Anda.");
      }
    }
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return "";
    try {
      const date = timestamp.toDate();
      const now = new Date();
      const diff = Math.floor((now.getTime() - date.getTime()) / 60000); // minutes

      if (diff < 1) return "Baru saja";
      if (diff < 60) return `${diff} menit yang lalu`;
      if (diff < 1440) return `${Math.floor(diff / 60)} jam yang lalu`;
      return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    } catch (e) {
      return "";
    }
  };

  return (
    <div className="w-full max-w-5xl px-4 flex flex-col items-center pb-24">
      <h2 className="text-2xl md:text-6xl font-serif font-bold text-center mb-8 md:mb-16 uppercase tracking-[0.2em] text-[#1E293B]">Konfirmasi Kehadiran</h2>
      
      <div className="bg-white/95 backdrop-blur-md p-6 md:p-14 rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.12)] border border-white text-left mb-16 relative overflow-hidden w-full max-w-4xl">
        <div className="absolute top-0 right-0 w-64 h-64 opacity-[0.04] -mr-20 -mt-20 rotate-45"><BatikKawung /></div>
        
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-8 relative z-10 font-sans">
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-2 tracking-widest">Nama Lengkap</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full p-4 md:p-5 bg-slate-50 border border-slate-100 rounded-2xl font-serif text-base outline-none focus:ring-2 focus:ring-blue-100 transition-all shadow-inner" placeholder="Nama Anda" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-2 tracking-widest">Group / Instansi</label>
              <input value={group} onChange={(e) => setGroup(e.target.value)} className="w-full p-4 md:p-5 bg-slate-50 border border-slate-100 rounded-2xl font-serif text-base outline-none focus:ring-2 focus:ring-blue-100 transition-all shadow-inner" placeholder="Contoh: Alumni UNPAS" />
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-2 tracking-widest">No WhatsApp</label>
              <div className="flex shadow-inner rounded-2xl overflow-hidden border border-slate-100">
                <span className="bg-slate-200 px-5 flex items-center text-slate-600 font-bold border-r border-slate-200">+62</span>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-4 md:p-5 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-100 transition-all font-serif" placeholder="81234..." />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-2 tracking-widest">Kehadiran</label>
              <div className="flex gap-4">
                {['Hadir', 'Tidak Hadir'].map(opt => (
                  <button key={opt} onClick={() => setAttendance(opt)} className={`flex-1 p-4 md:p-5 rounded-2xl font-bold uppercase tracking-widest transition-all text-xs md:text-sm ${attendance === opt ? 'bg-[#1E293B] text-white shadow-lg' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}>{opt}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="relative mb-10 z-10 font-sans">
          <div className="flex justify-between items-center mb-3 px-2">
            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Pesan & Doa</label>
            <button 
              onClick={handleGenerateAI} 
              disabled={!name || isGenerating} 
              className={`text-[9px] md:text-[10px] font-bold text-blue-700 flex items-center gap-2 bg-blue-50 px-4 py-1.5 rounded-full hover:bg-blue-100 transition-all border border-blue-200 ${(!name || isGenerating) && 'opacity-50 cursor-not-allowed'}`}
            >
              {isGenerating ? <RefreshCw className="animate-spin" size={12}/> : <Sparkles size={12}/>} 
              {isGenerating ? 'Menulis...' : 'Tulis via AI'}
            </button>
          </div>
          <textarea value={msg} onChange={(e) => setMsg(e.target.value)} rows={4} className="w-full p-5 bg-slate-50 border border-slate-100 rounded-3xl font-serif text-base outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none shadow-inner" placeholder="Tulis ucapan selamat..."></textarea>
        </div>

        <button onClick={handleSend} className="w-full py-5 md:py-7 bg-[#1E293B] text-white rounded-3xl font-bold text-lg md:text-xl shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-4 uppercase tracking-[0.4em] relative z-10 font-sans group">
          Kirim Konfirmasi <Send size={20} className="group-hover:translate-x-2 transition-transform"/>
        </button>
      </div>

      <div className="w-full text-left max-w-4xl">
        <h3 className="text-xl md:text-4xl font-serif font-bold text-[#1E293B] mb-8 md:mb-12 flex items-center gap-4">
          <MessageSquare size={32} strokeWidth={1.5} /> Ucapan & Doa Suci ({wishes.length})
        </h3>
        <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          {isLoadingWishes ? (
             <div className="text-center p-10 text-slate-400 animate-pulse">Memuat ucapan...</div>
          ) : error ? (
             <div className="p-6 md:p-8 text-amber-700 bg-amber-50 rounded-[2rem] border border-amber-100 flex flex-col items-center gap-3 text-center">
                <AlertTriangle size={32} />
                <p className="font-bold text-sm md:text-base">{error}</p>
                <p className="text-xs opacity-70">Data tidak dapat ditampilkan saat ini.</p>
             </div>
          ) : wishes.length === 0 ? (
             <div className="text-center p-10 text-slate-400 bg-white/50 rounded-3xl border border-white">Belum ada ucapan. Jadilah yang pertama!</div>
          ) : (
            wishes.map((wish) => (
              <div key={wish.id} className="bg-white/70 backdrop-blur-sm p-6 md:p-10 rounded-[2rem] border border-white/50 shadow-sm animate-fadeInUp transition-all hover:bg-white hover:shadow-md">
                <div className="flex justify-between items-start mb-3 font-sans">
                  <div>
                    <h4 className="text-base md:text-xl font-serif font-bold text-[#1E293B]">{wish.nama}</h4>
                    <div className="flex items-center gap-2">
                       <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">{wish.group}</p>
                       <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${wish.kehadiran === 'Hadir' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{wish.kehadiran}</span>
                    </div>
                  </div>
                  <span className="text-[9px] text-slate-400 uppercase font-bold bg-slate-50 px-3 py-1 rounded-full">{formatTime(wish.timestamp)}</span>
                </div>
                <p className="text-sm md:text-lg font-serif italic text-[#475569] leading-relaxed">"{wish.ucapan}"</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RsvpSection;