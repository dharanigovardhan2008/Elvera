import { Link } from 'react-router-dom';
import { Camera, Share2, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-text text-white py-20 px-6 lg:px-12 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-8">
        <div className="col-span-1 md:col-span-2 flex flex-col items-start space-y-6">
          <Link to="/" className="text-4xl font-serif font-semibold tracking-widest text-white hover:opacity-80 transition-opacity">
            ELVERA
          </Link>
          <p className="text-zinc-400 font-medium max-w-sm leading-relaxed tracking-wide text-balance">
            Dress like no one else. We curate the best premium fashion pieces from trusted platforms.
          </p>
          <div className="flex items-center space-x-5 pt-4">
            <a href="#" className="p-3 bg-zinc-800 rounded-full hover:bg-white hover:text-black transition-all duration-300 group">
              <Camera className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </a>
            <a href="#" className="p-3 bg-zinc-800 rounded-full hover:bg-white hover:text-black transition-all duration-300 group">
              <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </a>
            <a href="#" className="p-3 bg-zinc-800 rounded-full hover:bg-white hover:text-black transition-all duration-300 group">
              <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </a>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Shop</h4>
          <ul className="space-y-4">
            <li><Link to="/shop" className="text-zinc-300 hover:text-white transition-colors">All Products</Link></li>
            <li><Link to="/combos" className="text-zinc-300 hover:text-white transition-colors">Outfits</Link></li>
            <li><Link to="/shoes" className="text-zinc-300 hover:text-white transition-colors">Footwear</Link></li>
            <li><Link to="/shop?category=accessories" className="text-zinc-300 hover:text-white transition-colors">Accessories</Link></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Company</h4>
          <ul className="space-y-4">
            <li><a href="#" className="text-zinc-300 hover:text-white transition-colors">About Us</a></li>
            <li><a href="#" className="text-zinc-300 hover:text-white transition-colors">Contact</a></li>
            <li><a href="#" className="text-zinc-300 hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="text-zinc-300 hover:text-white transition-colors">Terms of Service</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-zinc-500 tracking-wide">
          &copy; {new Date().getFullYear()} ELVERA. All rights reserved.
        </p>
        <p className="text-sm text-zinc-500 bg-zinc-900 px-6 py-2 rounded-capsule border border-zinc-800 text-center">
          We only redirect to trusted platforms. We do not sell directly.
        </p>
      </div>
    </footer>
  );
}
