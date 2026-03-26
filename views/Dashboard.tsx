import React, { useState, useEffect, useCallback } from 'react';
import { useAuction } from '../context/AuctionContext';
import { formatCurrency } from '../constants';
import { Trophy, DollarSign, History, Shield, Globe, UserCheck, Users } from 'lucide-react';
import TeamDetailModal from '../components/TeamDetailModal';
import { Player, PlayerStatus, Team } from '../types';
import SoldOverlay from '../components/SoldOverlay';
import UnsoldOverlay from '../components/UnsoldOverlay';
import { isCaptain } from '../lib/playerDisplay';

const getCountryFlag = (country: string) => {
  const c = country.toLowerCase().trim();
  if (c === 'india' || c === 'ind') return '🇮🇳';
  if (c === 'australia' || c === 'aus') return '🇦🇺';
  if (c === 'england' || c === 'eng') return '🏴󠁧󠁢󠁥󠁮󠁧󠁿';
  if (c === 'south africa' || c === 'sa') return '🇿🇦';
  if (c === 'new zealand' || c === 'nz') return '🇳🇿';
  if (c === 'west indies' || c === 'wi') return '🏝️';
  if (c === 'pakistan' || c === 'pak') return '🇵🇰';
  if (c === 'sri lanka' || c === 'sl') return '🇱🇰';
  if (c === 'afghanistan' || c === 'afg') return '🇦🇫';
  if (c === 'bangladesh' || c === 'ban') return '🇧🇩';
  if (c === 'ireland' || c === 'ire') return '🇮🇪';
  if (c === 'zimbabwe' || c === 'zim') return '🇿🇼';
  return '🏳️';
};

// Import SET_NAMES if not already imported, otherwise define logic to use it.
import { SET_NAMES } from '../constants'; // Ensure this is imported at top of file

const getStatsToDisplay = (player: Player): { label: string; value: string | number }[] => {
    const role = player.role.toLowerCase();
    const stats = player.stats;
    const list: { label: string; value: string | number }[] = [];
    
    // 1. Batters & Keepers (Check for 'bats' or 'keeper')
    if (role.includes('bats') || role.includes('keeper') || role.includes('batter')) {
        list.push({ label: 'Age', value: stats.age });
        list.push({ label: 'Matches', value: stats.matches });
        list.push({ label: 'Runs', value: stats.runs });
        list.push({ label: 'Average', value: stats.avg });
        list.push({ label: 'Strike Rate', value: stats.strikeRate });
        list.push({ label: 'High Score', value: stats.highScore || 'N/A' });
    } 
    // 2. All Rounders
    else if (role.includes('all rounder') || role.includes('all-rounder')) {
        list.push({ label: 'Age', value: stats.age });
        list.push({ label: 'Matches', value: stats.matches });
        list.push({ label: 'Runs', value: stats.runs });
        list.push({ label: 'Average', value: stats.avg });
        list.push({ label: 'Strike Rate', value: stats.strikeRate });
        list.push({ label: 'High Score', value: stats.highScore || 'N/A' });
        list.push({ label: 'Wickets', value: stats.wickets || 0 });
        list.push({ label: 'Economy', value: stats.economy || 0 });
        list.push({ label: 'Best Bowl', value: stats.bestBowling || 'N/A' });
    } 
    // 3. Bowlers & Others
    else {
        list.push({ label: 'Age', value: stats.age });
        list.push({ label: 'Matches', value: stats.matches });
        list.push({ label: 'Wickets', value: stats.wickets || 0 });
        list.push({ label: 'Economy', value: stats.economy || 0 });
        list.push({ label: 'Best Bowl', value: stats.bestBowling || 'N/A' });
    }
    
    return list;
};



