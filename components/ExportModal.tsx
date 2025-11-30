import React, { useState, useRef, useEffect } from 'react';
import { X, Download, ChevronDown, Check, FileSpreadsheet, Square, CheckSquare } from 'lucide-react';
import { AnalysisProject } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: AnalysisProject;
}

export const ExportModal: React.FC<ExportModalProps> = ({ 
  isOpen, 
  onClose, 
  project
}) => {
  // Default to all files selected
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>(project.files.map(f => f.id));
  const [mergeFiles, setMergeFiles] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Initialize selection when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedFileIds(project.files.map(f => f.id));
      setMergeFiles(true);
      setIsDropdownOpen(false);
    }
  }, [isOpen, project.files]);

  if (!isOpen) return null;

  const isAllSelected = selectedFileIds.length === project.files.length && project.files.length > 0;
  
  const toggleFile = (id: string) => {
    if (selectedFileIds.includes(id)) {
      setSelectedFileIds(selectedFileIds.filter(fid => fid !== id));
    } else {
      setSelectedFileIds([...selectedFileIds, id]);
    }
  };

  const toggleAll = () => {
    if (isAllSelected) {
      setSelectedFileIds([]);
    } else {
      setSelectedFileIds(project.files.map(f => f.id));
    }
  };

  const handleExport = () => {
    if (selectedFileIds.length === 0) return;

    setIsExporting(true);
    // Simulate API call / generation
    setTimeout(() => {
        setIsExporting(false);
        onClose();
        const count = selectedFileIds.length;
        const fileText = count === project.files.length ? 'Весь проект' : `${count} файл(а)`;
        const mergeText = mergeFiles && count > 1 ? ' (объединенный)' : '';
        alert(`Экспорт успешно завершен!\nДанные: ${fileText}${mergeText}`);
    }, 1500);
  };

  const getDropdownLabel = () => {
    if (selectedFileIds.length === 0) return 'Выберите файлы...';
    if (isAllSelected) return 'Весь проект';
    if (selectedFileIds.length === 1) {
        const file = project.files.find(f => f.id === selectedFileIds[0]);
        return file ? file.name : '1 файл';
    }
    return `Выбрано: ${selectedFileIds.length} файл(а)`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden m-4 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
          <h2 className="text-lg font-bold text-slate-800">Экспорт данных</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="mb-6 space-y-4">
            
            {/* Dropdown Section */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Данные для выгрузки
              </label>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full flex items-center justify-between bg-white border border-slate-300 hover:border-indigo-500 px-4 py-2.5 rounded-lg text-sm text-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-100"
                >
                  <span className="flex items-center gap-2 truncate">
                    <FileSpreadsheet className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                    {getDropdownLabel()}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-20 max-h-60 overflow-y-auto">
                    {/* Select All Option */}
                    <div 
                      onClick={toggleAll}
                      className="flex items-center px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100"
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center mr-3 flex-shrink-0 transition-colors ${isAllSelected ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'}`}>
                        {isAllSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-sm font-medium text-slate-900">Весь проект</span>
                    </div>

                    {/* File List */}
                    {project.files.map((file) => {
                      const isSelected = selectedFileIds.includes(file.id);
                      return (
                        <div 
                          key={file.id}
                          onClick={() => toggleFile(file.id)}
                          className="flex items-center px-4 py-2.5 hover:bg-slate-50 cursor-pointer"
                        >
                          <div className={`w-4 h-4 rounded border flex items-center justify-center mr-3 flex-shrink-0 transition-colors ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'}`}>
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p className="text-sm text-slate-700 truncate">{file.name}</p>
                            <p className="text-xs text-slate-400">{file.rowCount} строк</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Merge Checkbox */}
            <div 
              onClick={() => setMergeFiles(!mergeFiles)}
              className="flex items-start cursor-pointer group"
            >
              <div className={`mt-0.5 mr-3 transition-colors ${mergeFiles ? 'text-indigo-600' : 'text-slate-300 group-hover:text-slate-400'}`}>
                 {mergeFiles ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
              </div>
              <div>
                <span className={`block text-sm font-medium transition-colors ${mergeFiles ? 'text-slate-900' : 'text-slate-600'}`}>
                   Объединить в один файл
                </span>
                <span className="block text-xs text-slate-500 mt-0.5">
                   Если выбрано, все данные будут собраны в один CSV-файл
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-100 mt-auto">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-slate-600 font-medium text-sm hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Отмена
          </button>
          <button 
            onClick={handleExport}
            disabled={isExporting || selectedFileIds.length === 0}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm hover:shadow"
          >
            {isExporting ? (
                <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Экспорт...
                </>
            ) : (
                <>
                    <Download className="w-4 h-4" />
                    Скачать CSV
                </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};