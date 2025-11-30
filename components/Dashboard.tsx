import React, { useState } from 'react';
import { AnalysisProject, KeywordData } from '../types';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  Tooltip as RechartsTooltip 
} from 'recharts';
import { AlertCircle, Sparkles, ArrowRight, MessageCircle } from 'lucide-react';
import { KPICards } from './KPICards';
import { DataSourceSelector } from './DataSourceSelector';

interface DashboardProps {
  data: AnalysisProject;
}

const SENTIMENT_COLORS = {
  positive: '#22c55e', // green-500
  neutral: '#94a3b8',  // slate-400
  negative: '#ef4444', // red-500
};

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>(data.files.map(f => f.id));
  const [selectedKeyword, setSelectedKeyword] = useState<KeywordData | null>(null);

  // Filter Data based on selection
  // In a real app, we'd recalculate KPI and Keyword counts here based on filtered reviews
  // For prototype, we filter reviews to show count, but keep keywords static or semi-static
  const filteredReviews = data.reviews.filter(r => selectedFileIds.includes(r.fileId));

  // Calculate Sentiment Distribution for Pie Chart (Filtered)
  const sentimentCounts = filteredReviews.reduce((acc, review) => {
    acc[review.sentiment]++;
    return acc;
  }, { positive: 0, neutral: 0, negative: 0 });

  const pieData = [
    { name: 'Негатив', value: sentimentCounts.negative, color: SENTIMENT_COLORS.negative },
    { name: 'Нейтрально', value: sentimentCounts.neutral, color: SENTIMENT_COLORS.neutral },
    { name: 'Позитив', value: sentimentCounts.positive, color: SENTIMENT_COLORS.positive },
  ];

  const topNegative = data.keywords.filter(k => k.sentiment === 'negative').slice(0, 4);
  const topPositive = data.keywords.filter(k => k.sentiment === 'positive').slice(0, 4);

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* Filters Row */}
      <div className="flex justify-end">
        <DataSourceSelector 
            files={data.files} 
            selectedFileIds={selectedFileIds} 
            onSelectionChange={setSelectedFileIds} 
        />
      </div>

      {/* KPI Cards */}
      <KPICards kpi={data.kpi} />

      {/* Row 2: Sentiment + AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Box */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-6 items-center">
            <div className="w-full sm:w-1/2">
                <h3 className="text-lg font-bold text-slate-800 mb-2">Тональность</h3>
                <div className="h-48 relative">
                    <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                        >
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                        </Pie>
                        <RechartsTooltip />
                    </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center">
                            <span className="block text-xl font-bold text-slate-800">{filteredReviews.length}</span>
                            <span className="text-[10px] text-slate-400 uppercase tracking-wide">Всего</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="w-full sm:w-1/2 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                     <h3 className="text-lg font-bold text-slate-800">Инсайты (AI)</h3>
                </div>
                {data.aiInsights.map((insight, idx) => (
                    <div key={idx} className="flex gap-3 text-sm p-3 rounded-lg bg-slate-50 border border-slate-100">
                        {insight.includes('Аномалия') ? (
                            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                        ) : (
                            <Sparkles className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        )}
                        <p className="text-slate-700 leading-relaxed">
                            {/* Simple HTML parsing simulation for bolding */}
                            <span dangerouslySetInnerHTML={{ 
                                __html: insight
                                    .replace('Аномалия:', '<b>Аномалия:</b>')
                                    .replace('Позитив:', '<b>Позитив:</b>')
                                    .replace('Успех:', '<b>Успех:</b>')
                                    .replace('Критично:', '<b>Критично:</b>')
                            }} />
                        </p>
                    </div>
                ))}
            </div>
        </div>

        {/* Placeholder for layout balance if needed, but for now we span cols below */}
      </div>


      {/* Row 3: What people say (Split View) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[500px]">
         
         {/* Left: Butterfly Chart */}
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-slate-800">Топ тем обсуждения</h3>
                <p className="text-xs text-slate-400 mt-1">Нажмите на столбик, чтобы увидеть детали</p>
            </div>

            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-4 px-4">
                <span>Жалобы</span>
                <span>Похвалы</span>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                 {/* Combined row mapping */}
                 {Array.from({ length: Math.max(topNegative.length, topPositive.length) }).map((_, i) => {
                     const neg = topNegative[i];
                     const pos = topPositive[i];

                     return (
                         <div key={i} className="flex items-center gap-4">
                             {/* Negative Side */}
                             <div className="flex-1 flex items-center justify-end gap-3 cursor-pointer group" onClick={() => neg && setSelectedKeyword(neg)}>
                                 {neg && (
                                     <>
                                        <span className={`text-sm font-medium transition-colors ${selectedKeyword?.name === neg.name ? 'text-slate-900 font-bold' : 'text-slate-600 group-hover:text-slate-900'}`}>{neg.name}</span>
                                        <div className={`h-8 rounded-l-md flex items-center justify-end pr-2 transition-all ${selectedKeyword?.name === neg.name ? 'bg-red-400 shadow-md ring-2 ring-red-200' : 'bg-red-200 group-hover:bg-red-300'}`} style={{ width: `${(neg.count / 150) * 100}%`, minWidth: '40px' }}>
                                            <span className="text-xs font-bold text-white">{neg.count}</span>
                                        </div>
                                     </>
                                 )}
                             </div>

                             {/* Positive Side */}
                             <div className="flex-1 flex items-center justify-start gap-3 cursor-pointer group" onClick={() => pos && setSelectedKeyword(pos)}>
                                 {pos && (
                                     <>
                                        <div className={`h-8 rounded-r-md flex items-center justify-start pl-2 transition-all ${selectedKeyword?.name === pos.name ? 'bg-green-400 shadow-md ring-2 ring-green-200' : 'bg-green-200 group-hover:bg-green-300'}`} style={{ width: `${(pos.count / 150) * 100}%`, minWidth: '40px' }}>
                                            <span className="text-xs font-bold text-white">{pos.count}</span>
                                        </div>
                                        <span className={`text-sm font-medium transition-colors ${selectedKeyword?.name === pos.name ? 'text-slate-900 font-bold' : 'text-slate-600 group-hover:text-slate-900'}`}>{pos.name}</span>
                                     </>
                                 )}
                             </div>
                         </div>
                     )
                 })}
            </div>
         </div>

         {/* Right: Interactive Detail View */}
         <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center relative transition-all duration-300">
            {selectedKeyword ? (
                <div className="w-full h-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
                    <div className={`p-4 rounded-full mb-6 ${selectedKeyword.sentiment === 'negative' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                        <MessageCircle className="w-8 h-8" />
                    </div>
                    
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">"{selectedKeyword.name}"</h2>
                    <div className="flex items-center gap-2 text-slate-500 mb-8">
                        <span className="text-sm">Связанное понятие:</span>
                        <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-sm font-semibold text-indigo-600">
                            {selectedKeyword.relatedWord}
                        </span>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 w-full text-left mb-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-10">
                             <Sparkles className="w-16 h-16 text-indigo-600" />
                        </div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">AI Анализ</h4>
                        <p className="text-slate-700 leading-relaxed">
                            {selectedKeyword.aiContext}
                        </p>
                    </div>

                    <button className="mt-auto flex items-center text-indigo-600 font-medium hover:text-indigo-800 transition-colors group">
                        Показать примеры отзывов
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </button>
                </div>
            ) : (
                <div className="text-slate-400">
                    <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium text-slate-500 mb-2">Выберите тему слева</h3>
                    <p className="max-w-xs mx-auto text-sm">Нажмите на любой столбик графика, чтобы увидеть AI-анализ причин.</p>
                </div>
            )}
         </div>

      </div>

    </div>
  );
};
