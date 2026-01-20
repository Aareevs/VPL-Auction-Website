import React, { useEffect } from 'react';
import { Player } from '../types';
import { formatCurrency } from '../constants';

interface UnsoldOverlayProps {
  player: Player;
  onComplete: () => void;
}

const UnsoldOverlay: React.FC<UnsoldOverlayProps> = ({ player, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
        onComplete();
    }, 3000); // Display for 3 seconds
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md animate-fade-in grayscale transition-all duration-1000">
       
       <div className="relative flex flex-col items-center">
           {/* Player Card (Grayscale & Dimmed) */}
           <div className="w-64 h-80 bg-slate-800 rounded-2xl border-4 border-slate-700 opacity-50 mb-8 overflow-hidden grayscale relative transform scale-90">
               {player.imageUrl ? (
                   <img src={player.imageUrl} className="w-full h-full object-cover opacity-60" />
               ) : (
                   <div className="w-full h-full flex items-center justify-center text-6xl text-slate-600 font-bold">?</div>
               )}
               <div className="absolute bottom-0 w-full bg-slate-900 p-4 text-center">
                   <div className="text-xl font-bold text-slate-400">{player.name}</div>
               </div>
           </div>

           {/* STAMP ANIMATION */}
           <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-[-15deg]">
               <div className="animate-stamp border-[8px] border-red-600 text-red-600 font-black text-6xl md:text-9xl px-8 py-2 uppercase tracking-widest bg-red-600/10 shadow-[0_0_50px_rgba(220,38,38,0.5)] backdrop-blur-none border-dashed-custom">
                   UNSOLD
               </div>
           </div>
       </div>

    </div>
  );
};

export default UnsoldOverlay;
