import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, limit } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { RsvpData } from '../types';
import { generateWish } from '../services/geminiService';
import { Send, RefreshCw, Sparkles, MessageSquare, Loader2, Clock } from 'lucide-react';
import { BatikTruntum } from './BatikPatterns';

interface RsvpSectionProps {
  onFinish: () => void;
}

const RsvpSection: React.FC<RsvpSectionProps> = ({ onFinish }) => {
  const [name, setName] = useState("");
  const [group, setGroup] = useState("");
  const [phone, setPhone] = useState("");
  const [attendance, setAttendance] = useState("Hadir");
  const [msg, setMsg] = useState("");
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [rsvps, setRsvps] = useState<RsvpData[]>([]);

  // Listen to Realtime Data
  useEffect(() => {
    const q = query(collection(db, "rsvps"), orderBy("createdAt", "desc"), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as RsvpData[];
      setRsvps(data);
    });

    return () => unsubscribe();
  }, []);

  const handleGenerateAI = async () => {
    if (!name) {
        alert("Mohon isi Nama Lengkap terlebih dahulu untuk menggunakan fitur AI.");
        return;
    }
    setIsGenerating(true);
    const wish = await generateWish(name);
    setMsg(wish);
    setIsGenerating(false);
  };

  const handleSend = async () => {
    if (!name || !msg) {
        alert("Mohon lengkapi Nama dan Ucapan.");
        return;
    }

    setIsSending(true);
    try {
      await addDoc(collection(db, "rsvps"), {
        nama: name,
        group: group || "Tamu Undangan",
        phone: phone,
        attendance: attendance,
        ucapan: msg,
        createdAt: serverTimestamp()
      });
      
      setName("");
      setGroup("");
      setPhone("");
      setMsg("");
      // Wait a bit to show success state or just move
      setTimeout(() => {
        onFinish();
      }, 1000);
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Gagal mengirim data. Pastikan koneksi internet lancar.");
    } finally {
      setIsSending(false);
    }
  };

  // Helper to format timestamp relative time
  const formatTime = (timestamp: any) => {
    if (!timestamp) return "Baru saja";
    
    // Handle Firestore Timestamp or standard Date
    let date;
    if (typeof timestamp.toDate === 'function') {
        date = timestamp.toDate();
    } else {
        date = new Date(timestamp);
    }

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Baru saja";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit yang lalu`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`;
    return `${Math.floor(diffInSeconds / 86400)} hari yang lalu`;
  };

  return (
    <div className="w-full max-w-5xl px-4 flex flex-col items-center pb-20">
      <h2 className="text-3xl md:text-6xl font-serif font-bold text-center mb-12 md:mb-16 uppercase tracking-[0.2em] text-[#1E293B]">Konfirmasi Kehadiran</h2>
      
      <div className="bg-white p-6 md:p-14 rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-white text-left mb-20 relative overflow-hidden w-full text-left">
        <div className="absolute top-0 right-0 w-64 h-64 opacity-[0.03] -mr-20 -mt-20"><BatikTruntum /></div>
        
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-8 relative z-10">
          <div className="space-y-6 font-sans">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-2 tracking-widest">Nama Lengkap</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full p-4 md:p-5 bg-slate-50 border border-slate-100 rounded-2xl font-serif text-base outline-none focus:ring-2 focus:ring-blue-100 transition-all shadow-inner text-slate-800" placeholder="Nama Anda" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-2 tracking-widest">Instansi / Hubungan</label>
              <input value={group} onChange={(e) => setGroup(e.target.value)} className="w-full p-4 md:p-5 bg-slate-50 border border-slate-100 rounded-2xl font-serif text-base outline-none focus:ring-2 focus:ring-blue-100 transition-all shadow-inner text-slate-800" placeholder="Contoh: Kolega, Alumni, Keluarga" />
            </div>
          </div>
          <div className="space-y-6 font-sans">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-2 tracking-widest">No WhatsApp (Opsional)</label>
              <div className="flex shadow-inner rounded-2xl overflow-hidden">
                <span className="bg-slate-200 px-5 flex items-center text-slate-600 font-bold border border-slate-200 border-r-0">+62</span>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-4 md:p-5 bg-slate-50 border border-slate-100 border-l-0 outline-none focus:ring-2 focus:ring-blue-100 transition-all font-serif text-slate-800" placeholder="81234..." />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-2 tracking-widest">Konfirmasi</label>
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
            <button onClick={handleGenerateAI} disabled={!name || isGenerating} className={`text-[9px] md:text-[10px] font-bold text-blue-700 flex items-center gap-2 bg-blue-50 px-4 py-1.5 rounded-full hover:bg-blue-100 transition-all ${(!name || isGenerating) && 'opacity-50'}`}>
              {isGenerating ? <RefreshCw className="animate-spin" size={12}/> : <Sparkles size={12}/>} Buat dengan AI
            </button>
          </div>
          <textarea value={msg} onChange={(e) => setMsg(e.target.value)} rows={4} className="w-full p-5 bg-slate-50 border border-slate-100 rounded-3xl font-serif text-base outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none shadow-inner text-slate-800" placeholder="Tulis ucapan selamat dan doa restu..."></textarea>
        </div>

        <button onClick={handleSend} disabled={isSending} className="w-full py-5 md:py-7 bg-[#1E293B] text-white rounded-3xl font-bold text-lg md:text-xl shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-4 uppercase tracking-[0.4em] relative z-10 font-sans disabled:opacity-70 disabled:cursor-not-allowed">
            {isSending ? <Loader2 className="animate-spin" /> : <>Kirim Konfirmasi <Send size={20}/></>}
        </button>
      </div>

      <div className="w-full text-left">
        <h3 className="text-2xl md:text-4xl font-serif font-bold text-[#1E293B] mb-10 flex items-center gap-4">
          <MessageSquare size={32} strokeWidth={1.5} /> Ucapan & Doa Suci
        </h3>
        <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar pb-10">
          {rsvps.length === 0 ? (
            <div className="text-center py-10 opacity-50">
                <p className="text-slate-400 italic">Belum ada ucapan yang masuk.</p>
                <p className="text-slate-400 text-sm">Jadilah yang pertama memberikan selamat.</p>
            </div>
          ) : (
            rsvps.map((wish) => (
              <div key={wish.id} className="bg-white/70 backdrop-blur-sm p-6 md:p-10 rounded-[2rem] border border-white/50 shadow-sm animate-fadeInUp">
                <div className="flex justify-between items-start mb-3 font-sans text-left">
                  <div>
                    <h4 className="text-lg md:text-xl font-serif font-bold text-[#1E293B] flex items-center gap-2">
                        {wish.nama}
                    </h4>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mt-1">{wish.group}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-[9px] uppercase font-bold px-3 py-1 rounded-full ${wish.attendance === 'Hadir' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{wish.attendance}</span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock size={10} /> {formatTime(wish.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="w-full h-px bg-slate-100 my-4"></div>
                <p className="text-sm md:text-lg font-serif italic text-[#475569] leading-relaxed text-left">"{wish.ucapan}"</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RsvpSection;