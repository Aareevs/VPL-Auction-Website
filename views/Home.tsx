import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

const PLAYER_IMAGES = [
  "https://images.news18.com/ibnlive/uploads/2025/02/virat-kohli-shot-AP-1-2025-02-9e28043ad4ef3e00a00b1a2093fa13c9-4x3.jpg",
  "https://i.pinimg.com/originals/bb/72/2a/bb722a1111f63463d651786ecb761a08.jpg",
  "https://mxp-media.ilnmedia.com/media/content/2021/Sep/Ravi-Shastri-Praises-MS-Dhonis-Wicket-Keeping-But-Some-People-Dont-Like-His-Comparison-1200x900_613347cb1b464.jpeg",
  "https://img.ipl.com/upload/20250918/fd887a9e65815c4730d7c9fdfdba9662.webp",
  "https://cloudfront-us-east-2.images.arcpublishing.com/reuters/RXVCL2CU4NP5LKKRLU6XDWYCZA.jpg",
  "https://akm-img-a-in.tosshub.com/indiatoday/images/story/202310/travis-head-becomes-5th-australia-batter-to-score-world-cup-hundred-on-debut-courtesy-ap-284825383-3x4_0.jpg?VersionId=X6ICl9jE4_nIxRXoc3x7EqLLjGnWjVM2",
  "https://cf-img-a-in.tosshub.com/sites/visualstory/stories/2023_04/story_32974/assets/2.jpeg?time=1682335725",
  "https://batsballsandbrakingzones.wordpress.com/wp-content/uploads/2019/03/kumar-sangakkara-of-sri-lanka-during-the-icc-world-twenty20-bangladesh-2014-final-between-i.jpg",
  "https://cdn.shopify.com/s/files/1/0278/4565/6649/files/WhatsApp_Image_2024-05-31_at_01.20.04.webp?v=1717098851"
];

// Pre-computed static columns (defined outside so typing in inputs never reshuffles or restarts animations)
const BG_COL1 = [PLAYER_IMAGES[0], PLAYER_IMAGES[1], PLAYER_IMAGES[2], PLAYER_IMAGES[3], PLAYER_IMAGES[4], PLAYER_IMAGES[0], PLAYER_IMAGES[1], PLAYER_IMAGES[2], PLAYER_IMAGES[3], PLAYER_IMAGES[4]];
const BG_COL2 = [PLAYER_IMAGES[5], PLAYER_IMAGES[6], PLAYER_IMAGES[7], PLAYER_IMAGES[8], PLAYER_IMAGES[0], PLAYER_IMAGES[5], PLAYER_IMAGES[6], PLAYER_IMAGES[7], PLAYER_IMAGES[8], PLAYER_IMAGES[0]];
const BG_COL3 = [PLAYER_IMAGES[1], PLAYER_IMAGES[3], PLAYER_IMAGES[5], PLAYER_IMAGES[7], PLAYER_IMAGES[2], PLAYER_IMAGES[1], PLAYER_IMAGES[3], PLAYER_IMAGES[5], PLAYER_IMAGES[7], PLAYER_IMAGES[2]];
const BG_COL4 = [PLAYER_IMAGES[8], PLAYER_IMAGES[6], PLAYER_IMAGES[4], PLAYER_IMAGES[2], PLAYER_IMAGES[0], PLAYER_IMAGES[8], PLAYER_IMAGES[6], PLAYER_IMAGES[4], PLAYER_IMAGES[2], PLAYER_IMAGES[0]];

const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const el = e.target as HTMLElement;
    el.style.display = 'none';
    if (el.parentElement) {
        el.parentElement.style.display = 'none';
    }
};

const renderCard = (src: string, key: string) => (
    <div 
        key={key} 
        className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl bg-slate-800 border border-slate-700/50 opacity-60"
    >
        <img 
            src={src} 
            alt="Cricket player" 
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover grayscale" 
            onError={handleImgError}
        />
    </div>
);

