import React, { useState } from 'react';
import { useAuction } from '../context/AuctionContext';
import { PlayerStatus, Player } from '../types';
import { formatCurrency } from '../constants';
import { PlusCircle, PlayCircle, Gavel, RefreshCw, Trophy, User, Layers, Pencil, X, Trash2 } from 'lucide-react';

const Admin: React.FC = () => {
  const { 
    teams, 
    players, 
    addPlayer, 
    updatePlayer,
    startAuction, 
    currentPlayer, 
    currentBid, 
    currentBidTeamId, 
    placeBid, 
    sellPlayer, 
    passPlayer,
    resetAuction,
    deletePlayer,
    sets,
    createSet,
    updatePlayerSet
  } = useAuction();

  // Form State
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerRole, setNewPlayerRole] = useState('');
  const [newPlayerCountry, setNewPlayerCountry] = useState('India');
  const [newPlayerImage, setNewPlayerImage] = useState('');
  const [newPlayerPrice, setNewPlayerPrice] = useState(20);
  const [newPlayerSet, setNewPlayerSet] = useState(0);
  const [newSetDialog, setNewSetDialog] = useState(false);
  const [newSetName, setNewSetName] = useState('');
  
  // Stats
  const [statsAge, setStatsAge] = useState(0);
  const [statsMatches, setStatsMatches] = useState(0);
  const [statsRuns, setStatsRuns] = useState(0);
  const [statsAvg, setStatsAvg] = useState(0);
  const [statsSR, setStatsSR] = useState(0);
  const [statsHighScore, setStatsHighScore] = useState('');
  const [statsWickets, setStatsWickets] = useState(0);
  const [statsEconomy, setStatsEconomy] = useState(0);
  const [statsBestBowling, setStatsBestBowling] = useState('');

  // Bidding State
  const [selectedBidTeam, setSelectedBidTeam] = useState<string>('');
  const [customBidAmount, setCustomBidAmount] = useState<string>('');

  // Group unsold players by set
  const unsoldPlayers = players.filter(p => p.status === PlayerStatus.UNSOLD);

  // Sort sets by display order
  const sortedSets = [...sets].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

  const resetForm = () => {
      setEditingPlayerId(null);
      setNewPlayerName('');
      setNewPlayerRole('');
      setNewPlayerCountry('India');
      setNewPlayerPrice(20);
      setNewPlayerSet(0);
      setNewPlayerImage('');
      setStatsMatches(0);
      setStatsRuns(0);
      setStatsAvg(0);
      setStatsSR(0);
      setStatsHighScore('');
      setStatsWickets(0);
      setStatsEconomy(0);
      setStatsBestBowling('');
      setStatsAge(0);
  }
