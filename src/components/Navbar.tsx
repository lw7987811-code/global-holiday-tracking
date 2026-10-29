import React from 'react';
import { Smartphone, Settings, FileText, TrendingUp, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  activeTab: 'h5' | 'admin';
  setActiveTab: (tab: 'h5' | 'admin') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-inner">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-wide">外盘数据早知道</span>
              <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                期货产品中心
              </span>
            </div>
          </div>
        </div>

        <nav className="flex items-center space-x-1 sm:space-x-2">
          <button
            onClick={() => setActiveTab('h5')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'h5'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>用户端 H5 预览</span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'admin'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>运营配置后台</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
