import React, { Component } from 'react';
import { AlertCircle, RefreshCw, ShoppingBag } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Storefront ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#faf5ea] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl border border-[#dfd5bf] shadow-xl p-8 text-center space-y-5">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-[#f3e8cc] border border-[#dfd5bf] flex items-center justify-center p-2.5">
              <img
                src="/logo.webp"
                alt="Godavari Organic Foods"
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#8c7355]">
                Godavari Organic Foods
              </span>
              <h2 className="font-urbanist font-black text-2xl text-[#18542a] mt-1">
                A Fresh Start Needed
              </h2>
              <p className="text-xs text-[#556b54] mt-2 leading-relaxed">
                The storefront encountered a momentary display update. Your cart items and account details remain safe.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 py-3 px-4 bg-white border border-[#dfd5bf] hover:bg-[#f3e8cc]/40 text-[#18542a] font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload</span>
              </button>
              <button
                onClick={this.handleReload}
                className="flex-1 py-3 px-4 bg-[#18542a] hover:bg-[#103b1d] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Home Store</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

