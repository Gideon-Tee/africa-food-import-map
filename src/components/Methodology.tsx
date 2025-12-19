import { Info } from 'lucide-react';

interface MethodologyProps {
  isCompact?: boolean;
}

export function Methodology({ isCompact }: MethodologyProps) {
  if (isCompact) {
    return (
      <div className="bg-white p-6 border border-gray-100 shadow-2xl backdrop-blur-2xl">
        <div className="flex items-center gap-3 mb-4 text-brand-orange">
          <Info className="w-5 h-5" />
          <h2 className="font-bold uppercase tracking-wider text-xs">Methodology</h2>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed mb-4">
          Data synthesized from OECD and FAO. Trade values represent official reported figures for agricultural and food products (2021-2023).
        </p>
        <div className="pt-4 border-t border-gray-100">
          <p className="text-[10px] text-gray-400 italic">
            * Sugar reclassified per GBFoods standards as a primary category.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 mt-8 border border-gray-100 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <Info className="w-6 h-6 text-brand-orange" />
        <h2 className="text-xl font-bold text-gray-900">Methodology & Data Sources</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-500 text-sm leading-relaxed">
        <div className="space-y-4">
          <p>
            The data presented in this dashboard is synthesized from multiple authoritative sources including the 
            <span className="text-gray-900 font-medium"> Organisation for Economic Co-operation and Development (OECD)</span> and the 
            <span className="text-gray-900 font-medium"> Food and Agriculture Organization (FAO)</span>.
          </p>
          <p>
            Trade values represent official reported figures for agricultural and food products, categorized by 
            HS codes and aggregated by year (2021-2023).
          </p>
        </div>
        
        <div className="space-y-4">
          <p>
            <span className="text-brand-red font-semibold underline">Note on Product Classification:</span>
          </p>
          <p>
            In alignment with GBFoods' internal reporting standards, <span className="text-gray-900 font-medium">Sugar</span> has been 
            reclassified as a primary food import/export category due to its significant impact on the African food 
            market and its role in regional food security and processing.
          </p>
          <p>
            Top 3 rankings are based on total USD value for each country in the respective year.
          </p>
        </div>
      </div>
    </div>
  );
}
