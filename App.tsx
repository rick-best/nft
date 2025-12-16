import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { Navbar } from './components/Navbar';
import { DeployForm } from './components/DeployForm';
import { CustomNetworkModal } from './components/CustomNetworkModal';
import { Translations } from './types';

// Fix: Extend Window interface to include ethereum property
declare global {
  interface Window {
    ethereum: any;
  }
}

// Wrapper component to use the hook
const AppContent = () => {
  const { t } = useLanguage();
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const connectWallet = useCallback(async () => {
    if (window.ethereum) {
      try {
        const _provider = new ethers.BrowserProvider(window.ethereum);
        const _signer = await _provider.getSigner();
        const _network = await _provider.getNetwork();
        const _account = await _signer.getAddress();

        setProvider(_provider);
        setSigner(_signer);
        setChainId(Number(_network.chainId));
        setAccount(_account);

        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts: string[]) => {
          if (accounts.length > 0) setAccount(accounts[0]);
          else setAccount(null);
        });

        // Listen for chain changes
        window.ethereum.on('chainChanged', () => {
          window.location.reload();
        });

      } catch (err) {
        console.error("Failed to connect wallet", err);
      }
    } else {
      alert("Please install MetaMask!");
    }
  }, []);

  const handleAddNetwork = async (params: any) => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [params],
      });
      // Refresh provider info after switch
      await connectWallet();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // Auto connect if previously connected (optional logic, skipped for simplicity)

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-brand-500 selection:text-white">
      <Navbar onConnect={connectWallet} account={account} chainId={chainId} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-indigo-500 mb-4">
            {t.launchpadTitle}
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            {t.launchpadSubtitle}
          </p>
        </div>

        <DeployForm 
          provider={provider} 
          signer={signer} 
          account={account} 
          chainId={chainId} 
          onOpenCustomChainModal={() => setIsModalOpen(true)}
        />
      </main>

      <CustomNetworkModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAddNetwork={handleAddNetwork} 
      />
    </div>
  );
};

const App = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;