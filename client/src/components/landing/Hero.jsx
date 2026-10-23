import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Check } from 'lucide-react';
import LineArtBackground from './LineArtBackground.jsx';
import SyncSculpture from '../three/SyncSculpture.jsx';
import ProductPreview from './ProductPreview.jsx';

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] bg-[#EAE9DF] text-[#102820] pt-12 pb-24 overflow-hidden flex flex-col justify-between">
      <LineArtBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#173D32]/10 border border-[#173D32]/15 text-xs font-semibold text-[#173D32] mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-[#34785B] animate-pulse" />
            <span>StaffSync 2.0 • Unified People & Workforce Platform</span>
          </div>

          <h1 className="font-serif-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-[#102820] max-w-5xl leading-[1.08] mb-6">
            Every team, <br />
            <span className="italic font-normal">working in sync.</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-[#34443A] max-w-2xl font-normal leading-relaxed mb-8">
            Bring employee directories, approval workflows, daily attendance, and team development
            together in one calm, editorial workspace.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5 mb-10">
            <Link
              to="/login"
              className="px-6 py-3.5 rounded-xl bg-[#173D32] text-[#EAE9DF] font-medium text-sm sm:text-base hover:bg-[#102820] shadow-md hover:shadow-lg transition-all flex items-center gap-2.5 group"
            >
              <span>Explore StaffSync</span>
              <ArrowRight className="w-4 h-4 text-[#C7F36B] group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#workflow"
              className="px-6 py-3.5 rounded-xl bg-white/70 hover:bg-white text-[#173D32] border border-[#173D32]/20 font-medium text-sm sm:text-base shadow-sm transition-all flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-[#7E8980]" />
              <span>See How It Works</span>
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#7E8980] font-medium mb-4">
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#34785B]" />
              Role-governed RBAC (HR, Manager, Employee)
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#34785B]" />
              Sub-second leave workflows
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#34785B]" />
              Real-time attendance telemetry
            </span>
          </div>
        </div>

        <div className="relative my-4 flex flex-col items-center justify-center">
          <div className="w-full max-w-3xl h-[420px] sm:h-[480px]">
            <SyncSculpture />
          </div>
        </div>

        <div className="mt-8">
          <ProductPreview />
        </div>
      </div>
    </section>
  );
}
