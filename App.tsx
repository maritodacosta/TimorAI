
import React, { useState, useRef, useEffect } from 'react';
import { generateWebsiteCode, refineWebsiteCode, bundleFilesForPreview } from './services/geminiService';
import { PreviewFrame } from './components/PreviewFrame';
import { Button } from './components/Button';
import { CodeEditor } from './components/CodeEditor';
import { FileExplorer } from './components/FileExplorer';
import { DeveloperProfileModal } from './components/DeveloperProfileModal';
import { PremiumModal } from './components/PremiumModal';
import { AuthModal } from './components/AuthModal';
import { LearnPage } from './components/LearnPage';
import { AboutPage } from './components/AboutPage';
import { DashboardPage } from './components/DashboardPage';
import { PricingPage } from './components/PricingPage';
import { AdminDashboard } from './components/AdminDashboard';
import { ChatWidget } from './components/ChatWidget';
import { GenerationStatus, ProjectFile, Language, User as UserType, Project } from './types';
import { TRANSLATIONS } from './constants/translations';
import { 
  Globe,
  Moon,
  Sun,
  Zap,
  Command,
  Github,
  LogOut,
  Save,
  Folder,
  RefreshCw,
  Crown,
  ExternalLink,
  Rocket,
  CheckCircle2,
  Menu,
  X
} from 'lucide-react';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<'dashboard' | 'builder' | 'learn' | 'about' | 'pricing' | 'admin'>('dashboard');
  const [prompt, setPrompt] = useState('');
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('id'); 
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [allUsers, setAllUsers] = useState<UserType[]>([]);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [isGithubSyncing, setIsGithubSyncing] = useState(false);
  const [githubOwner, setGithubOwner] = useState<string>('');
  const [syncMessage, setSyncMessage] = useState<string>('');
  const [lastRepoUrl, setLastRepoUrl] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const langMenuRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[language];

  useEffect(() => {
    const storedUser = localStorage.getItem('timorai_user');
    if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        if (parsedUser.role === 'admin') setActivePage('admin');
    }
    const storedDB = localStorage.getItem('timorai_users_db');
    if (storedDB) {
      setAllUsers(JSON.parse(storedDB));
    } else {
      const initialUsers: UserType[] = [
        { id: 'admin-001', name: 'Administrator', email: 'mdc@timor.ai', tier: 'premium', role: 'admin', avatar: 'https://ui-avatars.com/api/?name=Admin+System&background=4338ca&color=fff' },
        { id: 'user-001', name: 'User 1', email: 'user1@example.com', tier: 'free', role: 'user', avatar: 'https://ui-avatars.com/api/?name=User+One' }
      ];
      setAllUsers(initialUsers);
      localStorage.setItem('timorai_users_db', JSON.stringify(initialUsers));
    }
    
    const storedProjects = localStorage.getItem('timorai_projects_db');
    if (storedProjects) setProjects(JSON.parse(storedProjects));
    const savedLang = localStorage.getItem('timorai_pref_lang') as Language;
    if (savedLang) setLanguage(savedLang);
  }, []);

  const handleUpdateUserInDashboard = (updatedUser: UserType) => {
    const updatedAllUsers = allUsers.map(u => u.id === updatedUser.id ? updatedUser : u);
    setAllUsers(updatedAllUsers);
    localStorage.setItem('timorai_users_db', JSON.stringify(updatedAllUsers));
    if (user && user.id === updatedUser.id) {
      setUser(updatedUser);
      localStorage.setItem('timorai_user', JSON.stringify(updatedUser));
    }
  };

  const handleDeleteUserInDashboard = (userId: string) => {
    if (window.confirm(t.deleteConfirm)) {
      const updatedAllUsers = allUsers.filter(u => u.id !== userId);
      setAllUsers(updatedAllUsers);
      localStorage.setItem('timorai_users_db', JSON.stringify(updatedAllUsers));
    }
  };

  const autoSyncToGithub = async (targetFiles?: ProjectFile[]) => {
    const filesToSync = targetFiles || files;
    if (!user?.githubConnected || !user.githubToken || filesToSync.length === 0) return;
    
    setIsGithubSyncing(true);
    setSyncMessage(t.githubSyncing);
    const REPO_NAME = 'TimorAI-Projects';
    const GITHUB_API = 'https://api.github.com';
    const headers = {
      'Authorization': `token ${user.githubToken}`,
      'Accept': 'application/vnd.github.v3+json',
    };

    try {
      const userRes = await fetch(`${GITHUB_API}/user`, { headers });
      if (!userRes.ok) throw new Error("Token GitHub tidak valid.");
      const userData = await userRes.json();
      const owner = userData.login;
      setGithubOwner(owner);

      const repoRes = await fetch(`${GITHUB_API}/repos/${owner}/${REPO_NAME}`, { headers });
      if (repoRes.status === 404) {
        const createRes = await fetch(`${GITHUB_API}/user/repos`, {
          method: 'POST',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            name: REPO_NAME, 
            description: 'Website otomatis yang dibuat oleh TimorAI Enterprise',
            private: false,
            auto_init: true
          })
        });
        if (!createRes.ok) throw new Error("Gagal membuat repositori.");
        await new Promise(r => setTimeout(r, 2000));
      }

      for (const file of filesToSync) {
        const fileCheck = await fetch(`${GITHUB_API}/repos/${owner}/${REPO_NAME}/contents/${file.name}`, { headers });
        let sha = null;
        if (fileCheck.status === 200) {
          const checkData = await fileCheck.json();
          sha = checkData.sha;
        }

        await fetch(`${GITHUB_API}/repos/${owner}/${REPO_NAME}/contents/${file.name}`, {
          method: 'PUT',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: `Update TimorAI: ${file.name}`,
            content: btoa(unescape(encodeURIComponent(file.content))),
            sha: sha || undefined
          })
        });
      }
      
      const repoUrl = `https://github.com/${owner}/${REPO_NAME}`;
      setLastRepoUrl(repoUrl);
      setSyncMessage(t.githubPushSuccess);
      setTimeout(() => setSyncMessage(""), 4000);
    } catch (error: any) {
      setSyncMessage(t.githubPushError);
    } finally {
      setIsGithubSyncing(false);
    }
  };

  const handleGithubConnect = async () => {
    if (!user) { setIsAuthModalOpen(true); return; }
    if (user.githubConnected) {
        await autoSyncToGithub();
        return;
    }
    const token = window.prompt(t.githubTokenPrompt, user.githubToken || "");
    if (!token) return;
    setIsGithubSyncing(true);
    try {
      const res = await fetch('https://api.github.com/user', { headers: { 'Authorization': `token ${token}` } });
      if (!res.ok) throw new Error("Token salah.");
      const updatedUser = { ...user, githubConnected: true, githubToken: token, tier: 'premium' as const };
      setUser(updatedUser);
      localStorage.setItem('timorai_user', JSON.stringify(updatedUser));
      handleUpdateUserInDashboard(updatedUser);
      alert(t.githubConnectSuccess);
      if (files.length > 0) await autoSyncToGithub();
    } catch (e: any) {
      alert(t.githubPushError);
    } finally {
      setIsGithubSyncing(false);
    }
  };

  const handleGenerate = async () => {
    if (!user) { setIsAuthModalOpen(true); return; }
    if (!prompt.trim()) return;
    setStatus(GenerationStatus.LOADING);
    try {
      let result;
      if (files.length > 0) result = await refineWebsiteCode(files, prompt, language);
      else result = await generateWebsiteCode(prompt, language);
      setFiles(result.files);
      setLanguage(result.language);
      const rootFile = result.files.find(f => f.name === 'index.html') || result.files[0];
      if (rootFile) {
        setActiveFile(rootFile.name);
        setPreviewHtml(bundleFilesForPreview(result.files));
      }
      setStatus(GenerationStatus.SUCCESS);
      setPrompt('');
      if (user.githubConnected) setTimeout(() => autoSyncToGithub(result.files), 500);
    } catch (error) {
      setStatus(GenerationStatus.ERROR);
      alert(t.errorMsg);
    } finally {
      if (status === GenerationStatus.LOADING) setStatus(GenerationStatus.IDLE);
    }
  };

  const handleSaveProject = () => {
    if (!user) { setIsAuthModalOpen(true); return; }
    if (files.length === 0) return;
    const nameInput = window.prompt(t.savePrompt, `Website ${new Date().toLocaleDateString()}`);
    if (!nameInput) return;
    const newProject: Project = {
      id: currentProjectId || Date.now().toString(),
      userId: user.id,
      name: nameInput,
      files: files,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    const updatedProjects = [...projects.filter(p => p.id !== newProject.id), newProject];
    setProjects(updatedProjects);
    setCurrentProjectId(newProject.id);
    localStorage.setItem('timorai_projects_db', JSON.stringify(updatedProjects));
    if (user.githubConnected) autoSyncToGithub();
    else alert(t.saveSuccess);
  };

  const handleLogout = () => { setUser(null); localStorage.removeItem('timorai_user'); setActivePage('dashboard'); };
  const handleLanguageChange = (l: Language) => { setLanguage(l); localStorage.setItem('timorai_pref_lang', l); setIsLangMenuOpen(false); };

  const renderActivePage = () => {
    if (activePage === 'admin' && user?.role === 'admin') return (
      <AdminDashboard 
        language={language} 
        users={allUsers} 
        onUpdateUser={handleUpdateUserInDashboard} 
        onDeleteUser={handleDeleteUserInDashboard} 
        onLogout={handleLogout} 
      />
    );
    switch (activePage) {
      case 'dashboard': return <DashboardPage language={language} onNavigate={(p: any) => setActivePage(p)} />;
      case 'learn': return <LearnPage language={language} />;
      case 'about': return <AboutPage language={language} />;
      case 'pricing': return <PricingPage language={language} isLoggedIn={!!user} onUpgrade={() => setIsPremiumModalOpen(true)} onLoginRequest={() => setIsAuthModalOpen(true)} />;
      case 'builder':
      default: return (
        <main className="flex-1 flex flex-col md:flex-row h-full overflow-hidden relative">
          <div className={`bg-white dark:bg-[#020617] border-r border-gray-200 dark:border-white/5 transition-all duration-300 ${isSidebarOpen ? 'w-full md:w-[450px]' : 'w-0 overflow-hidden'}`}>
            <div className="p-8 h-full flex flex-col overflow-y-auto">
              <h1 className="text-3xl font-bold mb-4">{t.heroTitle}</h1>
              <p className="text-slate-500 mb-8">{t.heroDesc}</p>
              <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl mb-6 shadow-inner border border-gray-100 dark:border-white/5">
                <textarea 
                  value={prompt} 
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={t.placeholderIdle}
                  className="w-full bg-transparent resize-none focus:outline-none min-h-[150px] text-sm text-slate-800 dark:text-slate-200"
                />
                <div className="flex justify-end mt-2">
                  <Button onClick={handleGenerate} isLoading={status === GenerationStatus.LOADING} disabled={!prompt.trim()}>
                    {t.btnGenerate} <Zap className="w-4 h-4 ml-2 fill-current" />
                  </Button>
                </div>
              </div>
              {projects.length > 0 && (
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">{t.projectsTitle}</p>
                  <div className="space-y-2">
                    {projects.filter(p => p.userId === user?.id).map(p => (
                      <div key={p.id} onClick={() => { setFiles(p.files); setCurrentProjectId(p.id); setPreviewHtml(bundleFilesForPreview(p.files)); }} className={`p-4 bg-white dark:bg-white/5 border rounded-xl cursor-pointer transition-all hover:border-indigo-500/50 ${currentProjectId === p.id ? 'border-indigo-500 ring-1 ring-indigo-500/20' : 'border-gray-100 dark:border-white/5'}`}>
                        <div className="flex items-center gap-3">
                          <Folder className="w-4 h-4 text-indigo-500" />
                          <p className="font-bold text-sm truncate">{p.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {user?.githubConnected && (
                <div className="mt-8 p-6 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl text-white shadow-xl">
                   <div className="flex items-center gap-3 mb-4"><Rocket className="w-5 h-5 animate-bounce" /><h3 className="font-bold">Luncurkan ke Vercel</h3></div>
                   <p className="text-xs text-indigo-100 mb-6 leading-relaxed">Website Anda siap dionlinekan dengan domain profesional.</p>
                   <div className="space-y-3">
                     <a href={`https://vercel.com/new/clone?repository-url=${lastRepoUrl || `https://github.com/${githubOwner}/TimorAI-Projects`}`} target="_blank" className="w-full py-3 bg-white text-indigo-600 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-indigo-50 transition-colors">Deploy to Vercel <ExternalLink className="w-4 h-4" /></a>
                     <button onClick={() => autoSyncToGithub()} className="w-full py-3 bg-white/10 text-white border border-white/20 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-white/20 transition-colors">Push Update Sekarang <Github className="w-4 h-4" /></button>
                   </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 flex flex-col bg-slate-50 dark:bg-black overflow-hidden relative">
            {syncMessage && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[100] bg-white dark:bg-slate-900 px-6 py-3 rounded-full shadow-2xl border border-indigo-500/30 flex items-center gap-3 animate-in slide-in-from-top-4">
                {isGithubSyncing ? <RefreshCw className="w-4 h-4 text-indigo-500 animate-spin" /> : <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                <span className="text-xs font-bold text-slate-700 dark:text-white uppercase tracking-wider">{syncMessage}</span>
              </div>
            )}
            <div className="h-14 border-b border-gray-200 dark:border-white/5 bg-white dark:bg-[#020617] flex items-center justify-between px-6 z-20">
              <div className="flex gap-4">
                <button onClick={() => setViewMode('preview')} className={`text-xs font-bold uppercase tracking-wider ${viewMode === 'preview' ? 'text-indigo-600 border-b-2 border-indigo-600 pb-4 mt-4' : 'text-slate-400'}`}>{t.tabPreview}</button>
                <button onClick={() => setViewMode('code')} className={`text-xs font-bold uppercase tracking-wider ${viewMode === 'code' ? 'text-indigo-600 border-b-2 border-indigo-600 pb-4 mt-4' : 'text-slate-400'}`}>{t.tabEditor}</button>
              </div>
              <div className="flex items-center gap-3">
                {files.length > 0 && (
                  <>
                    <Button variant="ghost" onClick={handleGithubConnect} isLoading={isGithubSyncing} className={`h-9 px-4 rounded-lg ${user?.githubConnected ? 'text-emerald-500 bg-emerald-500/5' : ''}`}><Github className="w-4 h-4 mr-2" /> {user?.githubConnected ? t.btnGithubConnected : t.btnGithub}</Button>
                    <Button variant="secondary" onClick={handleSaveProject} className="h-9 px-4 rounded-lg"><Save className="w-4 h-4 mr-2" /> {t.btnSave}</Button>
                  </>
                )}
              </div>
            </div>
            <div className="flex-1 relative">
              {viewMode === 'preview' ? (
                <div className="w-full h-full p-4 flex justify-center bg-slate-100/50 dark:bg-black/40"><PreviewFrame html={previewHtml} title="TimorAI Preview" device={device} /></div>
              ) : (
                <div className="flex h-full">
                  <FileExplorer files={files} activeFile={activeFile} onSelectFile={(name) => { setActiveFile(name); }} title={t.explorerTitle} />
                  <div className="flex-1 h-full overflow-hidden"><CodeEditor code={files.find(f => f.name === activeFile)?.content || ''} /></div>
                </div>
              )}
              {status === GenerationStatus.LOADING && (
                <div className="absolute inset-0 bg-white/95 dark:bg-[#020617]/95 backdrop-blur-xl flex flex-col items-center justify-center z-50">
                  <div className="w-16 h-16 relative mb-6"><RefreshCw className="w-full h-full text-indigo-500 animate-spin" /><div className="absolute inset-0 flex items-center justify-center"><Zap className="w-6 h-6 text-indigo-500 fill-current animate-pulse" /></div></div>
                  <p className="text-xl font-display font-bold text-slate-900 dark:text-white mb-2">{t.buildMasterpiece}</p>
                </div>
              )}
            </div>
          </div>
        </main>
      );
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'dark bg-[#020617] text-white' : 'bg-[#f8fafc] text-slate-900'}`}>
      <nav className="h-16 border-b border-gray-200 dark:border-white/5 flex items-center justify-between px-4 md:px-6 sticky top-0 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl z-[60]">
        <div className="flex items-center gap-3 md:gap-6">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 lg:hidden text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div onClick={() => setActivePage('dashboard')} className="flex items-center gap-2 md:gap-3 cursor-pointer group">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Command className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-display font-bold tracking-tight">Timor<span className="text-indigo-600 dark:text-indigo-400">AI</span></span>
              <span className="text-[10px] md:text-[9px] font-bold uppercase tracking-[0.2em] opacity-60">{t.enterpriseText}</span>
            </div>
          </div>

          <div className="hidden lg:flex gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-full border border-gray-200 dark:border-white/5">
            <button onClick={() => setActivePage('dashboard')} className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${activePage === 'dashboard' ? 'bg-white dark:bg-white/10 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}>{t.navDashboard}</button>
            <button onClick={() => setActivePage('builder')} className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${activePage === 'builder' ? 'bg-white dark:bg-white/10 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}>{t.navBuilder}</button>
            <button onClick={() => setActivePage('learn')} className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${activePage === 'learn' ? 'bg-white dark:bg-white/10 text-indigo-600 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}>{t.navLearn}</button>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="relative" ref={langMenuRef}>
            <button onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} className="p-2 md:p-2.5 bg-slate-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl flex items-center gap-2 text-[10px] font-bold uppercase">
              <Globe className="w-4 h-4 text-indigo-500" /> <span className="hidden sm:inline">{language}</span>
            </button>
            {isLangMenuOpen && (
              <div className="absolute top-full right-0 mt-2 bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl p-2 w-40 animate-in slide-in-from-top-2 duration-200">
                {['id','tet','en','pt'].map(l => (
                  <button key={l} onClick={() => handleLanguageChange(l as Language)} className={`w-full text-left px-4 py-2.5 text-xs font-bold uppercase rounded-xl transition-colors ${language === l ? 'bg-indigo-500 text-white' : 'hover:bg-indigo-50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400'}`}>{l}</button>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 md:p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 transition-colors">
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          {user ? (
            <div className="flex items-center gap-2 pl-1">
              <div className="relative group cursor-pointer hidden sm:block" onClick={() => setActivePage('dashboard')}>
                <img src={user.avatar} className="w-8 h-8 md:w-9 h-9 rounded-full border-2 border-indigo-500/30 p-0.5" />
              </div>
              <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500"><LogOut className="w-5 h-5" /></button>
            </div>
          ) : (
            <Button onClick={() => setIsAuthModalOpen(true)} className="px-4 md:px-6 py-2 md:py-2.5 rounded-full text-[10px] md:text-xs font-bold uppercase">{t.navLogin}</Button>
          )}
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="absolute top-0 left-0 bottom-0 w-3/4 max-w-xs bg-white dark:bg-[#020617] shadow-2xl p-6 animate-in slide-in-from-left duration-300">
             <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                   <Command className="w-6 h-6 text-indigo-600" />
                   <div className="flex flex-col">
                     <span className="font-bold">TimorAI</span>
                     <span className="text-[8px] font-bold uppercase opacity-50">{t.enterpriseText}</span>
                   </div>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)}><X className="w-6 h-6 text-slate-500" /></button>
             </div>
             <div className="space-y-2">
                {[
                  { id: 'dashboard', label: t.navDashboard, icon: Globe },
                  { id: 'builder', label: t.navBuilder, icon: Zap },
                  { id: 'learn', label: t.navLearn, icon: Folder }
                ].map(item => (
                  <button 
                    key={item.id}
                    onClick={() => { setActivePage(item.id as any); setIsMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${activePage === item.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'}`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </button>
                ))}
             </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-hidden">{renderActivePage()}</div>
      <ChatWidget language={language} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onLogin={(u) => { setUser(u); localStorage.setItem('timorai_user', JSON.stringify(u)); handleUpdateUserInDashboard(u); }} language={language} />
      <PremiumModal isOpen={isPremiumModalOpen} onClose={() => setIsPremiumModalOpen(false)} onUpgrade={() => { if(user) { const u = {...user, tier: 'premium' as const}; setUser(u); localStorage.setItem('timorai_user', JSON.stringify(u)); handleUpdateUserInDashboard(u); } setIsPremiumModalOpen(false); }} language={language} />
    </div>
  );
};

export default App;
