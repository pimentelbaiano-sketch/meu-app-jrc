
import React, { useState, useEffect } from 'react';
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
  Target,
  History,
  Trash2,
  Share2,
  Printer
} from 'lucide-react';

const LOADING_MESSAGES = [
  "Analisando dinâmicas táticas...",
  "O jogo é um todo indissociável...",
  "Calculando comportamentos emergentes...",
  "Provocando a auto-organização...",
  "Estruturando princípios de jogo...",
  "Consultando a Periodização Tática...",
  "Ajustando a densidade do exercício..."
];

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
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [game, setGame] = useState<JRCGame | null>(null);
  const [history, setHistory] = useState<JRCGame[]>(() => {
    const saved = localStorage.getItem('soccer_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [form, setForm] = useState<GenerationRequest>({ theme: '', category: '', duration: '', intensity: 'medium' });

  useEffect(() => {
    localStorage.setItem('soccer_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setLoadingMsgIdx(prev => (prev + 1) % LOADING_MESSAGES.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await generateJRC(form);
      setGame(result);
      setHistory(prev => [result, ...prev].slice(0, 10));
    } catch (e) {
      console.error(e);
      alert("Erro ao conectar com a IA. Verifique sua chave API.");
    } finally {
      setLoading(false);
    }
  };

  const deleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const handleShare = async () => {
    if (!game) return;
    const shareText = `*PLANO DE TREINO: ${game.title}*\n\n*Tema:* ${game.theme}\n*Foco:* ${game.systemicFocus}\n\n*Regras:* \n${game.rules.map(r => `- ${r}`).join('\n')}\n\nGerado via Sistêmica Soccer`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: game.title,
          text: shareText,
        });
      } catch (err) {
        copyToClipboard(shareText);
      }
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Conteúdo copiado para a área de transferência!");
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-8 animate-pulse">
        <div className="relative">
          <Loader2 className="w-16 h-16 text-emerald-500 animate-spin" />
          <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-400 w-6 h-6" fill="currentColor" />
        </div>
        <div className="space-y-2">
          <p className="text-xl font-black italic text-white uppercase tracking-tighter">
            {LOADING_MESSAGES[loadingMsgIdx]}
          </p>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest italic">Processando arquitetura de jogo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-10 w-full space-y-12">
      <style>{`
        @media print {
          body { background: white !important; color: black !important; }
          .print-container { border: none !important; box-shadow: none !important; background: white !important; padding: 0 !important; }
          .print-text { color: #1e293b !important; }
          .bg-emerald-900 { background-color: #064e3b !important; -webkit-print-color-adjust: exact; }
          .bg-blue-600 { background-color: #2563eb !important; -webkit-print-color-adjust: exact; }
          .bg-red-600 { background-color: #dc2626 !important; -webkit-print-color-adjust: exact; }
        }
      `}</style>

      {!game ? (
        <div className="grid lg:grid-cols-3 gap-10 items-start">
          <div className="lg:col-span-2 space-y-8">
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
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Tempo de Sessão</label>
                    <input required placeholder="Ex: 15 min" className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" 
                      onChange={e => setForm({...form, duration: e.target.value})} />
                  </div>
                </div>
              </div>
              <button disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-emerald-500/20 active:scale-95">
                <Zap fill="currentColor" size={18} />
                GERAR EXERCÍCIO SISTÊMICO
              </button>
            </form>
          </div>

          <aside className="space-y-6">
            <div className="bg-slate-800/20 rounded-3xl border border-white/5 p-6">
              <h3 className="text-xs font-black uppercase text-slate-500 tracking-widest mb-6 flex items-center gap-2">
                <History size={14} /> Histórico Recente
              </h3>
              {history.length === 0 ? (
                <div className="text-center py-8 opacity-20">
                  <BookOpen size={40} className="mx-auto mb-2" />
                  <p className="text-[10px] font-bold">Nenhum treino salvo.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((item) => (
                    <div 
                      key={item.id} 
                      onClick={() => setGame(item)}
                      className="group bg-slate-950/50 p-4 rounded-2xl border border-white/5 cursor-pointer hover:border-emerald-500/50 transition-all flex items-center justify-between"
                    >
                      <div className="overflow-hidden">
                        <p className="text-[10px] text-emerald-400 font-black uppercase tracking-tighter truncate">{item.category}</p>
                        <p className="text-sm font-bold text-white truncate">{item.title}</p>
                      </div>
                      <button 
                        onClick={(e) => deleteHistoryItem(item.id, e)}
                        className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 rounded-lg text-slate-500 hover:text-red-500 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-end print:hidden">
            <button onClick={() => setGame(null)} className="text-emerald-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:underline">
               <ChevronRight className="rotate-180" size={14} /> Painel Inicial
            </button>
            <div className="flex gap-2">
              <button onClick={handleShare} className="bg-slate-800 text-white px-4 py-3 rounded-xl font-black text-[10px] flex items-center gap-2 hover:bg-slate-700 transition-colors">
                <Share2 size={14} /> COMPARTILHAR
              </button>
              <button onClick={() => window.print()} className="bg-white text-slate-900 px-6 py-3 rounded-xl font-black text-[10px] flex items-center gap-2 hover:bg-slate-200 transition-all active:scale-95 shadow-xl">
                <Printer size={14} /> IMPRIMIR / PDF
              </button>
            </div>
          </div>

          <div className="print-container bg-slate-800/20 border border-white/10 rounded-[3rem] overflow-hidden print:bg-white print:text-black">
            <div className="p-8 lg:p-16 space-y-12 print:p-0 print:space-y-8">
              <header className="border-b border-white/10 pb-8 flex flex-col sm:flex-row justify-between items-start print:border-slate-300 print:pb-4">
                <div className="space-y-2">
                   <span className="text-emerald-400 font-black text-[10px] uppercase tracking-[0.3em] print:text-emerald-700">{game.category} • {game.duration}</span>
                   <h2 className="text-4xl lg:text-7xl font-black italic tracking-tighter uppercase print:text-5xl print:text-slate-900">{game.title}</h2>
                   <p className="text-slate-500 font-bold tracking-widest uppercase text-xs print:text-slate-600">{game.theme}</p>
                </div>
                <div className="mt-4 sm:mt-0 flex items-center gap-2 text-[10px] font-black uppercase text-emerald-400 bg-emerald-400/10 px-4 py-2 rounded-full print:bg-slate-100 print:text-slate-800">
                  <Target size={14} /> Documento Técnico
                </div>
              </header>

              <div className="grid lg:grid-cols-3 gap-16 print:grid-cols-1 print:gap-8">
                <div className="lg:col-span-2 space-y-12 print:space-y-6">
                  <section>
                    <h3 className="text-emerald-400 font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-2 print:text-slate-900 print:mb-2">
                      <BookOpen size={16} /> Dinâmica do Exercício
                    </h3>
                    <p className="print-text text-slate-300 leading-relaxed text-lg print:text-sm">{game.description}</p>
                  </section>
                  
                  <section className="bg-slate-950/50 p-8 rounded-3xl border border-white/5 print:bg-slate-50 print:border-slate-300 print:p-6">
                    <h3 className="text-amber-400 font-black text-xs uppercase tracking-widest mb-6 print:text-slate-900 print:mb-3">Regras de Condicionamento</h3>
                    <div className="grid gap-4 print:gap-2">
                      {game.rules.map((r, i) => (
                        <div key={i} className="flex gap-4 items-start text-sm text-slate-400 print:text-slate-800 print:text-xs">
                          <CheckCircle2 size={18} className="text-emerald-500 mt-1 flex-shrink-0 print:w-4 print:h-4" />
                          <span>{r}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                <div className="space-y-10 print:space-y-6">
                  <div className="print:break-inside-avoid">
                    <SoccerPitch dimensions={game.setup.dimensions} playersCount={game.setup.players} visualData={game.visualData} />
                  </div>
                  
                  <div className="bg-emerald-500/10 p-8 rounded-[2rem] border border-emerald-500/20 relative overflow-hidden print:bg-slate-100 print:border-slate-300 print:p-6">
                    <Target className="absolute -right-4 -bottom-4 text-emerald-500/10 w-24 h-24 print:hidden" />
                    <h4 className="text-[10px] font-black uppercase text-emerald-400 mb-4 tracking-widest print:text-slate-900 print:mb-2">Foco do Treinador</h4>
                    <p className="text-sm text-slate-200 italic font-medium print:text-slate-800 print:text-xs">"{game.systemicFocus}"</p>
                  </div>

                  <div className="bg-slate-800/40 p-6 rounded-3xl border border-white/5 print:hidden">
                    <h4 className="text-[10px] font-black uppercase text-slate-500 mb-4">Recursos</h4>
                    <ul className="text-xs space-y-2 text-slate-400">
                      {game.setup.materials?.map((m, i) => <li key={i} className="flex items-center gap-2"><span>•</span> {m}</li>)}
                    </ul>
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
    const u: User = { id: '1', name: 'Coach Elite', email: 'coach@elite.com', status: 'active' };
    setUser(u);
    localStorage.setItem('soccer_user', JSON.stringify(u));
  };

  if (!user) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-6 overflow-hidden relative">
      {/* Background Decorativo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="text-center space-y-10 animate-in fade-in zoom-in duration-700 relative z-10">
        <div className="inline-block p-10 bg-emerald-500 rounded-[3.5rem] shadow-[0_0_100px_rgba(16,185,129,0.2)] hover:rotate-3 transition-transform">
          <Trophy size={70} className="text-slate-950" />
        </div>
        <div className="space-y-3">
          <h1 className="text-5xl font-black italic tracking-tighter uppercase">SISTÊMICA <span className="text-emerald-400">SOCCER</span></h1>
          <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.5em]">Tactical Intelligence Platform</p>
        </div>
        <button onClick={login} className="group bg-white text-slate-950 px-16 py-6 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-emerald-400 transition-all shadow-2xl active:scale-95 flex items-center gap-4 mx-auto">
          Acessar Área Técnica
          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );

  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950">
        <Navbar user={user} onLogout={() => { setUser(null); localStorage.removeItem('soccer_user'); }} />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </HashRouter>
  );
}
