import React, { useState, useRef } from 'react';
import { X, UploadCloud, Plus, AlertCircle } from 'lucide-react';
import { AnalysisProject, DataFile } from '../types';

interface NewAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (project: AnalysisProject) => void;
}

export const NewAnalysisModal: React.FC<NewAnalysisModalProps> = ({ 
  isOpen, 
  onClose, 
  onCreate
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
       const selectedFile = e.target.files[0];
       if (!selectedFile.name.endsWith('.csv')) {
           setError('Только формат .csv');
           return;
       }
       setError(null);
       setFile(selectedFile);
    }
  };

  const handleSubmit = () => {
      if (!title.trim()) {
          setError('Введите название анализа');
          return;
      }
      if (!file) {
          setError('Загрузите файл с данными');
          return;
      }

      // Mock creation logic
      const newFile: DataFile = {
          id: `f_${Date.now()}`,
          name: file.name,
          uploadDate: new Date().toLocaleDateString('ru-RU'),
          rowCount: Math.floor(Math.random() * 1000) + 100
      };

      const newProject: AnalysisProject = {
          id: `${Date.now()}`,
          title: title,
          description: description,
          files: [newFile],
          // Empty/Mock initial data
          kpi: { totalReviews: newFile.rowCount, nps: 0, npsDelta: 0, avgConfidence: 0 },
          reviews: [], // Ideally would be parsed from file
          keywords: [],
          aiInsights: ["Анализ выполняется..."]
      };

      onCreate(newProject);
      // Reset form
      setTitle('');
      setDescription('');
      setFile(null);
      setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden m-4">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Создание анализа</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Название проекта</label>
                <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Например: Жалобы Декабрь"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Описание (опционально)</label>
                <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Краткое описание задачи..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 h-20 resize-none"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Источник данных</label>
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${file ? 'border-green-500 bg-green-50' : 'border-slate-300 hover:border-indigo-500 hover:bg-slate-50'}`}
                >
                    <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleFileSelect} />
                    {file ? (
                        <>
                           <div className="bg-green-100 text-green-600 p-2 rounded-full mb-2">
                               <Plus className="w-5 h-5" />
                           </div>
                           <p className="text-sm font-bold text-green-800">{file.name}</p>
                           <p className="text-xs text-green-600">Нажмите, чтобы заменить</p>
                        </>
                    ) : (
                        <>
                           <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                           <p className="text-sm font-medium text-slate-600">Загрузить CSV файл</p>
                        </>
                    )}
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>
            )}
        </div>

        <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-600 font-medium text-sm hover:bg-slate-200 rounded-lg transition-colors">
            Отмена
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium text-sm transition-colors">
            Создать анализ
          </button>
        </div>
      </div>
    </div>
  );
};