import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, User, Menu, X, LogOut, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { useAuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { bag, favorites } = useAppContext();
  const { user, signOut, isAdmin, loading } = useAuthContext();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.success) {
      toast.success('Successfully logged out.');
      navigate('/');
      setMobileMenuOpen(false);
    } else {
      toast.error('Failed to sign out');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Combos', path: '/combos' },
    { name: 'Shoes', path: '/shoes' }
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-4 glass-light' : 'py-6 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          <Link to="/" className="text-2xl font-serif font-semibold tracking-widest text-text">
            ELVERA
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="relative group text-sm font-medium tracking-wide text-zinc-600 hover:text-text transition-colors"
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 h-[1px] bg-text transition-all duration-300 ${location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4 lg:gap-6">
            <Link to="/favorites" className="relative p-2 rounded-full hover:bg-zinc-100 transition-colors group hidden sm:block">
              <Heart className="w-5 h-5 text-zinc-600 group-hover:text-text" strokeWidth={1.5} />
              {favorites.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-text rounded-full"></span>
              )}
            </Link>

            <Link to="/bag" className="relative p-2 rounded-full hover:bg-zinc-100 transition-colors group">
              <ShoppingBag className="w-5 h-5 text-zinc-600 group-hover:text-text" strokeWidth={1.5} />
              {bag.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-text text-white text-[10px] flex items-center justify-center rounded-full font-medium">
                  {bag.length}
                </span>
              )}
            </Link>

            {!loading && user ? (
              isAdmin ? (
                <Link
                  to="/admin/dashboard"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-capsule bg-black text-white hover:bg-zinc-800 transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-medium">Admin Panel</span>
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-capsule border border-zinc-200 hover:border-text transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-text">
                      {user.displayName?.charAt(0).toUpperCase() ||
                        user.email?.charAt(0).toUpperCase() ||
                        'U'}
                    </span>
                  </div>
                  <span className="text-sm font-medium">
                    {user.displayName?.split(' ')[0] || user.email?.split('@')[0] || 'Profile'}
                  </span>
                </Link>
              )
            ) : !loading ? (
              <Link
                to="/login"
                className="hidden sm:block px-6 py-2.5 rounded-capsule bg-text text-white text-sm font-medium hover:bg-zinc-800 transition-all shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5"
              >
                LOGIN
              </Link>
            ) : null}

            <button className="md:hidden p-2 text-text" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="w-6 h-6" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-white flex flex-col"
          >
            <div className="p-6 flex items-center justify-between border-b border-zinc-100">
              <span className="text-xl font-serif font-semibold tracking-widest text-text">ELVERA</span>
              <button className="p-2 bg-zinc-50 rounded-full text-zinc-600" onClick={() => setMobileMenuOpen(false)}>
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-8 px-6 flex flex-col gap-8">
              {navLinks.map((link) => (
                <Link key={link.name} to={link.path} className="text-3xl font-serif text-text hover:text-zinc-600 transition-colors">
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="p-6 border-t border-zinc-100 flex flex-col gap-4">
              <Link to="/favorites" className="flex items-center gap-4 text-lg text-zinc-600 hover:text-text">
                <Heart className="w-6 h-6" strokeWidth={1.5} /> Saved Items ({favorites.length})
              </Link>

              {!loading && user ? (
                <>
                  {isAdmin ? (
                    <Link
                      to="/admin/dashboard"
                      className="w-full py-4 bg-black text-white rounded-capsule text-center font-medium"
                    >
                      Go to Admin Panel
                    </Link>
                  ) : (
                    <Link
                      to="/dashboard"
                      className="w-full py-4 bg-text text-white rounded-capsule text-center font-medium"
                    >
                      Go to Dashboard
                    </Link>
                  )}

                  <button
                    onClick={handleSignOut}
                    className="w-full py-4 bg-zinc-100 text-text rounded-capsule text-center font-medium hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </>
              ) : !loading ? (
                <Link
                  to="/login"
                  className="w-full py-4 bg-text text-white rounded-capsule text-center font-medium mt-4"
                >
                  Log In or Sign Up
                </Link>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
