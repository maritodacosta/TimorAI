import React, { useState, useEffect } from 'react';
import { Language, User } from '../types';
import { TRANSLATIONS } from '../constants/translations';
import { Users, Crown, DollarSign, Search, Trash2, Shield, MoreHorizontal, UserCheck, UserX, LogOut, Activity, Server, Cpu, Database, Network } from 'lucide-react';

interface AdminDashboardProps {
  language: Language;
  users: User[];
  onUpdateUser: (updatedUser: User) => void;
  onDeleteUser: (userId: string) => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  language, 
  users, 
  onUpdateUser, 
  onDeleteUser,
  onLogout
}) => {
  const t = TRANSLATIONS[language];
  const [searchTerm, setSearchTerm] = useState('');
  
  // Real-time metrics simulation state
  const [cpuUsage, setCpuUsage] = useState(45);
  const [ramUsage, setRamUsage] = useState(62);
  const [networkTraffic, setNetworkTraffic] = useState(120);

  // Effect to simulate real-time data changes
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(prev => Math.min(100, Math.max(10, prev + Math.floor(Math.random() * 10) - 5)));
      setRamUsage(prev => Math.min(100, Math.max(30, prev + Math.floor(Math.random() * 6) - 3)));
      setNetworkTraffic(prev => Math.max(50, prev + Math.floor(Math.random() * 50) - 20));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const premiumCount = users.filter(u => u.tier === 'premium').length;
  const revenue = premiumCount * 300; // $300 per premium user

  const toggleTier = (user: User) => {
    const newTier = user.tier === 'premium' ? 'free' : 'premium';
    onUpdateUser({ ...user, tier: newTier });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex flex-col">
      {/* Top Bar */}
      <div className="h-16 bg-white dark:bg-[#0f172a] border-b border-gray-200 dark:border-white/5 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
           <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-lg shadow-indigo-500/20">
             <Shield className="w-5 h-5" />
           </div>
           <div>
             <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-none">TimorAI <span className="text-indigo-500">Admin</span></h1>
             <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{t.adminAccess}</p>
           </div>
        </div>
        <button 
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-bold transition-colors"
        >
          <LogOut className="w-4 h-4" />
          {t.profileLogout}
        </button>
      </div>

      <div className="flex-1 p-6 max-w-7xl mx-auto w-full overflow-hidden">
        
        {/* Real-time System Metrics */}
        <div className="mb-8">
           <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
             <Activity className="w-4 h-4 text-emerald-500" /> {t.adminRealtimeTitle}
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-[#1e293b] p-4 rounded-xl border border-gray-200 dark:border-white/5 flex items-center gap-4 relative overflow-hidden group">
                 <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 z-10">
                    <Cpu className="w-6 h-6" />
                 </div>
                 <div className="z-10">
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">{t.adminCpu}</p>
                    <p className="text-2xl font-mono font-bold text-slate-900 dark:text-white tabular-nums">{cpuUsage}%</p>
                 </div>
                 {/* Animated Bar BG */}
                 <div className="absolute bottom-0 left-0 h-1 bg-indigo-500 transition-all duration-500" style={{ width: `${cpuUsage}%` }}></div>
              </div>

              <div className="bg-white dark:bg-[#1e293b] p-4 rounded-xl border border-gray-200 dark:border-white/5 flex items-center gap-4 relative overflow-hidden group">
                 <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center text-violet-600 dark:text-violet-400 shrink-0 z-10">
                    <Database className="w-6 h-6" />
                 </div>
                 <div className="z-10">
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">{t.adminRam}</p>
                    <p className="text-2xl font-mono font-bold text-slate-900 dark:text-white tabular-nums">{ramUsage}%</p>
                 </div>
                 <div className="absolute bottom-0 left-0 h-1 bg-violet-500 transition-all duration-500" style={{ width: `${ramUsage}%` }}></div>
              </div>

              <div className="bg-white dark:bg-[#1e293b] p-4 rounded-xl border border-gray-200 dark:border-white/5 flex items-center gap-4 relative overflow-hidden group">
                 <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 z-10">
                    <Network className="w-6 h-6" />
                 </div>
                 <div className="z-10">
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">{t.adminNetwork}</p>
                    <p className="text-2xl font-mono font-bold text-slate-900 dark:text-white tabular-nums">{networkTraffic} MB/s</p>
                 </div>
                 <div className="absolute bottom-0 left-0 h-1 bg-emerald-500 transition-all duration-500 w-full animate-pulse"></div>
              </div>
           </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{t.adminTotalUsers}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{users.length}</p>
              </div>
           </div>

           <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{t.adminPremiumUsers}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{premiumCount}</p>
              </div>
           </div>

           <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{t.adminRevenue}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">${revenue.toLocaleString()}</p>
              </div>
           </div>
        </div>

        {/* User Management Section */}
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden flex flex-col max-h-[600px]">
          <div className="p-6 border-b border-gray-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 bg-white/50 dark:bg-white/5 backdrop-blur-md sticky top-0 z-20">
             <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
               <Users className="w-5 h-5 text-indigo-500" />
               {t.adminUserMgmt}
             </h2>
             <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder={t.adminSearch}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-white"
                />
             </div>
          </div>

          <div className="overflow-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-slate-700">
             <table className="w-full text-left border-collapse min-w-[700px]">
                <thead className="sticky top-0 z-10">
                   <tr className="bg-slate-50 dark:bg-[#0f172a] border-b border-gray-200 dark:border-white/5 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      <th className="p-4 font-semibold w-1/2">{t.adminTableUser}</th>
                      <th className="p-4 font-semibold text-center w-1/4">{t.adminTableStatus}</th>
                      <th className="p-4 font-semibold text-right w-1/4">{t.adminTableAction}</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                   {filteredUsers.map(user => (
                     <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group animate-in fade-in duration-300">
                        <td className="p-4">
                           <div className="flex items-center gap-3">
                              <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border border-gray-200 dark:border-white/10" />
                              <div className="min-w-0">
                                 <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2 flex-wrap">
                                   <span className="truncate">{user.name}</span>
                                   {user.role === 'admin' && (
                                     <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] rounded font-bold border border-indigo-200 shrink-0">
                                       {t.adminBadgeAdmin}
                                     </span>
                                   )}
                                 </div>
                                 <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</div>
                              </div>
                           </div>
                        </td>
                        <td className="p-4 text-center">
                           <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${user.tier === 'premium' ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700/30' : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-white/5 dark:text-slate-400 dark:border-white/10'}`}>
                              {user.tier === 'premium' && <Crown className="w-3 h-3 mr-1" />}
                              {user.tier.toUpperCase()}
                           </span>
                        </td>
                        <td className="p-4 text-right">
                           <div className="flex items-center justify-end gap-2">
                             {user.role !== 'admin' && (
                               <>
                                 <button 
                                   onClick={() => toggleTier(user)}
                                   className={`p-2 rounded-lg transition-colors ${user.tier === 'free' ? 'text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-900/20' : 'text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-900/20'}`}
                                   title={user.tier === 'free' ? t.adminActionPromote : t.adminActionDemote}
                                 >
                                   {user.tier === 'free' ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                                 </button>
                                 <button 
                                   onClick={() => onDeleteUser(user.id)}
                                   className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                   title={t.adminActionDelete}
                                 >
                                   <Trash2 className="w-4 h-4" />
                                 </button>
                               </>
                             )}
                           </div>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
             {filteredUsers.length === 0 && (
               <div className="p-12 text-center text-slate-500 dark:text-slate-400 flex flex-col items-center">
                 <Search className="w-12 h-12 mb-4 opacity-20" />
                 <p>{t.adminNoUsers} "{searchTerm}"</p>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};