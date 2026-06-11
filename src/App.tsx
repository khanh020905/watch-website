import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Clock,
  Compass,
  Award,
  ShieldCheck,
  ChevronRight,
  Phone,
  ArrowUpRight,
  Mail,
  MapPin,
  ChevronUp,
  MessageSquare,
  Sparkles,
  Info
} from 'lucide-react';
import Header from './components/Header';
import WatchCard from './components/WatchCard';
import ReserveModal from './components/ReserveModal';
import WatchHistoryModal from './components/WatchHistoryModal';
import BoutiqueModal from './components/BoutiqueModal';
import RealTimeClock from './components/RealTimeClock';
import { WATCHES_DATA } from './data/watches';
import { WatchModel, ClientReservation } from './types';

// Register GSAP plugins safely
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function App() {
  const [selectedWatch, setSelectedWatch] = useState<WatchModel | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isBoutiquesOpen, setIsBoutiquesOpen] = useState(false);
  const [reservations, setReservations] = useState<ClientReservation[]>([]);
  
  // Back to Top trigger state
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  // VIP Client Care inquiry state
  const [clientInquiry, setClientInquiry] = useState({
    name: '',
    phone: '',
    timeSlot: 'morning',
    preferredModel: 'chronos',
    submitted: false
  });

  // Load reservations from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('velora_reservations');
      if (stored) {
        setReservations(JSON.parse(stored));
      }
    } catch {
      console.error('Không thể nạp dữ liệu từ localStorage');
    }
  }, []);

  // Monitor Scroll for Back To Top visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // GSAP Cinematic Entrance & Parallax Scroll Animations
  useEffect(() => {
    // 1. Smooth Fade-In and slide up for Hero components
    const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.4 } });
    
    tl.fromTo('.gsap-hero-badge', 
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, delay: 0.2 }
    );
    
    tl.fromTo('.gsap-hero-title', 
      { opacity: 0, y: 30, letterSpacing: '-0.02em' },
      { opacity: 1, y: 0, letterSpacing: 'normal' },
      '-=1.1'
    );
    
    tl.fromTo('.gsap-hero-desc', 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0 },
      '-=1.1'
    );
    
    tl.fromTo('.gsap-hero-cta', 
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, stagger: 0.1 },
      '-=1.1'
    );

    tl.fromTo('.gsap-hero-spec',
      { opacity: 0, x: -25 },
      { opacity: 1, x: 0, stagger: 0.15 },
      '-=1.2'
    );

    // 2. Parallax Scale & Rotation on Watch Case Frame itself
    gsap.fromTo('.gsap-watch-case',
      { opacity: 0, scale: 0.85, y: 50 },
      { opacity: 1, scale: 1, y: 0, duration: 2, ease: 'power3.out' }
    );

    // Subtle floating loop for the watch showcase
    gsap.to('.gsap-watch-case', {
      y: '+=10',
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    // 3. Scrubbed Scroll Parallax rotation for the outer dial ring structures
    gsap.to('.gsap-dial-ring', {
      rotation: 180,
      scrollTrigger: {
        trigger: 'section',
        start: 'top top',
        end: 'bottom center',
        scrub: 1,
      }
    });

    // 4. Precision row-reveal animated on scroll
    gsap.fromTo('.gsap-precision-row',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1.1,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#precision',
          start: 'top 80%',
        }
      }
    );

    return () => {
      // Clear triggers or trackers on unmount to prevent leaks
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const handleSaveReservation = (newRes: ClientReservation) => {
    const updated = [newRes, ...reservations];
    setReservations(updated);
    try {
      localStorage.setItem('velora_reservations', JSON.stringify(updated));
    } catch {
      console.error('Không thể ghi dữ liệu tới localStorage');
    }
  };

  const handleCancelReservation = (id: string) => {
    const updated = reservations.filter(res => res.id !== id);
    setReservations(updated);
    try {
      localStorage.setItem('velora_reservations', JSON.stringify(updated));
    } catch {
      console.error('Không thể cập nhật localStorage');
    }
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientInquiry.name || !clientInquiry.phone) return;
    setClientInquiry(prev => ({ ...prev, submitted: true }));

    // Auto reset submission state after 5 seconds
    setTimeout(() => {
      setClientInquiry(prev => ({ ...prev, name: '', phone: '', submitted: false }));
    }, 6000);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-luxury-bg text-white selection:bg-gold selection:text-luxury-bg overflow-x-hidden">
      {/* Absolute Cinematic Noise Overlay */}
      <div className="noise-overlay" />

      {/* Floating Header */}
      <Header
        onOpenStoreLocations={() => setIsBoutiquesOpen(true)}
        onOpenReservationsHistory={() => setIsHistoryOpen(true)}
        reservationsCount={reservations.length}
      />

      {/* ================= SECTION 1: HERO ================= */}
      <section className="relative min-h-screen pt-28 md:pt-36 pb-16 px-6 lg:px-12 flex items-center justify-center bg-gradient-to-b from-[#0e0c0a] via-[#050505] to-[#050505] overflow-hidden">
        {/* Cinematic Glowing Backgrounds */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold/10 blur-[130px] pointer-events-none" />
        <div className="absolute top-20 right-10 w-[350px] h-[350px] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />

        {/* Absolute Giant Background Watermark Text */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-[18vw] font-black tracking-[-0.05em] text-white/[0.02] select-none pointer-events-none uppercase whitespace-nowrap">
          TIMEPIECE
        </div>

        {/* Grid Structure */}
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          
          {/* Left Specification Sidebar (Columns: 3) */}
          <div className="hidden lg:flex lg:col-span-3 flex-col justify-between h-[50vh] border-l border-luxury-border pl-6">
            <div className="gsap-hero-spec space-y-1">
              <span className="font-serif text-5xl text-gold font-light block tracking-tight">01</span>
              <p className="text-[10px] text-white/50 uppercase tracking-[2px] font-bold">AUTOMATIC CALIBER</p>
              <p className="text-xs text-white/70 max-w-[180px] font-sans">Sử dụng chuyển động cơ tự động, tần số dao động cao mượt mà.</p>
            </div>

            <div className="gsap-hero-spec space-y-1">
              <span className="font-serif text-5xl text-gold font-light block tracking-tight">42H</span>
              <p className="text-[10px] text-white/50 uppercase tracking-[2px] font-bold">POWER RESERVE</p>
              <p className="text-xs text-white/70 max-w-[180px] font-sans">Thời gian tích cót vượt trội, duy trì hoạt động bền vững.</p>
            </div>

            <div className="gsap-hero-spec space-y-1">
              <span className="font-serif text-5xl text-gold font-light block tracking-tight">5ATM</span>
              <p className="text-[10px] text-white/50 uppercase tracking-[2px] font-bold">WATER RESISTANT</p>
              <p className="text-xs text-white/70 max-w-[180px] font-sans">Chống nước tối ưu, an toàn sử dụng trong điều kiện hằng ngày.</p>
            </div>
          </div>

          {/* Central Watch Image Showcase Stage (Columns: 5) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative py-6">
            {/* Rotating Outer Dial Rings */}
            <div className="gsap-dial-ring relative w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] rounded-full border border-gold/15 flex items-center justify-center shadow-inner">
              <div className="absolute inset-4 rounded-full border border-white/5 flex items-center justify-center">
                <div className="absolute inset-10 rounded-full border border-gold/5 flex items-center justify-center" />
              </div>

              {/* Central Premium Watch Case Frame */}
              <div className="gsap-watch-case relative w-[240px] h-[360px] sm:w-[320px] sm:h-[460px] rounded-full overflow-hidden border border-white/15 bg-[#111] shadow-2xl shadow-black z-10">
                <img
                  src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1100&q=90"
                  alt="Velora Luxury Watches Centercase"
                  className="w-full h-full object-cover transform scale-110 hover:scale-[1.14] transition-all duration-1000"
                />
                
                {/* Vignette lighting cover */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/35 to-black/85" />
              </div>

              {/* Floating Cost Indicator Bubble */}
              <div className="absolute right-[-10px] bottom-16 z-20 w-44 p-4 rounded-2xl glass-box border border-white/10 bg-zinc-950/80 backdrop-blur-md shadow-xl">
                <span className="text-[9px] text-white/50 uppercase tracking-[1px] block font-semibold mb-1">Thời Thượng Chỉ Từ</span>
                <strong className="text-xl font-extrabold text-gold block tracking-tight">12.900.000đ</strong>
                <span className="text-[8px] text-[#22c55e] font-mono flex items-center gap-1 mt-1">
                  ● Bảo Chứng Thụy Sỹ
                </span>
              </div>
            </div>
          </div>

          {/* Right Seductive Branding Headline Copy (Columns: 4) */}
          <div className="lg:col-span-4 flex flex-col justify-center text-left">
            <div className="gsap-hero-badge inline-flex items-center gap-3 text-gold text-xs font-bold uppercase tracking-[4px] mb-6">
              <span className="w-10 h-0.5 bg-gold block" />
              CHRONO AVANT-GARDE
            </div>

            <h1 className="gsap-hero-title font-serif text-4xl sm:text-6xl md:text-7xl font-light tracking-tight leading-[1.05] mb-6 text-white">
              Time Is <br />
              <span className="italic font-light text-gold font-serif block sm:inline">Not Worn.</span> <br className="hidden sm:inline" />
              It Is <span className="font-semibold text-cream">Owned.</span>
            </h1>

            <p className="gsap-hero-desc text-white/60 text-sm md:text-base leading-relaxed mb-8 max-w-[420px]">
              Tuyệt tác cơ học đúc kết tinh hoa đo lường thời gian châu Âu. Từng đường vát xước, mặt kính gương thẳm và bánh lắc dao động nhịp nhàng tạo nên đẳng cấp thượng cổ riêng biệt cho chủ nhân sở hữu.
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => scrollToSection('collection')}
                className="gsap-hero-cta h-14 px-8 bg-gold hover:bg-gold-hover text-luxury-bg text-xs font-extrabold uppercase tracking-[2px] rounded-full transition-all duration-300 shadow-md shadow-gold/10 flex items-center gap-2 cursor-pointer"
              >
                Khám Phá Collection <ArrowUpRight size={14} />
              </button>
              <button
                onClick={() => scrollToSection('precision')}
                className="gsap-hero-cta h-14 px-6 text-xs text-white hover:text-gold uppercase tracking-[1.5px] font-bold border-b border-white/20 hover:border-gold transition-all duration-300 py-2 cursor-pointer"
              >
                Xem Công Nghệ Chế Tác
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Continuous Marquee Banner */}
        <div className="absolute bottom-6 left-0 w-full overflow-hidden whitespace-nowrap bg-zinc-950/40 border-y border-white/5 py-4 pointer-events-none [content-visibility:auto]">
          <div className="animate-marquee flex gap-12 text-sm md:text-base font-serif tracking-[4px] font-extrabold text-white/5 uppercase opacity-35 select-none">
            <span>VELORA AUTOMATIC WATCH — SWISS CALIBER MECHANISM — OWN THE CHRONO MOMENT</span>
            <span>VELORA AUTOMATIC WATCH — SWISS CALIBER MECHANISM — OWN THE CHRONO MOMENT</span>
            <span>VELORA AUTOMATIC WATCH — SWISS CALIBER MECHANISM — OWN THE CHRONO MOMENT</span>
            <span>VELORA AUTOMATIC WATCH — SWISS CALIBER MECHANISM — OWN THE CHRONO MOMENT</span>
          </div>
        </div>
      </section>

      {/* ================= SECTION 2: PRECISION BOARD ================= */}
      <section id="precision" className="py-24 md:py-32 px-6 lg:px-12 bg-black relative border-t border-white/5 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="max-w-3xl mb-16 md:mb-24">
            <span className="text-gold text-xs font-bold uppercase tracking-[3px] block mb-3">TINH HOA ĐO LƯỜNG</span>
            <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[0.9]">
              Triết lý hoàn mỹ trong từng chi tiết siêu nhỏ.
            </h2>
            <p className="text-white/50 text-sm md:text-base mt-6 leading-relaxed max-w-xl">
              Không sử dụng cơ chế bo ráp hàng loạt, Velora quy tụ các bậc thầy nghệ nhân thủ công chăm chút tỉ mẩn từng phiến cầu máy, nén ép cót tự động và vát khía cạnh vỏ để đạt độ tương phản ánh sáng lý tưởng nhất.
            </p>
          </div>

          {/* Luxury Row Table Design */}
          <div className="border-t border-white/10 [content-visibility:auto]">
            {/* Row 1 */}
            <div className="gsap-precision-row grid grid-cols-1 md:grid-cols-12 gap-6 py-10 border-b border-white/10 items-center hover:bg-white/[0.01] px-2 transition-colors">
              <div className="md:col-span-2 text-gold font-serif text-4xl font-light">01</div>
              <div className="md:col-span-4">
                <h3 className="font-serif text-2xl font-bold tracking-tight text-white group-hover:text-gold">
                  Automatic Sweeping Caliber
                </h3>
                <span className="text-[10px] text-white/40 uppercase tracking-widest block mt-1 font-mono">BỘ CHUYỂN ĐỘNG TRƠN TRU</span>
              </div>
              <div className="md:col-span-6 text-white/60 text-xs md:text-sm leading-relaxed">
                Máy cơ tự động dao động tần số 28,800 Alt/h giúp kim giây lướt trôi nhịp nhàng gần như không giật hạt. Trở thành nét nghệ thuật uyển chuyển tuyệt đẹp đại diện cho dòng máy luxury Thụy Sỹ.
              </div>
            </div>

            {/* Row 2 */}
            <div className="gsap-precision-row grid grid-cols-1 md:grid-cols-12 gap-6 py-10 border-b border-white/10 items-center hover:bg-white/[0.01] px-2 transition-colors">
              <div className="md:col-span-2 text-gold font-serif text-4xl font-light">02</div>
              <div className="md:col-span-4">
                <h3 className="font-serif text-2xl font-bold tracking-tight text-white">
                  Scratch-Resistant Sapphire
                </h3>
                <span className="text-[10px] text-white/40 uppercase tracking-widest block mt-1 font-mono">KÍNH SAPPHIRE NGUYÊN KHỐI</span>
              </div>
              <div className="md:col-span-6 text-white/60 text-xs md:text-sm leading-relaxed">
                Được bảo vệ bởi kính sapphire cong vòm phủ chống lóa AR đa lớp giúp tối ưu quan sát mặt số trong mọi góc nắng gắt. Độ cứng vượt trội chỉ đứng sau kim cương bảo toàn vẻ trong như gương vĩnh cửu.
              </div>
            </div>

            {/* Row 3 */}
            <div className="gsap-precision-row grid grid-cols-1 md:grid-cols-12 gap-6 py-10 border-b border-white/10 items-center hover:bg-white/[0.01] px-2 transition-colors">
              <div className="md:col-span-2 text-gold font-serif text-4xl font-light">03</div>
              <div className="md:col-span-4">
                <h3 className="font-serif text-2xl font-bold tracking-tight text-white">
                  Surgical Steel 316L Case
                </h3>
                <span className="text-[10px] text-white/40 uppercase tracking-widest block mt-1 font-mono">THÉP Y TẾ ĐÁNH BÓNG SATIN</span>
              </div>
              <div className="md:col-span-6 text-white/60 text-xs md:text-sm leading-relaxed">
                Toàn bộ thân vỏ đúc từ thép không gỉ 316L, nung nguội cường độ cao chống lại hoàn toàn gỉ sét mỏi muối biển. Xử lý bề mặt mờ nhám kết hợp góc cạnh bóng loáng phản ứng ánh kim cương quý báu.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 3: STACKED COLLECTION ================= */}
      <section id="collection" className="py-24 md:py-32 px-6 lg:px-12 bg-zinc-950 border-t border-white/5 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          {/* Section Master Header */}
          <div className="max-w-3xl mb-16 md:mb-24">
            <span className="text-gold text-xs font-bold uppercase tracking-[3px] block mb-3">WATCH COLLECTION</span>
            <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[0.9]">
              Chọn kiệt tác phản chiếu tinh hoa của tầm vóc.
            </h2>
            <p className="text-white/50 text-sm md:text-base mt-6 leading-relaxed max-w-xl">
              Khám phá các mẫu đồng hồ automatic kinh điển mang đậm ngôn ngữ nghệ thuật của Velora. Mỗi sản phẩm được phát triển dưới phiên bản giới hạn, có khắc số thứ tự riêng biệt phía đáy máy.
            </p>
          </div>

          {/* Catalog Stack of Custom Cards */}
          <div className="space-y-16">
            {WATCHES_DATA.map((watch) => (
              <WatchCard
                key={watch.id}
                watch={watch}
                onReserve={(w) => setSelectedWatch(w)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ================= SECTION 4: ANATOMY COGNITIVE BLUEPRINT ================= */}
      <section id="anatomy" className="py-24 md:py-32 px-6 lg:px-12 bg-black bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/50 via-black to-black border-t border-white/5 scroll-mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Blueprint Graphic Placement Side (Columns: 6) */}
          <div className="lg:col-span-6 relative flex items-center justify-center h-[400px] sm:h-[550px] md:h-[650px]">
            <div className="absolute w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] border border-white/5 rounded-full flex items-center justify-center animate-spin-slow" />
            <div className="absolute w-[220px] h-[220px] sm:w-[350px] sm:h-[350px] border border-dashed border-gold/10 rounded-full" />

            {/* Main Center Watch Blueprint */}
            <div className="relative w-[280px] h-[280px] sm:w-[420px] sm:h-[420px] rounded-full overflow-hidden border border-white/10 glow-gold shadow-2xl z-10 [content-visibility:auto]">
              <img
                src="https://images.unsplash.com/photo-1619134778706-7015533a6150?auto=format&fit=crop&w=1100&q=90"
                alt="Velora Caliber Skeleton Blueprint"
                className="w-full h-full object-cover opacity-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            </div>

            {/* Spec pointers labels floating */}
            <div className="absolute top-[12%] left-[4%] bg-black/60 border border-white/10 px-4 py-1.5 rounded-full text-[10px] md:text-xs font-mono tracking-wider font-semibold shadow-lg text-cream/90 backdrop-blur-sm z-20">
              Mặt Saphire Cong AR
            </div>

            <div className="absolute top-[28%] right-[2%] bg-black/60 border border-white/10 px-4 py-1.5 rounded-full text-[10px] md:text-xs font-mono tracking-wider font-semibold shadow-lg text-cream/90 backdrop-blur-sm z-20">
              Vành Bezel Ceramic Xoay
            </div>

            <div className="absolute bottom-[28%] left-[2%] bg-black/60 border border-white/10 px-4 py-1.5 rounded-full text-[10px] md:text-xs font-mono tracking-wider font-semibold shadow-lg text-cream/90 backdrop-blur-sm z-20">
              Máy Tự Động Caliber V3
            </div>

            <div className="absolute bottom-[12%] right-[8%] bg-black/60 border border-white/10 px-4 py-1.5 rounded-full text-[10px] md:text-xs font-mono tracking-wider font-semibold shadow-lg text-cream/90 backdrop-blur-sm z-20">
              Dây Da Ý Hand-sewn
            </div>
          </div>

          {/* Blueprint Copy Explanation (Columns: 6) */}
          <div className="lg:col-span-6 space-y-8">
            <span className="text-gold text-xs font-bold uppercase tracking-[3px] block">WATCH ANATOMY</span>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[0.9]">
              Tuyệt đỉnh cơ học đồng thời song song.
            </h2>
            <p className="text-white/60 text-sm md:text-base leading-relaxed">
              Mỗi bộ máy cơ khí của Velora chứa hơn 180 linh kiện được tinh chỉnh để giảm lực ma sát tối đa. Độ sai lệch của kim cơ hội được đong đếm cẩn trọng bằng hệ thống căn chỉnh điện từ dải quang sải rộng.
            </p>

            <div className="border-t border-white/5 pt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-start py-2 border-b border-white/5">
                <strong className="text-gold text-xs uppercase tracking-wider font-mono">BẢO CHỨNG:</strong>
                <span className="sm:col-span-3 text-xs text-white/70">Cam kết bảo dưỡng chu đáo định kỳ miễn phí trọn đời tại mọi Boutique Việt Nam.</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-start py-2 border-b border-white/5">
                <strong className="text-gold text-xs uppercase tracking-wider font-mono">CHỐNG SỐC:</strong>
                <span className="sm:col-span-3 text-xs text-white/70">Trang bị hệ thống hấp thụ xung chấn Incabloc đỉnh cao hấp thu 98% tổn hại do va đập vật lý.</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-start py-2">
                <strong className="text-gold text-xs uppercase tracking-wider font-mono">ĐÁNH SỐ:</strong>
                <span className="sm:col-span-3 text-xs text-white/70">Nhà máy sản xuất phát số thứ tự Series chìm tăng trị giá sưu tầm tài sản theo thời gian.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 5: LIFESTYLE MAGAZINE grid ================= */}
      <section id="lifestyle" className="py-24 md:py-32 px-6 lg:px-12 bg-zinc-950 border-t border-white/5 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16 md:mb-24">
            <div className="lg:col-span-7">
              <span className="text-gold text-xs font-bold uppercase tracking-[3px] block mb-3">LIFESTYLE & CAMPAIGN</span>
              <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[0.9]">
                Khoảnh khắc khẳng định vị thế.
              </h2>
            </div>
            <div className="lg:col-span-5 text-white/50 text-xs md:text-sm leading-relaxed">
              Chiếc đồng hồ cao cấp không chỉ giúp đếm giây phút, nó còn phán quyết phong thái sang trọng bất biến của bạn trong từng sải bước bước ra xã hội.
            </div>
          </div>

          {/* Editorial 3 Column staggered photo grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 [content-visibility:auto]">
            {/* Box 1 */}
            <div className="relative group rounded-[32px] overflow-hidden border border-white/10 bg-neutral-900 aspect-[3/4] h-fit md:mt-24">
              <img
                src="https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=90"
                alt="Velora Executive campaign"
                className="w-full h-full object-cover transform scale-102 group-hover:scale-108 transition-all duration-1000"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-6">
                <span className="text-gold text-[10px] font-bold uppercase tracking-[2px] block mb-1">BUSINESS AMBASSADOR</span>
                <h4 className="font-serif text-2xl font-bold text-cream mb-2">Thương Giới Đỉnh Phong</h4>
                <p className="text-xs text-white/60 leading-relaxed">Đối tác tuyệt đối, khẳng định chữ tín tối cao trong từng cuộc thương thuyết kinh tế.</p>
              </div>
            </div>

            {/* Box 2 (Center highest box) */}
            <div className="relative group rounded-[32px] overflow-hidden border border-white/10 bg-neutral-900 aspect-[3/4.5] h-fit">
              <img
                src="https://images.unsplash.com/photo-1539874754764-5a96559165b0?auto=format&fit=crop&w=1000&q=90"
                alt="Velora Luxury Evening campaign"
                className="w-full h-full object-cover transform scale-102 group-hover:scale-108 transition-all duration-1000"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-6">
                <span className="text-gold text-[10px] font-bold uppercase tracking-[2px] block mb-1">EVENING SOPHISTICATION</span>
                <h4 className="font-serif text-2xl font-bold text-cream mb-2">Dạ Tiệc Thượng Lưu</h4>
                <p className="text-xs text-white/60 leading-relaxed">Nổi bật tinh tế dưới ánh đèn pha lê tiệc tối. Gây lưu luyến cho mọi ánh nhìn lướt qua.</p>
              </div>
            </div>

            {/* Box 3 */}
            <div className="relative group rounded-[32px] overflow-hidden border border-white/10 bg-neutral-900 aspect-[3/4] h-fit md:mt-12">
              <img
                src="https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=900&q=90"
                alt="Velora Cosmopolitan traveler"
                className="w-full h-full object-cover transform scale-102 group-hover:scale-108 transition-all duration-1000"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-6">
                <span className="text-gold text-[10px] font-bold uppercase tracking-[2px] block mb-1">GLOBAL TRAVELER</span>
                <h4 className="font-serif text-2xl font-bold text-cream mb-2">Hành Trình Vô Tận</h4>
                <p className="text-xs text-white/60 leading-relaxed">Bứt phá mọi ranh giới múi giờ thế giới. Đồng hành phong trần cùng từng dặm hành trình.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= INTERACTIVE COMPONENT: REAL-TIME SWISS ACCURACY STATS ================= */}
      <section className="py-20 px-6 lg:px-12 bg-black border-t border-white/5 relative">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-gold/10 border border-gold/30 rounded-full text-[10px] text-gold uppercase tracking-[1.5px] font-bold">
            <Sparkles size={11} className="animate-pulse" /> Trực Tuyến Đồng Bộ
          </div>
          
          <h2 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight">
            Chính xác đến từng góc giây Thụy Sỹ.
          </h2>
          
          <p className="text-white/50 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Hệ thống giờ GMT+7 trực tiếp kiểm soát tần vĩ độ trôi của quả lắc. Thử nghiệm đồng bộ hóa thời gian thực tự động của máy chủ vệ tinh nguyên tử Velora:
          </p>

          <RealTimeClock />
        </div>
      </section>

      {/* ================= IN-DEPTH FAQS DRAWER ================= */}
      <section className="py-20 px-6 lg:px-12 bg-zinc-950 border-t border-white/5 scroll-mt-20">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-gold text-xs font-bold uppercase tracking-[2px] block">DỊCH VỤ KHÁCH HÀNG</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight">
              Những đặc quyền sở hữu Velora tại Việt Nam
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 [content-visibility:auto]">
            <div className="p-6 rounded-2xl border border-white/5 bg-zinc-900/30 space-y-2">
              <h4 className="font-serif text-lg font-bold text-cream flex items-center gap-2">
                <Info size={16} className="text-gold shrink-0" /> Cách đặt chỗ hoạt động ra sao?
              </h4>
              <p className="text-xs md:text-sm text-white/50 leading-relaxed">
                Sau khi điền biểu mẫu đặt chỗ trực tuyến, Velora sẽ cấp cho tôn chủ một mã Certificate bảo mật. Chuyên gia tư vấn VIP sẽ liên lạc trực tiếp trong 15 phút để xác nhận ngày giờ đón tiếp tại Boutique VIP Lounge hoặc sắp xếp xe hộ tống giao hàng.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-white/5 bg-zinc-900/30 space-y-2">
              <h4 className="font-serif text-lg font-bold text-cream flex items-center gap-2">
                <Info size={16} className="text-gold shrink-0" /> Chế độ bảo hành quốc tế thế nào?
              </h4>
              <p className="text-xs md:text-sm text-white/50 leading-relaxed">
                Mọi đồng hồ Velora Automatic chính hãng đi kèm thẻ bảo hành vi mạch chống làm giả, được bảo hành toàn cầu 5 năm lỗi kỹ thuật từ nhà máy Thụy Sỹ và can thiệp bảo dưỡng định kỳ thay dầu hoàn toàn miễn phí cực an tâm.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-white/5 bg-zinc-900/30 space-y-2">
              <h4 className="font-serif text-lg font-bold text-cream flex items-center gap-2">
                <Info size={16} className="text-gold shrink-0" /> Tôi có thể trả lại sản phẩm không?
              </h4>
              <p className="text-xs md:text-sm text-white/50 leading-relaxed">
                Để phục vụ tốt nhất hành trình xa xỉ, quý khách hoàn toàn có quyền từ chối tiếp nhận đồng hồ tại thời điểm bàn giao đón tiếp nếu không vừa vặn gót tay hoặc không đúng kịch bản mong đợi mà không chịu bất cứ bồi hoàn tài chính nào.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-white/5 bg-zinc-900/30 space-y-2">
              <h4 className="font-serif text-lg font-bold text-cream flex items-center gap-2">
                <Info size={16} className="text-gold shrink-0" /> Khắc laser kỷ niệm có tính phí?
              </h4>
              <p className="text-xs md:text-sm text-white/50 leading-relaxed">
                Dịch vụ laser sợi quang khắc tinh xảo thông điệp ngày kỷ niệm cá nhân phía đáy máy được Velora chế tác miễn phí độc quyền tại chỗ bằng thiết bị quang sọc Đức chỉ tầm 10 phút trước khi bàn giao đồng hồ cho thượng khách.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 6: VIP CLIENT DISPATCH CONTACT ================= */}
      <section className="py-24 px-6 lg:px-12 bg-black relative border-t border-white/5 overflow-hidden">
        {/* Glow effects */}
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-gold/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 text-gold text-xs font-bold uppercase tracking-[3px]">
            <Phone size={14} /> VIP CARE DESK
          </div>
          
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-none text-cream">
            Yêu cầu chuyên viên VIP tư vấn riêng tư
          </h2>
          
          <p className="text-white/50 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Để lại thông tin cá nhân bảo mật dưới đây nếu quý cách cần sắp xếp một cuộc gọi tư vấn bảo mật, xem hàng trực tiếp tại biệt thự riêng hoặc hẹn đón tiếp VIP tại khu Flagship Lounges.
          </p>

          <form onSubmit={handleInquirySubmit} className="max-w-md mx-auto space-y-4 text-left p-6 sm:p-8 rounded-3xl border border-white/10 bg-zinc-950/60 backdrop-blur-md">
            {clientInquiry.submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-10 text-center space-y-3"
              >
                <div className="inline-flex w-12 h-12 rounded-full border border-gold/40 text-gold bg-gold/5 items-center justify-center mx-auto animate-pulse">
                  <Award size={24} />
                </div>
                <h4 className="text-lg font-serif font-bold text-cream">Gửi yêu cầu chu đáo thành công</h4>
                <p className="text-xs text-white/55 leading-relaxed">
                  Cảm ơn Quý khách. Chuyên viên chăm sóc VIP của bộ phận Velora Private Care sẽ chủ động quay số liên hệ trong vài phút tới sải máy.
                </p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/50 uppercase tracking-[1px] font-bold">Xưng danh Quý danh *</label>
                  <input
                    type="text"
                    required
                    value={clientInquiry.name}
                    onChange={(e) => setClientInquiry(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="VD: Anh/Chị Nguyễn"
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-white/50 uppercase tracking-[1px] font-bold">Số điện thoại liên lạc bảo mật *</label>
                  <input
                    type="tel"
                    required
                    value={clientInquiry.phone}
                    onChange={(e) => setClientInquiry(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="091*******"
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-gold focus:outline-none focus:ring-0"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-white/50 uppercase tracking-[1px] font-bold">Thời gian thuận tiện gọi lại</label>
                    <select
                      value={clientInquiry.timeSlot}
                      onChange={(e) => setClientInquiry(prev => ({ ...prev, timeSlot: e.target.value }))}
                      className="w-full bg-black border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:border-gold focus:outline-none"
                    >
                      <option value="morning">Buổi sáng (09:00 - 12:00)</option>
                      <option value="afternoon">Buổi chiều (13:30 - 17:30)</option>
                      <option value="evening">Buổi tối (18:30 - 21:00)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-white/50 uppercase tracking-[1px] font-bold">Mẫu đồng hồ chú ý nhất</label>
                    <select
                      value={clientInquiry.preferredModel}
                      onChange={(e) => setClientInquiry(prev => ({ ...prev, preferredModel: e.target.value }))}
                      className="w-full bg-black border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:border-gold focus:outline-none"
                    >
                      {WATCHES_DATA.map(w => (
                        <option key={w.id} value={w.id}>{w.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full h-12 bg-gold hover:bg-gold-hover text-luxury-bg text-xs font-extrabold uppercase tracking-[2px] rounded-full transition-all mt-2 cursor-pointer shadow-lg shadow-gold/5"
                >
                  Gửi Yêu Cầu Chăm Sóc VIP
                </button>
              </div>
            )}
          </form>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="relative min-h-[70vh] py-16 px-6 lg:px-12 bg-black border-t border-white/5 flex flex-col justify-between overflow-hidden">
        {/* Background Visual representation of Luxury mechanics dial */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1800&q=90')] bg-cover bg-center opacity-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10 [content-visibility:auto]">
          {/* Brand Col */}
          <div className="md:col-span-4 space-y-4">
            <h2 className="font-serif text-3xl text-gold font-bold tracking-tight">VELORA</h2>
            <p className="text-xs text-white/50 leading-relaxed max-w-sm">
              Kiệt tác đồng hồ automatic tinh hoa cơ khí chế tác châu Âu, đại diện cho bản ngã và di sản sang quý đi cùng năm tháng của quý thế hệ.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs">
              <span className="text-gold/80 flex items-center gap-1.5 font-bold">
                <MapPin size={12} /> VIETNAM FLAGSHIPS
              </span>
              <span className="text-white/40 font-mono">EST. 2026</span>
            </div>
          </div>

          {/* Nav Links Col */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-white/40 uppercase tracking-[1.5px] font-mono text-[10px] block">Khám Phá Velora</span>
            <ul className="space-y-2 text-xs text-white/70">
              <li>
                <a href="#precision" className="hover:text-gold transition-colors">Sự Chính Xác Hoạt Động</a>
              </li>
              <li>
                <a href="#collection" className="hover:text-gold transition-colors">Bộ Sưu Tập Đỉnh Cao</a>
              </li>
              <li>
                <a href="#anatomy" className="hover:text-gold transition-colors">Cấu Trúc Đóng Gói</a>
              </li>
              <li>
                <a href="#lifestyle" className="hover:text-gold transition-colors">Phong Cách Đời Thường</a>
              </li>
            </ul>
          </div>

          {/* Guarantee Badges Col */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-white/40 uppercase tracking-[1.5px] font-mono text-[10px] block">Cam Kết Độc Quyền</span>
            <ul className="space-y-2 text-xs text-white/70">
              <li className="flex items-center gap-2">
                <Award size={13} className="text-gold" /> Đóng hộp da quý tộc sang trọng
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck size={13} className="text-gold" /> Thẻ bảo mật căn cước thời đại
              </li>
              <li className="flex items-center gap-2">
                <Clock size={13} className="text-gold" /> Hỗ trợ bảo dưỡng lau dầu bôi trơn trọn đời
              </li>
            </ul>
          </div>

          {/* Contact Col */}
          <div className="md:col-span-2 space-y-3">
            <span className="text-white/40 uppercase tracking-[1.5px] font-mono text-[10px] block">Thông Tin Đối Tác</span>
            <div className="space-y-2 text-xs text-white/70 font-mono">
              <p className="flex items-center gap-1.5 hover:text-gold transition-colors duration-200">
                <Mail size={12} className="text-gold" /> contact@velora.vn
              </p>
              <p className="flex items-center gap-1.5 hover:text-gold transition-colors duration-200">
                <Phone size={12} className="text-gold" /> 1900.888.VLR
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright declaration */}
        <div className="max-w-7xl mx-auto w-full pt-12 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-white/45 relative z-10 mt-12 font-mono">
          <p>© 2026 VELORA Luxury Watchmaker Group. Bảo lưu mọi quyền thừa kế.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gold transition-colors">Chính Sách An Ninh & Bảo Mật</a>
            <span>•</span>
            <a href="#" className="hover:text-gold transition-colors">Điều Khoản Sở Hữu VIP</a>
          </div>
        </div>
      </footer>

      {/* Floating back to top button floating */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 p-4 rounded-full bg-zinc-900 border border-white/10 hover:border-gold hover:text-gold text-white/70 shadow-2xl z-30 transition-all cursor-pointer"
            title="Cuộn lên đầu trang"
          >
            <ChevronUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* State dialog modals */}
      <AnimatePresence>
        {/* Watch booking & customizer Modal */}
        {selectedWatch && (
          <ReserveModal
            watch={selectedWatch}
            onClose={() => setSelectedWatch(null)}
            onSaveReservation={handleSaveReservation}
          />
        )}

        {/* Chronological booking certificates list history modal */}
        {isHistoryOpen && (
          <WatchHistoryModal
            isOpen={isHistoryOpen}
            onClose={() => setIsHistoryOpen(false)}
            reservations={reservations}
            onCancelReservation={handleCancelReservation}
          />
        )}

        {/* Physical showroom store locator maps modal */}
        {isBoutiquesOpen && (
          <BoutiqueModal
            isOpen={isBoutiquesOpen}
            onClose={() => setIsBoutiquesOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
