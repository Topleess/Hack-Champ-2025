import React, { useState, useRef } from 'react';
import { X, UploadCloud, FileSpreadsheet, Trash2, AlertCircle } from 'lucide-react';
import { AnalysisProject, DataFile } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: AnalysisProject;
  onUpdateProject: (p: AnalysisProject) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  project,
  onUpdateProject
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    setError(null);
    if (!file.name.endsWith('.csv')) {
      setError('Пожалуйста, загрузите файл в формате .csv');
      return;
    }

    // Mock processing - in real app would read file
    const newFile: DataFile = {
      id: `new_${Date.now()}`,
      name: file.name,
      uploadDate: new Date().toLocaleDateString('ru-RU'),
      rowCount: Math.floor(Math.random() * 500) + 50
    };

    onUpdateProject({
      ...project,
      files: [...project.files, newFile]
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const removeFile = (fileId: string) => {
    onUpdateProject({
      ...project,
      files: project.files.filter(f => f.id !== fileId)
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden m-4">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Настройки анализа</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* File List */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">Загруженные данные</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {project.files.map(file => (
                <div key={file.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 text-green-700 rounded">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 text-sm">{file.name}</p>
                      <p className="text-xs text-slate-500">Загружено: {file.uploadDate} • {file.rowCount} строк</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFile(file.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Upload Area */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">Добавить новые данные</h3>
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all
                ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'}
                ${error ? 'border-red-300 bg-red-50' : ''}
              `}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".csv"
                onChange={handleFileSelect}
              />
              <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-slate-700">Нажмите для загрузки или перетащите файл</p>
              <p className="text-xs text-slate-500 mt-1">Поддерживается формат: CSV</p>
              {error && (
                <div className="mt-3 flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-4 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors"
          >
            Готово
          </button>
        </div>
      </div>
    </div>
  );
};
