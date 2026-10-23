import React from 'react';
import { BrainCircuit, TrendingDown, TrendingUp } from 'lucide-react';
import { ShapItem } from '../types';

interface ShapExplanationCardProps {
  explanations?: ShapItem[];
}

export const ShapExplanationCard: React.FC<ShapExplanationCardProps> = ({ explanations }) => {
  if (!explanations || explanations.length === 0) return null;

  const maxImpact = Math.max(...explanations.map((item) => item.impact_percentage), 1);

  return (
    <section className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/40">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h5 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-indigo-600" />
            Explainable AI (SHAP) Risk Drivers
          </h5>
          <p className="text-[11px] text-slate-500 mt-1">
            Mathematical feature contributions that shifted this default-risk prediction.
          </p>
        </div>
        <span className="shrink-0 text-[10px] px-2 py-1 rounded-full bg-indigo-100 text-indigo-800 font-bold">
          TreeExplainer Active
        </span>
      </div>

      <div className="space-y-4">
        {explanations.map((item) => {
          const increasesRisk = item.impact === 'increases_risk';
          const width = Math.max(4, (item.impact_percentage / maxImpact) * 100);

          return (
            <div key={item.feature}>
              <div className="flex items-center justify-between gap-3 mb-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  {increasesRisk ? (
                    <TrendingUp className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  )}
                  <span className="text-xs font-semibold text-slate-800 truncate">{item.label}</span>
                </div>
                <span
                  className={`shrink-0 text-[11px] font-mono font-bold ${
                    increasesRisk ? 'text-rose-700' : 'text-emerald-700'
                  }`}
                >
                  {increasesRisk ? '+' : '-'}{item.impact_percentage}% Risk
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/80 overflow-hidden">
                <div
                  className={`h-full rounded-full ${increasesRisk ? 'bg-rose-500' : 'bg-emerald-500'}`}
                  style={{ width: `${width}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-normal">{item.summary}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
