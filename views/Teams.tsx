import React, { useState } from 'react';
import { useAuction } from '../context/AuctionContext';
import { formatCurrency } from '../constants';
import { Users, IndianRupee, Shield, ChevronRight } from 'lucide-react';

const Teams: React.FC = () => {
  const { teams } = useAuction();
  const [selectedTeamId, setSelectedTeamId] = useState<string>(teams[0]?.id || '');

  const selectedTeam = teams.find(t => t.id === selectedTeamId);

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">
        
        {/* LEFT SIDEBAR - TEAM LIST */}
        <div className="col-span-12 lg:col-span-3">
             <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex flex-col h-[calc(100vh-140px)] sticky top-24">
                 <div className="p-4 border-b border-slate-800 bg-slate-950/50">
                     <h2 className="text-white font-bold display-font text-lg flex items-center gap-2">
                         <Shield className="text-blue-500" size={20} />
                         Franchises
                     </h2>
                 </div>
                 
                 <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                    {teams.map(team => (
                        <button
                            key={team.id}
                            onClick={() => setSelectedTeamId(team.id)}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 group text-left relative overflow-hidden ${
                                selectedTeamId === team.id
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                        >
                            {/* Active Indicator Background */}
                            {selectedTeamId === team.id && (
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 z-0"></div>
                            )}

                            <div className="w-10 h-10 rounded-lg bg-slate-800 border-2 border-slate-700/50 flex items-center justify-center flex-shrink-0 relative z-10 overflow-hidden">
                                {team.logoUrl ? (
                                    <img src={team.logoUrl} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center font-bold text-xs" style={{ background: team.primaryColor, color: '#fff' }}>
                                        {team.shortName}
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex-1 relative z-10">
                                <span className={`font-bold block leading-tight ${selectedTeamId === team.id ? 'text-white' : 'text-slate-300'}`}>
                                    {team.name}
                                </span>
                                <span className={`text-[10px] uppercase tracking-wider font-bold ${selectedTeamId === team.id ? 'text-blue-200' : 'text-slate-500'}`}>
                                    {team.squad.length} / 8 Players
                                </span>
                            </div>

                            {selectedTeamId === team.id && (
                                <ChevronRight size={16} className="text-white relative z-10" />
                            )}
                        </button>
                    ))}
                 </div>
             </div>
        </div>

        {/* RIGHT CONTENT - TEAM DETAILS */}
        <div className="col-span-12 lg:col-span-9">
            {selectedTeam ? (
                <div className="space-y-8 animate-fade-in">
                    
                    {/* Header Banner */}
                    <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 p-8 flex items-center justify-between">
                         <div className="absolute inset-0 opacity-10" style={{ background: `linear-gradient(to right, ${selectedTeam.primaryColor}, transparent)` }}></div>
                         <div className="relative z-10 flex items-center gap-6">
                             <div className="w-24 h-24 rounded-2xl bg-slate-800 border-4 border-slate-700 shadow-2xl overflow-hidden">
                                {selectedTeam.logoUrl ? (
                                    <img src={selectedTeam.logoUrl} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center display-font text-3xl" style={{ background: selectedTeam.primaryColor }}>
                                        {selectedTeam.shortName}
                                    </div>
                                )}
                             </div>
                             <div>
                                 <h1 className="text-4xl md:text-5xl font-bold text-white display-font mb-2">{selectedTeam.name}</h1>
                                 <div className="flex items-center gap-4 text-slate-400 font-mono text-sm">
                                     <span className="bg-slate-800 px-3 py-1 rounded-full border border-slate-700">Team ID: {selectedTeam.shortName}</span>
                                     <span className="bg-slate-800 px-3 py-1 rounded-full border border-slate-700">Captain: Coming Soon</span>
                                 </div>
                             </div>
                         </div>
                    </div>

                    {/* Team Header Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 relative overflow-hidden group hover:border-blue-500/30 transition-colors">
                            <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                <IndianRupee size={80} />
                            </div>
                            <div className="text-slate-400 text-sm uppercase tracking-wider mb-1 font-bold">Purse Remaining</div>
                            <div className="text-4xl text-green-400 font-bold display-font">{formatCurrency(selectedTeam.remainingPurse)}</div>
                            <div className="text-xs text-slate-500 mt-2 font-mono">Out of {formatCurrency(selectedTeam.totalPurse)}</div>
                        </div>
                        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 relative overflow-hidden group hover:border-blue-500/30 transition-colors">
                            <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Users size={80} />
                            </div>
                            <div className="text-slate-400 text-sm uppercase tracking-wider mb-1 font-bold">Squad Strength</div>
                            <div className="text-4xl text-white font-bold display-font">{selectedTeam.squad.length} <span className="text-lg text-slate-500 font-normal">/ 8</span></div>

                        </div>
                        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 relative overflow-hidden group hover:border-blue-500/30 transition-colors">
                            <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Shield size={80} />
                            </div>
                            <div className="text-slate-400 text-sm uppercase tracking-wider mb-1 font-bold">Total Spent</div>
                            <div className="text-4xl text-white font-bold display-font">{formatCurrency(selectedTeam.totalPurse - selectedTeam.remainingPurse)}</div>
                            <div className="text-xs text-slate-500 mt-2 font-mono">Total Investment</div>
                        </div>
                    </div>

                    {/* Squad List */}
                    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
                        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/30">
                            <h3 className="text-white text-xl font-bold display-font flex items-center gap-2">
                                <Users className="text-blue-500" size={24} />
                                Current Squad
                            </h3>
                            <span className="text-slate-500 text-sm font-mono">{selectedTeam.squad.length} Players</span>
                        </div>
                        
                        {selectedTeam.squad.length === 0 ? (
                            <div className="p-16 text-center">
                                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600">
                                    <Users size={32} />
                                </div>
                                <h4 className="text-white font-bold text-lg mb-2">No players yet</h4>
                                <p className="text-slate-500">This team hasn't purchased any players in the auction yet.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-950 text-slate-400 text-xs uppercase tracking-wider font-bold">
                                        <tr>
                                            <th className="p-4 pl-6">Player Name</th>
                                            <th className="p-4">Role</th>
                                            <th className="p-4">Country</th>
                                            <th className="p-4 text-right pr-6">Sold Price</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800 text-sm">
                                        {selectedTeam.squad.map(player => (
                                            <tr key={player.id} className="hover:bg-slate-800/50 transition-colors group">
                                                <td className="p-4 pl-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 overflow-hidden">
                                                            {player.imageUrl ? <img src={player.imageUrl} className="w-full h-full object-cover" /> : null}
                                                        </div>
                                                        <div className="font-bold text-white group-hover:text-blue-400 transition-colors">{player.name}</div>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-slate-300">
                                                    <span className="bg-slate-800 px-2 py-1 rounded text-xs border border-slate-700 uppercase font-bold tracking-wider">{player.role}</span>
                                                </td>
                                                <td className="p-4 text-slate-400 font-medium">{player.country}</td>
                                                <td className="p-4 text-right pr-6 font-mono text-green-400 font-bold text-base">{formatCurrency(player.soldPrice || 0)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center h-full text-slate-500">
                    Select a team to view details
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default Teams;
