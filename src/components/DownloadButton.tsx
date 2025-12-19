import { Download } from 'lucide-react';

export function DownloadButton() {
  const handleDownload = () => {
    // In a real app, this would point to a static file in public/ or an API endpoint
    window.open('/Africa Food Import Map.xlsx', '_blank');
  };

  return (
    <button
      onClick={handleDownload}
      className="flex items-center justify-between w-full px-6 py-4 bg-brand-yellow text-white font-black uppercase tracking-widest transition-all hover:bg-brand-orange hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-brand-yellow/20"
    >
      <div className="flex items-center gap-3">
        <Download className="w-5 h-5" />
        <span>Report Data</span>
      </div>
      <span className="text-[10px] bg-white/20 px-2 py-1 rounded">XLSX</span>
    </button>
  );
}
