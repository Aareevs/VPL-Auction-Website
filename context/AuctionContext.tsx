import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';
import { AuctionValueMode, Player, Team, Bid, PlayerStatus, AuctionSet } from '../types';
import { getAuctionBudget, INITIAL_TEAMS } from '../constants';
import { isCaptain } from '../lib/playerDisplay';

interface TeamOverride {
  team_id: string;
  name?: string;
  short_name?: string;
  logo_url?: string;
  primary_color?: string;
}

interface AuctionContextType {
  teams: Team[];
  players: Player[];
  valuationMode: AuctionValueMode;
  currentPlayer: Player | null;
  currentBid: number;
  currentBidTeamId: string | null;
  bidHistory: Bid[];
  sets: AuctionSet[];
  
  // Admin Actions
  createSet: (name: string) => Promise<void>;
  updatePlayerSet: (playerId: string, setId: number) => Promise<void>;
  reorderSets: (orderedSets: AuctionSet[]) => Promise<void>;
  addPlayer: (player: Player) => void;
  updatePlayer: (player: Player) => void;
  startAuction: (playerId: string) => void;
  placeBid: (teamId: string, amount: number) => void;
  sellPlayer: () => void;
  passPlayer: () => void;
  resetAuction: () => void;
  deletePlayer: (playerId: string) => void;
  updateTeam: (teamId: string, updates: Partial<{name: string, shortName: string, logoUrl: string, primaryColor: string}>) => Promise<void>;
  updateValuationMode: (mode: AuctionValueMode) => Promise<void>;
}

const AuctionContext = createContext<AuctionContextType | undefined>(undefined);
const AUCTION_MODE_STORAGE_KEY = 'vpl-auction-mode';

