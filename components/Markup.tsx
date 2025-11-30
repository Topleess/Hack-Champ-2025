import React, { useState, useEffect, useMemo } from 'react';
import { AnalysisProject, Review, Sentiment } from '../types';
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUp, ArrowDown, FileText } from 'lucide-react';
import { KPICards } from './KPICards';
import { DataSourceSelector } from './DataSourceSelector';

interface MarkupProps {
  project: AnalysisProject;
  setProjectData: (updatedProject: AnalysisProject) => void;
}

const ITEMS_PER_PAGE = 20;

export const Markup: React.FC<MarkupProps> = ({ project, setProjectData }) => {
  const [filter, setFilter] = useState<'all' | Sentiment>('all');
  const [searchInput, setSearchInput] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>(project.files.map(f => f.id));
  
  // Sorting State: null (default), 'asc', or 'desc'
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);

  // Reset to first page when filters/project/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, appliedSearch, project.id, selectedFileIds]);

  // Filtering Logic
  const filteredReviews = useMemo(() => {
    return project.reviews.filter(review => {
        const matchesFile = selectedFileIds.includes(review.fileId);
        const matchesFilter = filter === 'all' || review.sentiment === filter;
        const matchesSearch = appliedSearch === '' || review.text.toLowerCase().includes(appliedSearch.toLowerCase());
        return matchesFile && matchesFilter && matchesSearch;
      });
  }, [project.reviews, selectedFileIds, filter, appliedSearch]);

  // Sorting Logic
  const sortedReviews = useMemo(() => {
    if (!sortDirection) return filteredReviews;
    
    return [...filteredReviews].sort((a, b) => {
      return sortDirection === 'asc' 
        ? a.confidence - b.confidence 
        : b.confidence - a.confidence;
    });
  }, [filteredReviews, sortDirection]);

  // Calculate counts for filters based on CURRENT file selection and search (unfiltered by sentiment)
  const counts = {
    all: project.reviews.filter(r => selectedFileIds.includes(r.fileId) && (appliedSearch === '' || r.text.toLowerCase().includes(appliedSearch.toLowerCase()))).length,
    positive: project.reviews.filter(r => selectedFileIds.includes(r.fileId) && r.sentiment === 'positive' && (appliedSearch === '' || r.text.toLowerCase().includes(appliedSearch.toLowerCase()))).length,
    neutral: project.reviews.filter(r => selectedFileIds.includes(r.fileId) && r.sentiment === 'neutral' && (appliedSearch === '' || r.text.toLowerCase().includes(appliedSearch.toLowerCase()))).length,
    negative: project.reviews.filter(r => selectedFileIds.includes(r.fileId) && r.sentiment === 'negative' && (appliedSearch === '' || r.text.toLowerCase().includes(appliedSearch.toLowerCase()))).length,
  };

  // Pagination Logic
  const totalItems = sortedReviews.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const currentReviews = sortedReviews.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSentimentChange = (reviewId: string, newSentiment: Sentiment) => {
    const updatedReviews = project.reviews.map(r => 
      r.id === reviewId ? { ...r, sentiment: newSentiment } : r
    );
    setProjectData({ ...project, reviews: updatedReviews });
  };

  const handleSearch = () => {
    setAppliedSearch(searchInput);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const toggleSort = () => {
    setSortDirection(current => {
      if (current === 'asc') return 'desc';
      return 'asc'; // default to asc if null or desc
    });
  };

  const getFileName = (fileId: string) => {
      return project.files.find(f => f.id === fileId)?.name || 'Неизвестный файл';
  };

  return (
    <div className="flex flex-col gap-6 h-full pb-6">
      
      {/* Top: KPI Cards */}
      <KPICards kpi={project.kpi} />

      {/* Main Content Block */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col flex-1 min-h-[500px]">
        
        {/* Table Controls */}
        <div className="p-4 border-b border-slate-100 flex flex-col gap-4">
            
            {/* Row 1: Data Selector */}
            <div className="flex justify-between items-center">
                 <h2 className="text-lg font-bold text-slate-800">Разметка данных</h2>
                 <DataSourceSelector 
                    files={project.files} 
                    selectedFileIds={selectedFileIds} 
                    onSelectionChange={setSelectedFileIds} 
                />
            </div>

            {/* Row 2: Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50 p-2 rounded-lg">
                {/* Filter Pills */}
                <div className="flex bg-white p-1 rounded-md shadow-sm border border-slate-200">
                {(['all', 'negative', 'neutral', 'positive'] as const).map((f) => {
                    const labels = { all: 'Все', negative: 'Негатив', neutral: 'Нейтрально', positive: 'Позитив' };
                    const isActive = filter === f;
                    const count = counts[f];
                    return (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                            isActive 
                            ? 'bg-slate-800 text-white shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                        }`}
                    >
                        {labels[f]}
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? 'bg-slate-600 text-slate-200' : 'bg-slate-100 text-slate-500'}`}>
                            {count}
                        </span>
                    </button>
                    );
                })}
                </div>

                {/* On-Demand Search */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <input 
                            type="text" 
                            placeholder="Поиск по тексту..." 
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full pl-4 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm"
                        />
                    </div>
                    <button 
                        onClick={handleSearch}
                        className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-sm"
                        title="Найти"
                    >
                        <Search className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>

        {/* Data Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-1/2">Текст отзыва</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Источник</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Класс (AI)</th>
                <th 
                  onClick={toggleSort}
                  className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors select-none group"
                >
                  <div className="flex items-center gap-1">
                    Увер.
                    <span className="text-slate-400 group-hover:text-slate-600">
                      {sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : sortDirection === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3 opacity-0 group-hover:opacity-50" />}
                    </span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentReviews.length === 0 ? (
                  <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                          Ничего не найдено по вашему запросу
                      </td>
                  </tr>
              ) : currentReviews.map((review) => (
                <tr key={review.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-800 line-clamp-2" title={review.text}>{review.text}</p>
                    {/* Optional: Show ID in small print if needed for debug, otherwise hidden per request */}
                    {/* <span className="text-[10px] text-slate-400 font-mono mt-1">#{review.id}</span> */}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600 bg-slate-100 px-2 py-1 rounded max-w-fit" title={getFileName(review.fileId)}>
                        <FileText className="w-3 h-3 flex-shrink-0" />
                        <span className="text-xs font-medium truncate max-w-[150px]">{getFileName(review.fileId)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative inline-block">
                      <select
                        value={review.sentiment}
                        onChange={(e) => handleSentimentChange(review.id, e.target.value as Sentiment)}
                        className={`
                          appearance-none pl-3 pr-8 py-1 rounded-full text-xs font-bold uppercase cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all
                          ${review.sentiment === 'positive' ? 'bg-green-100 text-green-700 focus:ring-green-500 hover:bg-green-200' : ''}
                          ${review.sentiment === 'negative' ? 'bg-red-100 text-red-700 focus:ring-red-500 hover:bg-red-200' : ''}
                          ${review.sentiment === 'neutral' ? 'bg-slate-100 text-slate-600 focus:ring-slate-500 hover:bg-slate-200' : ''}
                        `}
                      >
                        <option value="positive">Позитив</option>
                        <option value="neutral">Нейтрально</option>
                        <option value="negative">Негатив</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-current opacity-50">
                         <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            review.confidence > 0.8 ? 'bg-green-500' : review.confidence > 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${review.confidence * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-slate-500 tabular-nums">{Math.round(review.confidence * 100)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-white rounded-b-xl">
          <div className="text-sm text-slate-500">
             {totalItems > 0 ? `Показано ${startIndex + 1}-${endIndex} из ${totalItems}` : 'Нет данных'}
          </div>
          
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-2 rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed text-slate-500 transition-colors"
                title="Первая страница"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed text-slate-500 transition-colors"
                title="Предыдущая страница"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <span className="text-sm font-medium text-slate-700 px-3">
                Страница {currentPage} из {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed text-slate-500 transition-colors"
                title="Следующая страница"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed text-slate-500 transition-colors"
                title="Последняя страница"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
