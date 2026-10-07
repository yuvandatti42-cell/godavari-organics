import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, User, Lock, Mail, Smartphone, Leaf } from 'lucide-react';

export default function AuthModal() {
  const { setAuthModalOpen, showToast } = useCart();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    showToast(isSignUp ? 'Welcome to Godavari Organic Family! Account created.' : 'Successfully logged in!');
    setAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#f3e8cc] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-[#d9ca9d] relative p-6 space-y-5">
        
        {/* Close Button */}
        <button 
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#e6dec9] hover:bg-[#d9ca9d] flex items-center justify-center text-[#18542a] transition-colors border border-[#c8b894]"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#163b28] flex items-center justify-center mx-auto mb-2">
            <Leaf className="w-6 h-6 text-[#2d6a4f]" />
          </div>
          <h3 className="text-xl font-bold font-serif text-[#163b28]">
            {isSignUp ? 'Join Organic Collective' : 'Sign in to Your Account'}
          </h3>
          <p className="text-xs text-gray-500">
            Access exclusive organic discounts, farm updates & track orders
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          {isSignUp && (
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Full Name</label>
              <div className="relative">
                <input 
                  type="text"
                  required
                  placeholder="Enter your name"
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-[#2d6a4f]"
                />
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Email or Mobile Number</label>
            <div className="relative">
              <input 
                type="text"
                required
                placeholder="name@example.com or +91..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-[#2d6a4f]"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">Password</label>
            <div className="relative">
              <input 
                type="password"
                required
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-[#2d6a4f]"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#163b28] hover:bg-[#2d6a4f] text-white font-bold rounded-xl shadow-lg transition-colors"
          >
            {isSignUp ? 'Create Free Account' : 'Sign In Now'}
          </button>
        </form>

        <div className="text-center text-xs text-gray-600 border-t border-gray-100 pt-3">
          {isSignUp ? 'Already have an account?' : "Don't have an account yet?"}{' '}
          <button 
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="font-bold text-[#2d6a4f] hover:underline"
          >
            {isSignUp ? 'Sign In' : 'Register Here'}
          </button>
        </div>

      </div>
    </div>
  );
}
