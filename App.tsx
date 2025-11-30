import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Markup } from './components/Markup';
import { SettingsModal } from './components/SettingsModal';
import { ExportModal } from './components/ExportModal';
import { NewAnalysisModal } from './components/NewAnalysisModal';
import { MOCK_PROJECTS } from './constants';
import { AnalysisProject } from './types';
import { Settings, Download, Edit3, Grid, Table } from 'lucide-react';

const App: React.FC = () => {
  // State for Projects (initialized with MOCK_PROJECTS)
  const [projects, setProjects] = useState<AnalysisProject[]>(MOCK_PROJECTS);
  
  // Selection State
  const [currentProjectId, setCurrentProjectId] = useState<string>(MOCK_PROJECTS[0].id);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'markup'>('dashboard');
  
  // Modal States
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isNewAnalysisOpen, setIsNewAnalysisOpen] = useState(false);

  // Derived State
  const currentProject = projects.find(p => p.id === currentProjectId) || projects[0];

  // Handlers
  const handleUpdateProject = (updatedProject: AnalysisProject) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  const handleCreateProject = (newProject: AnalysisProject) => {
      setProjects([newProject, ...projects]);
      setCurrentProjectId(newProject.id);
      setIsNewAnalysisOpen(false);
  };

  const handleTitleChange = (newTitle: string) => {
    handleUpdateProject({ ...currentProject, title: newTitle });
  };

  // Switch tabs effect to reset scroll or focus if needed
  useEffect(() => {
    // console.log("Tab changed to", activeTab);
  }, [activeTab]);

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        projects={projects} 
        currentProjectId={currentProjectId} 
        onSelectProject={(id) => setCurrentProjectId(id)} 
        onNewAnalysis={() => setIsNewAnalysisOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between flex-shrink-0">
          <div className="flex-1 mr-4">
             {/* Removed Breadcrumbs as requested */}
             <div className="flex items-center group">
               <input 
                 value={currentProject.title}
                 onChange={(e) => handleTitleChange(e.target.value)}
                 className="text-2xl font-bold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none transition-all w-full max-w-lg"
               />
               <Edit3 className="w-4 h-4 text-slate-300 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
             </div>
          </div>
          
          <div className="flex items-center gap-3">
             <button 
                onClick={() => setIsSettingsOpen(true)}
                className="text-slate-500 hover:text-indigo-600 p-2 rounded-full hover:bg-indigo-50 transition-colors"
                title="Настройки анализа и файлы"
             >
                <Settings className="w-5 h-5" />
             </button>
             <button 
                onClick={() => setIsExportOpen(true)}
                className="flex items-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
             >
                <Download className="w-4 h-4" />
                Экспорт CSV
             </button>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="px-8 pt-6 pb-2">
           <div className="border-b border-slate-200 flex space-x-8">
              <button
                 onClick={() => setActiveTab('dashboard')}
                 className={`pb-4 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${
                   activeTab === 'dashboard' 
                     ? 'border-indigo-600 text-indigo-600' 
                     : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                 }`}
              >
                <Grid className="w-4 h-4" />
                Дашборд (Аналитика)
              </button>
              <button
                 onClick={() => setActiveTab('markup')}
                 className={`pb-4 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${
                   activeTab === 'markup' 
                     ? 'border-indigo-600 text-indigo-600' 
                     : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                 }`}
              >
                <Table className="w-4 h-4" />
                Разметка данных 
                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs ml-1">
                  {currentProject.reviews.length}
                </span>
              </button>
           </div>
        </div>

        {/* Content View */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {activeTab === 'dashboard' ? (
            <Dashboard data={currentProject} />
          ) : (
            <Markup 
              project={currentProject} 
              setProjectData={handleUpdateProject} 
            />
          )}
        </div>

      </main>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        project={currentProject}
        onUpdateProject={handleUpdateProject}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        project={currentProject}
      />

      {/* New Analysis Modal */}
      <NewAnalysisModal 
        isOpen={isNewAnalysisOpen}
        onClose={() => setIsNewAnalysisOpen(false)}
        onCreate={handleCreateProject}
      />

    </div>
  );
};

export default App;