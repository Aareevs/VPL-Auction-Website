import React, { useState, useEffect } from 'react';
import { useAuction } from '../context/AuctionContext';
import { useAuth } from '../context/AuthProvider';
import { PlayerStatus, Player } from '../types';
import { formatAuctionValue, getAuctionUnitLabel } from '../constants';
import { supabase } from '../lib/supabaseClient';
import { CAPTAIN_SUFFIX, isCaptain, getPlayerDisplayName, getPlayerDisplayRole } from '../lib/playerDisplay';
import { PlusCircle, PlayCircle, Gavel, RefreshCw, Trophy, User, Layers, Pencil, X, Trash2, Shield, ShieldPlus, ShieldX, Mail, ArrowUp, ArrowDown, Save, Upload, Loader2 } from 'lucide-react';

interface AdminEmail {
  id: string;
  email: string;
  added_at: string;
}

const stripCaptainSuffix = (name: string) =>
  name.endsWith(CAPTAIN_SUFFIX) ? name.slice(0, -CAPTAIN_SUFFIX.length) : name;

const applyCaptainSuffix = (name: string, isCaptain: boolean) => {
  const cleanName = stripCaptainSuffix(name.trim());
  return isCaptain ? `${cleanName}${CAPTAIN_SUFFIX}` : cleanName;
};

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
    updatePlayerSet,
    reorderSets,
    updateTeam,
    valuationMode,
    updateValuationMode
  } = useAuction();

  const { user } = useAuth();

  // Admin email management state
  const [adminEmails, setAdminEmails] = useState<AdminEmail[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [adminEmailLoading, setAdminEmailLoading] = useState(false);
  const [adminEmailError, setAdminEmailError] = useState('');
  const [adminEmailSuccess, setAdminEmailSuccess] = useState('');

  // Fetch admin emails on mount
  useEffect(() => {
    fetchAdminEmails();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('admin_emails_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'admin_emails' }, () => {
        fetchAdminEmails();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchAdminEmails = async () => {
    const { data, error } = await supabase
      .from('admin_emails')
      .select('*')
      .order('added_at', { ascending: true });
    if (!error && data) setAdminEmails(data);
  };

  const handleAddAdminEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim()) return;
    
    setAdminEmailLoading(true);
    setAdminEmailError('');
    setAdminEmailSuccess('');
    
    try {
      // Check if already exists
      const existing = adminEmails.find(a => a.email.toLowerCase() === newAdminEmail.trim().toLowerCase());
      if (existing) {
        setAdminEmailError('This email already has admin access.');
        return;
      }

      const { error } = await supabase
        .from('admin_emails')
        .insert({ email: newAdminEmail.trim().toLowerCase() });
      
      if (error) throw error;
      
      setNewAdminEmail('');
      setAdminEmailSuccess(`Admin access granted to ${newAdminEmail.trim()}`);
      setTimeout(() => setAdminEmailSuccess(''), 3000);
      await fetchAdminEmails();
    } catch (err: any) {
      setAdminEmailError(err.message || 'Failed to grant admin access.');
    } finally {
      setAdminEmailLoading(false);
    }
  };

  const handleRevokeAdmin = async (adminEmail: AdminEmail) => {
    if (adminEmail.email === user?.email) {
      setAdminEmailError('You cannot revoke your own admin access.');
      setTimeout(() => setAdminEmailError(''), 3000);
      return;
    }
    
    if (!confirm(`Revoke admin access for ${adminEmail.email}?`)) return;
    
    setAdminEmailLoading(true);
    setAdminEmailError('');
    
    try {
      const { error } = await supabase
        .from('admin_emails')
        .delete()
        .eq('id', adminEmail.id);
      
      if (error) throw error;

      // Also update their profile role to spectator
      await supabase
        .from('profiles')
        .update({ role: 'spectator' })
        .eq('email', adminEmail.email);
      
      setAdminEmailSuccess(`Admin access revoked for ${adminEmail.email}`);
      setTimeout(() => setAdminEmailSuccess(''), 3000);
      await fetchAdminEmails();
    } catch (err: any) {
      setAdminEmailError(err.message || 'Failed to revoke admin access.');
    } finally {
      setAdminEmailLoading(false);
    }
  };

  // Form State
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerRole, setNewPlayerRole] = useState('');
  const [newPlayerCountry, setNewPlayerCountry] = useState('India');
  const [newPlayerImage, setNewPlayerImage] = useState('');
  const [newPlayerPrice, setNewPlayerPrice] = useState(20);
  const [newPlayerSet, setNewPlayerSet] = useState(0);
  const [playerStatusOverride, setPlayerStatusOverride] = useState<PlayerStatus>(PlayerStatus.UNSOLD);
  const [manualTeamId, setManualTeamId] = useState('');
  const [manualSoldPrice, setManualSoldPrice] = useState('');
  const [makeCaptain, setMakeCaptain] = useState(false);
  const [manageSetsDialog, setManageSetsDialog] = useState(false);
  const [newSetName, setNewSetName] = useState('');
  const [localSetOrder, setLocalSetOrder] = useState<typeof sets>([]);
  
  const [editingSetId, setEditingSetId] = useState<number | null>(null);
  const [editSetName, setEditSetName] = useState('');

  const handleUpdateSetName = async (setId: number) => {
      if (!editSetName.trim()) return;
      
      const { error } = await supabase
          .from('auction_sets')
          .update({ name: editSetName.trim() })
          .eq('id', setId);
          
      if (error) {
          alert("Error updating set name: " + error.message);
      } else {
          setEditingSetId(null);
          // Update the local list so it re-renders immediately
          const newOrder = localSetOrder.map(s => s.id === setId ? { ...s, name: editSetName.trim() } : s);
          setLocalSetOrder(newOrder);
      }
  };
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

  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [teamFormName, setTeamFormName] = useState('');
  const [teamFormShortName, setTeamFormShortName] = useState('');
  const [teamFormLogo, setTeamFormLogo] = useState('');
  const [teamFormColor, setTeamFormColor] = useState('');

  // Group unsold players by set
  const unsoldPlayers = players.filter(p => p.status === PlayerStatus.UNSOLD);
  const soldPlayers = players.filter(p => p.status === PlayerStatus.SOLD);

  // Sort sets by display order
  const sortedSets = [...sets].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingTeamLogo, setIsUploadingTeamLogo] = useState(false);

  const uploadImage = async (file: File, folder: 'players' | 'teams') => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
          .from('vpl-images')
          .upload(filePath, file);

      if (uploadError) {
          throw uploadError;
      }

      const { data } = supabase.storage.from('vpl-images').getPublicUrl(filePath);
      return data.publicUrl;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsUploading(true);
      try {
          const publicUrl = await uploadImage(file, 'players');
          setNewPlayerImage(publicUrl);
      } catch (error: any) {
          alert('Error uploading image: ' + error.message);
      } finally {
          setIsUploading(false);
      }
  };

  const handleTeamLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsUploadingTeamLogo(true);
      try {
          const publicUrl = await uploadImage(file, 'teams');
          setTeamFormLogo(publicUrl);
      } catch (error: any) {
          alert('Error uploading logo: ' + error.message);
      } finally {
          setIsUploadingTeamLogo(false);
      }
  };

  const resetForm = () => {
      setEditingPlayerId(null);
      setNewPlayerName('');
      setNewPlayerRole('');
      setNewPlayerCountry('India');
      setNewPlayerPrice(20);
      setNewPlayerSet(0);
      setNewPlayerImage('');
      setPlayerStatusOverride(PlayerStatus.UNSOLD);
      setManualTeamId('');
      setManualSoldPrice('');
      setMakeCaptain(false);
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
      setNewPlayerName(stripCaptainSuffix(player.name));
      setNewPlayerRole(player.role);
      setNewPlayerCountry(player.country);
      setNewPlayerPrice(player.basePrice);
      setNewPlayerSet(player.set);
      setNewPlayerImage(player.imageUrl || '');
      setPlayerStatusOverride(player.status);
      setManualTeamId(player.teamId || '');
      setManualSoldPrice(player.soldPrice ? String(player.soldPrice) : '');
      setMakeCaptain(isCaptain(player));
      
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

  const openTeamEditor = (teamId: string) => {
      const team = teams.find((item) => item.id === teamId);
      if (!team) return;

      setEditingTeamId(team.id);
      setTeamFormName(team.name);
      setTeamFormShortName(team.shortName);
      setTeamFormLogo(team.logoUrl || '');
      setTeamFormColor(team.primaryColor);
  };

  const closeTeamEditor = () => {
      setEditingTeamId(null);
      setTeamFormName('');
      setTeamFormShortName('');
      setTeamFormLogo('');
      setTeamFormColor('');
  };

  const handleSaveTeam = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingTeamId) return;

      await updateTeam(editingTeamId, {
          name: teamFormName.trim(),
          shortName: teamFormShortName.trim().toUpperCase(),
          logoUrl: teamFormLogo.trim(),
          primaryColor: teamFormColor
      });

      closeTeamEditor();
  };

  const handleSavePlayer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (playerStatusOverride === PlayerStatus.SOLD) {
      if (!manualTeamId) {
        alert('Select a team before saving a sold player.');
        return;
      }

    }

    const parsedSoldPrice = parseInt(manualSoldPrice, 10);
    const resolvedSoldPrice = makeCaptain
      ? 0
      : playerStatusOverride === PlayerStatus.SOLD && !Number.isNaN(parsedSoldPrice)
        ? Math.max(parsedSoldPrice, 0)
        : 0;
    
    const playerData: Player = {
      id: editingPlayerId || Date.now().toString(),
      name: applyCaptainSuffix(newPlayerName, makeCaptain),
      role: newPlayerRole,
      country: newPlayerCountry,
      basePrice: newPlayerPrice,
      status: playerStatusOverride,
      set: newPlayerSet,
      imageUrl: newPlayerImage,
      soldPrice: resolvedSoldPrice,
      teamId: playerStatusOverride === PlayerStatus.SOLD ? manualTeamId : undefined,
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
        await updatePlayer(playerData);
    } else {
        await addPlayer(playerData);
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
  };

  const currentSetName = currentPlayer ? sets.find(s => s.id === currentPlayer?.set)?.name : '';
  const quickBidSteps = valuationMode === 'points'
    ? [
        { amount: 1, label: '+1 Pt' },
        { amount: 2, label: '+2 Pts' },
        { amount: 5, label: '+5 Pts' },
        { amount: 10, label: '+10 Pts' }
      ]
    : [
        { amount: 10, label: '+10L' },
        { amount: 20, label: '+20L' },
        { amount: 50, label: '+50L' },
        { amount: 100, label: '+1Cr' }
      ];
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
                            <span>Base: {formatAuctionValue(currentPlayer.basePrice, valuationMode)}</span>
                            <span className="text-yellow-500 font-bold">Current: {formatAuctionValue(currentBid, valuationMode)}</span>
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
                                    {team.id}
                                </button>
                            ))}
                        </div>

                        <div className="flex flex-col gap-3">
                             <div className="flex gap-2">
                                {quickBidSteps.map(step => (
                                    <button key={step.label} onClick={() => handleQuickBid(step.amount)} className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm font-medium">
                                        {step.label}
                                    </button>
                                ))}
                             </div>
                             <div className="flex gap-2">
                                 <input 
                                    type="number" 
                                    placeholder={`Amount (${getAuctionUnitLabel(valuationMode)})`}
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

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 gap-4">
                  <div>
                      <h3 className="text-white font-bold">Auction Value Mode</h3>
                      <p className="text-xs text-slate-500 mt-1">Switch between currency purse and 100-point auctions.</p>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-full p-1">
                      <button
                          type="button"
                          onClick={() => updateValuationMode('currency')}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${valuationMode === 'currency' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                      >
                          Rupees
                      </button>
                      <button
                          type="button"
                          onClick={() => updateValuationMode('points')}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${valuationMode === 'points' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
                      >
                          Points
                      </button>
                  </div>
              </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold flex items-center gap-2">
                      <Shield size={18} className="text-cyan-400" />
                      Team Management
                  </h3>
                  <span className="text-xs text-slate-500">Click a team to edit name or logo</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {teams.map(team => (
                      <button
                          key={team.id}
                          type="button"
                          onClick={() => openTeamEditor(team.id)}
                          className="text-left bg-slate-800/70 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/40 rounded-xl p-3 transition-colors"
                      >
                          <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-700 overflow-hidden flex items-center justify-center">
                                  {team.logoUrl ? (
                                      <img src={team.logoUrl} alt={team.name} className="w-full h-full object-cover" />
                                  ) : (
                                      <div className="text-xs font-bold text-white" style={{ backgroundColor: team.primaryColor, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                          {team.shortName}
                                      </div>
                                  )}
                              </div>
                              <div className="min-w-0">
                                  <div className="text-white text-sm font-semibold truncate">{team.name}</div>
                                  <div className="text-xs text-slate-400">{team.shortName}</div>
                              </div>
                          </div>
                      </button>
                  ))}
              </div>
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
                        onClick={() => {
                            if (!manageSetsDialog) setLocalSetOrder([...sortedSets]);
                            setManageSetsDialog(!manageSetsDialog);
                        }}
                        className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 bg-blue-900/20 px-3 py-1.5 rounded-full border border-blue-500/30 transition-colors"
                    >
                        <Layers size={14} /> {manageSetsDialog ? 'Close Manage Sets' : 'Manage Sets'}
                    </button>
                </div>

              {manageSetsDialog && (
                   <div className="bg-slate-800 p-4 rounded-xl mb-6 border border-blue-500/30 space-y-4">
                       <h4 className="text-white font-bold text-sm">Create New Set</h4>
                       <form onSubmit={handleCreateSet} className="flex gap-2 pb-4 border-b border-slate-700">
                           <input 
                            type="text" 
                            className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm"
                            placeholder="e.g. Marquee Players"
                            value={newSetName}
                            onChange={e => setNewSetName(e.target.value)}
                            required
                           />
                           <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-4 rounded text-xs font-bold uppercase">Create</button>
                       </form>

                       <h4 className="text-white font-bold text-sm pt-2 flex items-center justify-between">
                           <span>Reorder Sets</span>
                           <button 
                               onClick={async () => {
                                   await reorderSets(localSetOrder);
                                   setManageSetsDialog(false);
                                   alert('Set order saved successfully!');
                               }}
                               className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors"
                           >
                               <Save size={12} /> Save Order
                           </button>
                       </h4>
                       <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                           {localSetOrder.map((s, index) => (
                               <div key={s.id} className="flex items-center justify-between bg-slate-900 border border-slate-700 p-2 rounded">
                                   {editingSetId === s.id ? (
                                       <div className="flex-1 flex gap-2 mr-2">
                                           <input 
                                               type="text" 
                                               className="flex-1 bg-slate-950 border border-blue-500 rounded px-2 py-1 text-sm text-white focus:outline-none"
                                               value={editSetName}
                                               onChange={(e) => setEditSetName(e.target.value)}
                                               autoFocus
                                               onKeyDown={(e) => {
                                                   if (e.key === 'Enter') handleUpdateSetName(s.id);
                                                   if (e.key === 'Escape') setEditingSetId(null);
                                               }}
                                           />
                                           <button onClick={() => handleUpdateSetName(s.id)} className="bg-blue-600 hover:bg-blue-500 text-white px-2 rounded flex items-center justify-center">
                                                <Save size={14} />
                                           </button>
                                           <button onClick={() => setEditingSetId(null)} className="bg-slate-700 hover:bg-slate-600 text-white px-2 rounded flex items-center justify-center">
                                                <X size={14} />
                                           </button>
                                       </div>
                                   ) : (
                                       <>
                                           <div className="text-sm text-slate-300 font-medium px-2 flex items-center gap-2">
                                               {s.name}
                                               <button 
                                                   onClick={(e) => {
                                                       e.preventDefault();
                                                       setEditingSetId(s.id);
                                                       setEditSetName(s.name);
                                                   }}
                                                   className="text-slate-500 hover:text-blue-400 p-1"
                                               >
                                                   <Pencil size={12} />
                                               </button>
                                           </div>
                                           <div className="flex bg-slate-800 rounded overflow-hidden">
                                       <button 
                                           onClick={(e) => {
                                               e.preventDefault();
                                               if (index > 0) {
                                                   const newOrder = [...localSetOrder];
                                                   [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
                                                   setLocalSetOrder(newOrder);
                                               }
                                           }}
                                           disabled={index === 0}
                                           className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent"
                                       >
                                           <ArrowUp size={14} />
                                       </button>
                                       <button 
                                           onClick={(e) => {
                                               e.preventDefault();
                                               if (index < localSetOrder.length - 1) {
                                                   const newOrder = [...localSetOrder];
                                                   [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
                                                   setLocalSetOrder(newOrder);
                                               }
                                           }}
                                           disabled={index === localSetOrder.length - 1}
                                           className="p-1.5 border-l border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent"
                                       >
                                           <ArrowDown size={14} />
                                       </button>
                                   </div>
                               </>
                               )}
                               </div>
                           ))}
                           {localSetOrder.length === 0 && <div className="text-xs text-slate-500 text-center py-2">No sets available.</div>}
                       </div>
                   </div>
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
                            <label className="block text-slate-400 text-xs mb-1">Base ({getAuctionUnitLabel(valuationMode)})</label>
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

                  {editingPlayerId && (
                      <div className="bg-slate-800/50 p-4 rounded-xl border border-amber-500/20 space-y-4">
                          <div className="flex items-center justify-between gap-4">
                              <div>
                                  <div className="text-sm font-bold text-amber-300">Manual Auction Override</div>
                                  <div className="text-xs text-slate-400">Force roster state without running the live auction flow.</div>
                              </div>
                              <label className="flex items-center gap-3 text-sm text-white">
                                  <span>Make Captain</span>
                                  <button
                                      type="button"
                                      onClick={() => setMakeCaptain(prev => !prev)}
                                      className={`relative w-12 h-7 rounded-full transition-colors ${makeCaptain ? 'bg-emerald-500' : 'bg-slate-700'}`}
                                  >
                                      <span
                                          className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${makeCaptain ? 'translate-x-6' : 'translate-x-1'}`}
                                      />
                                  </button>
                              </label>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                  <label className="block text-slate-400 text-xs mb-1">Status</label>
                                  <select
                                      className="w-full bg-slate-800 border border-slate-700 text-white rounded px-3 py-2 focus:outline-none focus:border-blue-500 appearance-none"
                                      value={playerStatusOverride}
                                      onChange={e => setPlayerStatusOverride(e.target.value as PlayerStatus)}
                                  >
                                      <option value={PlayerStatus.UNSOLD}>UNSOLD</option>
                                      <option value={PlayerStatus.PASSED}>PASSED</option>
                                      <option value={PlayerStatus.SOLD}>SOLD</option>
                                  </select>
                              </div>

                              <div>
                                  <label className="block text-slate-400 text-xs mb-1">Team</label>
                                  <select
                                      className="w-full bg-slate-800 border border-slate-700 text-white rounded px-3 py-2 focus:outline-none focus:border-blue-500 appearance-none disabled:opacity-50"
                                      value={manualTeamId}
                                      onChange={e => setManualTeamId(e.target.value)}
                                      disabled={playerStatusOverride !== PlayerStatus.SOLD}
                                  >
                                      <option value="">Select Team</option>
                                      {teams.map(team => (
                                          <option key={team.id} value={team.id}>{team.name}</option>
                                      ))}
                                  </select>
                              </div>

                              <div>
                                  <label className="block text-slate-400 text-xs mb-1">Final Value ({getAuctionUnitLabel(valuationMode)})</label>
                                  <input
                                      type="number"
                                      min={0}
                                      className="w-full bg-slate-800 border border-slate-700 text-white rounded px-3 py-2 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                                      value={manualSoldPrice}
                                      onChange={e => setManualSoldPrice(e.target.value)}
                                      disabled={playerStatusOverride !== PlayerStatus.SOLD}
                                      placeholder="Leave blank for direct assignment"
                                  />
                              </div>
                          </div>
                      </div>
                  )}

                  {/* Image Upload / URL Section */}
                  <div>
                      <label className="block text-slate-400 text-xs mb-2">Player Image</label>
                      <div className="flex gap-4 items-center">
                          {/* Preview Box */}
                          <div className="w-24 h-24 flex-shrink-0 bg-slate-900 border-2 border-slate-700 border-dashed rounded-xl overflow-hidden flex items-center justify-center relative group pointer-events-auto">
                              {newPlayerImage ? (
                                  <img src={newPlayerImage} className="w-full h-full object-cover" />
                              ) : (
                                  <User size={32} className="text-slate-600" />
                              )}
                              
                              {/* Upload Overlay */}
                              <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity z-10">
                                  {isUploading ? <Loader2 size={24} className="text-white animate-spin" /> : <Upload size={24} className="text-white" />}
                                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                              </label>
                          </div>
                          
                          {/* URL Fallback / Info */}
                          <div className="flex-1 space-y-2">
                             <div className="text-xs text-slate-500">Tap the preview picture to upload an image from your device, or simply paste a public image URL below.</div>
                             <input 
                                type="text" 
                                placeholder="Auto-fills on upload, or paste https://..."
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                value={newPlayerImage}
                                onChange={e => setNewPlayerImage(e.target.value)}
                             />
                          </div>
                      </div>
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


          {/* Admin Access Management */}
          <div className="bg-slate-900 border border-purple-900/50 rounded-2xl p-6 shadow-xl">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <Shield size={20} className="text-purple-400" />
              Admin Access Management
            </h3>
            <p className="text-slate-400 text-xs mb-4">Grant or revoke admin access by email. Admin users have full control over the auction dashboard.</p>

            {/* Admin Email List */}
            <div className="space-y-2 mb-4">
              {adminEmails.map(ae => (
                <div key={ae.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      ae.email === user?.email ? 'bg-purple-600/30 text-purple-400' : 'bg-slate-700 text-slate-400'
                    }`}>
                      <Mail size={14} />
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">{ae.email}</div>
                      <div className="text-[10px] text-slate-500">
                        Added {new Date(ae.added_at).toLocaleDateString()}
                        {ae.email === user?.email && <span className="ml-2 text-purple-400 font-bold">(You)</span>}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRevokeAdmin(ae)}
                    disabled={ae.email === user?.email || adminEmailLoading}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-red-900/30 text-red-400 hover:bg-red-900/60 hover:text-red-300 border border-red-900/30"
                    title={ae.email === user?.email ? 'Cannot revoke own access' : 'Revoke admin access'}
                  >
                    <ShieldX size={12} /> Revoke
                  </button>
                </div>
              ))}
              {adminEmails.length === 0 && (
                <div className="text-slate-500 text-sm text-center py-4">No admin emails configured.</div>
              )}
            </div>

            {/* Add Admin Email Form */}
            <form onSubmit={handleAddAdminEmail} className="flex gap-2">
              <div className="relative flex-1">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  placeholder="Enter email to grant admin access..."
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-purple-500 placeholder:text-slate-600"
                  value={newAdminEmail}
                  onChange={e => setNewAdminEmail(e.target.value)}
                  required
                  disabled={adminEmailLoading}
                />
              </div>
              <button
                type="submit"
                disabled={adminEmailLoading || !newAdminEmail.trim()}
                className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 rounded-lg text-sm font-medium transition-all shadow-lg shadow-purple-900/20"
              >
                <ShieldPlus size={14} /> Grant Access
              </button>
            </form>

            {/* Messages */}
            {adminEmailError && (
              <div className="mt-3 bg-red-950/50 border border-red-900/50 text-red-400 text-xs px-3 py-2 rounded-lg">
                {adminEmailError}
              </div>
            )}
            {adminEmailSuccess && (
              <div className="mt-3 bg-green-950/50 border border-green-900/50 text-green-400 text-xs px-3 py-2 rounded-lg">
                {adminEmailSuccess}
              </div>
            )}
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
                                            <div className="text-white font-medium">{getPlayerDisplayName(player)}</div>
                                            <div className="text-xs text-slate-400">{getPlayerDisplayRole(player)} • {formatAuctionValue(player.basePrice, valuationMode)}</div>
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
                                    <div className="text-white font-medium">{getPlayerDisplayName(player)}</div>
                                    <div className="text-xs text-slate-400">Set {player.set} • {getPlayerDisplayRole(player)}</div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEditClick(player)}
                                    className="bg-slate-700 hover:bg-slate-600 text-slate-200 p-2 rounded-full transition-opacity"
                                    title="Edit Player"
                                >
                                    <Pencil size={16} />
                                </button>
                                <button 
                                    onClick={() => startAuction(player.id)}
                                    disabled={!!currentPlayer}
                                    className="bg-red-600 hover:bg-red-500 disabled:bg-slate-700 disabled:text-slate-500 text-white p-2 rounded-full transition-opacity"
                                    title="Restart Auction"
                                >
                                    <PlayCircle size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col h-[400px]">
            <h3 className="text-white font-bold mb-4 flex items-center justify-between">
                <span className="text-emerald-400">Rostered Players ({soldPlayers.length})</span>
                <span className="text-xs text-slate-400">Manual team fixes</span>
            </h3>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {soldPlayers.length === 0 ? (
                    <div className="text-slate-500 text-center mt-12">No sold players yet.</div>
                ) : (
                    soldPlayers
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map(player => {
                            const team = teams.find(item => item.id === player.teamId);
                            return (
                                <div key={player.id} className="flex items-center justify-between p-3 bg-emerald-950/20 rounded-lg hover:bg-emerald-900/25 transition-colors border border-emerald-900/20 mb-2">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden flex-shrink-0">
                                            {player.imageUrl ? <img src={player.imageUrl} alt={player.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-500"><User size={20} /></div>}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-white font-medium truncate">{getPlayerDisplayName(player)}</div>
                                            <div className="text-xs text-slate-400 truncate">
                                                {team?.name || 'No team'} • {formatAuctionValue(player.soldPrice || 0, valuationMode)}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleEditClick(player)}
                                        className="bg-slate-700 hover:bg-slate-600 text-slate-200 p-2 rounded-full transition-opacity"
                                        title="Edit Player"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                </div>
                            );
                        })
                )}
            </div>
        </div>

      </div>

      {editingTeamId && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center px-4">
              <div className="w-full max-w-2xl bg-slate-900 border border-cyan-500/20 rounded-3xl p-6 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                      <div>
                          <h3 className="text-xl font-bold text-white">Edit Team</h3>
                          <p className="text-sm text-slate-400">Update branding directly from the admin dashboard.</p>
                      </div>
                      <button type="button" onClick={closeTeamEditor} className="text-slate-400 hover:text-white">
                          <X size={20} />
                      </button>
                  </div>

                  <form onSubmit={handleSaveTeam} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                              <label className="block text-slate-400 text-xs mb-1">Team Name</label>
                              <input
                                  type="text"
                                  required
                                  className="w-full bg-slate-800 border border-slate-700 text-white rounded px-3 py-2 focus:outline-none focus:border-cyan-500"
                                  value={teamFormName}
                                  onChange={e => setTeamFormName(e.target.value)}
                              />
                          </div>
                          <div>
                              <label className="block text-slate-400 text-xs mb-1">Short Name</label>
                              <input
                                  type="text"
                                  required
                                  maxLength={6}
                                  className="w-full bg-slate-800 border border-slate-700 text-white rounded px-3 py-2 focus:outline-none focus:border-cyan-500"
                                  value={teamFormShortName}
                                  onChange={e => setTeamFormShortName(e.target.value.toUpperCase())}
                              />
                          </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-4 items-start">
                          <div className="w-[140px] h-[140px] bg-slate-950 border-2 border-slate-700 border-dashed rounded-2xl overflow-hidden flex items-center justify-center relative group">
                              {teamFormLogo ? (
                                  <img src={teamFormLogo} alt={teamFormName} className="w-full h-full object-cover" />
                              ) : (
                                  <div className="text-white font-bold text-lg" style={{ color: teamFormColor || '#fff' }}>{teamFormShortName || 'LOGO'}</div>
                              )}
                              <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity z-10">
                                  {isUploadingTeamLogo ? <Loader2 size={24} className="text-white animate-spin" /> : <Upload size={24} className="text-white" />}
                                  <input type="file" accept="image/*" className="hidden" onChange={handleTeamLogoUpload} disabled={isUploadingTeamLogo} />
                              </label>
                          </div>

                          <div className="space-y-4">
                              <div>
                                  <label className="block text-slate-400 text-xs mb-1">Logo URL</label>
                                  <input
                                      type="text"
                                      className="w-full bg-slate-800 border border-slate-700 text-white rounded px-3 py-2 focus:outline-none focus:border-cyan-500"
                                      placeholder="Auto-fills on upload, or paste a public image URL"
                                      value={teamFormLogo}
                                      onChange={e => setTeamFormLogo(e.target.value)}
                                  />
                              </div>
                              <div>
                                  <label className="block text-slate-400 text-xs mb-1">Primary Color</label>
                                  <div className="flex gap-3">
                                      <input
                                          type="color"
                                          className="h-10 w-14 bg-slate-800 border border-slate-700 rounded"
                                          value={teamFormColor || '#000000'}
                                          onChange={e => setTeamFormColor(e.target.value)}
                                      />
                                      <input
                                          type="text"
                                          className="flex-1 bg-slate-800 border border-slate-700 text-white rounded px-3 py-2 focus:outline-none focus:border-cyan-500"
                                          value={teamFormColor}
                                          onChange={e => setTeamFormColor(e.target.value)}
                                      />
                                  </div>
                              </div>
                          </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                          <button type="button" onClick={closeTeamEditor} className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500">
                              Cancel
                          </button>
                          <button type="submit" className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium">
                              Save Team
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default Admin;
