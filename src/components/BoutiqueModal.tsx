import { motion } from 'motion/react';
import { X, MapPin, Phone, Clock, Compass, Award } from 'lucide-react';
import { BOUTIQUES_DATA } from '../data/watches';

interface BoutiqueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BoutiqueModal({ isOpen, onClose }: BoutiqueModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Main Board */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative w-full max-w-2xl rounded-[28px] border border-white/10 bg-zinc-950 p-6 md:p-8 text-white z-10 overflow-hidden shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full border border-white/10 bg-black/30 text-white/50 hover:text-white hover:border-white/30 transition-all z-20"
        >
          <X size={16} />
        </button>

        <div className="mb-6 flex gap-3 items-center">
          <div className="p-3 bg-gold/10 border border-gold/30 rounded-full text-gold">
            <Compass className="animate-spin-slow" size={22} />
          </div>
          <div>
            <h3 className="font-serif text-2xl font-extrabold tracking-tight">Hệ Thống Velora Boutique</h3>
            <p className="text-xs text-white/55 font-mono uppercase tracking-widest mt-0.5">Velora Luxury Flagship Showrooms</p>
          </div>
        </div>

        <p className="text-xs md:text-sm text-white/60 mb-6 leading-relaxed">
          Đón chào quý tôn chủ ghé thăm các không gian trải nghiệm sang trọng hàng đầu của chúng tôi. Tại đây, quý khách sẽ được đón tiếp riêng biệt trong phòng VIP Lounges, thưởng thức rượu Single Malt hảo hạng và được tư vấn trực tiếp bởi chuyên gia đo lường Thụy Sỹ.
        </p>

        <div className="space-y-4">
          {BOUTIQUES_DATA.map((boutique) => (
            <div
              key={boutique.id}
              className="p-5 rounded-2xl border border-white/10 bg-zinc-900/40 hover:border-gold/30 transition-all grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
            >
              <div className="md:col-span-8 space-y-2">
                <div className="flex items-center gap-1.5">
                  <span className="bg-gold/10 border border-gold/30 text-gold font-bold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                    {boutique.city}
                  </span>
                  <h4 className="text-base font-serif font-bold text-cream">{boutique.name}</h4>
                </div>
                <p className="text-xs text-white/60 flex items-start gap-1">
                  <MapPin size={12} className="stroke-[2.5] text-gold shrink-0 mt-0.5" />
                  <span>{boutique.address}</span>
                </p>
                <p className="text-xs text-white/50 flex items-center gap-1">
                  <Phone size={12} className="text-gold shrink-0" /> Hotline tiếp đón: <span className="text-cream font-mono">{boutique.phone}</span>
                </p>
              </div>

              <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-white/5 pt-3 md:pt-0 md:pl-4 space-y-1 text-left md:text-right">
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Giờ mở cửa</p>
                <p className="text-xs text-white/80 font-bold flex items-center gap-1 md:justify-end">
                  <Clock size={11} className="text-gold" /> 09:00 - 21:30
                </p>
                <p className="text-[9px] text-white/30 italic">Mở cửa tất cả ngày lễ</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] text-white/40">
          <span className="flex items-center gap-1">
            <Award size={12} className="text-gold" /> Đại lý ủy quyền chính thức
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gold hover:bg-gold-hover text-luxury-bg text-xs font-bold uppercase tracking-wider rounded-full transition-all"
          >
            Bàn giao & Đón tiếp
          </button>
        </div>
      </motion.div>
    </div>
  );
}
