import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ArrowRight, User } from 'lucide-react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ name: 'Guest User', email });
    navigate('/dashboard');
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
            className={`flex-1 py-3 text-xs font-bold tracking-widest uppercase rounded-capsule transition-all ${isLogin ? 'bg-white text-text shadow-sm' : 'text-zinc-500 hover:text-text'}`}
          >
            Login
          </button>
          <button 
            onClick={() => setIsLogin(false)}
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
                required 
                className="w-full bg-zinc-50 border border-zinc-200 rounded-capsule px-6 py-4 text-sm font-medium text-text outline-none focus:border-zinc-500 focus:bg-white transition-all shadow-sm"
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
              className="w-full bg-zinc-50 border border-zinc-200 rounded-capsule px-6 py-4 text-sm font-medium text-text outline-none focus:border-zinc-500 focus:bg-white transition-all shadow-sm"
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
              className="w-full bg-zinc-50 border border-zinc-200 rounded-capsule px-6 py-4 text-sm font-medium text-text outline-none focus:border-zinc-500 focus:bg-white transition-all shadow-sm"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            className="w-full mt-4 flex items-center justify-center gap-3 bg-text text-white px-8 py-5 rounded-capsule text-sm font-bold tracking-widest hover:bg-zinc-800 transition-all shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 group"
          >
            {isLogin ? 'LOG IN' : 'CREATE ACCOUNT'} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </motion.main>
  );
}
