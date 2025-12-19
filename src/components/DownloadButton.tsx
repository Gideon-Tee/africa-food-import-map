import { Download } from 'lucide-react';

export function DownloadButton() {
  const handleDownload = () => {
    // In a real app, this would point to a static file in public/ or an API endpoint
    window.open('/Africa Food Import Map.xlsx', '_blank');
  };

  return (
    <button
      onClick={handleDownload}
      className="group flex items-center justify-between w-full px-6 py-5 bg-brand-yellow text-white font-black uppercase tracking-widest transition-all hover:bg-brand-orange hover:shadow-xl hover:shadow-brand-orange/20 rounded-2xl active:scale-[0.98] shadow-lg shadow-brand-yellow/20"
    >
      <div className="flex items-center gap-4">
        <div className="p-2 bg-white/20 rounded-lg group-hover:scale-110 transition-transform">
          <Download className="w-5 h-5" />
        </div>
        <div className="flex flex-col items-start leading-none">
          <span className="text-sm">Download Data</span>
          <span className="text-[9px] mt-1 opacity-70">Complete Dataset</span>
        </div>
      </div>
      <span className="text-[10px] bg-black/10 px-2 py-1.5 rounded-md font-bold">XLSX</span>
    </button>
  );
}
