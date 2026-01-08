import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Player, Team, Bid, PlayerStatus } from '../types';
import { INITIAL_PLAYERS, INITIAL_TEAMS } from '../constants';

interface AuctionContextType {
  teams: Team[];
  players: Player[];
  currentPlayer: Player | null;
  currentBid: number;
  currentBidTeamId: string | null;
  bidHistory: Bid[];
  
  // Admin Actions
  addPlayer: (player: Player) => void;
  updatePlayer: (player: Player) => void; // Added updatePlayer
  startAuction: (playerId: string) => void;
  placeBid: (teamId: string, amount: number) => void;
  sellPlayer: () => void;
  passPlayer: () => void;
  resetAuction: () => void;
}

const AuctionContext = createContext<AuctionContextType | undefined>(undefined);

export const AuctionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
  
  // Auction State
  const [currentPlayerId, setCurrentPlayerId] = useState<string | null>(null);
  const [currentBid, setCurrentBid] = useState<number>(0);
  const [currentBidTeamId, setCurrentBidTeamId] = useState<string | null>(null);
  const [bidHistory, setBidHistory] = useState<Bid[]>([]);

  const currentPlayer = players.find(p => p.id === currentPlayerId) || null;

  const addPlayer = (player: Player) => {
    setPlayers(prev => [...prev, player]);
  };

  const updatePlayer = (updatedPlayer: Player) => {
    setPlayers(prev => prev.map(p => p.id === updatedPlayer.id ? updatedPlayer : p));
  };

  const startAuction = (playerId: string) => {
    const player = players.find(p => p.id === playerId);
    if (!player) return;
    
    // Reset auction state
    setCurrentPlayerId(playerId);
    setCurrentBid(player.basePrice);
    setCurrentBidTeamId(null);
    setBidHistory([]);

    // Update player status
    setPlayers(prev => prev.map(p => p.id === playerId ? { ...p, status: PlayerStatus.ON_AUCTION } : p));
  };

  const placeBid = (teamId: string, amount: number) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return;
    if (amount > team.remainingPurse) {
      alert(`Insufficient funds! ${team.name} only has ${team.remainingPurse}`);
      return;
    }
    if (amount <= currentBid && currentBidTeamId !== null) {
      // Allow starting bid if no one has bid yet
       if (currentBidTeamId === null && amount === currentBid) {
         // allow
       } else {
         alert("Bid must be higher than current bid");
         return;
       }
    }

    setCurrentBid(amount);
    setCurrentBidTeamId(teamId);
    setBidHistory(prev => [{ teamId, amount, timestamp: Date.now() }, ...prev]);
  };

  const sellPlayer = () => {
    if (!currentPlayer || !currentBidTeamId) return;

    // Deduct money from team
    setTeams(prevTeams => prevTeams.map(team => {
      if (team.id === currentBidTeamId) {
        return {
          ...team,
          remainingPurse: team.remainingPurse - currentBid,
          squad: [...team.squad, { ...currentPlayer, soldPrice: currentBid, status: PlayerStatus.SOLD, teamId: currentBidTeamId }]
        };
      }
      return team;
    }));

    // Update player status in global list
    setPlayers(prevPlayers => prevPlayers.map(p => {
      if (p.id === currentPlayer.id) {
        return {
          ...p,
          status: PlayerStatus.SOLD,
          soldPrice: currentBid,
          teamId: currentBidTeamId
        };
      }
      return p;
    }));

    // Reset auction state
    setCurrentPlayerId(null);
    setCurrentBid(0);
    setCurrentBidTeamId(null);
    setBidHistory([]);
  };

  const passPlayer = () => {
    if (!currentPlayer) return;

    setPlayers(prevPlayers => prevPlayers.map(p => {
      if (p.id === currentPlayer.id) {
        return { ...p, status: PlayerStatus.PASSED };
      }
      return p;
    }));

    setCurrentPlayerId(null);
    setCurrentBid(0);
    setCurrentBidTeamId(null);
    setBidHistory([]);
  };
  
  const resetAuction = () => {
      // Optional: Reset everything for demo
      if(confirm("Are you sure you want to reset all data?")) {
        setTeams(INITIAL_TEAMS);
        setPlayers(INITIAL_PLAYERS);
        setCurrentPlayerId(null);
        setCurrentBid(0);
        setCurrentBidTeamId(null);
        setBidHistory([]);
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