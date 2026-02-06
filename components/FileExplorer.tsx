import React from 'react';
import { ProjectFile } from '../types';
import { FileCode, FileJson, FileType, Folder, Lock } from 'lucide-react';

interface FileExplorerProps {
  files: ProjectFile[];
  activeFile: string | null;
  onSelectFile: (fileName: string) => void;
  title: string;
  isLocked?: boolean;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({ files, activeFile, onSelectFile, title, isLocked = false }) => {
  
  const getIcon = (type: string) => {
    switch(type) {
      case 'html': return <FileCode className="w-4 h-4 text-orange-400 shrink-0" />;
      case 'css': return <FileType className="w-4 h-4 text-blue-400 shrink-0" />;
      case 'js': return <FileJson className="w-4 h-4 text-yellow-400 shrink-0" />;
      default: return <FileCode className="w-4 h-4 text-gray-400 shrink-0" />;
    }
  };

  // Group files strictly for display (root vs folders)
  const renderFileTree = () => {
    const structure: Record<string, ProjectFile[]> = { root: [] };

    files.forEach(file => {
      const parts = file.name.split('/');
      if (parts.length > 1) {
        const folder = parts[0];
        if (!structure[folder]) structure[folder] = [];
        structure[folder].push(file);
      } else {
        structure.root.push(file);
      }
    });

    return (
      <div className="space-y-1">
        {/* Render Root Files First */}
        {structure.root.map(file => (
           <FileItem 
             key={file.name} 
             file={file} 
             isActive={activeFile === file.name} 
             onClick={() => !isLocked && onSelectFile(file.name)} 
             icon={getIcon(file.type)}
             disabled={isLocked}
           />
        ))}

        {/* Render Folders */}
        {Object.keys(structure).filter(k => k !== 'root').map(folder => (
          <div key={folder} className="mt-2">
            <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider truncate">
               <Folder className="w-3.5 h-3.5 shrink-0" />
               <span className="truncate">{folder}</span>
            </div>
            <div className="pl-2 border-l border-gray-200 dark:border-white/5 ml-3 space-y-1 mt-1">
              {structure[folder].map(file => (
                <FileItem 
                  key={file.name} 
                  file={file} 
                  isActive={activeFile === file.name} 
                  onClick={() => !isLocked && onSelectFile(file.name)} 
                  icon={getIcon(file.type)}
                  disabled={isLocked}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-64 bg-gray-50 dark:bg-[#1e1e1e] border-r border-gray-200 dark:border-white/10 flex flex-col h-full transition-colors duration-300 relative">
      <div className="p-3 border-b border-gray-200 dark:border-white/5 bg-gray-100 dark:bg-[#252526] shrink-0">
        <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</h3>
      </div>
      <div className={`flex-1 overflow-y-auto p-2 scrollbar-hide ${isLocked ? 'blur-sm select-none pointer-events-none opacity-50' : ''}`}>
        {renderFileTree()}
      </div>

      {/* Lock Overlay */}
      {isLocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4 text-center">
           <div className="w-10 h-10 bg-gray-200 dark:bg-white/10 rounded-full flex items-center justify-center mb-2">
             <Lock className="w-5 h-5 text-gray-500 dark:text-gray-300" />
           </div>
           <p className="text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">Premium Only</p>
           <p className="text-[10px] text-gray-500 dark:text-gray-400">Upgrade to access file explorer for this project.</p>
        </div>
      )}
    </div>
  );
};

const FileItem = ({ file, isActive, onClick, icon, disabled }: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all duration-150 group text-left
      ${isActive 
        ? 'bg-primary/20 text-primary dark:text-white' 
        : 'text-gray-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-white/5'
      }
      ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
    `}
  >
    {icon}
    <span className="truncate flex-1 min-w-0">{file.name.split('/').pop()}</span>
  </button>
);