// ... (skipping context references) ...
// Jump to line 396


  const handleEditClick = (player: Player) => {
      setEditingPlayerId(player.id);
      setNewPlayerName(player.name);
      setNewPlayerRole(player.role);
      setNewPlayerCountry(player.country);
      setNewPlayerPrice(player.basePrice);
      setNewPlayerSet(player.set);
      setNewPlayerImage(player.imageUrl || '');
      
      setStatsAge(player.stats.age || 0);
      setStatsMatches(player.stats.matches);
      setStatsRuns(player.stats.runs);
      setStatsAvg(player.stats.avg);
      setStatsSR(player.stats.strikeRate);
      setStatsHighScore(player.stats.highScore || '');
      setStatsWickets(player.stats.wickets || 0);
      setStatsEconomy(player.stats.economy || 0);
      setStatsBestBowling(player.stats.bestBowling || '');
  }

  const handleSavePlayer = (e: React.FormEvent) => {
    e.preventDefault();
    
    const playerData: Player = {
      id: editingPlayerId || Date.now().toString(),
      name: newPlayerName,
      role: newPlayerRole,
      country: newPlayerCountry,
      basePrice: newPlayerPrice,
      status: editingPlayerId ? (players.find(p => p.id === editingPlayerId)?.status || PlayerStatus.UNSOLD) : PlayerStatus.UNSOLD,
      set: newPlayerSet,
      imageUrl: newPlayerImage,
      stats: {
          age: statsAge,
          matches: statsMatches,
          runs: statsRuns,
          avg: statsAvg,
          strikeRate: statsSR,
          highScore: statsHighScore,
          wickets: statsWickets,
          economy: statsEconomy,
          bestBowling: statsBestBowling
      }
    };

    if (editingPlayerId) {
        updatePlayer(playerData);
    } else {
        addPlayer(playerData);
    }
    
    resetForm();
  };

  const handleQuickBid = (increment: number) => {
    // Allows bidding without team (anonymous) or with team
    let nextBid = 0;
    if (currentBid === 0) { // Fix: If fresh auction, start from base
       // Actually base price is usually set as currentBid in startAuction? 
       // No, startAuction sets current_bid to basePrice.
       // So currentBid is at least basePrice.
       nextBid = currentBid + increment;
    } else {
        nextBid = currentBid + increment;
    }
    
    // If user clicked a team, use it. If not, use null (anonymous).
    placeBid(selectedBidTeam || null, nextBid);
  };
  
  const handleCustomBid = () => {
      if(!customBidAmount) return;
      placeBid(selectedBidTeam || null, parseInt(customBidAmount));
      setCustomBidAmount('');
  }
  
  const handleCreateSet = async (e: React.FormEvent) => {
      e.preventDefault();
      if(!newSetName) return;
      await createSet(newSetName);
      setNewSetName('');
      setNewSetDialog(false);
  };

  const currentSetName = currentPlayer ? sets.find(s => s.id === currentPlayer?.set)?.name : '';
  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEFT: Auction Controls */}
        <div className="space-y-8">
            
          {/* Active Auction Control */}
          <div className="bg-slate-900 border border-blue-900/50 rounded-2xl p-6 shadow-xl relative overflow-hidden">
             {currentPlayer ? (
                <>
                    <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                        <Gavel size={120} />
                    </div>
                    
                    <div className="mb-6">
                        <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">{currentSetName} | On The Block</span>
                        <h2 className="text-4xl text-white font-bold display-font">{currentPlayer.name}</h2>
                        <div className="flex gap-4 text-slate-400 mt-1">
                            <span>Base: {formatCurrency(currentPlayer.basePrice)}</span>
                            <span className="text-yellow-500 font-bold">Current: {formatCurrency(currentBid)}</span>
                        </div>
                    </div>

                    {/* Bidding Controls */}
                    <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 mb-6">
                        <div className="flex items-center justify-between mb-2">
                             <label className="block text-slate-400 text-xs uppercase">Select Buyer (Optional for Bidding)</label>
                             {selectedBidTeam && (
                                 <button onClick={() => setSelectedBidTeam('')} className="text-xs text-red-400 hover:text-red-300">Clear</button>
                             )}
                        </div>
                        <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mb-4">
                            {teams.map(team => (
                                <button
                                    key={team.id}
                                    onClick={() => setSelectedBidTeam(team.id)}
                                    // Removed disabled check to allow selection even if "insufficient" just in case, but safe to keep warning later
                                    // disabled={team.remainingPurse < currentBid}
                                    className={`p-2 rounded-lg text-xs font-bold transition-all border ${
                                        selectedBidTeam === team.id
                                        ? 'bg-blue-600 text-white border-blue-500 ring-2 ring-blue-400/30'
                                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                                    } ${team.remainingPurse < currentBid ? 'opacity-50' : ''}`}
                                >
                                    {team.shortName}
                                </button>
                            ))}
                        </div>

                        <div className="flex flex-col gap-3">
                             <div className="flex gap-2">
                                <button onClick={() => handleQuickBid(10)} className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm font-medium">+10L</button>
                                <button onClick={() => handleQuickBid(20)} className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm font-medium">+20L</button>
                                <button onClick={() => handleQuickBid(50)} className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm font-medium">+50L</button>
                                <button onClick={() => handleQuickBid(100)} className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm font-medium">+1Cr</button>
                             </div>
                             <div className="flex gap-2">
                                 <input 
                                    type="number" 
                                    placeholder="Amount (Lakhs)"
                                    className="flex-1 bg-slate-800 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                                    value={customBidAmount}
                                    onChange={(e) => setCustomBidAmount(e.target.value)}
                                 />
                                 <button onClick={handleCustomBid} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium">Bid</button>
                             </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button 
                            onClick={() => sellPlayer(selectedBidTeam)}
                            disabled={!selectedBidTeam && !currentBidTeamId} // Need SOME team
                            className="flex-1 bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-xl uppercase tracking-widest shadow-lg shadow-green-900/20"
                        >
                            SOLD
                        </button>
                        <button 
                            onClick={passPlayer}
                            className="flex-1 bg-red-600 hover:bg-red-500 text-white py-4 rounded-xl font-bold text-xl uppercase tracking-widest shadow-lg shadow-red-900/20"
                        >
                            UNSOLD
                        </button>
                    </div>
                </>
             ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500">
                    <p className="mb-4">No player currently on auction.</p>
                    <p className="text-sm">Select a player from the list below to start.</p>
                </div>
             )}
          </div>

          {/* Add/Edit Player Form */}
          <div className={`border border-slate-800 rounded-2xl p-6 transition-all duration-300 ${editingPlayerId ? 'bg-blue-900/20 border-blue-500/50' : 'bg-slate-900'}`}>
              <h3 className="text-white font-bold mb-4 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {editingPlayerId ? <Pencil size={20} className="text-blue-400" /> : <PlusCircle size={20} />} 
                    {editingPlayerId ? 'Edit Player' : 'Add Player Card'}
                  </span>
                  {editingPlayerId && (
                      <button onClick={resetForm} className="text-slate-400 hover:text-white"><X size={20} /></button>
                  )}
              </h3>
              
              {/* Set Management Toggle */}
                <div className="mb-4 flex justify-end">
                    <button 
                        onClick={() => setNewSetDialog(!newSetDialog)}
                        className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                    >
                        <Layers size={14} /> {newSetDialog ? 'Cancel New Set' : 'Create New Set'}
                    </button>
                </div>

              {newSetDialog && (
                   <form onSubmit={handleCreateSet} className="bg-slate-800 p-4 rounded-lg mb-4 border border-blue-500/30">
                       <label className="block text-slate-400 text-xs mb-1">New Set Name</label>
                       <div className="flex gap-2">
                           <input 
                            type="text" 
                            className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm"
                            placeholder="e.g. Marquee Players"
                            value={newSetName}
                            onChange={e => setNewSetName(e.target.value)}
                            required
                           />
                           <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-4 rounded text-xs font-bold uppercase">Create</button>
                       </div>
                   </form>
              )}

              <form onSubmit={handleSavePlayer} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                          <label className="block text-slate-400 text-xs mb-1">Player Name</label>
                          <input 
                            type="text" 
                            required
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                            value={newPlayerName}
                            onChange={e => setNewPlayerName(e.target.value)}
                          />
                      </div>
                      <div>
                          <label className="block text-slate-400 text-xs mb-1">Country</label>
                          <input 
                            type="text" 
                            required
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                            value={newPlayerCountry}
                            onChange={e => setNewPlayerCountry(e.target.value)}
                          />
                      </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="block text-slate-400 text-xs mb-1">Role</label>
                          <input 
                            type="text" 
                            placeholder="e.g. WK-Batter"
                            required
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                            value={newPlayerRole}
                            onChange={e => setNewPlayerRole(e.target.value)}
                          />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-slate-400 text-xs mb-1">Set</label>
                            <select 
                                required
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded px-3 py-2 focus:outline-none focus:border-blue-500 appearance-none"
                                value={newPlayerSet}
                                onChange={e => setNewPlayerSet(parseInt(e.target.value))}
                            >
                                {sortedSets.map(s => (
                                    <option key={s.id} value={s.id}>{s.id}: {s.name}</option>
                                ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-slate-400 text-xs mb-1">Base (L)</label>
                            <input 
                                type="number" 
                                required
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                                value={newPlayerPrice}
                                onChange={e => setNewPlayerPrice(parseInt(e.target.value))}
                            />
                          </div>
                      </div>
                  </div>

                  <div>
                      <label className="block text-slate-400 text-xs mb-1">Image URL</label>
                      <input 
                        type="text" 
                        placeholder="https://..."
                        className="w-full bg-slate-800 border border-slate-700 text-white rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                        value={newPlayerImage}
                        onChange={e => setNewPlayerImage(e.target.value)}
                      />
                  </div>

                  {/* Stats Section */}
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                      <div className="text-slate-300 text-sm font-bold mb-3 flex items-center gap-2">
                          <Trophy size={14} className="text-yellow-500" /> Player Stats
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="block text-slate-500 text-[10px] uppercase">Age</label>
                            <input type="number" className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm" value={statsAge} onChange={e => setStatsAge(parseInt(e.target.value))} />
                          </div>
                          <div>
                            <label className="block text-slate-500 text-[10px] uppercase">Matches</label>
                            <input type="number" className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm" value={statsMatches} onChange={e => setStatsMatches(parseInt(e.target.value))} />
                          </div>
                          <div>
                            <label className="block text-slate-500 text-[10px] uppercase">Runs</label>
                            <input type="number" className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm" value={statsRuns} onChange={e => setStatsRuns(parseInt(e.target.value))} />
                          </div>
                          <div>
                            <label className="block text-slate-500 text-[10px] uppercase">Avg</label>
                            <input type="number" step="0.1" className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm" value={statsAvg} onChange={e => setStatsAvg(parseFloat(e.target.value))} />
                          </div>
                          <div>
                            <label className="block text-slate-500 text-[10px] uppercase">S.R.</label>
                            <input type="number" step="0.1" className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm" value={statsSR} onChange={e => setStatsSR(parseFloat(e.target.value))} />
                          </div>
                          <div>
                            <label className="block text-slate-500 text-[10px] uppercase">High Score</label>
                            <input type="text" className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm" value={statsHighScore} onChange={e => setStatsHighScore(e.target.value)} />
                          </div>
                          <div>
                            <label className="block text-slate-500 text-[10px] uppercase">Wickets</label>
                            <input type="number" className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm" value={statsWickets} onChange={e => setStatsWickets(parseInt(e.target.value))} />
                          </div>
                          <div>
                            <label className="block text-slate-500 text-[10px] uppercase">Economy</label>
                            <input type="number" step="0.01" className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm" value={statsEconomy} onChange={e => setStatsEconomy(parseFloat(e.target.value))} />
                          </div>
                          <div>
                            <label className="block text-slate-500 text-[10px] uppercase">Best Bowl</label>
                            <input type="text" className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm" value={statsBestBowling} onChange={e => setStatsBestBowling(e.target.value)} />
                          </div>
                      </div>
                  </div>

                  <button 
                    type="submit" 
                    className={`w-full py-2 rounded font-medium shadow-lg transition-all ${
                        editingPlayerId 
                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20' 
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20'
                    }`}
                  >
                      {editingPlayerId ? 'Save Changes' : 'Add Player'}
                  </button>
              </form>
          </div>

          <div className="pt-8 border-t border-slate-800">
             <button onClick={resetAuction} className="flex items-center gap-2 text-red-500 hover:text-red-400 text-sm">
                 <RefreshCw size={14} /> Reset Entire Auction
             </button>
          </div>

        </div>

        {/* RIGHT: Player List Queue */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col h-[800px]">
            <h3 className="text-white font-bold mb-4 flex items-center justify-between">
                <span>Unsold Queue ({unsoldPlayers.length})</span>
                <span className="text-xs font-normal text-slate-400">By Set</span>
            </h3>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {unsoldPlayers.length === 0 ? (
                    <div className="text-slate-500 text-center mt-12">No unsold players remaining.</div>
                ) : (
                    sortedSets.map(setObj => {
                        const setPlayers = unsoldPlayers
                            .filter(p => p.set === setObj.id)
                            .sort((a, b) => {
                                // Priority 1: Display Order (if present)
                                if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
                                    return a.displayOrder - b.displayOrder;
                                }
                                if (a.displayOrder !== undefined) return -1; // Has order comes first
                                if (b.displayOrder !== undefined) return 1;

                                // Priority 2: Fallback to existing logic (updatedAt or ID)
                                const timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
                                const timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
                                
                                if (timeA === timeB) {
                                    const getNum = (str: string) => parseInt(str.split('-')[1] || '0');
                                    return getNum(a.id) - getNum(b.id);
                                }

                                return timeA - timeB;
                            });
                        if (setPlayers.length === 0) return null;

                        return (
                        <div key={setObj.id} className="mb-6">
                            <div className="sticky top-0 bg-slate-900/95 backdrop-blur z-10 py-2 border-b border-slate-800 mb-2 flex items-center gap-2 text-blue-400">
                                <Layers size={14} />
                                <span className="font-bold uppercase text-xs tracking-wider">{setObj.name}</span>
                            </div>
                            <div className="space-y-2">
                            {setPlayers.map(player => (
                                <div key={player.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700 group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden flex-shrink-0">
                                            {player.imageUrl ? (
                                                <img src={player.imageUrl} alt={player.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-500"><User size={20} /></div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="text-white font-medium">{player.name}</div>
                                            <div className="text-xs text-slate-400">{player.role} • {formatCurrency(player.basePrice)}</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => {
                                                if(confirm(`Are you sure you want to PERMANENTLY delete ${player.name}?`)) {
                                                    deletePlayer(player.id);
                                                }
                                            }}
                                            className="bg-red-900/50 hover:bg-red-800 text-red-200 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="Delete Player"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                        <button 
                                            onClick={() => handleEditClick(player)}
                                            className="bg-slate-700 hover:bg-slate-600 text-slate-300 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="Edit Player"
                                        >
                                            <Pencil size={14} />
                                        </button>
                                        <button 
                                            onClick={() => startAuction(player.id)}
                                            disabled={!!currentPlayer}
                                            className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="Start Auction"
                                        >
                                            <PlayCircle size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            </div>
                        </div>
                    )
                })
                )}
            </div>
        </div>

        {/* RE-AUCTION QUEUE (Passed Players) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col h-[400px]">
            <h3 className="text-white font-bold mb-4 flex items-center justify-between">
                <span className="text-red-400">Re-Auction Queue ({players.filter(p => p.status === PlayerStatus.PASSED).length})</span>
            </h3>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {players.filter(p => p.status === PlayerStatus.PASSED).length === 0 ? (
                    <div className="text-slate-500 text-center mt-12">No passed players.</div>
                ) : (
                    players.filter(p => p.status === PlayerStatus.PASSED).map(player => (
                        <div key={player.id} className="flex items-center justify-between p-3 bg-red-950/20 rounded-lg hover:bg-red-900/30 transition-colors border border-red-900/30 mb-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden flex-shrink-0 grayscale">
                                    {player.imageUrl ? <img src={player.imageUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-500"><User size={20} /></div>}
                                </div>
                                <div>
                                    <div className="text-white font-medium">{player.name}</div>
                                    <div className="text-xs text-slate-400">Set {player.set} • {player.role}</div>
                                </div>
                            </div>
                            <button 
                                onClick={() => startAuction(player.id)}
                                disabled={!!currentPlayer}
                                className="bg-red-600 hover:bg-red-500 disabled:bg-slate-700 disabled:text-slate-500 text-white p-2 rounded-full transition-opacity"
                                title="Restart Auction"
                            >
                                <PlayCircle size={18} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default Admin;