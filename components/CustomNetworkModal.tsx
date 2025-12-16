import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface CustomNetworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNetwork: (params: any) => Promise<void>;
}

export const CustomNetworkModal: React.FC<CustomNetworkModalProps> = ({ isOpen, onClose, onAddNetwork }) => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    chainId: '',
    chainName: '',
    rpcUrl: '',
    symbol: '',
    explorer: ''
  });

  if (!isOpen) return null;

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
                  placeholder="e.g. 1234 or 0x..." 
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