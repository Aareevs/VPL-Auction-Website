import React from 'react';
import { X, Trophy, DollarSign, Users } from 'lucide-react';
import { Team, Player } from '../types';
import { formatCurrency } from '../constants';
import { getPlayerAcquisitionLabel, getPlayerDisplayName, getPlayerDisplayRole, isCaptain } from '../lib/playerDisplay';

interface TeamDetailModalProps {
  team: Team;
  onClose: () => void;
}

const TeamDetailModal: React.FC<TeamDetailModalProps> = ({ team, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-6 px-8 flex items-center justify-between border-b border-slate-800" style={{ background: `linear-gradient(to right, ${team.primaryColor}20, transparent)` }}>
           <div className="flex items-center gap-6">
               <div className="w-20 h-20 rounded-xl bg-slate-800 border-2 border-slate-700 overflow-hidden shadow-xl flex-shrink-0 relative z-10">
                   {team.logoUrl ? (
                       <img src={team.logoUrl} className="w-full h-full object-cover" />
                   ) : (
                       <div className="w-full h-full flex items-center justify-center font-bold text-2xl text-white" style={{ background: team.primaryColor }}>
                           {team.shortName}
                       </div>
                   )}
               </div>
               <div>
                   <h2 className="text-3xl font-bold text-white display-font mb-1">{team.name}</h2>
                   <div className="flex items-center gap-4 text-sm font-bold">
                       <span className={`flex items-center gap-1.5 ${team.squad.length >= 7 ? 'text-red-400' : 'text-slate-400'}`}><Users size={14} /> {team.squad.length} / 7 Players</span>
                       <span className="text-green-400 flex items-center gap-1.5"><DollarSign size={14} /> {formatCurrency(team.remainingPurse)} Left</span>
                   </div>
               </div>
           </div>
           <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-colors"
           >
               <X size={20} />
           </button>
        </div>

        {/* Squad List */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-900/50">
           <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
               <Trophy size={14} /> Current Squad
           </h3>
           
           {team.squad.length === 0 ? (
               <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-xl bg-slate-900/30">
                   <p className="text-slate-500 font-medium">No players purchased yet.</p>
               </div>
           ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                   {team.squad.map(player => (
                       <div key={player.id} className="flex items-center gap-3 p-3 bg-slate-800 border border-slate-700/50 rounded-xl hover:border-slate-600 transition-colors group">
                           <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-700 border border-slate-600 flex-shrink-0">
                               {player.imageUrl ? <img src={player.imageUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">IMG</div>}
                           </div>
                           <div className="min-w-0 flex-1">
                               <div className="flex items-center gap-2 min-w-0">
                                   <div className="text-white font-bold truncate leading-tight">{getPlayerDisplayName(player)}</div>
                                   {isCaptain(player) && (
                                       <span className="bg-amber-500/15 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold flex-shrink-0">
                                           Captain
                                       </span>
                                   )}
                               </div>
                               {getPlayerDisplayRole(player) ? (
                                   <div className="text-xs text-slate-400 truncate mt-0.5">{getPlayerDisplayRole(player)}</div>
                               ) : null}
                           </div>
                           <div className="text-right">
                               {getPlayerAcquisitionLabel(player) ? (
                                   <div className="text-green-400 font-bold font-mono text-sm">{getPlayerAcquisitionLabel(player)}</div>
                               ) : null}
                           </div>
                       </div>
                   ))}
               </div>
           )}
        </div>

        {/* Footer Stats */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/30 flex justify-between text-xs text-slate-500 font-mono uppercase tracking-widest">
            <span>Total Spent: {formatCurrency(team.totalPurse - team.remainingPurse)}</span>
            <span className={team.squad.length >= 7 ? 'text-red-500 font-bold' : ''}>Squad Limit: {team.squad.length}/7</span>
        </div>
      </div>
    </div>
  );
};

export default TeamDetailModal;
