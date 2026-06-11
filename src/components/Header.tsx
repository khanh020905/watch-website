import { useState } from 'react';
import { Menu, X, Clock, MapPin, Award } from 'lucide-react';

interface HeaderProps {
  onOpenStoreLocations: () => void;
  onOpenReservationsHistory: () => void;
  reservationsCount: number;
}

export default function Header({ onOpenStoreLocations, onOpenReservationsHistory, reservationsCount }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Sự Chính Xác', href: '#precision' },
    { name: 'Bộ Sưu Tập', href: '#collection' },
    { name: 'Cấu Trúc', href: '#anatomy' },
    { name: 'Phong Cách', href: '#lifestyle' }
  ];

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[88vw] max-w-7xl h-18 px-6 md:px-8 z-50 flex justify-between items-center border border-luxury-border rounded-full bg-luxury-bg/60 backdrop-blur-xl transition-all duration-300 shadow-lg shadow-black/40">
        {/* Logo */}
        <a href="#" className="font-serif text-2xl md:text-3xl text-gold tracking-tight hover:opacity-80 transition-opacity">
          VELORA
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-xs text-white/70 hover:text-gold uppercase tracking-[1.5px] font-semibold transition-colors duration-200"
            >
              {item.name}
            </a>
          ))}
        </nav>

        {/* Desktop CTA & Navigation Actions */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={onOpenStoreLocations}
            className="p-2 text-white/70 hover:text-gold transition-colors"
            title="Hệ thống Boutique"
          >
            <MapPin size={18} />
          </button>
          
          <button
            onClick={onOpenReservationsHistory}
            className="relative p-2 text-white/70 hover:text-gold transition-colors mr-2"
            title="Lịch sử yêu cầu"
          >
            <Clock size={18} />
            {reservationsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold text-luxury-bg text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {reservationsCount}
              </span>
            )}
          </button>

          <a
            href="#collection"
            className="text-xs font-bold uppercase tracking-[1px] bg-gold hover:bg-gold-hover text-luxury-bg px-5 py-2.5 rounded-full transition-all duration-200"
          >
            Đặt Chỗ Ngay
          </a>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={onOpenReservationsHistory}
            className="relative p-2 text-white/75"
          >
            <Clock size={20} />
            {reservationsCount > 0 && (
              <span className="absolute top-1 right-1 bg-gold text-luxury-bg text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                {reservationsCount}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-white/75 hover:text-gold transition-colors focus:outline-none"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Backdrop & Sheet */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-luxury-bg/95 flex flex-col justify-center items-center backdrop-blur-2xl">
          <nav className="flex flex-col items-center gap-8 mb-12">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={handleNavClick}
                className="text-xl text-white hover:text-gold uppercase tracking-[3px] font-serif transition-colors duration-200"
              >
                {item.name}
              </a>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenStoreLocations();
              }}
              className="flex items-center gap-2 text-lg text-gold-hover uppercase tracking-[2px]"
            >
              <MapPin size={18} /> Hệ Thống Boutique
            </button>
          </nav>
          
          <a
            href="#collection"
            onClick={handleNavClick}
            className="w-4/5 text-center text-sm font-bold uppercase tracking-[2px] bg-gold text-luxury-bg py-4 rounded-full"
          >
            Khám phá bộ sưu tập
          </a>
        </div>
      )}
    </>
  );
}