const Dashboard: React.FC = () => {
  const { currentPlayer, currentBid, currentBidTeamId, teams, bidHistory, players, sets } = useAuction();
  
  // Include both SOLD and PASSED (Unsold) players
  const recentSold = players
      .filter(p => (p.status === PlayerStatus.SOLD || p.status === PlayerStatus.PASSED) && !isCaptain(p))
      // Sort by when they finished? We don't have a timestamp on status change, 
      // but assuming they come in order of IDs or we rely on 'updated_at' if we had it.
      // For now, we rely on the order they appear in the list, which might be ID based.
      // Best to rely on a 'sold_at' timestamp if available, but for now filtering is okay.
      // Actually, standard reverse might not be enough if persistence reorders them.
      // But let's stick to the current logic for now.
      .slice(-4)
      .reverse();

  const [showSoldAnimation, setShowSoldAnimation] = useState(false);
  const [showUnsoldAnimation, setShowUnsoldAnimation] = useState(false);
  const [soldAnimationData, setSoldAnimationData] = useState<{team: any, player: any, price: number} | null>(null);
  const [unsoldAnimationData, setUnsoldAnimationData] = useState<Player | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  const handleSoldComplete = useCallback(() => setShowSoldAnimation(false), []);
  const handleUnsoldComplete = useCallback(() => setShowUnsoldAnimation(false), []);
  
  // 1. Reset Logic
  // 1. Reset Logic - Removed as we use local ref for one-time animations now
  // useEffect(() => { ... }, [players]);

  // 2. Animation Trigger (Edge Detection)
  const prevPlayerRef = React.useRef<{id: string, status: string} | null>(null);

  useEffect(() => {
     let currentData: {id: string, status: string} | null = null;
     let playerObj: Player | undefined | null = currentPlayer;

     // Determine the "current" player state to track.
     // Priority 1: The active player on stage (currentPlayer)
     if (currentPlayer) {
         currentData = { id: currentPlayer.id, status: currentPlayer.status };
     } 
     // Priority 2: If stage is empty, check if the LAST tracked player has updated status
     // This handles the race condition where 'current_player_id' is cleared before or simultaneously with the status update.
     else if (prevPlayerRef.current) {
         const lastId = prevPlayerRef.current.id;
         const updatedPlayer = players.find(p => p.id === lastId);
         if (updatedPlayer) {
             currentData = { id: updatedPlayer.id, status: updatedPlayer.status };
             playerObj = updatedPlayer;
         }
     }

     if (!currentData) {
         prevPlayerRef.current = null;
         return;
     }

     const prev = prevPlayerRef.current;
     
     // Check for transitions ONLY if we are tracking the same player
     if (prev && prev.id === currentData.id) {
        if (prev.status !== PlayerStatus.SOLD && currentData.status === PlayerStatus.SOLD) {
            // SOLD Transition
            if (playerObj && !isCaptain(playerObj)) {
                 const team = teams.find(t => t.id === playerObj.teamId);
                 setSoldAnimationData({
                     team, 
                     player: playerObj, 
                     price: playerObj.soldPrice || 0
                 });
                 setShowSoldAnimation(true);
             }
         } else if (prev.status !== PlayerStatus.PASSED && currentData.status === PlayerStatus.PASSED) {
             // UNSOLD Transition
             if (playerObj) {
                 setUnsoldAnimationData(playerObj);
                 setShowUnsoldAnimation(true);
             }
         }
     } 
     
     // Update ref
     prevPlayerRef.current = currentData;
  }, [currentPlayer, teams, players]);

  const holdingTeam = teams.find(t => t.id === currentBidTeamId);

  // Heuristic for Minimal Profile: If role is effectively absent AND stats are entirely 0.
  const isMinimalProfile = currentPlayer && 
      (!currentPlayer.role || currentPlayer.role === '-' || currentPlayer.role.toLowerCase() === 'n/a') && 
      (!currentPlayer.stats || (currentPlayer.stats.matches === 0 && currentPlayer.stats.runs === 0 && currentPlayer.stats.wickets === 0));

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12 px-6">
      
      {/* SOLD ANIMATION OVERLAY */}
      {showSoldAnimation && soldAnimationData && (
        <SoldOverlay 
            team={soldAnimationData.team} 
            player={soldAnimationData.player} 
            price={soldAnimationData.price}
            onComplete={handleSoldComplete} 
        />
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Main Player Card */}
        <div className="col-span-12 lg:col-span-8">
          
          {/* PLAYER CARD CONTAINER */}
          <div className="relative w-full min-h-[500px] bg-gradient-to-r from-[#001845] to-[#023e8a] rounded-3xl overflow-hidden shadow-2xl border border-blue-900/50 flex flex-col md:block">
            
            {/* Background Graphics */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -right-20 -top-20 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute left-0 bottom-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
                {/* Diagonal graphic lines */}
                <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-blue-900/50 to-transparent -skew-x-12 transform -translate-x-10"></div>
            </div>

            {currentPlayer ? (
                isMinimalProfile ? (
                    /* ======== MINIMALIST VISUAL UI ======== */
                    <div className="relative w-full h-full min-h-[600px] flex flex-col justify-end overflow-hidden bg-gradient-to-t from-slate-950 to-transparent z-10">
                        
                        {/* Huge Player Image (Cutout) */}
                        {currentPlayer.imageUrl && (
                            <div className="absolute inset-0 flex items-start justify-center z-0 pt-12 px-10 pb-[220px]">
                                <img 
                                    src={currentPlayer.imageUrl} 
                                    alt={currentPlayer.name} 
                                    className="w-full h-full object-contain object-bottom drop-shadow-[0_0_40px_rgba(0,0,0,0.6)]"
                                />
                            </div>
                        )}

                        {/* Gradient fade to ensure text at bottom is readable */}
                        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent z-10 pointer-events-none"></div>

                        {/* Content at Bottom Center */}
                        <div className="relative z-20 pb-8 pt-10 px-6 flex flex-col items-center text-center w-full">
                            <h2 className="text-5xl md:text-6xl lg:text-[80px] text-white font-black display-font leading-none tracking-tight uppercase drop-shadow-2xl mb-6 transform -skew-x-6 mt-auto">
                                {currentPlayer.name}
                            </h2>

                            {/* Bidding Info */}
                            <div className="inline-flex flex-col items-center bg-black/60 backdrop-blur-xl px-12 py-6 rounded-3xl border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                                 {currentBid > 0 ? (
                                     <>
                                         <div className="text-yellow-400 font-bold text-5xl md:text-6xl display-font tracking-widest animate-pulse">
                                             <span className="text-white drop-shadow-md">{formatCurrency(currentBid)}</span>
                                         </div>
                                         {holdingTeam && (
                                             <div className="font-bold text-slate-300 mt-4 flex items-center gap-3">
                                                 <span className="text-xs md:text-sm tracking-[0.2em] text-slate-400">HELD BY</span>
                                                 <span style={{ color: holdingTeam.primaryColor }} className="text-xl md:text-2xl uppercase tracking-wider">{holdingTeam.name}</span>
                                             </div>
                                         )}
                                     </>
                                 ) : (
                                     <div className="text-red-500 font-bold text-4xl md:text-5xl display-font tracking-wide">
                                         BASE <span className="text-white ml-4">{formatCurrency(currentPlayer.basePrice)}</span>
                                     </div>
                                 )}
                            </div>
                        </div>
                    </div>
                ) : (
                    /* ======== STANDARD DETAILED UI ======== */
                    <>
                        {/* LEFT CONTENT (Text & Stats) */}
                        <div className={`relative w-full ${currentPlayer.imageUrl ? 'md:w-[60%] text-left' : 'md:w-full text-center items-center'} h-full p-8 md:p-10 flex flex-col justify-between z-10 transition-all duration-300`}>
                            
                            {/* Header Info */}
                            <div className={`space-y-4 ${!currentPlayer.imageUrl && 'flex flex-col items-center'}`}>
                                 <div className="flex items-center gap-3 mb-2">
                                    <span className="text-3xl filter drop-shadow-md">
                                        {getCountryFlag(currentPlayer.country)}
                                    </span>
                                    <span className="text-white font-bold text-xl uppercase tracking-widest flex items-center gap-2">
                                        {currentPlayer.country}
                                    </span>
                                 </div>

                                 {/* Name Box */}
                                 <div className="relative inline-block">
                                     <div className="bg-gradient-to-r from-[#4cc9f0] to-[#4361ee] text-slate-950 text-5xl md:text-6xl lg:text-7xl font-black px-6 py-2 uppercase display-font transform -skew-x-6 shadow-lg shadow-blue-500/20 tracking-wide whitespace-nowrap">
                                         {currentPlayer.name}
                                     </div>
                                 </div>
                                 
                                 {/* Role */}
                                 <div className="flex items-center gap-3 mt-4 text-blue-100">
                                     <Shield size={28} className="text-white fill-white/10" />
                                     <span className="text-white font-bold text-2xl uppercase tracking-wider font-mono">{currentPlayer.role}</span>
                                 </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="my-6 flex-grow w-full">
                                <div className={`grid ${currentPlayer.imageUrl ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'} gap-x-8 gap-y-4 border-t-2 border-blue-500/30 pt-6`}>
                                    {getStatsToDisplay(currentPlayer).map((stat, index) => (
                                        <StatRow key={index} label={stat.label} value={stat.value} />
                                    ))}
                                </div>
                            </div>

                            {/* Footer / Base Price OR Current Bid */}
                            <div className={`mt-auto ${!currentPlayer.imageUrl && 'w-full flex justify-center'}`}>
                                {currentBid > 0 ? (
                                    <div>
                                        <div className="text-yellow-400 font-bold text-3xl md:text-4xl display-font drop-shadow-lg tracking-wide animate-pulse">
                                            CURRENT BID : <span className="text-white">{formatCurrency(currentBid)}</span>
                                        </div>
                                        {holdingTeam && (
                                            <div className="text-sm font-bold text-slate-400 mt-1 flex items-center gap-2">
                                                HELD BY: <span style={{ color: holdingTeam.primaryColor }} className="text-lg uppercase tracking-wider">{holdingTeam.name}</span>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-red-500 font-bold text-3xl md:text-4xl display-font drop-shadow-lg tracking-wide">
                                        BASE PRICE : <span className="text-red-500">{formatCurrency(currentPlayer.basePrice)}</span>
                                    </div>
                                )}
                            </div>

                        </div>

                        {/* RIGHT CONTENT - IMAGE */}
                        {currentPlayer.imageUrl && (
                            <div className="relative md:absolute bottom-0 right-0 w-full md:w-[50%] h-[400px] md:h-[95%] z-0 flex items-end justify-center pointer-events-none overflow-hidden md:overflow-visible">
                                 <img 
                                    src={currentPlayer.imageUrl} 
                                    alt={currentPlayer.name} 
                                    className="h-full w-full object-contain object-bottom drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]"
                                 />
                            </div>
                        )}

                        {/* No Image Fallback Background Decoration if URL is missing */}
                        {!currentPlayer.imageUrl && (
                            <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none">
                                <Trophy size={400} />
                            </div>
                        )}
                    </>
                )
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-12 relative z-10">
                    <div className="w-24 h-24 bg-blue-900/30 rounded-full flex items-center justify-center mb-6 animate-pulse border border-blue-500/30">
                        <Trophy className="text-blue-400" size={40} />
                    </div>
                    <h2 className="text-5xl text-white font-bold display-font mb-2">Waiting for Player</h2>
                    <p className="text-blue-300 text-lg">The next auction lot will appear here soon.</p>
                </div>
            )}
            
          </div>

          {/* Bid History Ticker */}
          <div className="mt-6 bg-slate-900/50 border border-slate-800 rounded-xl p-4">
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                <History size={14} /> Real-time Bids
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {bidHistory.length === 0 ? (
                    <span className="text-slate-600 text-sm italic">No bids yet</span>
                ) : (
                    bidHistory.map((bid, idx) => {
                         const team = teams.find(t => t.id === bid.teamId);
                         return (
                             <div key={idx} className="flex-shrink-0 bg-slate-800 rounded-lg px-4 py-2 border border-slate-700 flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-700 border border-slate-600 flex items-center justify-center">
                                     {team?.logoUrl ? <img src={team.logoUrl} className="w-full h-full object-cover" /> : <div className="text-[10px] font-bold text-white flex items-center justify-center w-full h-full" style={{ background: team?.primaryColor }}>{team?.shortName}</div>}
                                 </div>
                                 <span className="text-white font-mono font-bold">{formatCurrency(bid.amount)}</span>
                             </div>
                         )
                    })
                )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Sidebar Stats */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          
          {/* RECENT ACTIVITY (Sold + Unsold) */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
             <h3 className="text-white text-lg font-bold display-font mb-4 flex items-center gap-2">
                <Trophy size={20} className="text-yellow-500" />
                Recent Activity
             </h3>
             <div className="space-y-4">
                {recentSold.length === 0 ? (
                    <div className="text-slate-500 text-sm">No activity yet.</div>
                ) : (
                    recentSold.map(player => {
                        const team = teams.find(t => t.id === player.teamId);
                        const playerSet = sets.find(s => s.id === player.set);
                        const setName = playerSet ? playerSet.name : `Set ${player.set}`;
                        const isUnsold = player.status === PlayerStatus.PASSED;
                        
                        return (
                            <div key={player.id} className={`flex items-center gap-4 p-3 rounded-xl border ${isUnsold ? 'bg-red-950/20 border-red-900/50' : 'bg-slate-950/50 border-slate-800/50'}`}>
                                <div className={`w-12 h-12 rounded-full overflow-hidden border flex items-center justify-center ${isUnsold ? 'border-red-800 opacity-50 bg-red-900/20' : 'border-slate-700 bg-slate-800'}`}>
                                     {player.imageUrl ? (
                                        <img src={player.imageUrl} className="w-full h-full object-cover" />
                                     ) : (
                                        <span className={`font-bold text-lg ${isUnsold ? 'text-red-400' : 'text-slate-400'}`}>
                                            {player.name.charAt(0)}
                                        </span>
                                     )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-white font-bold truncate">{player.name}</div>
                                    <div className="text-xs text-slate-400 truncate">
                                        {isUnsold ? (
                                            <span className="text-slate-500">Unsold in {setName}</span>
                                        ) : (
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <span className="text-slate-400">Sold to</span>
                                                {team?.logoUrl && <img src={team.logoUrl} className="w-4 h-4 object-contain" />}
                                                <span className="text-slate-200 font-bold">{team?.shortName}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className={`font-bold text-lg font-mono ${isUnsold ? 'text-red-500' : 'text-green-400'}`}>
                                    {isUnsold ? 'UNSOLD' : formatCurrency(player.soldPrice || 0)}
                                </div>
                            </div>
                        )
                    })
                )}
             </div>
          </div>

          {/* PURSE STATUS / TEAMS LIST */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 max-h-[400px] flex flex-col">
             <h3 className="text-white text-lg font-bold display-font mb-4 flex items-center gap-2 flex-shrink-0">
                <Users size={20} className="text-blue-500" />
                Teams & Squads
             </h3>
             <div className="space-y-2 overflow-y-auto pr-2 custom-scrollbar flex-1">
                {teams.map(team => (
                    <button 
                        key={team.id} 
                        onClick={() => setSelectedTeam(team)}
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950/50 hover:bg-slate-800 border border-slate-800 hover:border-slate-600 transition-all group text-left"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-800 flex items-center justify-center border border-slate-700 group-hover:scale-105 transition-transform">
                                 {team.logoUrl ? <img src={team.logoUrl} className="w-full h-full object-cover" /> : <div className="text-[10px] font-bold text-white flex items-center justify-center w-full h-full" style={{ background: team.primaryColor }}>{team.shortName}</div>}
                            </div>
                            <div>
                                <div className="text-white font-bold text-sm">#{team.id} {team.name}</div>
                                <div className="text-xs text-slate-400">Purse: <span className="text-green-400 font-mono">{formatCurrency(team.remainingPurse)}</span></div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className={`text-xs font-bold px-2 py-1 rounded-md border ${team.squad.length >= 7 ? 'bg-red-900/30 border-red-500/50 text-red-400' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                                {team.squad.length}/7
                            </span>
                        </div>
                    </button>
                ))}
             </div>
          </div>
        </div>

        {showUnsoldAnimation && unsoldAnimationData && (
            <UnsoldOverlay 
                player={unsoldAnimationData}
                onComplete={handleUnsoldComplete}
            />
        )}

        {/* TEAM DETAIL MODAL */}
        {selectedTeam && (
            <TeamDetailModal 
                team={selectedTeam} 
                onClose={() => setSelectedTeam(null)} 
            />
        )}

        </div>
      </div>
  );
};

const StatRow: React.FC<{ label: string, value: number | string }> = ({ label, value }) => (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0 hover:bg-white/5 px-2 rounded transition-colors">
        <span className="text-blue-200 font-bold uppercase text-sm tracking-wider">{label}</span>
        <span className="text-white font-bold text-xl font-mono">{value}</span>
    </div>
);

export default Dashboard;
