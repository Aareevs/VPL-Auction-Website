import React from 'react';
import { useAuction } from '../context/AuctionContext';
import { formatCurrency } from '../constants';
import { Trophy, DollarSign, History, Shield, Globe } from 'lucide-react';
import { Player } from '../types';

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

const getStatsToDisplay = (player: Player) => {
    const role = player.role.toLowerCase();
    const stats = player.stats;
    const list = [];
    
    // Common stats
    list.push({ label: 'Age', value: stats.age });
    list.push({ label: 'Matches', value: stats.matches });

    if (role.includes('all') || role.includes('round')) {
        // All Rounder
        list.push({ label: 'Runs', value: stats.runs });
        list.push({ label: 'Average', value: stats.avg });
        list.push({ label: 'Strike Rate', value: stats.strikeRate });
        list.push({ label: 'High Score', value: stats.highScore || 'N/A' });
        list.push({ label: 'Wickets', value: stats.wickets || 0 });
        list.push({ label: 'Economy', value: stats.economy || 0 });
        list.push({ label: 'Best Bowl', value: stats.bestBowling || 'N/A' });
    } else if (role.includes('bowl')) {
        // Bowler
        list.push({ label: 'Wickets', value: stats.wickets || 0 });
        list.push({ label: 'Economy', value: stats.economy || 0 });
        list.push({ label: 'Best Bowl', value: stats.bestBowling || 'N/A' });
    } else {
        // Batter or Wicket Keeper
        list.push({ label: 'Runs', value: stats.runs });
        list.push({ label: 'Average', value: stats.avg });
        list.push({ label: 'Strike Rate', value: stats.strikeRate });
        list.push({ label: 'High Score', value: stats.highScore || 'N/A' });
    }
    
    return list;
};

const Dashboard: React.FC = () => {
  const { currentPlayer, currentBid, currentBidTeamId, teams, bidHistory, players } = useAuction();
  const [showSoldAnimation, setShowSoldAnimation] = useState(false);
  const [soldAnimationData, setSoldAnimationData] = useState<{team: any, player: any, price: number} | null>(null);

  // Trigger Animation when player is SOLD
  useEffect(() => {
    if (currentPlayer?.status === PlayerStatus.SOLD && currentBidTeamId && currentBid > 0) {
        const winningTeam = teams.find(t => t.id === currentBidTeamId);
        if (winningTeam) {
            setSoldAnimationData({
                team: winningTeam,
                player: currentPlayer,
                price: currentBid
            });
            setShowSoldAnimation(true);
        }
    }
  }, [currentPlayer?.status, currentBidTeamId]);

  const holdingTeam = teams.find(t => t.id === currentBidTeamId);
  // Include both SOLD and PASSED (Unsold) players
  const recentSold = players.filter(p => p.status === 'SOLD' || p.status === 'PASSED').slice(-4).reverse();

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12 px-6">
      
      {/* SOLD ANIMATION OVERLAY */}
      {showSoldAnimation && soldAnimationData && (
        <SoldOverlay 
            team={soldAnimationData.team} 
            player={soldAnimationData.player} 
            price={soldAnimationData.price}
            onComplete={() => setShowSoldAnimation(false)} 
        />
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Main Player Card */}
        {/* ... (omitted for brevity) ... */}
        
        {/* RIGHT COLUMN: Sidebar Stats */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          
          {/* JUST SOLD */}
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
                        const isUnsold = player.status === 'PASSED';
                        
                        return (
                            <div key={player.id} className={`flex items-center gap-4 p-3 rounded-xl border ${isUnsold ? 'bg-red-950/20 border-red-900/50' : 'bg-slate-950/50 border-slate-800/50'}`}>
                                <div className={`w-12 h-12 rounded-full overflow-hidden border ${isUnsold ? 'border-red-800 opacity-50' : 'border-slate-700 bg-slate-800'}`}>
                                     {player.imageUrl ? <img src={player.imageUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">IMG</div>}
                                </div>
                                {/* LIVE BID OVERLAY */}
                    <div className="absolute top-4 right-4 md:right-6 z-20">
                         <div className="bg-slate-950/80 backdrop-blur-md border border-yellow-500/50 rounded-xl p-4 shadow-xl min-w-[200px] md:min-w-[240px] text-center">
                             <div className="text-yellow-500 text-xs font-bold uppercase tracking-widest mb-1 animate-pulse">Current Bid</div>                                       {isUnsold ? (
                                            <span className="text-slate-500">Unsold in Set {player.set}</span>
                                        ) : (
                                            <>Sold to <span className="text-slate-200">{team?.name}</span></>
                                        )}
                                    </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-white font-bold truncate">{player.name}</div>
                                    <div className="text-xs text-slate-400 truncate">
                                        {isUnsold ? (
                                            <span className="text-slate-500">Unsold in Set {player.set}</span>
                                        ) : (
                                            <>Sold to <span className="text-slate-200">{team?.name}</span></>
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

          {/* PURSE STATUS */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
             <h3 className="text-white text-lg font-bold display-font mb-4 flex items-center gap-2">
                <DollarSign size={20} className="text-green-500" />
                Team Purses
             </h3>
             <div className="space-y-4">
                {teams.map(team => (
                    <div key={team.id} className="group">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-slate-200 text-sm font-bold">{team.name}</span>
                            <span className="text-white font-mono text-sm font-bold">{formatCurrency(team.remainingPurse)}</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700/50">
                            <div 
                                className="h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(0,0,0,0.3)]" 
                                style={{ 
                                    width: `${(team.remainingPurse / team.totalPurse) * 100}%`,
                                    backgroundColor: team.primaryColor 
                                }} 
                            />
                        </div>
                    </div>
                ))}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const StatRow = ({ label, value }: { label: string, value: number | string }) => (
    <div className="flex items-center justify-between py-3 border-b border-white/10 last:border-0 hover:bg-white/5 px-2 rounded transition-colors">
        <span className="text-blue-200 font-bold uppercase text-base tracking-wider">{label}</span>
        <span className="text-white font-bold text-2xl font-mono">{value}</span>
    </div>
);

export default Dashboard;