const SlidingBackground = React.memo(() => {
    return (
        <div className="absolute inset-0 overflow-hidden z-0 bg-slate-950 flex items-center justify-center pointer-events-none select-none">
            {/* Overlay to dim images slightly so login form is readable */}
            <div className="absolute inset-0 bg-slate-950/75 z-10 pointer-events-none"></div>
            
            {/* Slanted Container */}
            <div className="relative w-[150vw] h-[150vh] flex gap-8 transform -rotate-12 scale-110 z-0">
                
                {/* Column 1 - Moves Up */}
                <div className="flex-1 min-w-[300px]">
                    <div className="flex flex-col gap-8 animate-marquee-up">
                        {BG_COL1.map((src, i) => renderCard(src, `c1-${i}`))}
                    </div>
                </div>

                {/* Column 2 - Moves Down (Slower) */}
                <div className="flex-1 min-w-[300px] mt-[-200px]">
                    <div className="flex flex-col gap-8 animate-marquee-down" style={{ animationDuration: '55s' }}>
                        {BG_COL2.map((src, i) => renderCard(src, `c2-${i}`))}
                    </div>
                </div>

                {/* Column 3 - Moves Up */}
                <div className="flex-1 min-w-[300px]">
                    <div className="flex flex-col gap-8 animate-marquee-up" style={{ animationDuration: '45s' }}>
                        {BG_COL3.map((src, i) => renderCard(src, `c3-${i}`))}
                    </div>
                </div>

                {/* Column 4 - Moves Down (Extra coverage) */}
                <div className="flex-1 min-w-[300px] mt-[-100px] hidden md:block">
                    <div className="flex flex-col gap-8 animate-marquee-down" style={{ animationDuration: '50s' }}>
                        {BG_COL4.map((src, i) => renderCard(src, `c4-${i}`))}
                    </div>
                </div>

            </div>
        </div>
    );
});
SlidingBackground.displayName = 'SlidingBackground';

const ProtectedLogo: React.FC<{ className?: string }> = ({ className }) => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = '/logo.png';
    img.onload = () => {
      canvas.width = img.naturalWidth || 1024;
      canvas.height = img.naturalHeight || 1024;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  }, []);

  return (
    <div 
      className="relative mx-auto inline-block select-none"
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
      style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
    >
      <canvas 
        ref={canvasRef}
        className={className}
        style={{ 
          userSelect: 'none', 
          WebkitUserSelect: 'none', 
          pointerEvents: 'none' 
        }}
      />
      {/* Invisible protective barrier blocking element inspection and drag */}
      <div 
        className="absolute inset-0 z-10 cursor-default select-none"
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
      />
    </div>
  );
};

const Home: React.FC = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  if (authLoading) return null;

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage('Check your email for the confirmation link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate('/dashboard'); // Will be redirected to Onboarding by App.tsx if needed
      }
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  return (
    <div className="min-h-screen py-4 px-3 sm:py-8 sm:px-4 flex items-center justify-center bg-slate-950 relative overflow-x-hidden">
      
      {/* Background Animation */}
      <SlidingBackground />

      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl px-5 py-5 sm:px-8 sm:pt-4 sm:pb-8 w-full max-w-[390px] sm:max-w-md shadow-2xl relative z-30 my-auto">
        <div className="text-center mb-3 sm:mb-5 select-none" onContextMenu={(e) => e.preventDefault()}>
          <ProtectedLogo className="w-20 h-20 sm:w-28 sm:h-28 mx-auto mb-1 object-contain drop-shadow-md" />
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent display-font leading-tight">
            VPL Auction 2027
          </h1>
          <p className="text-blue-400 font-medium text-xs sm:text-sm tracking-wide mt-0.5">Time for Season 2</p>
          <p className="text-slate-400 mt-0.5 sm:mt-1 text-xs sm:text-sm">Sign in to join the bidding war</p>
        </div>

        {/* Warning for development/setup */}
        {!import.meta.env.VITE_SUPABASE_URL && (
           <div className="mb-4 p-3 bg-red-900/40 border border-red-700 rounded-lg text-red-200 text-xs sm:text-sm">
             <strong>Configuration Required:</strong> Supabase credentials are missing. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment/Vercel settings.
           </div>
        )}

        {message && (
          <div className="mb-3 p-2.5 sm:p-3 bg-blue-900/30 border border-blue-800 rounded-lg text-blue-200 text-xs sm:text-sm">
            {message}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-1.5 sm:py-2 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-1.5 sm:py-2 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-sm sm:text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
        </form>

        <div className="my-3 sm:my-5 flex items-center">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="px-3 text-[11px] sm:text-xs text-slate-500 uppercase tracking-wider">Or continue with</span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-white text-slate-900 font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm sm:text-base hover:bg-slate-100 transition-colors"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
              fill="#FBBC05"
            />
            <path
              d="M12 4.36c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.09 14.97 0 12 0 7.7 0 3.99 2.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google
        </button>

        <p className="mt-3 sm:mt-5 text-center text-xs sm:text-sm text-slate-400">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-400 hover:text-blue-300 font-medium"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Home;
