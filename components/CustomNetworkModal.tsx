import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { ChainData } from '../types';

interface CustomNetworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNetwork: (params: any) => Promise<void>;
}

export const CustomNetworkModal: React.FC<CustomNetworkModalProps> = ({ isOpen, onClose, onAddNetwork }) => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    chainId: '',
    chainName: '',
    rpcUrl: '',
    symbol: '',
    explorer: ''
  });

  // Search/Data State
  const [allChains, setAllChains] = useState<ChainData[]>([]);
  const [isFetchingChains, setIsFetchingChains] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch chains on mount
  useEffect(() => {
    if (isOpen && allChains.length === 0) {
      setIsFetchingChains(true);
      fetch('https://chainid.network/chains.json')
        .then(res => res.json())
        .then((data: ChainData[]) => {
          setAllChains(data);
        })
        .catch(err => console.error("Failed to fetch chains:", err))
        .finally(() => setIsFetchingChains(false));
    }
  }, [isOpen, allChains.length]);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectChain = (chain: ChainData) => {
    // Find first valid https RPC that doesn't require API key injection usually denoted by ${
    const validRpc = chain.rpc.find(r => r.startsWith('https://') && !r.includes('${')) || '';
    
    setFormData({
      chainId: chain.chainId.toString(),
      chainName: chain.name,
      rpcUrl: validRpc,
      symbol: chain.nativeCurrency?.symbol || '',
      explorer: chain.explorers && chain.explorers.length > 0 ? chain.explorers[0].url : ''
    });
    setSearchTerm(chain.name);
    setShowDropdown(false);
  };

  const filteredChains = allChains.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.chainId.toString().includes(searchTerm)
  ).slice(0, 10); // Limit results for performance

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Validate and Format Chain ID to Hex
      let chainIdHex = formData.chainId;
      if (!chainIdHex.startsWith('0x')) {
        chainIdHex = `0x${parseInt(formData.chainId).toString(16)}`;
      }

      await onAddNetwork({
        chainId: chainIdHex,
        chainName: formData.chainName,
        nativeCurrency: {
          name: formData.symbol,
          symbol: formData.symbol,
          decimals: 18,
        },
        rpcUrls: [formData.rpcUrl],
        blockExplorerUrls: formData.explorer ? [formData.explorer] : undefined,
      });
      onClose();
    } catch (error) {
      console.error("Failed to add network", error);
      alert(t.error + (error as any).message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-slate-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-slate-700">
          <div className="bg-slate-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 className="text-lg leading-6 font-medium text-white mb-4" id="modal-title">
              {t.addCustomChain}
            </h3>

            {/* Search Combobox */}
            <div className="mb-6 relative" ref={dropdownRef}>
              <label className="block text-sm font-medium text-brand-400 mb-1">
                {t.searchNetwork}
              </label>
              <input
                type="text"
                className="appearance-none block w-full px-3 py-2 border border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 bg-slate-900 text-white sm:text-sm"
                placeholder={isFetchingChains ? t.loadingNetworks : "Type to search..."}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
              />
              
              {showDropdown && searchTerm && (
                <div className="absolute z-50 w-full mt-1 bg-slate-700 rounded-md shadow-lg max-h-60 overflow-auto border border-slate-600">
                   {isFetchingChains && <div className="p-2 text-slate-400 text-sm text-center">{t.loadingNetworks}</div>}
                   {!isFetchingChains && filteredChains.length === 0 && (
                     <div className="p-2 text-slate-400 text-sm text-center">{t.noResults}</div>
                   )}
                   {filteredChains.map((chain) => (
                     <button
                       key={chain.chainId}
                       type="button"
                       className="w-full text-left px-4 py-2 text-sm text-white hover:bg-brand-600 transition-colors border-b border-slate-600 last:border-0"
                       onClick={() => handleSelectChain(chain)}
                     >
                       <div className="font-medium">{chain.name}</div>
                       <div className="text-xs text-slate-300 flex justify-between">
                         <span>ID: {chain.chainId}</span>
                         <span>{chain.nativeCurrency?.symbol}</span>
                       </div>
                     </button>
                   ))}
                </div>
              )}
            </div>
            
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-slate-600"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-2 bg-slate-800 text-xs text-slate-400">
                  {t.manualEntry}
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input 
                label={t.networkName} 
                required 
                placeholder="e.g. My Custom Chain" 
                value={formData.chainName}
                onChange={(e) => setFormData({...formData, chainName: e.target.value})}
              />
              <Input 
                label={t.rpcUrl} 
                required 
                placeholder="https://..." 
                value={formData.rpcUrl}
                onChange={(e) => setFormData({...formData, rpcUrl: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label={t.chainId} 
                  required 
                  placeholder="e.g. 1234" 
                  value={formData.chainId}
                  onChange={(e) => setFormData({...formData, chainId: e.target.value})}
                />
                <Input 
                  label={t.currencySymbol} 
                  required 
                  placeholder="e.g. ETH" 
                  value={formData.symbol}
                  onChange={(e) => setFormData({...formData, symbol: e.target.value})}
                />
              </div>
              <Input 
                label={t.blockExplorer} 
                placeholder="https://..." 
                value={formData.explorer}
                onChange={(e) => setFormData({...formData, explorer: e.target.value})}
              />
              
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <Button type="submit" isLoading={isLoading} className="w-full sm:col-start-2">
                  {t.addAndSwitch}
                </Button>
                <Button type="button" variant="secondary" className="mt-3 w-full sm:mt-0 sm:col-start-1" onClick={onClose}>
                  {t.cancel}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};