export const AuctionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sets, setSets] = useState<AuctionSet[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [auctionState, setAuctionState] = useState<any>(null);
  const [bidHistory, setBidHistory] = useState<Bid[]>([]);
  const [teamOverrides, setTeamOverrides] = useState<TeamOverride[]>([]);
  const [isBootstrapped, setIsBootstrapped] = useState(false);
  const [valuationMode, setValuationMode] = useState<AuctionValueMode>(() => {
    if (typeof window === 'undefined') return 'currency';
    const storedMode = window.localStorage.getItem(AUCTION_MODE_STORAGE_KEY);
    return storedMode === 'points' ? 'points' : 'currency';
  });

  // Derived State
  const teams = useMemo(() => {
    const teamBudget = getAuctionBudget(valuationMode);
    return INITIAL_TEAMS.map(team => {
      const override = teamOverrides.find(o => o.team_id === team.id);
      const teamPlayers = players
        .filter(p => p.teamId === team.id)
        .sort((a, b) => {
          const captainDelta = Number(isCaptain(b)) - Number(isCaptain(a));
          if (captainDelta !== 0) return captainDelta;
          return a.name.localeCompare(b.name);
        });
      const spent = teamPlayers.reduce((sum, p) => sum + (p.soldPrice || 0), 0);
      return {
        ...team,
        name: override?.name || team.name,
        shortName: override?.short_name || team.shortName,
        logoUrl: override?.logo_url || team.logoUrl,
        primaryColor: override?.primary_color || team.primaryColor,
        totalPurse: teamBudget,
        remainingPurse: teamBudget - spent,
        squad: teamPlayers
      };
    });
  }, [players, teamOverrides, valuationMode]);

  const currentPlayer = useMemo(() => {
    if (!auctionState?.current_player_id) return null;
    return players.find(p => p.id === auctionState.current_player_id) || null;
  }, [players, auctionState]);

  const currentBid = auctionState?.current_bid || 0;
  const currentBidTeamId = auctionState?.current_bidder_team_id || null;

  // Initial Fetch & Realtime Subscription
  useEffect(() => {
    const bootstrap = async () => {
      await Promise.all([
        fetchInitialData(),
        fetchTeamOverrides(),
        fetchAuctionSettings()
      ]);
      setIsBootstrapped(true);
    };

    bootstrap();

    // Subscribe to Players changes
    const playerSub = supabase
      .channel('public:players')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'players' }, (payload) => {
        if (payload.eventType === 'UPDATE') {
          // KEY FIX: Transform the raw DB row (snake_case) to our Player object (camelCase)
          const updatedPlayer = transformPlayerFromDB(payload.new);
          setPlayers(prev => prev.map(p => p.id === payload.new.id ? updatedPlayer : p));
        } else if (payload.eventType === 'INSERT') {
          const newPlayer = transformPlayerFromDB(payload.new);
          setPlayers(prev => [...prev, newPlayer]);
        } else if (payload.eventType === 'DELETE') {
          setPlayers(prev => prev.filter(p => p.id !== payload.old.id));
        }
      })
      .subscribe();



    // Subscribe to Sets changes
    const setsSub = supabase
      .channel('public:auction_sets')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'auction_sets' }, (payload) => {
          if (payload.eventType === 'INSERT') {
             setSets(prev => [...prev, payload.new as AuctionSet].sort((a,b) => (a.display_order||0) - (b.display_order||0)));
          } else if (payload.eventType === 'UPDATE') {
             setSets(prev => prev.map(s => s.id === payload.new.id ? payload.new as AuctionSet : s).sort((a,b) => (a.display_order||0) - (b.display_order||0)));
          }
       })
      .subscribe();

    // Subscribe to Auction State changes
    const auctionSub = supabase
      .channel('public:auction_state')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'auction_state' }, (payload) => {
        if (payload.eventType === 'UPDATE') {
          setAuctionState(payload.new);
          // If the player changed, reset bid history
          if (payload.old && payload.new.current_player_id !== payload.old.current_player_id) {
             setBidHistory([]);
          }
           // Add to bid history purely on client side for now (transient)
           if (payload.new.current_bid > (payload.old?.current_bid || 0)) {
               setBidHistory(prev => [{ 
                   teamId: payload.new.current_bidder_team_id, 
                   amount: payload.new.current_bid, 
                   timestamp: Date.now() 
               }, ...prev]);
           }
        }
      })
      .subscribe();

    // Subscribe to team_overrides changes
    const teamOverrideSub = supabase
      .channel('public:team_overrides')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'team_overrides' }, (payload) => {
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
              setTeamOverrides(prev => {
                  const idx = prev.findIndex(o => o.team_id === payload.new.team_id);
                  if (idx >= 0) {
                      const updated = [...prev];
                      updated[idx] = payload.new as TeamOverride;
                      return updated;
                  }
                  return [...prev, payload.new as TeamOverride];
              });
          }
      })
      .subscribe();

    const auctionSettingsSub = supabase
      .channel('public:auction_settings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'auction_settings' }, (payload) => {
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          const mode = payload.new.valuation_mode === 'points' ? 'points' : 'currency';
          setValuationMode(mode);
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(AUCTION_MODE_STORAGE_KEY, mode);
          }
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(playerSub);
      supabase.removeChannel(setsSub);
      supabase.removeChannel(auctionSub);
      supabase.removeChannel(teamOverrideSub);
      supabase.removeChannel(auctionSettingsSub);
    };
  }, []);

  const fetchInitialData = async (attempt = 1): Promise<void> => {
    try {
      const { data: playersData, error } = await supabase.from('players').select('*').order('set_no', { ascending: true });
      
      if (error) {
          // Retry on AbortError
          if (error.message?.includes('AbortError') || error.message?.includes('aborted')) {
            if (attempt < 3) {
              console.log(`[Auction] Retrying fetch (attempt ${attempt + 1}/3)...`);
              await new Promise(r => setTimeout(r, 500));
              return fetchInitialData(attempt + 1);
            }
          }
          console.error("Error fetching players:", error);
          return;
      }

      if (playersData) {
          const sorted_players = playersData.map(transformPlayerFromDB).sort((a, b) => {
              if (a.set !== b.set) return a.set - b.set;
              const getNum = (str: string) => parseInt(str.split('-')[1] || '0');
              return getNum(a.id) - getNum(b.id);
          });
          setPlayers(sorted_players);
      }

      const { data: auctionData } = await supabase.from('auction_state').select('*').single();
      if (auctionData) setAuctionState(auctionData);

      const { data: setsData } = await supabase.from('auction_sets').select('*').order('display_order', { ascending: true });
      if (setsData) {
          setSets(setsData);
      }
    } catch (err: any) {
      if (err?.name === 'AbortError' && attempt < 3) {
        console.log(`[Auction] Retrying after AbortError (attempt ${attempt + 1}/3)...`);
        await new Promise(r => setTimeout(r, 500));
        return fetchInitialData(attempt + 1);
      }
      console.error('[Auction] fetchInitialData failed:', err);
    }
  };
  
  // Helper to map DB casing if needed (assuming DB uses camelCase or consistent, but verify keys)
  // Our SQL used snake_case for image_url, etc. Types use camelCase.
  const transformPlayerFromDB = (p: any): Player => ({
      ...p,
      basePrice: p.base_price,
      soldPrice: p.sold_price,
      teamId: p.team_id,
      imageUrl: p.image_url,
      set: p.set_no,
      updatedAt: p.updated_at,
      displayOrder: p.display_order,
      // stats already jsonb so matches object
  });

  // Actions
  const reorderSets = async (orderedSets: AuctionSet[]) => {
      // Build array of {id, name, display_order} to satisfy NOT NULL 'name' constraint during upsert
      const updates = orderedSets.map((set, index) => ({
          id: set.id,
          name: set.name,
          display_order: index + 1 // 1-indexed for clarity
      }));

      // Upsert into auction_sets table
      const { error } = await supabase.from('auction_sets').upsert(updates);
      if (error) {
          console.error("Error reordering sets:", error);
          alert("Error reordering sets: " + error.message);
      }
  };

  const addPlayer = async (player: Player) => {
     // Admin only - insert to DB
     const { error } = await supabase.from('players').insert({
         id: player.id,
         name: player.name,
         country: player.country,
         role: player.role,
         base_price: player.basePrice,
         set_no: player.set,
         stats: player.stats,
         image_url: player.imageUrl,
         status: 'UNSOLD'
     });
     
     if (error) {
         alert("Error adding player: " + error.message);
     }
  };

  const updatePlayer = async (player: Player) => {
      const isSold = player.status === PlayerStatus.SOLD;
      const { error } = await supabase.from('players').update({
          name: player.name,
          country: player.country,
          role: player.role,
          base_price: player.basePrice,
          set_no: player.set,
          stats: player.stats,
          image_url: player.imageUrl,
          status: player.status,
          sold_price: isSold ? (player.soldPrice || 0) : 0,
          team_id: isSold ? (player.teamId || null) : null,
          updated_at: new Date().toISOString()
      }).eq('id', player.id);

      if (error) {
          alert("Error updating player: " + error.message);
      } else {
          if (auctionState?.current_player_id === player.id && player.status !== PlayerStatus.ON_AUCTION) {
              const { error: auctionError } = await supabase.from('auction_state').update({
                  current_player_id: null,
                  status: 'waiting',
                  current_bid: 0,
                  current_bidder_team_id: null
              }).eq('id', 1);

              if (auctionError) {
                  alert("Player updated, but failed to reset live auction state: " + auctionError.message);
                  return;
              }
          }

          alert("Player updated successfully!");
      }
  };

  const deletePlayer = async (playerId: string) => {
      const { error } = await supabase.from('players').delete().eq('id', playerId);

      if (error) {
          alert("Error deleting player: " + error.message);
      } else {
          // Optimistically remove from state or rely on realtime subscription
          // The insert/update subscriptions handled array changes, but delete needs one too
          // However, our realtime 'postgres_changes' listener for event '*' covers DELETE.
          // Let's check that logic.
          // Correct, lines 59-68 handle UPDATE and INSERT. We need to handle DELETE there too.
          // For now, let's just alert.
          alert("Player deleted successfully!");
      }
  };

  const startAuction = async (playerId: string) => {
      const player = players.find(p => p.id === playerId);
      if (!player) {
          alert("Player not found!");
          return;
      }
      
      // Update Player status
      const { error: playerError } = await supabase
          .from('players')
          .update({ status: PlayerStatus.ON_AUCTION })
          .eq('id', playerId);
      
      if (playerError) {
          alert("Failed to update player: " + playerError.message);
          return;
      }
      
      // Update Auction State - use UPSERT to handle missing row
      const { error: auctionError } = await supabase
          .from('auction_state')
          .upsert({
              id: 1,
              current_player_id: playerId,
              status: 'bidding',
              current_bid: player.basePrice,
              current_bidder_team_id: null
          }, { onConflict: 'id' });

      if (auctionError) {
          alert("Failed to start auction: " + auctionError.message);
          return;
      }
      
      setBidHistory([]);
  };

  const placeBid = async (teamId: string | null, amount: number) => {
    if (teamId) {
        const team = teams.find(t => t.id === teamId);
        if (!team) return;
        if (amount > team.remainingPurse) {
          alert(`Insufficient funds! ${team.name} only has ${team.remainingPurse}`);
          return; // Do not proceed
        }
    }
    
    // Optimistic check? Server will just process it. Admin is the one clicking anyway.
    await supabase.from('auction_state').update({
        current_bid: amount,
        current_bidder_team_id: teamId
    }).eq('id', 1);
  };

  const sellPlayer = async (buyerTeamId?: string) => {
    if (!currentPlayer) return;
    
    const finalTeamId = buyerTeamId || currentBidTeamId;
    
    if (!finalTeamId) {
        alert("No team selected to sell to!");
        return;
    }
    
    // Final purse check just in case
    const buyingTeam = teams.find(t => t.id === finalTeamId);
    if (buyingTeam && buyingTeam.remainingPurse < currentBid) {
         if(!confirm(`WARNING: ${buyingTeam.name} has only ${buyingTeam.remainingPurse} but bid is ${currentBid}. Proceed?`)) {
             return;
         }
    }

    // 1. Update Player (Persistence)
    // TeamID and SoldPrice are stored in player row
    await supabase.from('players').update({
        status: PlayerStatus.SOLD,
        sold_price: currentBid,
        team_id: finalTeamId
    }).eq('id', currentPlayer.id);

    // 2. Reset Auction State
    await supabase.from('auction_state').update({
        current_player_id: null,
        status: 'waiting',
        current_bid: 0,
        current_bidder_team_id: null
    }).eq('id', 1);
  };

  const passPlayer = async () => {
    if (!currentPlayer) return;

    await supabase.from('players').update({ status: PlayerStatus.PASSED }).eq('id', currentPlayer.id);
    
    await supabase.from('auction_state').update({
        current_player_id: null,
        status: 'waiting',
        current_bid: 0,
        current_bidder_team_id: null
    }).eq('id', 1);
  };

  const resetAuction = async () => {
      if(confirm("DANGER: Reset all auction data?")) {
          // Reset all players
          await supabase.from('players').update({
              status: 'UNSOLD',
              sold_price: 0,
              team_id: null
          }).neq('id', 'placeholder'); // Update all

          // Reset State
          await supabase.from('auction_state').update({
            current_player_id: null,
            status: 'waiting',
            current_bid: 0,
            current_bidder_team_id: null
        }).eq('id', 1);
      }
  }

  const createSet = async (name: string) => {
    // Generate next display order
    const nextOrder = sets.length > 0 ? Math.max(...sets.map(s => s.display_order || 0)) + 1 : 0;
    
    // Check collision on ID
    // We let Serial handle ID, but displaying might need reload if realtime fails/is slow
    const { error } = await supabase.from('auction_sets').insert({
        name,
        display_order: nextOrder
    });

    if (error) alert("Error creating set: " + error.message);
  };

  const updatePlayerSet = async (playerId: string, setId: number) => {
      const { error } = await supabase.from('players').update({
          set_no: setId,
          updated_at: new Date().toISOString()
      }).eq('id', playerId);

      if(error) alert("Error moving player: " + error.message);
  }

  const fetchTeamOverrides = async () => {
      const { data, error } = await supabase.from('team_overrides').select('*');
      if (!error && data) setTeamOverrides(data as TeamOverride[]);
  };

  const fetchAuctionSettings = async () => {
      const { data, error } = await supabase
          .from('auction_settings')
          .select('valuation_mode')
          .eq('id', 1)
          .maybeSingle();

      if (!error && data?.valuation_mode) {
          const mode = data.valuation_mode === 'points' ? 'points' : 'currency';
          setValuationMode(mode);
          if (typeof window !== 'undefined') {
              window.localStorage.setItem(AUCTION_MODE_STORAGE_KEY, mode);
          }
      }
  };

  const updateValuationMode = async (mode: AuctionValueMode) => {
      setValuationMode(mode);
      if (typeof window !== 'undefined') {
          window.localStorage.setItem(AUCTION_MODE_STORAGE_KEY, mode);
      }

      const { error } = await supabase.from('auction_settings').upsert({
          id: 1,
          valuation_mode: mode,
          updated_at: new Date().toISOString()
      });

      if (error) {
          console.warn('Failed to persist auction mode, using local storage fallback:', error.message);
      }
  };

  const updateTeam = async (teamId: string, updates: Partial<{name: string, shortName: string, logoUrl: string, primaryColor: string}>) => {
      const dbUpdates: any = { updated_at: new Date().toISOString() };
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.shortName !== undefined) dbUpdates.short_name = updates.shortName;
      if (updates.logoUrl !== undefined) dbUpdates.logo_url = updates.logoUrl;
      if (updates.primaryColor !== undefined) dbUpdates.primary_color = updates.primaryColor;

      const { error } = await supabase.from('team_overrides').upsert({
          team_id: teamId,
          ...dbUpdates
      });

      if (error) {
          alert('Error updating team: ' + error.message);
      }
  }

  return (
    <AuctionContext.Provider value={{
      teams,
      players,
      valuationMode,
      currentPlayer,
      currentBid,
      currentBidTeamId,
      bidHistory,
      sets,
      createSet,
      reorderSets,
      updatePlayerSet,
      addPlayer,
      updatePlayer,
      startAuction,
      placeBid,
      sellPlayer,
      passPlayer,
      resetAuction,
      deletePlayer,
      updateTeam,
      updateValuationMode
    }}>
      {isBootstrapped ? children : null}
    </AuctionContext.Provider>
  );
};

export const useAuction = () => {
  const context = useContext(AuctionContext);
  if (context === undefined) {
    throw new Error('useAuction must be used within an AuctionProvider');
  }
  return context;
};
