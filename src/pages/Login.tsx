import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { ArrowRight, User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp, signInWithGoogle } = useAuthContext();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill all fields');
      return;
    }

    if (!isLogin && !name) {
      toast.error('Please enter your name');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        // LOGIN
        const result = await signIn(email, password);
        
        if (result.success) {
          toast.success('Welcome back to ELVERA');
          // ✅ Changed to home page
          navigate('/', { replace: true });
        } else {
          toast.error(result.error || 'Invalid credentials');
        }
      } else {
        // SIGN UP
        const result = await signUp(email, password, name);
        
        if (result.success) {
          toast.success('Account created successfully! 🎉');
          // ✅ Changed to home page
          navigate('/', { replace: true });
        } else {
          toast.error(result.error || 'Failed to create account');
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast.error(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    
    try {
      const result = await signInWithGoogle();
      
      if (result.success) {
        toast.success('Signed in with Google! 🎉');
        // ✅ Changed to home page
        navigate('/', { replace: true });
      } else {
        toast.error(result.error || 'Google sign-in failed');
      }
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      toast.error(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.main 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-32 pb-20 flex items-center justify-center px-6"
    >
      <div className="w-full max-w-md bg-white border border-zinc-200 rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_60px_rgb(0,0,0,0.06)] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-zinc-200 via-zinc-800 to-zinc-200"></div>
        <div className="flex items-center justify-center w-16 h-16 bg-zinc-100 rounded-full mb-8 mx-auto border border-zinc-200">
          <User className="w-6 h-6 text-zinc-600" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-center text-text mb-2 tracking-wide">
          {isLogin ? 'Welcome Back' : 'Join ELVERA'}
        </h1>
        <p className="text-center text-zinc-500 text-sm font-medium mb-10 tracking-wide">
          {isLogin ? 'Access your saved pieces and click history' : 'Create an account to save pieces'}
        </p>

        <div className="flex items-center justify-center bg-zinc-100 p-1.5 rounded-capsule mb-8 border border-zinc-200">
          <button 
            onClick={() => setIsLogin(true)}
            disabled={loading}
            className={`flex-1 py-3 text-xs font-bold tracking-widest uppercase rounded-capsule transition-all ${isLogin ? 'bg-white text-text shadow-sm' : 'text-zinc-500 hover:text-text'}`}
          >
            Login
          </button>
          <button 
            onClick={() => setIsLogin(false)}
            disabled={loading}
            className={`flex-1 py-3 text-xs font-bold tracking-widest uppercase rounded-capsule transition-all ${!isLogin ? 'bg-white text-text shadow-sm' : 'text-zinc-500 hover:text-text'}`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold tracking-widest text-zinc-400 uppercase mb-2">Full Name</label>
              <input 
                type="text" 
                required={!isLogin}
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-capsule px-6 py-4 text-sm font-medium text-text outline-none focus:border-zinc-500 focus:bg-white transition-all shadow-sm disabled:opacity-50"
                placeholder="John Doe"
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-bold tracking-widest text-zinc-400 uppercase mb-2">Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-capsule px-6 py-4 text-sm font-medium text-text outline-none focus:border-zinc-500 focus:bg-white transition-all shadow-sm disabled:opacity-50"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold tracking-widest text-zinc-400 uppercase mb-2">Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-capsule px-6 py-4 text-sm font-medium text-text outline-none focus:border-zinc-500 focus:bg-white transition-all shadow-sm disabled:opacity-50"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-4 flex items-center justify-center gap-3 bg-text text-white px-8 py-5 rounded-capsule text-sm font-bold tracking-widest hover:bg-zinc-800 transition-all shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {loading ? 'PLEASE WAIT...' : (isLogin ? 'LOG IN' : 'CREATE ACCOUNT')} 
            {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        {/* Google Sign In Button */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-zinc-400 font-bold tracking-widest">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full mt-6 flex items-center justify-center gap-3 bg-white border-2 border-zinc-200 text-text px-8 py-4 rounded-capsule text-sm font-bold tracking-widest hover:border-zinc-400 hover:bg-zinc-50 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            GOOGLE
          </button>
        </div>
      </div>
    </motion.main>
  );
}
