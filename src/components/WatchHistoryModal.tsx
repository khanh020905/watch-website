import { motion } from 'motion/react';
import { X, Clock, MapPin, ShieldCheck, FileText, Calendar } from 'lucide-react';
import { ClientReservation } from '../types';

interface WatchHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservations: ClientReservation[];
  onCancelReservation?: (id: string) => void;
}

export default function WatchHistoryModal({ isOpen, onClose, reservations, onCancelReservation }: WatchHistoryModalProps) {
  if (!isOpen) return null;

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

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

      {/* Sheet Box */}
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
            <Clock size={22} />
          </div>
          <div>
            <h3 className="font-serif text-2xl font-extrabold tracking-tight">Lịch Sử Chứng Thư Đặt Chỗ</h3>
            <p className="text-xs text-white/55 font-mono uppercase tracking-widest mt-0.5">Velora Security Escrow History</p>
          </div>
        </div>

        {reservations.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
            <FileText size={40} className="text-white/20 mx-auto mb-3" />
            <p className="text-sm text-white/50 font-sans">Chưa có chứng thư đặt chỗ nào trong phiên làm việc này.</p>
            <p className="text-xs text-gold/60 mt-1">Đồng hồ hạng sang của bạn đang đợi bạn chế tác!</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {reservations.map((reservation) => (
              <div
                key={reservation.id}
                className="p-5 rounded-2xl border border-white/10 bg-zinc-900/40 hover:border-gold/30 transition-all space-y-4"
              >
                <div className="flex justify-between items-start border-b border-white/5 pb-3">
                  <div>
                    <span className="text-[10px] text-gold font-bold font-mono tracking-wider">{reservation.id}</span>
                    <h4 className="text-base font-serif font-bold text-cream mt-1">{reservation.watchName}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-white/40 block font-mono">{reservation.createdTime}</span>
                    <span className="text-sm text-gold font-extrabold">{formatPrice(reservation.price)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-white/70 font-sans">
                  <div>
                    <span className="text-white/40 text-[9px] uppercase block">Khắc laser:</span>
                    <span className="font-mono text-cream">
                      {reservation.customization.engravingText
                        ? `"${reservation.customization.engravingText.toUpperCase()}"`
                        : 'Không chọn'}
                    </span>
                  </div>
                  <div>
                    <span className="text-white/40 text-[9px] uppercase block">Dây đeo chế tác:</span>
                    <span className="font-mono text-cream font-medium">
                      {reservation.customization.strapType.toUpperCase()}
                    </span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-white/40 text-[9px] uppercase block">Hình thức bàn giao:</span>
                    <p className="text-white/80">
                      {reservation.deliveryMethod === 'pickup'
                        ? `Bàn giao trực tiếp tại: ${reservation.boutiqueLocation}`
                        : `Vận chuyển tận nhà: ${reservation.shippingAddress}`}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex justify-between items-center text-[10px]">
                  <span className="flex items-center gap-1.5 text-green-400 font-semibold uppercase">
                    <ShieldCheck size={12} /> Đã Bảo Chứng Trực Tuyến
                  </span>
                  {onCancelReservation && (
                    <button
                      onClick={() => onCancelReservation(reservation.id)}
                      className="text-white/40 hover:text-red-400 font-medium transition-colors cursor-pointer"
                    >
                      Hủy đặt chỗ
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-white/5 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white/5 hover:bg-white/10 active:scale-95 text-xs text-white uppercase tracking-wider font-bold rounded-full transition-all"
          >
            Đóng bảng
          </button>
        </div>
      </motion.div>
    </div>
  );
}
