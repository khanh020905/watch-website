import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function RealTimeClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 100); // 10 ticks per second for sweep second hand simulation!
    return () => clearInterval(interval);
  }, []);

  // Format Vietnam Time GMT+7
  const getVietnamTime = (date: Date) => {
    // Add 7 hours offset from UTC for Vietnamese display precision
    const utc = date.getTime() + date.getTimezoneOffset() * 60000;
    return new Date(utc + 3600000 * 7);
  };

  const vnTime = getVietnamTime(time);
  const hours = vnTime.getHours();
  const minutes = vnTime.getMinutes();
  const seconds = vnTime.getSeconds();
  const milliseconds = vnTime.getMilliseconds();

  // Smooth angle calculations for the sweeping hands (like high-quality mechanical movements!)
  const secondAngle = (seconds * 6) + (milliseconds * 0.006);
  const minuteAngle = (minutes * 6) + (seconds * 0.1);
  const hourAngle = ((hours % 12) * 30) + (minutes * 0.5);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="flex flex-col items-center justify-center p-6 border border-white/10 rounded-3xl bg-black/40 backdrop-blur-md max-w-sm w-full mx-auto shadow-xl shadow-black/60">
      {/* Clock Face SVG */}
      <div className="relative w-40 h-40 mb-4 rounded-full border-2 border-gold/30 bg-neutral-950 flex items-center justify-center shadow-inner shadow-black">
        {/* Outer Dial Markers */}
        <div className="absolute inset-2 rounded-full border border-white/5 flex items-center justify-center">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 bg-gold/50 rounded-full"
              style={{
                transform: `rotate(${i * 30}deg) translateY(-64px)`
              }}
            />
          ))}
        </div>

        {/* Brand Label */}
        <div className="absolute top-10 text-center select-none">
          <span className="text-[9px] text-gold font-serif tracking-widest font-extrabold block">VELORA</span>
          <span className="text-[7px] text-white/40 font-mono tracking-widest block uppercase">AUTOMATIC</span>
        </div>

        {/* Hands */}
        {/* Hour Hand */}
        <div
          className="absolute w-1 h-12 bg-white rounded-full origin-bottom"
          style={{
            transform: `rotate(${hourAngle}deg) translateY(-20px)`,
            transition: 'transform 0.05s linear'
          }}
        />

        {/* Minute Hand */}
        <div
          className="absolute w-0.75 h-16 bg-cream rounded-full origin-bottom"
          style={{
            transform: `rotate(${minuteAngle}deg) translateY(-26px)`,
            transition: 'transform 0.05s linear'
          }}
        />

        {/* Sweep Second Hand (Red/Gold elegant) */}
        <div
          className="absolute w-0.5 h-18 bg-gold origin-bottom"
          style={{
            transform: `rotate(${secondAngle}deg) translateY(-30px)`,
            transition: 'transform 0.05s linear'
          }}
        />

        {/* Center pin */}
        <div className="absolute w-2.5 h-2.5 bg-black border border-gold rounded-full z-10" />

        {/* Caliber Label inside face */}
        <div className="absolute bottom-10 text-[7px] text-white/50 font-mono tracking-widest select-none">
          SWISS MOVEMENT
        </div>
      </div>

      {/* Numerical precise ICT Display */}
      <div className="text-center font-mono">
        <div className="text-2xl text-cream font-bold tracking-wider">
          {formatNumber(hours)}:{formatNumber(minutes)}:{formatNumber(seconds)}
          <span className="text-xs text-gold ml-1">
            .{Math.floor(milliseconds / 100)}
          </span>
        </div>
        <div className="text-[10px] text-white/40 uppercase tracking-[2px] mt-1 flex items-center justify-center gap-1.5">
          <Clock size={10} className="text-gold animate-spin-slow" /> ICT GMT+7 (HANOI - SAIGON)
        </div>
      </div>
    </div>
  );
}
