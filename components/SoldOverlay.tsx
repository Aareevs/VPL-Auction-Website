import React, { useEffect, useState } from 'react';
import { Gavel } from 'lucide-react';
import { Player, Team } from '../types';
import { formatCurrency } from '../utils';

interface SoldOverlayProps {
    team: Team | undefined;
    player: Player;
    price: number;
    onComplete: () => void;
}

const SoldOverlay: React.FC<SoldOverlayProps> = ({ team, player, price, onComplete }) => {
    const [phase, setPhase] = useState<'hammer' | 'banner'>('hammer');

    useEffect(() => {
        // Phase 1: Hammer Animation (0-1.2s)
        const hammerTimer = setTimeout(() => {
            setPhase('banner');
        }, 1200);

        // Phase 2: Complete (Total 5s)
        const completeTimer = setTimeout(() => {
            onComplete();
        }, 5000);

        return () => {
            clearTimeout(hammerTimer);
            clearTimeout(completeTimer);
        };
    }, [onComplete]);

    if (!team) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
            
            {/* PHASE 1: HAMMER */}
            {phase === 'hammer' && (
                <div className="relative flex flex-col items-center justify-center animate-shake">
                    <div className="animate-hammerSwing origin-bottom-right">
                        <Gavel size={300} className="text-yellow-500 drop-shadow-[0_0_50px_rgba(234,179,8,0.8)] fill-yellow-500" />
                    </div>
                </div>
            )}

            {/* PHASE 2: BANNER */}
            {phase === 'banner' && (
                <div className="w-full max-w-6xl mx-auto px-4 perspective-1000">
                    <div className="relative overflow-hidden rounded-xl shadow-2xl animate-bannerExpand origin-center transform-gpu border-4 border-yellow-500/50">
                        
                        {/* Dynamic Background */}
                        <div 
                            className="absolute inset-0 z-0"
                            style={{ 
                                background: `linear-gradient(135deg, ${team.primaryColor} 0%, ${team.secondaryColor} 100%)`,
                                opacity: 0.95 
                            }} 
                        />
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 mix-blend-overlay z-0"></div>

                        {/* Content Container */}
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-8 md:p-12 gap-8 text-white min-h-[300px]">
                            
                            {/* LEFT: Team Info */}
                            <div className="flex flex-col items-center md:items-start space-y-4 animate-slideUp delay-100 text-center md:text-left">
                                <div className="bg-white/10 p-4 rounded-full backdrop-blur-md border border-white/20 shadow-xl">
                                    <div className="text-4xl font-black tracking-tighter uppercase font-mono">{team.shortName}</div>
                                </div>
                                <div>
                                    <div className="text-yellow-300 font-bold tracking-widest uppercase text-sm mb-1">Winning Bid</div>
                                    <h2 className="text-5xl md:text-7xl font-black display-font drop-shadow-lg">
                                        {formatCurrency(price)}
                                    </h2>
                                </div>
                            </div>

                            {/* CENTER: Action Text */}
                            <div className="flex flex-col items-center justify-center animate-zoomIn delay-200">
                                <span className="text-2xl md:text-3xl font-bold uppercase tracking-[0.5em] text-white/80 mb-2">Sold To</span>
                                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white drop-shadow-[0_4px_0_rgba(0,0,0,0.3)] filter text-center py-2 px-6 border-y-2 border-white/30">
                                    {team.name}
                                </h1>
                            </div>

                            {/* RIGHT: Player Info */}
                            <div className="flex flex-col items-center md:items-end animate-slideUp delay-300">
                                <div className="relative w-48 h-48 md:w-64 md:h-64 mb-4">
                                    {/* Glowing ring behind image */}
                                    <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-pulse"></div>
                                    <img 
                                        src={player.imageUrl} 
                                        alt={player.name}
                                        className="w-full h-full object-cover rounded-full border-4 border-white shadow-2xl relative z-10 bg-slate-800"
                                    />
                                </div>
                                <div className="text-center md:text-right">
                                    <div className="text-3xl font-bold">{player.name}</div>
                                    <div className="text-blue-100 font-mono text-lg">{player.role}</div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SoldOverlay;
