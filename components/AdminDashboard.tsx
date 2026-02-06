
import React, { useState, useEffect } from 'react';
import { Language, User } from '../types';
import { TRANSLATIONS } from '../constants/translations';
import { 
  Users, Crown, Search, Trash2, Shield, UserCheck, 
  LogOut, Cpu, Database, Network, TrendingUp, 
  Terminal, Activity, ShieldAlert 
} from 'lucide-react';

interface AdminDashboardProps {
  language: Language;
  users: User[];
  onUpdateUser: (updatedUser: User) => void;
  onDeleteUser: (userId: string) => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ language, users, onUpdateUser, onDeleteUser, onLogout }) => {
  const t = TRANSLATIONS[language];
  const [searchTerm, setSearchTerm] = useState('');
  const [cpuUsage, setCpuUsage] = useState(45);
  const [ramUsage, setRamUsage] = useState(62);
  const [networkTraffic, setNetworkTraffic] = useState(120);
  const [logs, setLogs] = useState<{ id: number, time: string, msg: string, type: 'info' | 'warn' | 'error' }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(prev => Math.min(100, Math.max(10, prev + Math.floor(Math.random() * 10) - 5)));
      setRamUsage(prev => Math.min(100, Math.max(30, prev + Math.floor(Math.random() * 6) - 3)));
      setNetworkTraffic(prev => Math.max(50, prev + Math.floor(Math.random() * 50) - 20));
      
      if (Math.random() > 0.7) {
        const types: ('info' | 'warn' | 'error')[] = ['info', 'info', 'warn', 'error'];
        const msgs = [
          "New user registered", 
          "AI build completed", 
          "Github sync triggered", 
          "High traffic detected", 
          "Database backup successful"
        ];
        const newLog = {
          id: Date.now(),
          time: new Date().toLocaleTimeString(),
          msg: msgs[Math.floor(Math.random() * msgs.length)],
          type: types[Math.floor(Math.random() * types.length)]
        };
        setLogs(prev => [newLog, ...prev].slice(0, 15));
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const premiumCount = users.filter(u => u.tier === 'premium').length;
  const totalRevenue = premiumCount * 300;
  const conversionRate = users.length > 0 ? ((premiumCount / users.length) * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex flex-col transition-colors duration-300">
      <div className="h-16 bg-white dark:bg-[#0f172a] border-b border-gray-200 dark:border-white/5 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
           <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-lg shadow-indigo-500/20 shrink-0">
             <Shield className="w-5 h-5" />
           </div>
           <div className="hidden sm:block">
             <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-none">TimorAI <span className="text-indigo-500">Admin</span></h1>
             <p className="text-[10px] text-slate-500 font-mono tracking-tighter uppercase">{t.enterpriseText} v2.5</p>
           </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 bg-slate-100 dark:bg-white/5 px-3 py-1.5 rounded-full border border-gray-200 dark:border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Server Online</span>
          </div>
          <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl text-xs font-bold hover:bg-red-100 transition-all">
            <LogOut className="w-4 h-4" /> <span className="hidden xs:inline">{t.profileLogout}</span>
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6">
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#1e293b] p-4 rounded-2xl border border-gray-200 dark:border-white/5 flex flex-col items-center text-center">
            <div className="w-10 h-10 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-500 mb-2">
               <Users className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white leading-none">{users.length}</div>
            <div className="text-[10px] text-slate-500 uppercase font-bold mt-1">{t.adminTotalUsers}</div>
          </div>
          <div className="bg-white dark:bg-[#1e293b] p-4 rounded-2xl border border-gray-200 dark:border-white/5 flex flex-col items-center text-center">
            <div className="w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-500 mb-2">
               <Crown className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white leading-none">{premiumCount}</div>
            <div className="text-[10px] text-slate-500 uppercase font-bold mt-1">{t.adminPremiumUsers}</div>
          </div>
          <div className="bg-white dark:bg-[#1e293b] p-4 rounded-2xl border border-gray-200 dark:border-white/5 flex flex-col items-center text-center">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mb-2">
               <TrendingUp className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white leading-none">${totalRevenue}</div>
            <div className="text-[10px] text-slate-500 uppercase font-bold mt-1">{t.adminRevenue}</div>
          </div>
          <div className="bg-white dark:bg-[#1e293b] p-4 rounded-2xl border border-gray-200 dark:border-white/5 flex flex-col items-center text-center">
            <div className="w-10 h-10 bg-violet-500/10 rounded-full flex items-center justify-center text-violet-500 mb-2">
               <Activity className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white leading-none">{conversionRate}%</div>
            <div className="text-[10px] text-slate-500 uppercase font-bold mt-1">Conversion</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white dark:bg-[#1e293b] p-6 rounded-3xl border border-gray-200 dark:border-white/5 shadow-xl space-y-6">
             <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
               <Activity className="w-4 h-4 text-indigo-500" /> {t.adminResourceLive}
             </h3>
             <div className="space-y-4">
                {[
                  { label: t.adminCpu, val: `${cpuUsage}%`, icon: Cpu, color: 'indigo', bar: cpuUsage },
                  { label: t.adminRam, val: `${ramUsage}%`, icon: Database, color: 'violet', bar: ramUsage },
                  { label: t.adminNetwork, val: `${networkTraffic}MB/s`, icon: Network, color: 'emerald', bar: Math.min(100, (networkTraffic/500)*100) }
                ].map((stat, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-tight">
                      <div className="flex items-center gap-2 text-slate-500">
                        <stat.icon className="w-3.5 h-3.5" /> {stat.label}
                      </div>
                      <span className="text-slate-900 dark:text-white">{stat.val}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-${stat.color}-500 transition-all duration-1000`} 
                        style={{ width: `${stat.bar}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
             </div>
             
             <div className="pt-4 border-t border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" /> {t.adminServerOK}
                </div>
             </div>
          </div>

          <div className="lg:col-span-2 bg-white dark:bg-[#1e293b] p-6 rounded-3xl border border-gray-200 dark:border-white/5 shadow-xl flex flex-col">
             <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-4">
               <Terminal className="w-4 h-4 text-emerald-500" /> {t.adminSystemLog}
             </h3>
             <div className="flex-1 bg-black/5 dark:bg-black/40 rounded-xl p-4 font-mono text-[10px] md:text-xs overflow-y-auto max-h-[220px] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-slate-700">
                {logs.length === 0 ? (
                  <div className="text-slate-500 italic">Initializing monitoring kernel...</div>
                ) : (
                  logs.map(log => (
                    <div key={log.id} className="mb-1.5 flex items-start gap-2">
                       <span className="text-slate-400 shrink-0">[{log.time}]</span>
                       <span className={`font-bold uppercase shrink-0 ${log.type === 'info' ? 'text-indigo-400' : log.type === 'warn' ? 'text-amber-400' : 'text-red-400'}`}>{log.type}:</span>
                       <span className="text-slate-600 dark:text-slate-300">{log.msg}</span>
                    </div>
                  ))
                )}
             </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1e293b] rounded-3xl border border-gray-200 dark:border-white/5 shadow-xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-200 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
             <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
               <Users className="w-6 h-6 text-indigo-500" /> {t.adminUserMgmt}
             </h2>
             <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder={t.adminSearch}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-white"
                />
             </div>
          </div>

          <div className="flex-1 min-h-[400px]">
             <div className="hidden md:block overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                     <tr className="bg-slate-50 dark:bg-[#0f172a] border-b border-gray-200 dark:border-white/5 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                        <th className="p-6">{t.adminTableUser}</th>
                        <th className="p-6 text-center">{t.adminTableStatus}</th>
                        <th className="p-6 text-right">{t.adminTableAction}</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                     {filteredUsers.length > 0 ? filteredUsers.map(user => (
                       <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                          <td className="p-6">
                             <div className="flex items-center gap-4">
                                <div className="relative">
                                  <img src={user.avatar} className="w-12 h-12 rounded-full border-2 border-indigo-500/20" />
                                  {user.tier === 'premium' && <Crown className="absolute -top-1 -right-1 w-4 h-4 text-amber-500 fill-amber-500" />}
                                </div>
                                <div>
                                   <div className="font-bold text-slate-900 dark:text-white text-base">{user.name}</div>
                                   <div className="text-sm text-slate-500">{user.email}</div>
                                </div>
                             </div>
                          </td>
                          <td className="p-6 text-center">
                             <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold border uppercase tracking-widest ${user.tier === 'premium' ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-white/5 dark:text-slate-400'}`}>
                                {user.tier}
                             </span>
                          </td>
                          <td className="p-6 text-right">
                             {user.role !== 'admin' ? (
                               <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <button 
                                   onClick={() => onUpdateUser({...user, tier: user.tier === 'premium' ? 'free' : 'premium'})} 
                                   className={`p-2.5 rounded-xl transition-all shadow-sm ${user.tier === 'premium' ? 'bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-indigo-600' : 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 hover:bg-indigo-100'}`}
                                   title={user.tier === 'premium' ? t.adminActionDemote : t.adminActionPromote}
                                 >
                                    {user.tier === 'premium' ? <ShieldAlert className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
                                 </button>
                                 <button 
                                   onClick={() => onDeleteUser(user.id)} 
                                   className="p-2.5 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-100 transition-all shadow-sm"
                                   title={t.adminActionDelete}
                                 >
                                   <Trash2 className="w-5 h-5" />
                                 </button>
                               </div>
                             ) : (
                               <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{t.adminProtected}</span>
                             )}
                          </td>
                       </tr>
                     )) : (
                       <tr>
                         <td colSpan={3} className="p-12 text-center text-slate-400 italic">{t.adminNoUsers}</td>
                       </tr>
                     )}
                  </tbody>
               </table>
             </div>

             <div className="md:hidden divide-y divide-gray-100 dark:divide-white/5">
                {filteredUsers.map(user => (
                  <div key={user.id} className="p-4 space-y-4">
                     <div className="flex items-center gap-4">
                        <img src={user.avatar} className="w-12 h-12 rounded-full border-2 border-indigo-500/20" />
                        <div className="flex-1 min-w-0">
                           <div className="font-bold text-slate-900 dark:text-white text-base truncate">{user.name}</div>
                           <div className="text-sm text-slate-500 truncate">{user.email}</div>
                           <span className={`inline-block mt-2 px-3 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-widest ${user.tier === 'premium' ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30' : 'bg-slate-100 text-slate-600'}`}>{user.tier}</span>
                        </div>
                        {user.role !== 'admin' && (
                          <div className="flex flex-col gap-2">
                             <button 
                               onClick={() => onUpdateUser({...user, tier: user.tier === 'premium' ? 'free' : 'premium'})} 
                               className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl text-indigo-600 shadow-sm"
                             >
                                <UserCheck className="w-5 h-5" />
                             </button>
                             <button 
                               onClick={() => onDeleteUser(user.id)} 
                               className="p-3 bg-red-50 dark:bg-red-500/10 rounded-xl text-red-500 shadow-sm"
                             >
                                <Trash2 className="w-5 h-5" />
                             </button>
                          </div>
                        )}
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CheckCircle2 = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/>
  </svg>
);
