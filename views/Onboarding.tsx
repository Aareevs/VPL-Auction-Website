import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { INITIAL_TEAMS } from '../constants';
import { useAuth } from '../context/AuthProvider';


const Onboarding: React.FC = () => {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
       if (!user) return;
        
       // 1. If already setup, redirect (handled largely by ProtectedRoute but good to have)
       if (profile?.role) {
           navigate('/dashboard');
           return;
       }

       // 2. Check if email is an admin (from admin_emails table)
       if (user.email) {
           try {
               const { data } = await supabase
                 .from('admin_emails')
                 .select('email')
                 .eq('email', user.email)
                 .single();
               
               if (data) {
                   await handleAdminOnboarding();
                   return;
               }
           } catch (err) {
               // Table may not exist yet — fall through to spectator
               console.warn('admin_emails check failed, falling through:', err);
           }
       }

       // 3. Auto-assign Spectator for everyone else (Bypass UI)
       await handleAutoSpectator();
    };
    
    init();
  }, [user, profile]);

  const handleAdminOnboarding = async () => {
    setLoading(true);
    try {
      if (!user) return;
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        email: user.email,
        full_name: user?.user_metadata?.full_name || user?.user_metadata?.name || null,
        role: 'admin',
        team_id: null,
        created_at: new Date().toISOString(),
      });
      if (error) throw error;
      await refreshProfile();
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error setting up admin:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoSpectator = async () => {
      setLoading(true);
      try {
          if (!user) return;
          console.log("Auto-assigning spectator role...");
          const { error } = await supabase.from('profiles').upsert({
              id: user.id,
              email: user.email,
              full_name: user?.user_metadata?.full_name || user?.user_metadata?.name || null,
              role: 'spectator',
              team_id: null,
              created_at: new Date().toISOString(),
          });

          if (error) throw error;
          await refreshProfile();
          navigate('/dashboard');
      } catch (error: any) {
          console.error('Error auto-assigning spectator:', error);
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
       <div className="text-center">
           <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
           <p className="text-xl text-white font-bold">Entering Auction...</p>
       </div>
    </div>
  );
};

export default Onboarding;
