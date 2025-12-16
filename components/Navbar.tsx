import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/Button';

interface NavbarProps {
  onConnect: () => void;
  account: string | null;
  chainId: number | null;
}

export const Navbar: React.FC<NavbarProps> = ({ onConnect, account, chainId }) => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <nav className="bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl mr-2">🚀</span>
              <span className="font-bold text-xl tracking-tight text-white hidden sm:block">OmniLaunch</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {chainId && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">
                Chain ID: {chainId}
              </span>
            )}
            
            <button 
              onClick={toggleLanguage}
              className="p-2 rounded-md hover:bg-slate-800 transition-colors text-2xl"
              title={language === 'en' ? "Switch to Chinese" : "Switch to English"}
            >
              {language === 'en' ? '🇨🇳' : '🇺🇸'}
            </button>

            <Button onClick={onConnect} variant={account ? 'secondary' : 'primary'}>
              {account ? formatAddress(account) : t.connectWallet}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};