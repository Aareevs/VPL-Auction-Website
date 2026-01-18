import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { INITIAL_TEAMS } from '../../constants';
import { useAuth } from '../context/AuthProvider';
import { Users, Eye } from 'lucide-react';

const Onboarding: React.FC = () => {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<'team_member' | 'spectator' | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [teamCounts, setTeamCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchTeamCounts();
    if (user?.email === 'aareevs@gmail.com') {
      handleAdminOnboarding();
    } else if (profile?.role) {
      // If user already has a role, redirect to dashboard (Persistence)
      navigate('/dashboard');
    }
  }, [user, profile]);

  const handleAdminOnboarding = async () => {
    setLoading(true);
    try {
      if (!user) return;
      
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
        role: 'admin',
        team_id: null,
        created_at: new Date().toISOString(),
      });

      if (error) throw error;

      await refreshProfile();
      navigate('/dashboard'); // Direct access to dashboard
    } catch (error: any) {
      console.error('Error setting up admin:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamCounts = async () => {
    // Fetch all profiles with a team_id to count members
    const { data, error } = await supabase
      .from('profiles')
      .select('team_id')
      .not('team_id', 'is', null);

    if (error) {
      console.error('Error fetching team counts:', error);
      return;
    }

    const counts: Record<string, number> = {};
    data.forEach((p: any) => {
      if (p.team_id) {
        counts[p.team_id] = (counts[p.team_id] || 0) + 1;
      }
    });
    setTeamCounts(counts);
  };

  const handleComplete = async () => {
    if (!user) return;
    if (!role) return;
    if (role === 'team_member' && !selectedTeam) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
        role: role,
        team_id: role === 'team_member' ? selectedTeam : null,
        created_at: new Date().toISOString(),
      });

      if (error) throw error;

      await refreshProfile();
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      alert(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Welcome to VPL 2026</h1>
          <p className="text-slate-400 text-lg">Choose how you want to participate</p>
        </div>

        {loading && user?.email === 'aareevs@gmail.com' ? (
           <div className="text-center">
             <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
             <p className="text-xl text-white">Recognized Admin. Setting up access...</p>
           </div>
        ) : !role ? (
          <div className="grid md:grid-cols-2 gap-8">
            <button
              onClick={() => setRole('spectator')}
              className="group bg-slate-900 border border-slate-800 p-8 rounded-2xl hover:bg-slate-800 hover:border-blue-500/50 transition-all text-left"
            >
              <div className="w-16 h-16 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Eye size={32} className="text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Spectator</h3>
              <p className="text-slate-400">
                View auction stats, team squads, and live updates. You cannot bid or manage a team.
              </p>
            </button>

            <button
              onClick={() => setRole('team_member')}
              className="group bg-slate-900 border border-slate-800 p-8 rounded-2xl hover:bg-slate-800 hover:border-purple-500/50 transition-all text-left"
            >
              <div className="w-16 h-16 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users size={32} className="text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Team Member</h3>
              <p className="text-slate-400">
                Join one of the 12 franchises. Manage your squad and participate in the auction.
              </p>
            </button>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 animate-fade-in">
            <button 
              onClick={() => { setRole(null); setSelectedTeam(null); }}
              className="text-slate-500 hover:text-white mb-6 text-sm flex items-center gap-1"
            >
              ← Back to roles
            </button>

            {role === 'spectator' ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Eye size={40} className="text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Enter as Spectator?</h3>
                <p className="text-slate-400 mb-8 max-w-md mx-auto">
                  You'll have read-only access to the dashboard. You can track all the action live.
                </p>
                <button
                  onClick={handleComplete}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all"
                >
                  {loading ? 'Setting up...' : 'Get Started'}
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-2xl font-bold text-white mb-6 text-center">Select Your Team</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                  {INITIAL_TEAMS.map((team) => {
                    const memberCount = teamCounts[team.id] || 0;
                    const isFull = memberCount >= 6;
                    const isSelected = selectedTeam === team.id;

                    return (
                      <button
                        key={team.id}
                        onClick={() => !isFull && setSelectedTeam(team.id)}
                        disabled={isFull}
                        className={`relative p-4 rounded-xl border transition-all text-left ${
                          isSelected
                            ? 'bg-slate-800 border-green-500 ring-1 ring-green-500'
                            : isFull
                            ? 'bg-slate-900/50 border-slate-800 opacity-50 cursor-not-allowed'
                            : 'bg-slate-900 border-slate-800 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div 
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                            style={{ backgroundColor: team.primaryColor }}
                          >
                            {team.shortName}
                          </div>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                            isFull ? 'bg-red-500/10 text-red-500' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {memberCount}/6
                          </span>
                        </div>
                        <h4 className="font-bold text-white truncate">{team.name}</h4>
                        {isFull && <span className="text-xs text-red-500 mt-1 block">Team Full</span>}
                      </button>
                    );
                  })}
                </div>
                
                <div className="mt-8 flex justify-end border-t border-slate-800 pt-6">
                   <button
                    onClick={handleComplete}
                    disabled={loading || !selectedTeam}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Joining Team...' : 'Join Team'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
