import React, { useState } from 'react';
import { useAuction } from '../context/AuctionContext';
import { formatCurrency } from '../constants';
import { Users, IndianRupee, Shield } from 'lucide-react';

const Teams: React.FC = () => {
  const { teams } = useAuction();
  const [selectedTeamId, setSelectedTeamId] = useState<string>(teams[0]?.id || '');

  const selectedTeam = teams.find(t => t.id === selectedTeamId);

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Team Selector Tabs */}
        <div className="flex overflow-x-auto gap-4 mb-8 pb-4 scrollbar-hide">
            {teams.map(team => (
                <button
                    key={team.id}
                    onClick={() => setSelectedTeamId(team.id)}
                    className={`flex-shrink-0 px-6 py-3 rounded-xl border transition-all duration-300 ${
                        selectedTeamId === team.id
                        ? 'bg-slate-800 border-blue-500 text-white shadow-lg shadow-blue-900/20'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: team.primaryColor }}></div>
                        <span className="font-bold tracking-wide">{team.name}</span>
                    </div>
                </button>
            ))}
        </div>

        {selectedTeam && (
            <div className="space-y-8">
                {/* Team Header Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 relative overflow-hidden group">
                        <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                            <IndianRupee size={80} />
                        </div>
                        <div className="text-slate-400 text-sm uppercase tracking-wider mb-1">Purse Remaining</div>
                        <div className="text-4xl text-white font-bold display-font">{formatCurrency(selectedTeam.remainingPurse)}</div>
                        <div className="text-xs text-slate-500 mt-2">Out of {formatCurrency(selectedTeam.totalPurse)}</div>
                    </div>
                    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 relative overflow-hidden group">
                        <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Users size={80} />
                        </div>
                        <div className="text-slate-400 text-sm uppercase tracking-wider mb-1">Squad Strength</div>
                        <div className="text-4xl text-white font-bold display-font">{selectedTeam.squad.length} <span className="text-lg text-slate-500 font-normal">Players</span></div>
                        <div className="text-xs text-slate-500 mt-2">Min 15 required</div>
                    </div>
                    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 relative overflow-hidden group">
                        <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Shield size={80} />
                        </div>
                        <div className="text-slate-400 text-sm uppercase tracking-wider mb-1">Total Spent</div>
                        <div className="text-4xl text-white font-bold display-font">{formatCurrency(selectedTeam.totalPurse - selectedTeam.remainingPurse)}</div>
                    </div>
                </div>

                {/* Squad List */}
                <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                    <div className="p-6 border-b border-slate-800">
                        <h3 className="text-white text-xl font-bold display-font">Current Squad</h3>
                    </div>
                    
                    {selectedTeam.squad.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">
                            No players bought yet.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-950 text-slate-400 text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="p-4 font-medium">Player Name</th>
                                        <th className="p-4 font-medium">Role</th>
                                        <th className="p-4 font-medium">Country</th>
                                        <th className="p-4 font-medium text-right">Sold Price</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800 text-sm">
                                    {selectedTeam.squad.map(player => (
                                        <tr key={player.id} className="hover:bg-slate-800/50 transition-colors">
                                            <td className="p-4 font-medium text-white">{player.name}</td>
                                            <td className="p-4 text-slate-300">
                                                <span className="bg-slate-800 px-2 py-1 rounded text-xs border border-slate-700">{player.role}</span>
                                            </td>
                                            <td className="p-4 text-slate-400">{player.country}</td>
                                            <td className="p-4 text-right font-mono text-yellow-500 font-bold">{formatCurrency(player.soldPrice || 0)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default Teams;
