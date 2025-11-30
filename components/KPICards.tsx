import React from 'react';
import { MessageSquare, TrendingUp } from 'lucide-react';
import { KPI } from '../types';

const ActivityIcon = () => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-indigo-400">
      <path d="M22 12H18L15 21L9 3L6 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export const KPICards: React.FC<{ kpi: KPI }> = ({ kpi }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-32">
        <div className="flex justify-between items-start">
          <span className="text-sm font-medium text-slate-500">Всего отзывов</span>
          <MessageSquare className="w-5 h-5 text-indigo-400" />
        </div>
        <div className="text-3xl font-bold text-slate-900">{kpi.totalReviews}</div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-32">
        <div className="flex justify-between items-start">
          <span className="text-sm font-medium text-slate-500">NPS (Лояльность)</span>
          <TrendingUp className={`w-5 h-5 ${kpi.nps > 0 ? 'text-green-500' : 'text-red-500'}`} />
        </div>
        <div className="flex items-end gap-2">
          <span className={`text-3xl font-bold ${kpi.nps > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {kpi.nps > 0 ? '+' : ''}{kpi.nps}%
          </span>
          <span className={`text-sm font-medium mb-1 ${kpi.npsDelta >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {kpi.npsDelta > 0 ? '+' : ''}{kpi.npsDelta}% за неделю
          </span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-32">
        <div className="flex justify-between items-start">
          <span className="text-sm font-medium text-slate-500">Качество модели</span>
          <ActivityIcon />
        </div>
        <div>
          <div className="text-3xl font-bold text-slate-900">{kpi.avgConfidence}%</div>
          <div className="text-xs text-slate-400 mt-1">High Confidence</div>
        </div>
      </div>
    </div>
  );
};
