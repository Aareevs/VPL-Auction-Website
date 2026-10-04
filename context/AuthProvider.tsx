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

  const [isAdminEmail, setIsAdminEmail] = useState(false);

  const fetchAndUpsertProfile = useCallback(async (authUser: User) => {
    try {
      const userEmail = (authUser.email || '').toLowerCase().trim();
      const isSuperAdmin = userEmail === 'aareevs@gmail.com';

      // 1. Check if the user is listed in admin_emails table
      let isEmailAdmin = isSuperAdmin;
      if (userEmail && !isSuperAdmin) {
        try {
          const { data: adminRecord } = await supabase
            .from('admin_emails')
            .select('email')
            .ilike('email', userEmail)
            .maybeSingle();

          if (adminRecord) {
            isEmailAdmin = true;
          }
        } catch (adminErr) {
          console.error('[Auth] Error querying admin_emails:', adminErr);
        }
      }

      setIsAdminEmail(isEmailAdmin);

      // 2. Fetch existing profile
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (data && !error) {
        let currentProfile = data as UserProfile;

        // Synchronize role if there is a mismatch with admin_emails
        if (isEmailAdmin && currentProfile.role !== 'admin') {
          currentProfile = { ...currentProfile, role: 'admin', team_id: null };
          try {
            await supabase
              .from('profiles')
              .update({ role: 'admin', team_id: null })
              .eq('id', authUser.id);
          } catch (updateErr) {
            console.warn('[Auth] Failed to update profile role in DB:', updateErr);
          }
        } else if (!isEmailAdmin && currentProfile.role === 'admin' && !isSuperAdmin) {
          currentProfile = { ...currentProfile, role: 'spectator' };
          try {
            await supabase
              .from('profiles')
              .update({ role: 'spectator' })
              .eq('id', authUser.id);
          } catch (updateErr) {
            console.warn('[Auth] Failed to demote profile role in DB:', updateErr);
          }
        }

        setProfile(currentProfile);
        return;
      }

      // 3. If no profile exists, create/upsert one with the proper role
      const role: UserRole = isEmailAdmin ? 'admin' : 'spectator';
      const newProfile: UserProfile = {
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
        setProfile(newProfile);
      } else {
        setProfile(newProfile);
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
        setIsAdminEmail(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchAndUpsertProfile]);

  // Real-time synchronization: listen to changes in admin_emails table
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('auth_admin_emails_sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'admin_emails' }, () => {
        fetchAndUpsertProfile(user);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchAndUpsertProfile]);

  const signOut = async () => {
    try { await supabase.auth.signOut(); } catch {}
    setUser(null);
    setProfile(null);
    setIsAdminEmail(false);
  };

  const userEmailLower = user?.email?.toLowerCase().trim();
  const isAdmin = profile?.role === 'admin' || isAdminEmail || userEmailLower === 'aareevs@gmail.com';

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
