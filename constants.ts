import { Player, PlayerStatus, Team } from './types';

export const INITIAL_PURSE = 10000; // 100 Crores

export const INITIAL_TEAMS: Team[] = [
  {
    id: 't1',
    name: 'Chennai Super Kings',
    shortName: 'CSK',
    primaryColor: '#F9CD05', // CSK Yellow
    secondaryColor: '#005FAC', // CSK Blue
    totalPurse: INITIAL_PURSE,
    remainingPurse: INITIAL_PURSE,
    squad: [],
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/2/2b/Chennai_Super_Kings_Logo.svg'
  },
  {
    id: 't2',
    name: 'Mumbai Indians',
    shortName: 'MI',
    primaryColor: '#004BA0', // MI Blue
    secondaryColor: '#D1AB3E', // MI Gold
    totalPurse: INITIAL_PURSE,
    remainingPurse: INITIAL_PURSE,
    squad: [],
    logoUrl: 'https://a.espncdn.com/combiner/i?img=%2Fi%2Fteamlogos%2Fcricket%2F500%2F335978.png'
  },
  {
    id: 't3',
    name: 'Royal Challengers Bangalore',
    shortName: 'RCB',
    primaryColor: '#EC1C24', // RCB Red
    secondaryColor: '#2B2A29', // RCB Black/Gold
    totalPurse: INITIAL_PURSE,
    remainingPurse: INITIAL_PURSE,
    squad: [],
// RCB
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d4/Royal_Challengers_Bengaluru_Logo.svg/250px-Royal_Challengers_Bengaluru_Logo.svg.png'
  },
  {
    id: 't4',
    name: 'Kolkata Knight Riders',
    shortName: 'KKR',
    primaryColor: '#2E0854', // KKR Purple
    secondaryColor: '#B3A123', // KKR Gold
    totalPurse: INITIAL_PURSE,
    remainingPurse: INITIAL_PURSE,
    squad: [],
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/4/4c/Kolkata_Knight_Riders_Logo.svg'
  },
  {
    id: 't5',
    name: 'Sunrisers Hyderabad',
    shortName: 'SRH',
    primaryColor: '#F7A721', // SRH Orange
    secondaryColor: '#000000', // Black
    totalPurse: INITIAL_PURSE,
    remainingPurse: INITIAL_PURSE,
    squad: [],
    // SRH
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/5/51/Sunrisers_Hyderabad_Logo.svg'
  },
  {
    id: 't6',
    name: 'Delhi Capitals',
    shortName: 'DC',
    primaryColor: '#17479E', // DC Blue
    secondaryColor: '#DC333E', // DC Red
    totalPurse: INITIAL_PURSE,
    remainingPurse: INITIAL_PURSE,
    squad: [],
    // DC
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/2/2f/Delhi_Capitals.svg'
  },
  {
    id: 't7',
    name: 'Rajasthan Royals',
    shortName: 'RR',
    primaryColor: '#EA1A85', // RR Pink
    secondaryColor: '#254AA5', // RR Blue
    totalPurse: INITIAL_PURSE,
    remainingPurse: INITIAL_PURSE,
    squad: [],
    logoUrl: 'https://img1.hscicdn.com/image/upload/f_auto/lsci/db/PICTURES/CMS/400400/400406.png'
  },
  {
    id: 't8',
    name: 'Punjab Kings',
    shortName: 'PBKS',
    primaryColor: '#DD1F2D', // PBKS Red
    secondaryColor: '#A7A9AC', // Silver
    totalPurse: INITIAL_PURSE,
    remainingPurse: INITIAL_PURSE,
    squad: [],
    // PBKS
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/d/d4/Punjab_Kings_Logo.svg'
  },
  {
    id: 't9',
    name: 'Lucknow Super Giants',
    shortName: 'LSG',
    primaryColor: '#0084CA', // LSG Cyan/Blue
    secondaryColor: '#A6A8AB', // Grey
    totalPurse: INITIAL_PURSE,
    remainingPurse: INITIAL_PURSE,
    squad: [],
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a9/Lucknow_Super_Giants_IPL_Logo.svg'
  },
  {
    id: 't10',
    name: 'Gujarat Titans',
    shortName: 'GT',
    primaryColor: '#1B2133', // GT Dark Blue
    secondaryColor: '#BCA05E', // Gold
    totalPurse: INITIAL_PURSE,
    remainingPurse: INITIAL_PURSE,
    squad: [],
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/0/09/Gujarat_Titans_Logo.svg'
  },
  {
    id: 't11',
    name: 'Dragon Defenders',
    shortName: 'DD',
    primaryColor: '#c2410c', // Orange 700
    secondaryColor: '#fed7aa', // Orange 200
    totalPurse: INITIAL_PURSE,
    remainingPurse: INITIAL_PURSE,
    squad: [],
  },
  {
    id: 't12',
    name: 'Warrior Wolves',
    shortName: 'WW',
    primaryColor: '#4338ca', // Indigo 700
    secondaryColor: '#c7d2fe', // Indigo 200
    totalPurse: INITIAL_PURSE,
    remainingPurse: INITIAL_PURSE,
    squad: [],
  }
];

