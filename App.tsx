
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { User, JRCGame, GenerationRequest } from './types';
import { generateJRC } from './services/geminiService';
import { SoccerPitch } from './components/SoccerPitch';
import { 
  Trophy, 
  LogOut, 
  BookOpen, 
  ChevronRight, 
  Zap,
  Download,
  Loader2,
  CheckCircle2,
  Target
} from 'lucide-react';

const Navbar: React.FC<{ user: User; onLogout: () => void }> = ({ user, onLogout }) => (
  <nav className="border-b border-white/10 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between print:hidden">
    <div className="flex items-center gap-2">
      <div className="bg-emerald-500 p-2 rounded-lg shadow-lg shadow-emerald-500/20">
        <Trophy className="w-5 h-5 text-slate-900" />
      </div>
      <span className="text-xl font-black italic tracking-tighter uppercase">SISTÊMICA <span className="text-emerald-400">SOCCER</span></span>
    </div>
    <div className="flex items-center gap-4">
      <span className="hidden sm:inline text-xs font-bold text-slate-400">Prof. {user.name}</span>
      <button onClick={onLogout} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 transition-colors"><LogOut size={18} /></button>
    </div>
  </nav>
);

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [game, setGame] = useState<JRCGame | null>(null);
  const [form, setForm] = useState<GenerationRequest>({ theme: '', category: '', duration: '', intensity: 'medium' });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await generateJRC(form);
      setGame(result);
    } catch (e) {
      alert("Erro ao conectar com a IA. Verifique sua chave API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-10 w-full">
      {!game ? (
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-8">
            <h1 className="text-5xl sm:text-7xl font-black italic tracking-tighter leading-[0.9] uppercase">Projete treinos de <span className="text-emerald-500 underline decoration-white/10">elite</span>.</h1>
            <p className="text-slate-400 text-lg max-w-md">Utilize a ciência da complexidade para criar jogos que provocam inteligência tática automática.</p>
            
            <form onSubmit={handleGenerate} className="bg-slate-800/40 p-6 sm:p-10 rounded-[2.5rem] border border-white/5 space-y-6 shadow-2xl">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">O que quer treinar?</label>
                  <input required placeholder="Ex: Transição Defensiva Rápida" className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
                    onChange={e => setForm({...form, theme: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Categoria</label>
                    <input required placeholder="Ex: Sub-17" className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" 
                      onChange={e => setForm({...form, category: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Tempo</label>
                    <input required placeholder="Ex: 15 min" className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" 
                      onChange={e => setForm({...form, duration: e.target.value})} />
                  </div>
                </div>
              </div>
              <button disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all disabled:opacity-50">
                {loading ? <Loader2 className="animate-spin" /> : <Zap fill="currentColor" size={18} />}
                {loading ? 'SISTEMATIZANDO...' : 'CONSTRUIR JRC AGORA'}
              </button>
            </form>
          </div>
          <div className="hidden lg:flex bg-emerald-500/5 border border-emerald-500/10 p-12 rounded-[3rem] items-center justify-center">
             <p className="italic text-slate-500 text-2xl text-center leading-relaxed">
               "No futebol, a forma é a interação."
             </p>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-end print:hidden">
            <button onClick={() => setGame(null)} className="text-emerald-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:underline">
               <ChevronRight className="rotate-180" size={14} /> Voltar ao Painel
            </button>
            <button onClick={() => window.print()} className="bg-white text-slate-900 px-6 py-3 rounded-xl font-black text-xs flex items-center gap-2">
              <Download size={14} /> SALVAR PDF
            </button>
          </div>

          <div className="bg-slate-800/20 border border-white/10 rounded-[3rem] overflow-hidden print:bg-white print:text-black print:border-none">
            <div className="p-8 lg:p-16 space-y-12">
              <header className="border-b border-white/10 pb-8 flex flex-col sm:flex-row justify-between items-start print:border-slate-200">
                <div className="space-y-2">
                   <span className="text-emerald-400 font-black text-[10px] uppercase tracking-[0.3em]">{game.category} • {game.duration}</span>
                   <h2 className="text-4xl lg:text-7xl font-black italic tracking-tighter uppercase">{game.title}</h2>
                   <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">{game.theme}</p>
                </div>
                <div className="mt-4 sm:mt-0 text-[10px] font-black uppercase text-emerald-400 bg-emerald-400/10 px-4 py-2 rounded-full">
                  Ficha Técnica Gerada por IA
                </div>
              </header>

              <div className="grid lg:grid-cols-3 gap-16">
                <div className="lg:col-span-2 space-y-12">
                  <section>
                    <h3 className="text-emerald-400 font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                      <BookOpen size={16} /> Dinâmica e Objetivos
                    </h3>
                    <p className="text-slate-300 leading-relaxed text-lg print:text-slate-700">{game.description}</p>
                  </section>
                  
                  <section className="bg-slate-950/50 p-8 rounded-3xl border border-white/5 print:bg-slate-50 print:border-slate-200">
                    <h3 className="text-amber-400 font-black text-xs uppercase tracking-widest mb-6">Regras de Provocação (Condicionantes)</h3>
                    <div className="grid gap-4">
                      {game.rules.map((r, i) => (
                        <div key={i} className="flex gap-4 items-start text-sm text-slate-400 print:text-slate-800">
                          <CheckCircle2 size={18} className="text-emerald-500 mt-1 flex-shrink-0" />
                          <span>{r}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                <div className="space-y-10">
                  <SoccerPitch dimensions={game.setup.dimensions} playersCount={game.setup.players} visualData={game.visualData} />
                  
                  <div className="bg-emerald-500/10 p-8 rounded-[2rem] border border-emerald-500/20 relative overflow-hidden">
                    <Target className="absolute -right-4 -bottom-4 text-emerald-500/10 w-24 h-24" />
                    <h4 className="text-[10px] font-black uppercase text-emerald-400 mb-4 tracking-widest">Foco Sistêmico</h4>
                    <p className="text-sm text-slate-200 italic font-medium">"{game.systemicFocus}"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('soccer_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = () => {
    const u: User = { id: '1', name: 'Treinador Pro', email: 'coach@elite.com', status: 'active' };
    setUser(u);
    localStorage.setItem('soccer_user', JSON.stringify(u));
  };

  if (!user) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-6">
      <div className="text-center space-y-10 animate-in fade-in zoom-in duration-700">
        <div className="inline-block p-8 bg-emerald-500 rounded-[3rem] shadow-[0_0_80px_rgba(16,185,129,0.2)]">
          <Trophy size={60} className="text-slate-950" />
        </div>
        <div className="space-y-3">
          <h1 className="text-5xl font-black italic tracking-tighter uppercase">SISTÊMICA <span className="text-emerald-400">SOCCER</span></h1>
          <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.5em]">The Coach's Artificial Brain</p>
        </div>
        <button onClick={login} className="bg-white text-slate-950 px-16 py-6 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:scale-105 transition-all shadow-2xl active:scale-95">
          Iniciar Sessão Técnica
        </button>
      </div>
    </div>
  );

  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Navbar user={user} onLogout={() => { setUser(null); localStorage.removeItem('soccer_user'); }} />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

