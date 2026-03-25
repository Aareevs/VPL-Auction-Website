import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

const Onboarding: React.FC = () => {
  const { user, profile, refreshProfile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const didRun = useRef(false);

  // Already onboarded? Go to dashboard.
  useEffect(() => {
    if (profile?.role) {
      navigate('/dashboard', { replace: true });
    }
  }, [profile, navigate]);

  // Auto-onboarding: run ONCE when user is available and no profile exists
  useEffect(() => {
    if (!user || profile?.role || didRun.current || authLoading) return;
    didRun.current = true;

    const onboard = async () => {
      setBusy(true);
      setError(null);

      try {
        let role: 'admin' | 'spectator' = 'spectator';

        // Check admin_emails table (with timeout)
        if (user.email) {
          try {
            const adminCheck = await Promise.race([
              supabase.from('admin_emails').select('email').eq('email', user.email).single(),
              new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000))
            ]);
            if ('data' in adminCheck && adminCheck.data) role = 'admin';
          } catch {
            // Timeout or table doesn't exist — fall through to spectator
          }
        }

        // Upsert profile (with timeout)
        console.log(`[Onboarding] Assigning role: ${role}`);
        const upsertResult = await Promise.race([
          supabase.from('profiles').upsert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
            role,
            team_id: null,
            created_at: new Date().toISOString(),
          }),
          new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Profile save timed out')), 8000))
        ]);

        if ('error' in upsertResult && upsertResult.error) {
          throw new Error(upsertResult.error.message);
        }

        console.log('[Onboarding] Success — navigating to dashboard');
        // Navigate directly — don't wait for refreshProfile
        navigate('/dashboard', { replace: true });
        
        // Refresh profile in background so dashboard picks it up
        refreshProfile().catch(() => {});
      } catch (err: any) {
        console.error('[Onboarding] Failed:', err);
        setError(err?.message || 'Something went wrong. Please try again.');
      } finally {
        setBusy(false);
      }
    };

    onboard();
  }, [user, authLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  // Not logged in at all? Back to home.
  if (!authLoading && !user) {
    return <Navigate to="/" replace />;
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-xl text-white font-bold mb-2">Couldn't Enter Auction</p>
          <p className="text-slate-400 mb-6 break-words">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                setError(null);
                didRun.current = false;
                setBusy(false);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/dashboard', { replace: true })}
              className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Skip to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
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
