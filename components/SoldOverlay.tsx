import React, { useEffect, useState } from 'react';
import { Gavel } from 'lucide-react';
import { Player, Team } from '../types';
import { formatCurrency } from '../constants';

interface SoldOverlayProps {
    team: Team | undefined;
    player: Player;
    price: number;
    onComplete: () => void;
}

const SoldOverlay: React.FC<SoldOverlayProps> = ({ team, player, price, onComplete }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 4000); // Display for 4 seconds
        return () => clearTimeout(timer);
    }, [onComplete]);

    if (!team) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md animate-fade-in transition-all duration-1000">
            
            <div className="relative flex flex-col items-center">
                {/* Player Card (Dimmed) */}
                <div className="w-64 h-80 bg-slate-800 rounded-2xl border-4 border-slate-700 opacity-80 mb-8 overflow-hidden relative transform scale-110 shadow-2xl">
                    {player.imageUrl ? (
                        <img src={player.imageUrl} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl text-slate-600 font-bold">
                             {player.name.charAt(0)}
                        </div>
                    )}
                    <div className="absolute bottom-0 w-full bg-slate-900 p-4 text-center">
                        <div className="text-xl font-bold text-white">{player.name}</div>
                        <div className="text-sm text-slate-400">{player.role}</div>
                    </div>
                </div>

                {/* STAMP ANIMATION */}
                <div className="absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-[-15deg] z-10">
                    <div className="animate-stamp border-[8px] border-green-500 text-green-500 font-black text-6xl md:text-8xl px-8 py-2 uppercase tracking-widest bg-green-900/20 shadow-[0_0_50px_rgba(34,197,94,0.5)] backdrop-blur-none border-dashed-custom whitespace-nowrap">
                        SOLD
                    </div>
                </div>

                {/* Sold Details */}
                <div className="text-center animate-slideUp delay-300 space-y-2 relative z-20 bg-slate-900/80 p-6 rounded-2xl border border-blue-500/30 backdrop-blur-xl shadow-2xl min-w-[300px]">
                    <div className="text-slate-400 text-sm uppercase tracking-widest font-bold">Sold To</div>
                    
                    <div className="flex items-center justify-center gap-3 my-2">
                        {team.logoUrl ? (
                            <img src={team.logoUrl} className="w-12 h-12 object-contain" />
                        ) : (
                             <div className="w-10 h-10 rounded flex items-center justify-center text-white font-bold text-xs" style={{ background: team.primaryColor }}>
                                {team.shortName}
                             </div>
                        )}
                        <div className="text-3xl font-black text-white display-font">{team.name}</div>
                    </div>

                    <div className="text-green-400 font-mono font-bold text-4xl drop-shadow-lg">
                        {formatCurrency(price)}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default SoldOverlay;
