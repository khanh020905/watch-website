import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Award, Eye, Sliders, Calendar, ChevronRight, MapPin, Phone, Truck, ShieldCheck } from 'lucide-react';
import { WatchModel, CustomizationState, ClientReservation, BoutiqueLocation } from '../types';
import { BOUTIQUES_DATA } from '../data/watches';

interface ReserveModalProps {
  watch: WatchModel | null;
  onClose: () => void;
  onSaveReservation: (reservation: ClientReservation) => void;
}

export default function ReserveModal({ watch, onClose, onSaveReservation }: ReserveModalProps) {
  if (!watch) return null;

  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Customize, 2: Book Details, 3: Success Receipt
  
  // Customization state
  const [customizer, setCustomizer] = useState<CustomizationState>({
    strapType: 'leather',
    engravingText: '',
    giftWrapping: false,
    warrantyExtension: false
  });

  // Client Details state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    deliveryMethod: 'pickup' as 'pickup' | 'delivery',
    boutiqueId: 'sg',
    address: '',
    notes: ''
  });

  // Error States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeReservation, setActiveReservation] = useState<ClientReservation | null>(null);

  // Strap Cost multipliers
  const strapCosts = {
    leather: 0,
    steel: 1500000,
    mesh: 1200000,
    matte: 2000000
  };

  const strapNames = {
    leather: 'Dây Da Ý (Italian Leather) - Mặc Định',
    steel: 'Thép Đúc Không Gỉ (Brushed Steel) (+1.500.000đ)',
    mesh: 'Lưới Titan Cao Cấp (Titanium Mesh) (+1.200.000đ)',
    matte: 'Thép Phủ Carbon Mờ (Matte Black) (+2.000.000đ)'
  };

  const giftWrapCost = customizer.giftWrapping ? 500000 : 0;
  const warrantyCost = customizer.warrantyExtension ? 1500000 : 0;
  const premiumStrapCost = strapCosts[customizer.strapType];
  const totalPrice = watch.price + premiumStrapCost + giftWrapCost + warrantyCost;

  const handleStrapChange = (type: CustomizationState['strapType']) => {
    setCustomizer(prev => ({ ...prev, strapType: type }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckboxChange = (name: 'giftWrapping' | 'warrantyExtension') => {
    setCustomizer(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Vui lòng nhập họ và tên';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9+()-\s]{9,15}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập Email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Email không đúng định dạng';
    }
    if (formData.deliveryMethod === 'delivery' && !formData.address.trim()) {
      newErrors.address = 'Vui lòng nhập địa chỉ nhận hàng';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1) {
      setStep(2);
    }
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

    const selectedBoutique = BOUTIQUES_DATA.find(b => b.id === formData.boutiqueId);
    const orderNum = `VL-${Date.now().toString().slice(-6)}`;
    
    const newBooking: ClientReservation = {
      id: orderNum,
      watchId: watch.id,
      watchName: watch.name,
      price: totalPrice,
      customization: customizer,
      customerName: formData.name,
      customerPhone: formData.phone,
      customerEmail: formData.email,
      deliveryMethod: formData.deliveryMethod,
      boutiqueLocation: formData.deliveryMethod === 'pickup' ? selectedBoutique?.name : undefined,
      shippingAddress: formData.deliveryMethod === 'delivery' ? formData.address : undefined,
      createdTime: new Date().toLocaleString('vi-VN')
    };

    setActiveReservation(newBooking);
    onSaveReservation(newBooking);
    setStep(3);
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Dynamic Background Blur Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md"
      />

      {/* Main Reservation Box Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-5xl rounded-[32px] border border-white/10 bg-zinc-950 text-white overflow-hidden shadow-2xl shadow-black z-10 grid grid-cols-1 md:grid-cols-12 max-h-[90vh] md:max-h-none h-fit"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full border border-white/10 bg-black/30 text-white/50 hover:text-white hover:border-white/30 transition-all z-30"
        >
          <X size={18} />
        </button>

        {/* LEFT COLUMN: VISUAL PREVIEW SIDE (Takes 5 cols) */}
        <div className="md:col-span-5 bg-gradient-to-br from-neutral-900 to-black p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5 sticky top-0">
          <div>
            <span className="text-gold font-bold text-xs uppercase tracking-[3px] block mb-2">{watch.tag}</span>
            <h3 className="font-serif text-3xl font-extrabold tracking-tight mb-1">{watch.name}</h3>
            <p className="text-white/50 text-xs font-mono tracking-widest uppercase">{watch.movementType}</p>
          </div>

          {/* Interactive Strap & Watch Composition View */}
          <div className="relative py-8 flex items-center justify-center">
            {/* Clock mechanism circles background */}
            <div className="absolute w-64 h-64 border border-white/5 rounded-full flex items-center justify-center">
              <div className="w-48 h-48 border border-gold/10 rounded-full animate-spin-slow" />
            </div>

            {/* Simulated interactive customize watch image with strap shading overlay */}
            <div className="relative w-56 h-56 rounded-full overflow-hidden border border-white/10 glow-gold">
              <img
                src={watch.image}
                alt={watch.name}
                className="w-full h-full object-cover transform scale-110"
              />
              
              {/* Strap Overlay Tint for Visual Customization Simulation */}
              <div
                className={`absolute inset-0 bg-blend-multiply transition-all duration-500 pointer-events-none ${
                  customizer.strapType === 'steel' ? 'bg-zinc-500/10' :
                  customizer.strapType === 'mesh' ? 'bg-amber-100/10' :
                  customizer.strapType === 'matte' ? 'bg-black/40' :
                  'bg-orange-950/20'
                }`}
              />

              {/* Laser Engraving text placement visualization */}
              {customizer.engravingText && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 border border-gold/20 px-3 py-1 rounded-md text-[9px] text-gold font-mono uppercase tracking-[2px] backdrop-blur-sm shadow-md animate-pulse">
                  Laser: &quot;{customizer.engravingText}&quot;
                </div>
              )}
            </div>
          </div>

          {/* Pricing breakdown summary */}
          <div className="mt-4 pt-4 border-t border-white/5">
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-white/50">
                <span>Giá cơ bản:</span>
                <span>{formatPrice(watch.price)}</span>
              </div>
              {customizer.strapType !== 'leather' && (
                <div className="flex justify-between text-xs text-gold/80">
                  <span>Tùy chọn Quai đeo:</span>
                  <span>+{formatPrice(strapCosts[customizer.strapType])}</span>
                </div>
              )}
              {customizer.giftWrapping && (
                <div className="flex justify-between text-xs text-gold/80">
                  <span>Hộp Quà Thượng Hạng:</span>
                  <span>+{formatPrice(giftWrapCost)}</span>
                </div>
              )}
              {customizer.warrantyExtension && (
                <div className="flex justify-between text-xs text-gold/80">
                  <span>Gia Hạn 5 Năm Bảo Hành:</span>
                  <span>+{formatPrice(warrantyCost)}</span>
                </div>
              )}
              <div className="flex justify-between items-end pt-3 border-t border-white/10">
                <span className="text-sm font-semibold uppercase tracking-wider text-cream">TỔNG GIÁ TRỊ:</span>
                <span className="text-2xl font-extrabold text-gold tracking-tight">{formatPrice(totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE FORM STEPS (Takes 7 cols) */}
        <div className="md:col-span-7 p-8 overflow-y-auto max-h-[75vh] md:max-h-[90vh]">
          {/* Step Progress indicators */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => step !== 3 && setStep(1)}
              className={`text-xs uppercase tracking-[2px] font-bold ${
                step === 1 ? 'text-gold border-b border-goldpb-1' : 'text-white/40'
              }`}
            >
              01 Tùy Biến
            </button>
            <ChevronRight size={14} className="text-white/20" />
            <button
              onClick={() => step === 2 && setStep(2)}
              disabled={step === 3}
              className={`text-xs uppercase tracking-[2px] font-bold ${
                step === 2 ? 'text-gold border-b border-gold pb-1' : 'text-white/40'
              }`}
            >
              02 Đăng Ký Sở Hữu
            </button>
            <ChevronRight size={14} className="text-white/20" />
            <span className={`text-xs uppercase tracking-[2px] font-bold ${step === 3 ? 'text-gold' : 'text-white/40'}`}>
              03 Chứng Nhận
            </span>
          </div>

          <AnimatePresence mode="wait">
            {/* STEP 1: CUSTOMIZER FORM */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <div>
                  <h4 className="text-xl font-serif text-cream tracking-tight mb-2 flex items-center gap-2">
                    <Sliders size={18} className="text-gold" /> Chế Tác Riêng Cho Bạn
                  </h4>
                  <p className="text-sm text-white/60 leading-relaxed">
                    Chọn loại dây đeo cao cấp thay thế và khắc laser chìm thông điệp độc bản lên đĩa máy để làm kỷ niệm ý nghĩa.
                  </p>
                </div>

                {/* Strap custom selection */}
                <div className="space-y-3">
                  <span className="text-xs uppercase tracking-[1.5px] text-gold font-bold block">Quai đeo tùy chọn:</span>
                  <div className="grid grid-cols-1 gap-2.5">
                    {(Object.keys(strapCosts) as Array<CustomizationState['strapType']>).map((strap) => (
                      <button
                        key={strap}
                        onClick={() => handleStrapChange(strap)}
                        className={`flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${
                          customizer.strapType === strap
                            ? 'border-gold bg-gold/5 text-white glow-gold'
                            : 'border-white/5 bg-white/[0.02] text-white/50 hover:bg-white/[0.04]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            customizer.strapType === strap ? 'border-gold' : 'border-white/25'
                          }`}>
                            {customizer.strapType === strap && <div className="w-2 h-2 bg-gold rounded-full" />}
                          </div>
                          <span className="text-xs font-semibold">{strapNames[strap]}</span>
                        </div>
                        {strapCosts[strap] > 0 && (
                          <span className="text-xs font-mono text-gold font-bold">+{formatPrice(strapCosts[strap])}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* laser engraving panel */}
                <div className="space-y-3 pt-4 border-t border-white/5">
                  <span className="text-xs uppercase tracking-[1.5px] text-gold font-bold block">Khắc Laser Kỷ Niệm (Miễn Phí):</span>
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                    <input
                      type="text"
                      maxLength={24}
                      value={customizer.engravingText}
                      onChange={(e) => setCustomizer(prev => ({ ...prev, engravingText: e.target.value }))}
                      placeholder="VD: TRUONG & LAN 2026, FOREVER..."
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-white/30 focus:border-gold focus:outline-none tracking-wider uppercase font-mono"
                    />
                    <p className="text-[10px] text-white/40 leading-relaxed font-sans">
                      * Dòng văn bản sẽ được khắc cơ khí tinh xảo bằng tia laser sợi quang trực tiếp lên vành đệm rotor sapphire phía đáy máy. Tối đa 24 ký tự viết hoa.
                    </p>
                  </div>
                </div>

                {/* Luxury add-ons */}
                <div className="space-y-3 pt-4 border-t border-white/5">
                  <span className="text-xs uppercase tracking-[1.5px] text-gold font-bold block">Dịch vụ bổ sung:</span>
                  <div className="space-y-2.5">
                    <button
                      onClick={() => handleCheckboxChange('giftWrapping')}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${
                        customizer.giftWrapping
                          ? 'border-gold bg-gold/5 text-white'
                          : 'border-white/5 bg-white/[0.02] text-white/50 hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                          customizer.giftWrapping ? 'border-gold bg-gold text-luxury-bg' : 'border-white/25'
                        }`}>
                          {customizer.giftWrapping && <Check size={12} className="stroke-[3]" />}
                        </div>
                        <div>
                          <span className="text-xs font-semibold block text-white/90">Hộp Quà Velora Vua Thượng Hạng</span>
                          <span className="text-[10px] text-white/40 block">Hộp da cao cấp lót nhung kèm thiệp sáp nổi hoàng gia</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-gold font-bold">+{formatPrice(500000)}</span>
                    </button>

                    <button
                      onClick={() => handleCheckboxChange('warrantyExtension')}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${
                        customizer.warrantyExtension
                          ? 'border-gold bg-gold/5 text-white'
                          : 'border-white/5 bg-white/[0.02] text-white/50 hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                          customizer.warrantyExtension ? 'border-gold bg-gold text-luxury-bg' : 'border-white/25'
                        }`}>
                          {customizer.warrantyExtension && <Check size={12} className="stroke-[3]" />}
                        </div>
                        <div>
                          <span className="text-xs font-semibold block text-white/90">Gia Hạn Bảo Hành Kim Cương Toàn Học</span>
                          <span className="text-[10px] text-white/40 block">Tăng tổng thời hạn bảo hành lên 10 năm tại Thụy Sỹ & Việt Nam</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-gold font-bold">+{formatPrice(1500000)}</span>
                    </button>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    onClick={handleNextStep}
                    className="w-full h-14 bg-gold hover:bg-gold-hover text-luxury-bg text-sm font-extrabold uppercase tracking-[2px] rounded-full flex items-center justify-center gap-2 transition-all shadow-lg shadow-gold/10"
                  >
                    Tiếp Tục Đăng Ký <ChevronRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: BOOKING DETAILS FORM */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <div>
                  <h4 className="text-xl font-serif text-cream tracking-tight mb-2 flex items-center gap-2">
                    <Award size={18} className="text-gold" /> Thông Tin Chủ Sở Hữu
                  </h4>
                  <p className="text-sm text-white/60 leading-relaxed">
                    Vui lòng cung cấp thông tin liên hệ chính xác để được xuất Phiếu đặt chỗ bảo mật và cấp Giấy chứng nhận bảo hành thuộc tài sản cá nhân.
                  </p>
                </div>

                <form onSubmit={handleSubmitBooking} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Customer Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs text-white/50 uppercase tracking-[1px] font-bold">
                        Họ và tên chủ nhân *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Nguyễn Văn A"
                        className={`w-full bg-white/[0.02] border ${
                          errors.name ? 'border-red-500' : 'border-white/10'
                        } rounded-xl px-4 py-3 text-xs text-white focus:border-gold focus:outline-none transition-colors`}
                      />
                      {errors.name && <span className="text-[10px] text-red-500 font-medium">{errors.name}</span>}
                    </div>

                    {/* Customer Phone */}
                    <div className="space-y-1.5">
                      <label className="text-xs text-white/50 uppercase tracking-[1px] font-bold">
                        Số điện thoại liên hệ *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="0901234567"
                        className={`w-full bg-white/[0.02] border ${
                          errors.phone ? 'border-red-500' : 'border-white/10'
                        } rounded-xl px-4 py-3 text-xs text-white focus:border-gold focus:outline-none transition-colors`}
                      />
                      {errors.phone && <span className="text-[10px] text-red-500 font-medium">{errors.phone}</span>}
                    </div>
                  </div>

                  {/* Customer Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/50 uppercase tracking-[1px] font-bold">
                      Địa chỉ Email đặt hàng *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="chu_so_huu@velora.com"
                      className={`w-full bg-white/[0.02] border ${
                        errors.email ? 'border-red-500' : 'border-white/10'
                      } rounded-xl px-4 py-3 text-xs text-white focus:border-gold focus:outline-none transition-colors`}
                    />
                    {errors.email && <span className="text-[10px] text-red-500 font-medium">{errors.email}</span>}
                  </div>

                  {/* Method select */}
                  <div className="space-y-3 pt-2">
                    <span className="text-xs text-white/50 uppercase tracking-[1px] font-bold block">
                      Hình thức nhận hàng hoặc trải nghiệm:
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, deliveryMethod: 'pickup' }))}
                        className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border text-xs font-bold transition-all ${
                          formData.deliveryMethod === 'pickup'
                            ? 'border-gold bg-gold/5 text-white'
                            : 'border-white/5 bg-white/[0.02] text-white/50'
                        }`}
                      >
                        <MapPin size={14} /> Nhận Tại Boutique
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, deliveryMethod: 'delivery' }))}
                        className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border text-xs font-bold transition-all ${
                          formData.deliveryMethod === 'delivery'
                            ? 'border-gold bg-gold/5 text-white'
                            : 'border-white/5 bg-white/[0.02] text-white/50'
                        }`}
                      >
                        <Truck size={14} /> Giao Hàng Đẳng Cấp tận nơi
                      </button>
                    </div>
                  </div>

                  {formData.deliveryMethod === 'pickup' ? (
                    /* Boutique Selector panel */
                    <div className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5 mt-3">
                      <span className="text-xs uppercase tracking-[1px] text-gold font-bold block">
                        Chọn vị trí Velora Boutique đón tiếp bạn:
                      </span>
                      <select
                        name="boutiqueId"
                        value={formData.boutiqueId}
                        onChange={handleInputChange}
                        className="w-full bg-black border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:border-gold focus:outline-none"
                      >
                        {BOUTIQUES_DATA.map((bq) => (
                          <option key={bq.id} value={bq.id}>
                            {bq.name} ({bq.city})
                          </option>
                        ))}
                      </select>

                      {/* Display Selected Boutique Address Card */}
                      <div className="bg-neutral-900/80 p-3 rounded-xl border border-white/5 mt-2">
                        {(() => {
                          const activeBq = BOUTIQUES_DATA.find(b => b.id === formData.boutiqueId);
                          return (
                            <div className="space-y-1.5">
                              <p className="text-xs font-semibold text-cream">{activeBq?.name}</p>
                              <p className="text-[10.5px] text-white/50 flex align-start gap-1">
                                <MapPin size={11} className="mt-0.5 shrink-0 text-gold" /> {activeBq?.address}
                              </p>
                              <p className="text-[10.5px] text-white/50 flex items-center gap-1">
                                <Phone size={11} className="text-gold" /> Hotline: {activeBq?.phone}
                              </p>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  ) : (
                    /* Delivery Address input */
                    <div className="space-y-1.5 p-4 rounded-2xl bg-white/[0.02] border border-white/5 mt-3">
                      <label className="text-xs text-white/50 uppercase tracking-[1px] font-bold block">
                        Địa chỉ nhận hàng chi tiết *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Số nhà, Tên đường, Quận/Huyện, Tỉnh thành..."
                        className={`w-full bg-black border ${
                          errors.address ? 'border-red-500' : 'border-white/10'
                        } rounded-xl px-4 py-3 text-xs text-white focus:border-gold focus:outline-none transition-colors`}
                      />
                      {errors.address && <span className="text-[10px] text-red-500 font-medium">{errors.address}</span>}
                      <p className="text-[10px] text-white/40 leading-relaxed mt-1 font-sans">
                        * Miễn phí hoàn toàn dịch vụ chuyển phát nhanh hỏa tốc đảm bảo giá trị cao kèm vệ sỹ áp tải trao tay trực tiếp cho khách hàng trên toàn quốc.
                      </p>
                    </div>
                  )}

                  {/* Customer personal note */}
                  <div className="space-y-1.5 pt-2">
                    <label className="text-xs text-white/50 uppercase tracking-[1px] font-bold block">
                      Ghi chú hoặc yêu cầu đón tiếp đặc biệt khách hàng ưu tiên
                    </label>
                    <textarea
                      name="notes"
                      rows={2}
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Yêu cầu cụ thể của từng hành trình cá nhân..."
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-gold focus:outline-none"
                    />
                  </div>

                  {/* Submission triggers */}
                  <div className="pt-6 flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-1/3 h-14 bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 text-white text-xs font-bold uppercase tracking-[1px] rounded-full transition-all"
                    >
                      Quay Lại
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 h-14 bg-gold hover:bg-gold-hover text-luxury-bg text-sm font-extrabold uppercase tracking-[2px] rounded-full flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-gold/10"
                    >
                      Đặt Chỗ Hoàn Tất <Check size={16} />
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* STEP 3: MOCK TRANSACTION RECEIPT SUCCESS */}
            {step === 3 && activeReservation && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6 text-center py-6"
              >
                <div className="inline-flex w-16 h-16 rounded-full bg-gold/10 border border-gold/40 items-center justify-center text-gold mb-2 animate-bounce">
                  <ShieldCheck size={36} />
                </div>

                <div>
                  <h4 className="text-2xl font-serif text-cream tracking-tight mb-2">Đăng Ký Đã Được Ký Thừa Nhận</h4>
                  <p className="text-sm text-white/60 max-w-md mx-auto">
                    Kính chào ông/bà <strong className="text-white">{activeReservation.customerName}</strong>. Velora đã ghi nhận yêu cầu sở hữu đồng hồ sang trọng này từ hệ thống thành công.
                  </p>
                </div>

                {/* LUXURIOUS CERTIFICATE PANEL */}
                <div className="border border-gold/25 p-6 rounded-2xl bg-neutral-900/60 shadow-xl max-w-md mx-auto space-y-4 relative overflow-hidden text-left font-mono">
                  {/* Decorative golden watermark background */}
                  <div className="absolute right-0 bottom-0 opacity-5 font-serif text-8xl text-gold select-none pointer-events-none transform translate-x-4 translate-y-6">
                    Velora
                  </div>

                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <span className="text-[10px] text-gold font-bold tracking-widest">VELORA CHRONOMETER</span>
                    <span className="text-[10px] text-white/50">{activeReservation.id}</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-white/40 block text-[9px] uppercase">Dòng sản phẩm:</span>
                      <span className="text-white font-bold">{activeReservation.watchName}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-white/40 block text-[9px] uppercase">Quai đeo chế tác:</span>
                        <span className="text-white font-medium">{activeReservation.customization.strapType.toUpperCase()}</span>
                      </div>
                      <div>
                        <span className="text-white/40 block text-[9px] uppercase">Thời gian đăng ký:</span>
                        <span className="text-white font-medium">{activeReservation.createdTime}</span>
                      </div>
                    </div>

                    {activeReservation.customization.engravingText && (
                      <div>
                        <span className="text-white/40 block text-[9px] uppercase">Laser Engraving khắc máy:</span>
                        <span className="text-gold font-semibold tracking-wider">&quot;{activeReservation.customization.engravingText.toUpperCase()}&quot;</span>
                      </div>
                    )}

                    <div>
                      <span className="text-white/40 block text-[9px] uppercase">Cách thức tiếp nhận:</span>
                      <span className="text-white">
                        {activeReservation.deliveryMethod === 'pickup'
                          ? `Boutique Pickup: tại ${activeReservation.boutiqueLocation}`
                          : `Hộ tống giao địa chỉ: ${activeReservation.shippingAddress}`}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex justify-between items-end">
                      <span className="text-[10px] text-cream uppercase font-bold">GIÁ TRỊ TÀI SẢN:</span>
                      <span className="text-lg text-gold font-bold font-sans">{formatPrice(activeReservation.price)}</span>
                    </div>
                  </div>

                  {/* QR Core simulation box */}
                  <div className="bg-white p-2.5 rounded-lg w-28 h-28 mx-auto flex items-center justify-center border border-white/10 shadow-lg mt-4">
                    {/* Simulated digital matrix block block */}
                    <div className="w-full h-full flex flex-wrap gap-0.5 opacity-80">
                      {Array.from({ length: 144 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-1.5 ${
                            (i * 3 + 7) % 5 === 0 || (i * 7) % 9 === 0 ? 'bg-black' : 'bg-transparent'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-[8px] text-center text-white/40 font-sans tracking-tight mt-1">
                    * Quét mã certificate để trình diện nhận đồng hồ trực tiếp hoặc khi được chuyên gia bảo an liên hệ.
                  </p>
                </div>

                <div className="pt-4 flex flex-col gap-2 max-w-xs mx-auto">
                  <p className="text-[10px] text-white/40 font-sans leading-relaxed">
                    Một email chứa Giấy chứng nhận bảo chứng số đã được gửi tự động tới địa chỉ <strong className="text-white">{activeReservation.customerEmail}</strong>.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-2 h-12 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-[1px] rounded-full transition-all"
                  >
                    Đóng phiên giao dịch
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
