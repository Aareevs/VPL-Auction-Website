import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import { User } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'team_member' | 'spectator' | null;

interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  team_id: string | null;
  full_name?: string | null;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string, currentUser?: User): Promise<UserProfile | null> => {
    try {
      console.log('[Auth] Fetching profile for', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('[Auth] No profile found — user needs onboarding');
        } else {
          console.error('[Auth] Profile fetch error:', error.message);
        }
        setProfile(null);
        return null;
      }

      const profileData = data as UserProfile;

      // Fire-and-forget name sync
      if (currentUser && !profileData.full_name) {
        const fullName = currentUser.user_metadata?.full_name || currentUser.user_metadata?.name;
        if (fullName) {
          profileData.full_name = fullName;
          supabase.from('profiles').update({ full_name: fullName }).eq('id', userId).then(() => {});
        }
      }

      console.log('[Auth] Profile loaded:', profileData.role);
      setProfile(profileData);
      return profileData;
    } catch (err) {
      console.error('[Auth] Unexpected error:', err);
      setProfile(null);
      return null;
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user.id, user);
    }
  }, [user, fetchProfile]);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        console.log('[Auth] Initializing...');
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('[Auth] getSession error:', error.message);
        }

        if (!mounted) return;

        const currentUser = session?.user ?? null;
        console.log('[Auth] Session user:', currentUser?.email ?? 'none');
        setUser(currentUser);

        if (currentUser) {
          await fetchProfile(currentUser.id, currentUser);
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error('[Auth] Init failed:', err);
        if (mounted) {
          setUser(null);
          setProfile(null);
        }
      } finally {
        // ALWAYS stop loading, no matter what happens
        if (mounted) {
          console.log('[Auth] Init complete, loading = false');
          setLoading(false);
        }
      }
    };

    initAuth();

    // Listen for auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'INITIAL_SESSION') return;
      if (!mounted) return;

      console.log('[Auth] Event:', event);

      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        await fetchProfile(currentUser.id, currentUser);
      } else {
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const value = {
    user,
    profile,
    loading,
    isAdmin: profile?.role === 'admin' || user?.email === 'aareevs@gmail.com',
    signOut,
    refreshProfile
  };

  if (loading) {
    return (
      <AuthContext.Provider value={value}>
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400">Loading...</p>
          </div>
        </div>
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