// Helper for stats
const s = (matches: number, runs: number, highScore: string, wickets: number = 0, bestBowling: string = '', avg: number = 0, strikeRate: number = 0) => ({
    matches,
    runs,
    highScore,
    wickets,
    bestBowling,
    avg,
    strikeRate,
    economy: 0,
    age: 0
});

// Helper for bowler stats
const b = (matches: number, wickets: number, bestBowling: string) => ({
    matches,
    runs: 0,
    highScore: '',
    wickets,
    bestBowling,
    avg: 0,
    strikeRate: 0,
    economy: 0,
    age: 0
});

export const SET_NAMES: Record<number, string> = {
  0: "Tier 1",
  1: "Overseas Capped Batters I",
  2: "Indian Capped Batters",
  3: "All Rounders I",
  4: "Capped Indian Bowlers I",
  5: "Capped Overseas Bowlers I",
  6: "Wicketkeeper Batsman I",
  7: "Uncapped Batsman I",
  8: "All Rounders II",
  9: "Retired Bowlers",
  10: "Legends Batsman",
  11: "Legends All Rounders",
  12: "Legends Bowlers",
  13: "Uncapped Indian Batsman II",
  14: "Indian Batsman II"
};

export const INITIAL_PLAYERS: Player[] = [
  // SET 0 - Tier 1
  { id: 't1-1', set: 0, name: 'Dewald Brevis', country: 'South Africa', role: 'Middle Order Batsman', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(115, 2696, '162') },
  { id: 't1-2', set: 0, name: 'Mitchell Marsh', country: 'Australia', role: 'All Rounder', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(222, 5633, '117', 85, '4/6') },
  { id: 't1-3', set: 0, name: 'Phil Salt', country: 'England', role: 'Wicketkeeper Batter', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(322, 8135, '141*') },
  { id: 't1-4', set: 0, name: 'Tilak Verma', country: 'India', role: 'Top Order Batter', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(134, 4092, '151') },
  { id: 't1-5', set: 0, name: 'Varun Chakravarthy', country: 'India', role: 'Legbreak Googly', basePrice: 200, status: PlayerStatus.UNSOLD, stats: b(138, 179, '5/17') },
  { id: 't1-6', set: 0, name: 'Mitchell Starc', country: 'Australia', role: 'Left Arm Fast', basePrice: 200, status: PlayerStatus.UNSOLD, stats: b(153, 207, '5/35') },
  { id: 't1-7', set: 0, name: 'KL Rahul', country: 'India', role: 'Wicketkeeper Batter', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(239, 8125, '132*') },
  { id: 't1-8', set: 0, name: 'Marco Jansen', country: 'South Africa', role: 'All Rounder', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(123, 1040, '71*', 139, '5/30') },
  { id: 't1-9', set: 0, name: 'Shreyas Iyer', country: 'India', role: 'Top Order Batter', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(240, 6578, '147') },
  { id: 't1-10', set: 0, name: 'Matt Henry', country: 'New Zealand', role: 'Right Arm Fast Medium', basePrice: 200, status: PlayerStatus.UNSOLD, stats: b(174, 211, '5/18') },
  { id: 't1-11', set: 0, name: 'Mohammed Siraj', country: 'India', role: 'Right Arm Fast', basePrice: 200, status: PlayerStatus.UNSOLD, stats: b(160, 183, '4/17') },
  { id: 't1-12', set: 0, name: 'Sikandar Raza', country: 'Zimbabwe', role: 'All Rounder', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(334, 6775, '133*', 219, '5/18') },
  { id: 't1-13', set: 0, name: 'Travis Head', country: 'Australia', role: 'Opener Batsman', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(168, 4414, '102') },
  { id: 't1-14', set: 0, name: 'Rohit Sharma', country: 'India', role: 'Top Order Batsman', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(463, 12248, '121*') },
  { id: 't1-15', set: 0, name: 'Quinton De Kock', country: 'South Africa', role: 'Wicketkeeper Batter', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(421, 11734, '140*') },
  { id: 't1-16', set: 0, name: 'Josh Hazlewood', country: 'Australia', role: 'Right Arm Fast Medium', basePrice: 200, status: PlayerStatus.UNSOLD, stats: b(127, 170, '4/12') },
  { id: 't1-17', set: 0, name: 'Kuldeep Yadav', country: 'India', role: 'Left Arm Wrist Spin', basePrice: 200, status: PlayerStatus.UNSOLD, stats: b(185, 236, '5/17') },
  { id: 't1-18', set: 0, name: 'Dale Steyn', country: 'South Africa', role: 'Right Arm Fast', basePrice: 200, status: PlayerStatus.UNSOLD, stats: b(228, 263, '4/9') },
  { id: 't1-19', set: 0, name: 'Jasprit Bumrah', country: 'India', role: 'Right Arm Fast', basePrice: 200, status: PlayerStatus.UNSOLD, stats: b(258, 327, '5/10') },
  { id: 't1-20', set: 0, name: 'Hardik Pandya', country: 'India', role: 'All Rounder', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(314, 5852, '91', 213, '5/36') },
  { id: 't1-21', set: 0, name: 'Jos Buttler', country: 'England', role: 'Wicketkeeper Batter', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(477, 13554, '124') },
  { id: 't1-22', set: 0, name: 'Abhishek Sharma', country: 'India', role: 'Opener Batsman', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(168, 4918, '148') },
  { id: 't1-23', set: 0, name: 'Axar Patel', country: 'India', role: 'All Rounder', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(300, 3497, '70*', 255, '4/21') },
  { id: 't1-24', set: 0, name: 'Arshdeep Singh', country: 'India', role: 'Left Arm Medium Fast', basePrice: 200, status: PlayerStatus.UNSOLD, stats: b(182, 239, '5/32') },
  { id: 't1-25', set: 0, name: 'Pat Cummins', country: 'Australia', role: 'All Rounder', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(171, 1001, '66*', 192, '4/16') },
  { id: 't1-26', set: 0, name: 'Sanju Samson', country: 'India', role: 'Wicketkeeper Batter', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(320, 8033, '119') },
  { id: 't1-27', set: 0, name: 'AB de Villiers', country: 'South Africa', role: 'Middle Order Batsman', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(340, 9424, '133*') },
  { id: 't1-28', set: 0, name: 'Adil Rashid', country: 'England', role: 'Legbreak', basePrice: 200, status: PlayerStatus.UNSOLD, stats: b(353, 394, '4/2') },
  { id: 't1-29', set: 0, name: 'Virat Kohli', country: 'India', role: 'Top Order Batsman', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(414, 13543, '122*') },
  { id: 't1-30', set: 0, name: 'Adam Zampa', country: 'Australia', role: 'Legbreak Googly', basePrice: 200, status: PlayerStatus.UNSOLD, stats: b(318, 393, '6/19') },
  { id: 't1-31', set: 0, name: 'Romario Shephard', country: 'West Indies', role: 'All Rounder', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(223, 2443, '73*', 206, '4/13') },
    
  // SET 1 - Overseas Capped Batters I
  { id: 's1-2', set: 1, name: 'Rovman Powell', country: 'West Indies', role: 'Middle Order Batsman', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(317, 5750, '107') },
  { id: 's1-3', set: 1, name: 'Harry Brook', country: 'England', role: 'Middle Order Batsman', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(166, 3890, '105*') },
  { id: 's1-5', set: 1, name: 'David Miller', country: 'South Africa', role: 'Middle Order Batsman', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(543, 11612, '120*') },
  { id: 's1-6', set: 1, name: 'Kane Williamson', country: 'New Zealand', role: 'Top Order Batter', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(288, 7351, '101*') },
  { id: 's1-7', set: 1, name: 'Reeza Hendricks', country: 'South Africa', role: 'Opener Batsman', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(291, 8169, '117') },
  { id: 's1-8', set: 1, name: 'Tim David', country: 'Australia', role: 'Middle Order Batsman', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(313, 6136, '102*') },
  { id: 's1-9', set: 1, name: 'Aiden Markram', country: 'South Africa', role: 'Opener Batsman', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(210, 5154, '100') },
  { id: 's1-10', set: 1, name: 'Joe Root', country: 'England', role: 'Top Order Batter', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(129, 3062, '92*') },
  { id: 's1-11', set: 1, name: 'Ibrahim Zadran', country: 'Afghanistan', role: 'Opener Batsman', basePrice: 150, status: PlayerStatus.UNSOLD, stats: s(128, 3326, '101*') },
  { id: 's1-12', set: 1, name: 'Shimron Hetmyer', country: 'West Indies', role: 'Middle Order Batsman', basePrice: 150, status: PlayerStatus.UNSOLD, stats: s(309, 6053, '100') },
  { id: 's1-13', set: 1, name: 'Pathum Nissanka', country: 'Sri Lanka', role: 'Top Order Batter', basePrice: 150, status: PlayerStatus.UNSOLD, stats: s(155, 4310, '119') },
  { id: 's1-14', set: 1, name: 'Sherfane Rutherford', country: 'West Indies', role: 'Middle Order Batsman', basePrice: 150, status: PlayerStatus.UNSOLD, stats: s(232, 3868, '86') },
  { id: 's1-15', set: 1, name: 'Steve Smith', country: 'Australia', role: 'Top Order Batter', basePrice: 150, status: PlayerStatus.UNSOLD, stats: s(266, 5943, '125*') },

  // SET 2 - Indian Capped Batters
  { id: 's2-1', set: 2, name: 'Shubman Gill', country: 'India', role: 'Opener Batsman', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(175, 5412, '129') },
  { id: 's2-2', set: 2, name: 'Ruturaj Gaikwad', country: 'India', role: 'Opener Batsman', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(151, 5002, '123*') },
  { id: 's2-3', set: 2, name: 'Suryakumar Yadav', country: 'India', role: 'Top Order Batter', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(346, 8975, '117') },
  { id: 's2-5', set: 2, name: 'Rinku Singh', country: 'India', role: 'Middle Order Batsman', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(175, 3397, '79') },
  { id: 's2-8', set: 2, name: 'Yashasvi Jaiswal', country: 'India', role: 'Opener Batsman', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(121, 3682, '124') },
  { id: 's2-9', set: 2, name: 'Nitesh Rana', country: 'India', role: 'Middle Order Batsman', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(211, 5122, '107') },
  { id: 's2-10', set: 2, name: 'Venkatesh Iyer', country: 'India', role: 'Top Order Batsman', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(145, 3249, '104') },
  { id: 's2-11', set: 2, name: 'Devdutt Paddikal', country: 'India', role: 'Top Order Batsman', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(115, 3362, '124*') },
  { id: 's2-12', set: 2, name: 'Manish Pandey', country: 'India', role: 'Top Order Batsman', basePrice: 150, status: PlayerStatus.UNSOLD, stats: s(311, 7100, '129*') },
  { id: 's2-13', set: 2, name: 'Prithvi Shaw', country: 'India', role: 'Opener Batsman', basePrice: 150, status: PlayerStatus.UNSOLD, stats: s(124, 3085, '134') },
  { id: 's2-14', set: 2, name: 'Ajinkya Rahane', country: 'India', role: 'Top Order Batsman', basePrice: 150, status: PlayerStatus.UNSOLD, stats: s(294, 7633, '105*') },
  { id: 's2-15', set: 2, name: 'Rahul Tripathi', country: 'India', role: 'Top Order Batsman', basePrice: 100, status: PlayerStatus.UNSOLD, stats: s(172, 3807, '93') },

  // SET 3 - All Rounders I
  { id: 's3-4', set: 3, name: 'Mohammad Nabi', country: 'Afghanistan', role: 'All Rounder', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(473, 6833, '89', 402, '5/15') },
  { id: 's3-6', set: 3, name: 'Rachin Ravindra', country: 'New Zealand', role: 'All Rounder', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(116, 1922, '70', 65, '4/11') },
  { id: 's3-7', set: 3, name: 'Ravindra Jadeja', country: 'India', role: 'All Rounder', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(346, 3985, '77*', 235, '5/16') },
  { id: 's3-8', set: 3, name: 'Ben Stokes', country: 'England', role: 'All Rounder', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(162, 3027, '107*', 93, '4/16') },
  { id: 's3-9', set: 3, name: 'Glenn Phillips', country: 'New Zealand', role: 'All Rounder', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(272, 6924, '116*', 29, '3/6') },
  { id: 's3-11', set: 3, name: 'Glenn Maxwell', country: 'Australia', role: 'All Rounder', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(493, 10890, '154*', 195, '3/10') },
  { id: 's3-12', set: 3, name: 'Mitchell Santner', country: 'New Zealand', role: 'All Rounder', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(250, 2564, '92*', 253, '4/11') },
  { id: 's3-13', set: 3, name: 'Marcus Stoinis', country: 'Australia', role: 'All Rounder', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(353, 7073, '147*', 190, '4/15') },
  { id: 's3-14', set: 3, name: 'Will Jacks', country: 'England', role: 'All Rounder', basePrice: 150, status: PlayerStatus.UNSOLD, stats: s(240, 6120, '108*', 80, '4/15') },
  { id: 's3-15', set: 3, name: 'Krunal Pandya', country: 'India', role: 'All Rounder', basePrice: 150, status: PlayerStatus.UNSOLD, stats: s(228, 3017, '86', 165, '4/15') },

  // SET 4 - Capped Indian Bowlers I
  { id: 's4-1', set: 4, name: 'Bhuvneshwar Kumar', country: 'India', role: 'Right Arm Medium Pace', basePrice: 200, status: PlayerStatus.UNSOLD, stats: b(316, 335, '5/4') },
  { id: 's4-2', set: 4, name: 'Ravi Bishnoi', country: 'India', role: 'Legbreak Googly', basePrice: 200, status: PlayerStatus.UNSOLD, stats: b(166, 194, '4/13') },
  { id: 's4-3', set: 4, name: 'Thangarasu Natarajan', country: 'India', role: 'Left Arm Medium', basePrice: 200, status: PlayerStatus.UNSOLD, stats: b(103, 112, '4/19') },
  { id: 's4-5', set: 4, name: 'Yuzvendra Chahal', country: 'India', role: 'Legbreak Googly', basePrice: 200, status: PlayerStatus.UNSOLD, stats: b(329, 384, '6/25') },
  { id: 's4-8', set: 4, name: 'Mohammed Shami', country: 'India', role: 'Right Arm Fast', basePrice: 200, status: PlayerStatus.UNSOLD, stats: b(183, 226, '4/11') },
  { id: 's4-9', set: 4, name: 'Deepak Chahar', country: 'India', role: 'Right Arm Medium', basePrice: 200, status: PlayerStatus.UNSOLD, stats: b(166, 184, '6/7') },
  { id: 's4-12', set: 4, name: 'Mukesh Kumar', country: 'India', role: 'Right Arm Medium', basePrice: 150, status: PlayerStatus.UNSOLD, stats: b(80, 84, '4/22') },
  { id: 's4-13', set: 4, name: 'Harshit Rana', country: 'India', role: 'Right arm Fast', basePrice: 150, status: PlayerStatus.UNSOLD, stats: b(44, 50, '3/24') },
  { id: 's4-14', set: 4, name: 'Rahul Chahar', country: 'India', role: 'Legbreak Googly', basePrice: 150, status: PlayerStatus.UNSOLD, stats: b(140, 142, '5/14') },
  { id: 's4-15', set: 4, name: 'Shivam Mavi', country: 'India', role: 'Right Arm Fast Medium', basePrice: 100, status: PlayerStatus.UNSOLD, stats: b(68, 63, '4/14') },

  // SET 5 - Capped Overseas Bowlers I
  { id: 's5-1', set: 5, name: 'Kagiso Rabada', country: 'South Africa', role: 'Right Arm Fast', basePrice: 200, status: PlayerStatus.UNSOLD, stats: b(231, 286, '4/21') },
  { id: 's5-3', set: 5, name: 'Jofra Archer', country: 'England', role: 'Right Arm Fast', basePrice: 200, status: PlayerStatus.UNSOLD, stats: b(182, 225, '4/18') },
  { id: 's5-4', set: 5, name: 'Keshav Maharaj', country: 'South Africa', role: 'Slow Left Arm Orthodox', basePrice: 200, status: PlayerStatus.UNSOLD, stats: b(195, 165, '4/15') },
  { id: 's5-6', set: 5, name: 'Maheesh Theekshana', country: 'Sri Lanka', role: 'Right Arm Offbreak', basePrice: 200, status: PlayerStatus.UNSOLD, stats: b(214, 217, '4/15') },
  { id: 's5-9', set: 5, name: 'Lockie Ferguson', country: 'New Zealand', role: 'Right Arm Fast', basePrice: 200, status: PlayerStatus.UNSOLD, stats: b(197, 223, '5/21') },
  { id: 's5-11', set: 5, name: 'Lungi Ngidi', country: 'South Africa', role: 'Right arm Fast medium', basePrice: 150, status: PlayerStatus.UNSOLD, stats: b(158, 200, '5/39') },
  { id: 's5-12', set: 5, name: 'Noor Ahmad', country: 'Afghanistan', role: 'Left Arm Wrist Spin', basePrice: 150, status: PlayerStatus.UNSOLD, stats: b(188, 226, '5/11') },
  { id: 's5-13', set: 5, name: 'Matheesha Pathirana', country: 'Sri Lanka', role: 'Right Arm Fast', basePrice: 150, status: PlayerStatus.UNSOLD, stats: b(102, 137, '4/20') },
  { id: 's5-14', set: 5, name: 'Akeal Hosein', country: 'West Indies', role: 'Slow Left Arm Orthodox', basePrice: 100, status: PlayerStatus.UNSOLD, stats: b(257, 241, '5/11') },
  { id: 's5-15', set: 5, name: 'Josh Little', country: 'Ireland', role: 'Left Arm Fast Medium', basePrice: 100, status: PlayerStatus.UNSOLD, stats: b(148, 167, '5/13') },

  // SET 6 - Wicketkeeper Batsman I
  { id: 's6-2', set: 6, name: 'Ishan Kishan', country: 'India', role: 'Wicketkeeper Batter', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(216, 5787, '113*') },
  { id: 's6-3', set: 6, name: 'Tim Seifert', country: 'New Zealand', role: 'Wicketkeeper Batter', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(297, 6868, '125*') },
  { id: 's6-6', set: 6, name: 'Kusal Mendis', country: 'Sri Lanka', role: 'Wicketkeeper Batter', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(194, 5212, '105*') },
  { id: 's6-7', set: 6, name: 'Josh Inglis', country: 'Australia', role: 'Wicketkeeper Batter', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(163, 3866, '118*') },
  { id: 's6-8', set: 6, name: 'Rahmanullah Gurbaz', country: 'Afghanistan', role: 'Wicketkeeper Batter', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(251, 6079, '121*') },
  { id: 's6-10', set: 6, name: 'Heinrich Klaasen', country: 'South Africa', role: 'Wicketkeeper Batter', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(271, 6102, '105*') },
  { id: 's6-11', set: 6, name: 'Nicholas Pooran', country: 'West Indies', role: 'Wicketkeeper Batter', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(437, 10271, '108*') },
  { id: 's6-13', set: 6, name: 'Jitesh Sharma', country: 'India', role: 'Wicketkeeper Batter', basePrice: 150, status: PlayerStatus.UNSOLD, stats: s(158, 3163, '106*') },
  { id: 's6-14', set: 6, name: 'Ryan Rickleton', country: 'South Africa', role: 'Wicketkeeper Batter', basePrice: 150, status: PlayerStatus.UNSOLD, stats: s(138, 3735, '113') },
  { id: 's6-15', set: 6, name: 'Finn Allen', country: 'New Zealand', role: 'Wicketkeeper Batter', basePrice: 150, status: PlayerStatus.UNSOLD, stats: s(166, 4580, '151') },

  // SET 7 - Uncapped Batsman I
  { id: 's7-1', set: 7, name: 'Martin Guptill', country: 'New Zealand', role: 'Opener Batsman', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(354, 9922, '120*') },
  { id: 's7-2', set: 7, name: 'David Warner', country: 'Australia', role: 'Opener Batsman', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(429, 13769, '135*') },
  { id: 's7-4', set: 7, name: 'Alex Hales', country: 'England', role: 'Opener Batsman', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(528, 14449, '119*') },
  { id: 's7-5', set: 7, name: 'Faf Du Plessis', country: 'South Africa', role: 'Opener Batsman', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(428, 11958, '120*') },
  { id: 's7-6', set: 7, name: 'Eoin Morgan', country: 'England', role: 'Middle Order Batsman', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(374, 7780, '91') },
  { id: 's7-9', set: 7, name: 'Dawid Malan', country: 'England', role: 'Top Order Batsman', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(387, 10634, '117') },
  { id: 's7-10', set: 7, name: 'Aaron Finch', country: 'Australia', role: 'Top Order Batsman', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(387, 11458, '172') },
  { id: 's7-11', set: 7, name: 'Shaun Marsh', country: 'Australia', role: 'Top Order Batsman', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(215, 7050, '115') },
  { id: 's7-12', set: 7, name: 'Shikhar Dhawan', country: 'India', role: 'Opener Batsman', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(387, 11458, '172') },
  { id: 's7-13', set: 7, name: 'Hashim Amla', country: 'South Africa', role: 'Top Order Batsman', basePrice: 150, status: PlayerStatus.UNSOLD, stats: s(164, 4563, '104*') },
  { id: 's7-14', set: 7, name: 'Ross Taylor', country: 'New Zealand', role: 'Middle order Batter', basePrice: 150, status: PlayerStatus.UNSOLD, stats: s(302, 6604, '111*') },
  { id: 's7-15', set: 7, name: 'Gautam Gambhir', country: 'India', role: 'Top Order Batsman', basePrice: 150, status: PlayerStatus.UNSOLD, stats: s(251, 6402, '93') },

  // SET 8 - All Rounders II
  { id: 's8-1', set: 8, name: 'Cameron Green', country: 'Australia', role: 'All Rounder', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(63, 1334, '100*', 28, '3/35') },
  { id: 's8-2', set: 8, name: 'Wanindu Hasaranga', country: 'Sri Lanka', role: 'All Rounder', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(238, 2463, '77*', 332, '6/9') },
  { id: 's8-3', set: 8, name: 'Shivam Dube', country: 'India', role: 'All Rounder', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(188, 3596, '95*', 69, '3/4') },
  { id: 's8-4', set: 8, name: 'Rashid Khan', country: 'Afghanistan', role: 'All Rounder', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(508, 2853, '79*', 687, '6/17') },
  { id: 's8-5', set: 8, name: 'Sam Curran', country: 'England', role: 'All Rounder', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(188, 3596, '95*', 69, '3/4') },
  { id: 's8-6', set: 8, name: 'Riyan Parag', country: 'India', role: 'All Rounder', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(143, 3168, '95', 48, '3/5') },
  { id: 's8-8', set: 8, name: 'Michael Bracewell', country: 'New Zealand', role: 'All Rounder', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(203, 3455, '141*', 96, '4/28') },
  { id: 's8-9', set: 8, name: 'Liam Livingstone', country: 'England', role: 'All Rounder', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(337, 7611, '103', 146, '4/17') },
  { id: 's8-10', set: 8, name: 'Jason Holder', country: 'West Indies', role: 'All Rounder', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(322, 3183, '69', 354, '5/27') },
  { id: 's8-11', set: 8, name: 'Washington Sundar', country: 'India', role: 'All Rounder', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(159, 1489, '54*', 118, '3/3') },
  { id: 's8-12', set: 8, name: 'Gulabdin Naib', country: 'Afghanistan', role: 'All Rounder', basePrice: 150, status: PlayerStatus.UNSOLD, stats: s(174, 2555, '91', 102, '4/12') },
  { id: 's8-13', set: 8, name: 'Nitesh Kumar Reddy', country: 'India', role: 'All Rounder', basePrice: 100, status: PlayerStatus.UNSOLD, stats: s(40, 737, '76*', 14, '3/17') },
  { id: 's8-14', set: 8, name: 'Kamindu Mendis', country: 'Sri Lanka', role: 'All Rounder', basePrice: 100, status: PlayerStatus.UNSOLD, stats: s(117, 2311, '99*', 28, '3/21') },
  { id: 's8-15', set: 8, name: 'Jacob Bethell', country: 'England', role: 'All Rounder', basePrice: 100, status: PlayerStatus.UNSOLD, stats: s(86, 1538, '87', 18, '2/5') },

  // SET 9 - Uncapped Bowlers I
  { id: 's9-1', set: 9, name: 'Tim Southee', country: 'New Zealand', role: 'Right Arm Fast Medium', basePrice: 200, status: PlayerStatus.UNSOLD, stats: b(295, 348, '6/16') },
  { id: 's9-2', set: 9, name: 'Ashish Nehra', country: 'India', role: 'Left Arm Fast Medium', basePrice: 200, status: PlayerStatus.UNSOLD, stats: b(132, 162, '4/10') },
  { id: 's9-3', set: 9, name: 'Stuart Broad', country: 'England', role: 'Right Arm Fast Medium', basePrice: 200, status: PlayerStatus.UNSOLD, stats: b(85, 100, '4/24') },
  { id: 's9-4', set: 9, name: 'Harbhajan Singh', country: 'India', role: 'Right Arm Offbreak', basePrice: 200, status: PlayerStatus.UNSOLD, stats: b(268, 235, '5/18') },
  { id: 's9-5', set: 9, name: 'Piyush Chawla', country: 'India', role: 'Legbreak', basePrice: 200, status: PlayerStatus.UNSOLD, stats: b(305, 327, '4/12') },
  { id: 's9-6', set: 9, name: 'Lasith Malinga', country: 'Sri Lanka', role: 'Right Arm Fast', basePrice: 200, status: PlayerStatus.UNSOLD, stats: b(295, 390, '6/7') },
  { id: 's9-7', set: 9, name: 'Amit Mishra', country: 'India', role: 'Legbreak', basePrice: 200, status: PlayerStatus.UNSOLD, stats: b(259, 285, '5/17') },
  { id: 's9-8', set: 9, name: 'Trent Boult', country: 'New Zealand', role: 'Left Arm Fast Medium', basePrice: 200, status: PlayerStatus.UNSOLD, stats: b(286, 332, '4/13') },
  { id: 's9-10', set: 9, name: 'Imran Tahir', country: 'South Africa', role: 'Legbreak Googly', basePrice: 200, status: PlayerStatus.UNSOLD, stats: b(446, 570, '5/21') },
  { id: 's9-11', set: 9, name: 'Mohit Sharma', country: 'India', role: 'Right Arm Medium', basePrice: 150, status: PlayerStatus.UNSOLD, stats: b(172, 167, '5/10') },
  { id: 's9-12', set: 9, name: 'Vernon Philander', country: 'South Africa', role: 'Right Arm Fast Medium', basePrice: 150, status: PlayerStatus.UNSOLD, stats: b(123, 92, '5/17') },
  { id: 's9-13', set: 9, name: 'James Faulkner', country: 'Australia', role: 'Left Arm Fast Medium', basePrice: 150, status: PlayerStatus.UNSOLD, stats: b(223, 262, '5/16') },
  { id: 's9-14', set: 9, name: 'Pravin Tambe', country: 'India', role: 'Legbreak', basePrice: 100, status: PlayerStatus.UNSOLD, stats: b(64, 70, '4/15') },
  { id: 's9-15', set: 9, name: 'James Anderson', country: 'England', role: 'Right Arm Fast Medium', basePrice: 100, status: PlayerStatus.UNSOLD, stats: b(58, 63, '3/17') },

  // SET 10 - Legends Batsman I
  { id: 's10-1', set: 10, name: 'Brian Lara', country: 'West Indies', role: 'Top Order Batsman', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(429, 14602, '169') },
  { id: 's10-2', set: 10, name: 'Kumar Sangakkara', country: 'Sri Lanka', role: 'Wicketkeeper Batter', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(267, 6937, '94') },
  { id: 's10-3', set: 10, name: 'Kevin Pieterson', country: 'England', role: 'Top Order Batsman', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(200, 5695, '115*') },
  { id: 's10-4', set: 10, name: 'Rahul Dravid', country: 'India', role: 'Wicketkeeper Batter', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(109, 2586, '75*') },
  { id: 's10-5', set: 10, name: 'Brendon McCullum', country: 'New Zealand', role: 'Opener Batsman', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(308, 12051, '181*') },
  { id: 's10-6', set: 10, name: 'Matthew Hayden', country: 'Australia', role: 'Opener Batsman', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(161, 6133, '181*') },
  { id: 's10-7', set: 10, name: 'Sachin Tendulkar', country: 'India', role: 'Top Order Batsman', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(463, 18426, '200*') },
  { id: 's10-8', set: 10, name: 'Adam Gilchrist', country: 'Australia', role: 'Wicketkeeper Batter', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(262, 5500, '109*') },
  { id: 's10-9', set: 10, name: 'Virender Sehwag', country: 'India', role: 'Opener Batsman', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(159, 4061, '122') },
  { id: 's10-10', set: 10, name: 'Jacques Kallis', country: 'South Africa', role: 'All Rounder', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(176, 4416, '97*', 114, '4/15') },
  { id: 's10-11', set: 10, name: 'Vivian Richards', country: 'West Indies', role: 'All Rounder', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(187, 6721, '189*', 290, '6/24') },
  { id: 's10-12', set: 10, name: 'Jonty Rhodes', country: 'South Africa', role: 'Middle Order Batsman', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(245, 5935, '121') },
  { id: 's10-13', set: 10, name: 'Vvs Laxman', country: 'India', role: 'Top Order Batsman', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(173, 5078, '131') },
  { id: 's10-14', set: 10, name: 'MS Dhoni', country: 'India', role: 'Wicketkeeper Batter', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(405, 7628, '84') },
  { id: 's10-15', set: 10, name: 'Ricky Ponting', country: 'Australia', role: 'Top Order Batsman', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(375, 909, '98') },

  // SET 11 - Uncapped All Rounders
  { id: 's11-1', set: 11, name: 'Andre Russel', country: 'West Indies', role: 'All Rounder', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(586, 9606, '121', 507, '5/15') },
  { id: 's11-2', set: 11, name: 'Yuvraj Singh', country: 'India', role: 'All Rounder', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(231, 4857, '83', 80, '2/29') },
  { id: 's11-3', set: 11, name: 'Chris Gayle', country: 'West Indies', role: 'All Rounder', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(463, 14562, '175*', 83, '4/22') },
  { id: 's11-4', set: 11, name: 'Ravichandran Ashwin', country: 'India', role: 'All Rounder', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(333, 8543, '50', 317, '4/8') },
  { id: 's11-5', set: 11, name: 'Kieron Pollard', country: 'West Indies', role: 'All Rounder', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(732, 14434, '104', 333, '4/15') },
  { id: 's11-6', set: 11, name: 'Shane Watson', country: 'Australia', role: 'All Rounder', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(343, 8821, '124*', 216, '4/15') },
  { id: 's11-7', set: 11, name: 'Sunil Narine', country: 'West Indies', role: 'All Rounder', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(579, 13516, '109*', 609, '5/19') },
  { id: 's11-8', set: 11, name: 'Kapil Dev', country: 'India', role: 'All Rounder', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(310, 14947, '175*', 335, '5/43') },
  { id: 's11-9', set: 11, name: 'Moeen Ali', country: 'England', role: 'All Rounder', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(413, 7711, '121*', 265, '5/34') },
  { id: 's11-10', set: 11, name: 'Suresh Raina', country: 'India', role: 'All Rounder', basePrice: 200, status: PlayerStatus.UNSOLD, stats: s(336, 8654, '126*', 54, '4/26') },
  { id: 's11-11', set: 11, name: 'Dwayne Bravo', country: 'West Indies', role: 'All Rounder', basePrice: 150, status: PlayerStatus.UNSOLD, stats: s(582, 6970, '70*', 631, '5/23') },
  { id: 's11-12', set: 11, name: 'Andrew Flintoff', country: 'England', role: 'All Rounder', basePrice: 150, status: PlayerStatus.UNSOLD, stats: s(141, 3394, '123', 169, '5/19') },
  { id: 's11-13', set: 11, name: 'Irfan Pathan', country: 'India', role: 'All Rounder', basePrice: 150, status: PlayerStatus.UNSOLD, stats: s(181, 2020, '65*', 173, '5/13') },
  { id: 's11-14', set: 11, name: 'Chris Woakes', country: 'England', role: 'All Rounder', basePrice: 150, status: PlayerStatus.UNSOLD, stats: s(170, 1031, '57*', 179, '4/21') },
  { id: 's11-15', set: 11, name: 'Chris Morris', country: 'South Africa', role: 'All Rounder', basePrice: 150, status: PlayerStatus.UNSOLD, stats: s(234, 1868, '82*', 290, '4/9') },
];

export const formatCurrency = (lakhs: number) => {
  if (lakhs >= 100) {
    return `₹${(lakhs / 100).toFixed(2)} Cr`;
  }
  return `₹${lakhs} L`;
};