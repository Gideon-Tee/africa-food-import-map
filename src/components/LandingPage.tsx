import { useCallback } from 'react';
import { ArrowDown, Globe, BarChart2, Package } from 'lucide-react';
import { HeroMap } from './HeroMap';
import gbhubLogo from '../assets/GBHUB-LOGO.png';

const STATS = [
  { icon: <Globe className="w-4 h-4" />,    value: '54',    label: 'Nations' },
  { icon: <Package className="w-4 h-4" />,   value: 'Top 3', label: 'Products' },
  { icon: <BarChart2 className="w-4 h-4" />, value: '3 Yrs', label: 'Trade Data' },
];

export function LandingPage() {
  const scrollToDashboard = useCallback(() => {
    document.getElementById('dashboard-section')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="relative w-full h-full flex overflow-hidden" style={{ background: '#f7f4f0' }}>

      {/* ── LEFT PANEL ── */}
      <div className="relative flex flex-col w-full md:w-[48%] lg:w-[42%] flex-shrink-0 h-full">

        {/* Logo — pinned top left */}
        <div className="absolute top-6 left-12 lg:left-16 z-20">
          <img src={gbhubLogo} alt="GBHub Africa" className="w-28 drop-shadow-sm" />
        </div>

        {/* Subtle blob */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute rounded-full opacity-30 blur-3xl"
            style={{ width:400,height:400,background:'radial-gradient(circle,rgba(183,43,24,0.12) 0%,transparent 70%)',top:'-10%',left:'-20%' }} />
        </div>

        {/* Main content — centred, padded away from logo */}
        <div className="flex flex-col justify-center flex-1 px-12 lg:px-16 pt-20 pb-10 relative z-10">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">
              Africa Food Trade Intelligence
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl lg:text-5xl font-[900] leading-[1.05] tracking-tight mb-6 text-gray-900">
            Africa's food
            <br />trade{' '}
            <span style={{
              background:'linear-gradient(90deg,rgb(183,43,24),rgb(237,104,67),rgb(250,187,37))',
              WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',
            }}>
              tells a story.
            </span>
          </h1>

          {/* Body card */}
          <div className="mb-7 p-6 rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm shadow-sm">
            <p className="text-gray-600 text-sm lg:text-base leading-relaxed">
              A story of <span className="text-brand-red font-bold">dependency</span>,{' '}
              <span className="text-brand-orange font-bold">opportunity</span>, and{' '}
              <span className="text-gray-900 font-bold">resilience</span>.
              This platform maps the top 3 imported and exported food products for all 54 African
              nations — ranked by USD trade value — alongside the source and destination countries
              driving each flow.
            </p>
            <p className="text-gray-400 text-xs mt-3">
              Explore by country and year to uncover patterns shaping the continent's food systems.
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-3 mb-8">
            {STATS.map(({ icon, value, label }) => (
              <div key={label} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white shadow-sm flex-1 justify-center">
                <span className="text-brand-red">{icon}</span>
                <div>
                  <p className="text-gray-900 font-[900] text-base leading-none">{value}</p>
                  <p className="text-gray-400 text-[9px] font-bold uppercase tracking-wider">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={scrollToDashboard}
            className="group relative flex items-center gap-3 px-7 py-3.5 rounded-xl font-black text-white text-sm shadow-lg overflow-hidden self-start"
            style={{ background:'linear-gradient(135deg,rgb(183,43,24) 0%,rgb(237,104,67) 100%)' }}
          >
            <span className="relative z-10">Explore the Map</span>
            <ArrowDown className="relative z-10 w-4 h-4 group-hover:translate-y-1 transition-transform duration-200" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background:'linear-gradient(135deg,rgb(237,104,67) 0%,rgb(250,187,37) 100%)' }} />
          </button>

          {/* Scroll hint */}
          <div className="mt-8 flex items-center gap-2 opacity-40">
            <div className="w-px h-8 bg-gradient-to-b from-gray-400 to-transparent" />
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em]">Scroll down to explore</span>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL — map ── */}
      <div className="hidden md:flex flex-1 relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{ background:'linear-gradient(to right,#f7f4f0,transparent)' }} />
        <div className="absolute top-6 right-6 z-20 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-3 py-1.5 shadow-sm flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Agricultural Commodities</span>
        </div>
        <HeroMap />
      </div>
    </div>
  );
}
