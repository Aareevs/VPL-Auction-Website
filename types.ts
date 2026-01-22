// ... (existing types)

export enum PlayerStatus {
  UNSOLD = 'UNSOLD',
  ON_AUCTION = 'ON_AUCTION',
  SOLD = 'SOLD',
  PASSED = 'PASSED' // Unsold after auction attempt
}

export interface Player {
  id: string;
  name: string;
  role: string;
  country: string;
  basePrice: number;
  status: PlayerStatus;
  set: number; // Added set number
  soldPrice?: number;
  teamId?: string;
  imageUrl?: string;
  stats: {
    matches: number;
    runs: number;
    avg: number;
    strikeRate: number;
    age: number;
    wickets?: number;
    economy?: number;
    highScore?: string;
    bestBowling?: string;
  };
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  primaryColor: string;
  secondaryColor: string;
  totalPurse: number;
  remainingPurse: number;
  squad: Player[];
  logoUrl?: string;
}

export interface Bid {
  teamId: string;
  amount: number;
  timestamp: number;
}

export interface AuctionSet {
  id: number;
  name: string;
  display_order?: number;
}