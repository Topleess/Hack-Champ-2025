import React from 'react';
import { 
  Plus, 
  Search, 
  LayoutDashboard, 
  Settings,
  Activity
} from 'lucide-react';
import { AnalysisProject } from '../types';

interface SidebarProps {
  projects: AnalysisProject[];
  currentProjectId: string;
  onSelectProject: (id: string) => void;
  onNewAnalysis: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ projects, currentProjectId, onSelectProject, onNewAnalysis }) => {
  return (
    <div className="w-64 bg-[#0f172a] text-slate-300 flex flex-col h-screen border-r border-slate-800 flex-shrink-0">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <Activity className="w-6 h-6 text-indigo-500 mr-2" />
        <span className="font-bold text-white text-lg tracking-tight">Hack&Champ</span>
      </div>

      {/* Main Action */}
      <div className="p-4">
        <button 
          onClick={onNewAnalysis}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center transition-colors shadow-lg hover:shadow-indigo-500/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Новый анализ
        </button>
      </div>

      {/* Search */}
      <div className="px-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Поиск..." 
            className="w-full bg-slate-800 border border-slate-700 text-sm text-slate-200 rounded-md pl-9 pr-3 py-2 focus:outline-none focus:border-indigo-500 placeholder-slate-500"
          />
        </div>
      </div>

      {/* Project List */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Недавние анализы
        </div>
        <div className="space-y-1 px-2">
          {projects.map((project) => {
            const isActive = project.id === currentProjectId;
            return (
              <button
                key={project.id}
                onClick={() => onSelectProject(project.id)}
                className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium flex items-center transition-colors ${
                  isActive 
                    ? 'bg-slate-800 text-white border-l-2 border-indigo-500' 
                    : 'hover:bg-slate-800/50 hover:text-slate-100 border-l-2 border-transparent'
                }`}
              >
                <LayoutDashboard className={`w-4 h-4 mr-3 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                <span className="truncate">{project.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer / User Profile */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs">
            AU
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs text-slate-500">Правительство Москвы</p>
          </div>
        </div>
      </div>
    </div>
  );
};