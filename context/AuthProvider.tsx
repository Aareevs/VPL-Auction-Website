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

  const fetchAndUpsertProfile = useCallback(async (authUser: User) => {
    try {
      // Try to fetch existing profile
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (data && !error) {
        setProfile(data as UserProfile);
        return;
      }

      // If no profile exists (error.code === 'PGRST116') or other error, let's upsert one
      let role: UserRole = 'spectator';
      
      // Check if they are an admin
      if (authUser.email) {
        const { data: adminData } = await supabase
          .from('admin_emails')
          .select('email')
          .eq('email', authUser.email)
          .single();
          
        if (adminData) role = 'admin';
      }

      // Upsert new profile
      const newProfile = {
        id: authUser.id,
        email: authUser.email || '',
        full_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || null,
        role,
        team_id: null,
      };

      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert(newProfile);

      if (!upsertError) {
        setProfile(newProfile as UserProfile);
      }
    } catch (err) {
      console.error('[Auth] Profile operation failed:', err);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) await fetchAndUpsertProfile(user);
  }, [user, fetchAndUpsertProfile]);

  useEffect(() => {
    let mounted = true;

    // Supabase 2.39.3 getSession works perfectly and doesn't block
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setLoading(false);
      
      if (currentUser) {
        fetchAndUpsertProfile(currentUser);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setLoading(false);
      
      if (currentUser) {
        fetchAndUpsertProfile(currentUser);
      } else {
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchAndUpsertProfile]);

  const signOut = async () => {
    try { await supabase.auth.signOut(); } catch {}
    setUser(null);
    setProfile(null);
  };

  const isAdmin = profile?.role === 'admin' || user?.email === 'aareevs@gmail.com';

  const value = {
    user,
    profile,
    loading,
    isAdmin,
    signOut,
    refreshProfile
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
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
