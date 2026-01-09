import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Player, Team, Bid, PlayerStatus } from '../types';
import { INITIAL_TEAMS } from '../constants';

interface AuctionContextType {
  teams: Team[];
  players: Player[];
  currentPlayer: Player | null;
  currentBid: number;
  currentBidTeamId: string | null;
  bidHistory: Bid[];
  
  // Admin Actions
  addPlayer: (player: Player) => void;
  updatePlayer: (player: Player) => void;
  startAuction: (playerId: string) => void;
  placeBid: (teamId: string, amount: number) => void;
  sellPlayer: () => void;
  passPlayer: () => void;
  resetAuction: () => void;
}

const AuctionContext = createContext<AuctionContextType | undefined>(undefined);

export const AuctionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [auctionState, setAuctionState] = useState<any>(null);
  const [bidHistory, setBidHistory] = useState<Bid[]>([]);

  // Derived State
  const teams = useMemo(() => {
    return INITIAL_TEAMS.map(team => {
      const teamPlayers = players.filter(p => p.teamId === team.id);
      const spent = teamPlayers.reduce((sum, p) => sum + (p.soldPrice || 0), 0);
      return {
        ...team,
        remainingPurse: team.totalPurse - spent,
        squad: teamPlayers
      };
    });
  }, [players]);

  const currentPlayer = useMemo(() => {
    if (!auctionState?.current_player_id) return null;
    return players.find(p => p.id === auctionState.current_player_id) || null;
  }, [players, auctionState]);

  const currentBid = auctionState?.current_bid || 0;
  const currentBidTeamId = auctionState?.current_bidder_team_id || null;

  // Initial Fetch & Realtime Subscription
  useEffect(() => {
    fetchInitialData();

    // Subscribe to Players changes
    const playerSub = supabase
      .channel('public:players')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'players' }, (payload) => {
        if (payload.eventType === 'UPDATE') {
          setPlayers(prev => prev.map(p => p.id === payload.new.id ? { ...p, ...payload.new } : p));
        } else if (payload.eventType === 'INSERT') {
          setPlayers(prev => [...prev, payload.new as Player]);
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

    return () => {
      supabase.removeChannel(playerSub);
      supabase.removeChannel(auctionSub);
    };
  }, []);

  const fetchInitialData = async () => {
    const { data: playersData, error } = await supabase.from('players').select('*').order('set_no', { ascending: true });
    
    if (error) {
        console.error("Error fetching players:", error);
        return;
    }

    if (playersData) {
        // Sort specifically by the ID suffix (s1-2 vs s1-10) to keep original order
        const sorted_players = playersData.map(transformPlayerFromDB).sort((a, b) => {
            if (a.set !== b.set) return a.set - b.set;
            // Parse "s1-2" -> 2, "s1-10" -> 10
            const getNum = (str: string) => parseInt(str.split('-')[1] || '0');
            return getNum(a.id) - getNum(b.id);
        });
        setPlayers(sorted_players);
    }

    const { data: auctionData } = await supabase.from('auction_state').select('*').single();
    if (auctionData) setAuctionState(auctionData);
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
      // stats already jsonb so matches object
  });

  // Actions
  const addPlayer = async (player: Player) => {
     // Admin only - insert to DB
     // (Using snake_case for DB)
     await supabase.from('players').insert({
         id: player.id,
         name: player.name,
         country: player.country,
         role: player.role,
         base_price: player.basePrice,
         set_no: player.set,
         stats: player.stats,
         status: 'UNSOLD'
     });
  };

  const updatePlayer = async (player: Player) => {
      await supabase.from('players').update({
          name: player.name,
          country: player.country,
          // ... other fields
      }).eq('id', player.id);
  };

  const startAuction = async (playerId: string) => {
      console.log("Starting auction for:", playerId);
      
      // 1. Update Player status
      const { error: playerError } = await supabase.from('players').update({ status: PlayerStatus.ON_AUCTION }).eq('id', playerId);
      if (playerError) {
          alert("Error updating player status: " + playerError.message);
          return;
      }
      
      // 2. Update Auction State
      const player = players.find(p => p.id === playerId);
      const { error: auctionError } = await supabase.from('auction_state').update({
          current_player_id: playerId,
          status: 'bidding',
          current_bid: player?.basePrice || 0,
          current_bidder_team_id: null
      }).eq('id', 1);

      if (auctionError) {
          alert("Error starting auction: " + auctionError.message);
      } else {
          setBidHistory([]);
      }
  };

  const placeBid = async (teamId: string, amount: number) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return;
    if (amount > team.remainingPurse) {
      alert(`Insufficient funds! ${team.name} only has ${team.remainingPurse}`);
      return; // Do not proceed
    }
    
    // Optimistic check? Server will just process it. Admin is the one clicking anyway.
    await supabase.from('auction_state').update({
        current_bid: amount,
        current_bidder_team_id: teamId
    }).eq('id', 1);
  };

  const sellPlayer = async () => {
    if (!currentPlayer || !currentBidTeamId) return;

    // 1. Update Player (Persistence)
    // TeamID and SoldPrice are stored in player row
    await supabase.from('players').update({
        status: PlayerStatus.SOLD,
        sold_price: currentBid,
        team_id: currentBidTeamId
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

  return (
    <AuctionContext.Provider value={{
      teams,
      players,
      currentPlayer,
      currentBid,
      currentBidTeamId,
      bidHistory,
      addPlayer,
      updatePlayer,
      startAuction,
      placeBid,
      sellPlayer,
      passPlayer,
      resetAuction
    }}>
      {children}
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