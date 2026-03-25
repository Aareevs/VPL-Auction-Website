import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, Navigate } from 'react-router-dom';
import { INITIAL_TEAMS } from '../constants';
import { useAuth } from '../context/AuthProvider';


const Onboarding: React.FC = () => {
  const { user, profile, refreshProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const onboardingAttempted = useRef(false);

  // If the AuthProvider already has a profile with a role, skip onboarding entirely
  useEffect(() => {
    if (profile?.role) {
      navigate('/dashboard', { replace: true });
    }
  }, [profile, navigate]);

  // Main onboarding logic — only runs once per mount
  useEffect(() => {
    if (!user || profile?.role || onboardingAttempted.current) return;
    onboardingAttempted.current = true;
    
    const init = async () => {
       setLoading(true);
       setError(null);

       try {
         // 1. Check if email is an admin (from admin_emails table)
         if (user.email) {
             try {
                 const { data } = await supabase
                   .from('admin_emails')
                   .select('email')
                   .eq('email', user.email)
                   .single();
                 
                 if (data) {
                     await handleRoleAssignment('admin');
                     return;
                 }
             } catch (err) {
                 // Table may not exist yet — fall through to spectator
                 console.warn('admin_emails check failed, falling through:', err);
             }
         }

         // 2. Auto-assign Spectator for everyone else
         await handleRoleAssignment('spectator');
       } catch (err: any) {
         console.error('Onboarding failed:', err);
         setError(err?.message || 'Failed to set up your account. Please try again.');
         setLoading(false);
       }
    };
    
    init();
  }, [user]); // Only depend on user, not profile

  const handleRoleAssignment = async (role: 'admin' | 'spectator') => {
    if (!user) return;
    console.log(`Assigning ${role} role...`);
    
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      email: user.email,
      full_name: user?.user_metadata?.full_name || user?.user_metadata?.name || null,
      role,
      team_id: null,
      created_at: new Date().toISOString(),
    });
    
    if (error) throw error;
    
    await refreshProfile();
    // Navigation will happen via the profile useEffect above
  };

  const handleRetry = () => {
    setError(null);
    onboardingAttempted.current = false;
    // Force re-run by setting a dummy state
    setLoading(false);
    // Re-trigger the effect by toggling the ref and forcing re-render
    window.location.reload();
  };

  // Redirect unauthenticated users AFTER all hooks have been called
  if (!authLoading && !user) {
    return <Navigate to="/" replace />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-xl text-white font-bold mb-2">Couldn't Enter Auction</p>
          <p className="text-slate-400 mb-6">{error}</p>
          <button
            onClick={handleRetry}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
