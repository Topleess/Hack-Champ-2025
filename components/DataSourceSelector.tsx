import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Database, Check } from 'lucide-react';
import { DataFile } from '../types';

interface DataSourceSelectorProps {
  files: DataFile[];
  selectedFileIds: string[];
  onSelectionChange: (ids: string[]) => void;
}

export const DataSourceSelector: React.FC<DataSourceSelectorProps> = ({ 
  files, 
  selectedFileIds, 
  onSelectionChange 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSelection = (id: string) => {
    if (selectedFileIds.includes(id)) {
      if (selectedFileIds.length > 1) {
         onSelectionChange(selectedFileIds.filter(fid => fid !== id));
      }
    } else {
      onSelectionChange([...selectedFileIds, id]);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
      >
        <Database className="w-4 h-4 text-indigo-500" />
        <span>
            {selectedFileIds.length === files.length 
              ? 'Все данные' 
              : `Выбрано: ${selectedFileIds.length}`}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
           <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase">
             Источники данных
           </div>
           <div className="p-1">
             {files.map(file => (
               <div 
                 key={file.id} 
                 onClick={() => toggleSelection(file.id)}
                 className="flex items-center px-3 py-2 text-sm hover:bg-indigo-50 rounded cursor-pointer group"
               >
                 <div className={`w-4 h-4 mr-3 rounded border flex items-center justify-center transition-colors ${
                    selectedFileIds.includes(file.id) 
                      ? 'bg-indigo-600 border-indigo-600' 
                      : 'border-slate-300 bg-white'
                 }`}>
                   {selectedFileIds.includes(file.id) && <Check className="w-3 h-3 text-white" />}
                 </div>
                 <div className="flex-1 overflow-hidden">
                    <p className="truncate font-medium text-slate-700">{file.name}</p>
                    <p className="text-xs text-slate-400">{file.rowCount} строк • {file.uploadDate}</p>
                 </div>
               </div>
             ))}
           </div>
        </div>
      )}
    </div>
  );
};
