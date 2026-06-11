import React from 'react';
import { motion } from 'motion/react';
import { Eye, ShieldCheck, Clock, Award, Sliders } from 'lucide-react';
import { WatchModel } from '../types';

interface WatchCardProps {
  key?: string | number;
  watch: WatchModel;
  onReserve: (watch: WatchModel) => void;
}

export default function WatchCard({ watch, onReserve }: WatchCardProps) {
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  return (
    <article className="watch-card relative min-h-[600px] md:min-h-[660px] display-grid grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-[50px] items-center p-6 md:p-11 rounded-[38px] md:rounded-[46px] border border-white/10 bg-gradient-to-br from-[#17130f] to-[#070707] shadow-xl hover:border-gold/30 transition-all duration-500 overflow-hidden group">
      {/* Absolute styling glowing ornaments */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-gold/5 blur-[80px] group-hover:scale-125 transition-transform duration-1000 pointer-events-none" />

      {/* LEFT ASPECT: Visual Image Box with zoom parallax effect */}
      <div className="relative h-[280px] sm:h-[380px] md:h-[520px] rounded-[28px] md:rounded-[38px] overflow-hidden border border-white/10 [content-visibility:auto]">
        <img
          src={watch.image}
          alt={watch.name}
          className="w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-1000"
          loading="lazy"
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black via-black/40 to-transparent flex items-end p-6">
          <div className="flex gap-2.5 flex-wrap">
            {watch.highlights.slice(0, 2).map((highlight, idx) => (
              <span
                key={idx}
                className="bg-black/60 border border-white/10 text-white/80 rounded-full px-3 py-1 text-[10px] font-medium backdrop-blur-sm"
              >
                {highlight}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT ASPECT: Luxury Specs Copy & reservation buttons */}
      <div className="relative z-10">
        <span className="model-tag text-xs font-bold text-gold uppercase tracking-[3px] block mb-3">
          {watch.tag}
        </span>
        
        <h3 className="font-serif text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 group-hover:text-cream transition-colors">
          {watch.name}
        </h3>
        
        <p className="text-white/50 text-sm md:text-[15px] leading-relaxed mb-6">
          {watch.description}
        </p>

        {/* Feature Spec grid boxes */}
        <div className="grid grid-cols-3 gap-2.5 md:gap-3.5 my-6">
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col justify-center text-center">
            <strong className="text-gold font-serif text-lg md:text-xl font-bold block">{watch.caseSize}</strong>
            <span className="text-white/40 text-[10px] uppercase font-mono tracking-wider mt-1">Vỏ máy</span>
          </div>
          
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col justify-center text-center">
            <strong className="text-gold font-serif text-lg md:text-xl font-bold block">{watch.waterResist}</strong>
            <span className="text-white/40 text-[10px] uppercase font-mono tracking-wider mt-1">Chịu nước</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col justify-center text-center">
            <strong className="text-gold font-serif text-lg md:text-xl font-bold block">{watch.reservePower}</strong>
            <span className="text-white/40 text-[10px] uppercase font-mono tracking-wider mt-1">Tích cót</span>
          </div>
        </div>

        {/* Highlight points list */}
        <div className="space-y-2 mb-8">
          <span className="text-[10px] text-gold font-bold uppercase tracking-[2px] block">Nét Chế Tác Nổi Bật:</span>
          {watch.highlights.map((highlight, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-white/70">
              <ShieldCheck size={14} className="text-gold shrink-0 mt-0.5" />
              <span>{highlight}</span>
            </div>
          ))}
        </div>

        {/* Value and Reservation Call to action */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] text-white/40 uppercase tracking-[1.5px] block">Bảo chứng sở hữu</span>
            <div className="price text-2xl md:text-3xl font-extrabold text-gold font-serif tracking-tight mt-0.5">
              {formatPrice(watch.price)}
            </div>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => onReserve(watch)}
              className="flex-1 sm:flex-initial h-13 px-6 rounded-full border border-gold/30 text-gold hover:bg-gold/10 transition-all flex items-center justify-center gap-1.5 font-bold uppercase text-xs tracking-wider cursor-pointer"
            >
              <Sliders size={14} /> Chế Tác Riêng
            </button>
            <button
              onClick={() => onReserve(watch)}
              className="flex-1 sm:flex-initial h-13 px-8 bg-gold hover:bg-gold-hover text-luxury-bg hover:scale-[1.02] shadow-md shadow-gold/5 transition-all text-xs font-extrabold uppercase tracking-widest rounded-full cursor-pointer"
            >
              Đặt Chỗ
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
