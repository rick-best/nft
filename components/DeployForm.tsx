import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { FACTORY_ADDRESSES, FACTORY_ABI, STANDARD_NFT_ABI, STANDARD_NFT_BYTECODE } from '../constants/contracts';

interface DeployFormProps {
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  account: string | null;
  chainId: number | null;
  onOpenCustomChainModal: () => void;
}

export const DeployForm: React.FC<DeployFormProps> = ({ provider, signer, account, chainId, onOpenCustomChainModal }) => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployedAddress, setDeployedAddress] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Determine Deployment Mode
  const isFactorySupported = chainId && FACTORY_ADDRESSES[chainId];

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signer || !chainId) return;
    
    setIsDeploying(true);
    setError(null);
    setDeployedAddress(null);
    setTxHash(null);

    try {
      if (isFactorySupported) {
        // Mode A: Factory Deployment
        const factoryAddress = FACTORY_ADDRESSES[chainId];
        const factory = new ethers.Contract(factoryAddress, FACTORY_ABI, signer);
        
        console.log(`Deploying via Factory at ${factoryAddress}...`);
        const tx = await factory.deployCollection(name, symbol);
        setTxHash(tx.hash);
        const receipt = await tx.wait();
        
        // This assumes the factory emits an event or we calculate address. 
        // For simplicity in this demo, we mock the address retrieval or grab from logs if we had the event ABI.
        // Let's assume the factory returns the address in a real scenario via a call or event. 
        // Here we just show the TX hash and a mock address for demo purposes if event parsing logic is complex without full ABI.
        // In a real generic factory, we'd parse the "CollectionDeployed" event.
        setDeployedAddress("0x... (Check Explorer)"); 
      } else {
        // Mode B: Direct Deployment (Custom Chain)
        console.log("Deploying directly via Bytecode...");
        const factory = new ethers.ContractFactory(STANDARD_NFT_ABI, STANDARD_NFT_BYTECODE, signer);
        
        // BaseURI is empty for this demo
        const contract = await factory.deploy(name, symbol, ""); 
        setTxHash(contract.deploymentTransaction()?.hash || null);
        
        await contract.waitForDeployment();
        const address = await contract.getAddress();
        setDeployedAddress(address);
      }
    } catch (err: any) {
      console.error(err);
      // If code is placeholder, it will fail.
      if (err.code === 'INVALID_ARGUMENT' && err.message.includes('invalid bytecode')) {
        setError("Dev Note: Real deployment requires valid compiled bytecode in constants/contracts.ts");
      } else {
        setError(err.message || "Deployment Failed");
      }
    } finally {
      setIsDeploying(false);
    }
  };

  if (!account) {
    return (
      <div className="text-center py-12 bg-slate-800 rounded-lg border border-slate-700">
        <div className="text-4xl mb-4">👛</div>
        <h3 className="text-xl font-medium text-white mb-2">{t.connectWallet}</h3>
        <p className="text-slate-400">{t.launchpadSubtitle}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-slate-800 shadow-xl rounded-lg border border-slate-700 overflow-hidden">
        <div className="px-6 py-8 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white text-center">{t.deployCollection}</h2>
          <div className="mt-2 flex justify-center">
             <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isFactorySupported ? 'bg-green-900 text-green-200' : 'bg-yellow-900 text-yellow-200'}`}>
                {isFactorySupported ? t.modeSupported : t.modeCustom}
             </span>
          </div>
          {!isFactorySupported && (
            <div className="mt-4 text-center">
               <p className="text-sm text-slate-400 mb-2">Chain ID: {chainId} not in factory list.</p>
               <Button variant="secondary" onClick={onOpenCustomChainModal} className="text-xs">
                 {t.addCustomChain}
               </Button>
            </div>
          )}
        </div>
        
        <form onSubmit={handleDeploy} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label={t.collectionName} 
              placeholder="e.g. Bored Apes" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input 
              label={t.collectionSymbol} 
              placeholder="e.g. BAYC" 
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="p-4 bg-red-900/50 border border-red-800 rounded-md">
              <p className="text-sm text-red-200">{t.error} {error}</p>
            </div>
          )}

          {deployedAddress && (
            <div className="p-4 bg-green-900/50 border border-green-800 rounded-md">
              <h4 className="text-sm font-medium text-green-200 mb-2">{t.success}</h4>
              <p className="text-xs text-green-100 mb-1">{t.contractAddress}: <span className="font-mono">{deployedAddress}</span></p>
              {txHash && (
                 <a 
                   href="#" 
                   className="text-xs text-brand-400 hover:text-brand-300 underline"
                   onClick={(e) => e.preventDefault()} // Placeholder link
                 >
                   {t.viewOnExplorer} (Tx: {txHash.slice(0, 10)}...)
                 </a>
              )}
            </div>
          )}

          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full text-lg py-4" 
              isLoading={isDeploying}
              disabled={!name || !symbol}
            >
              {isDeploying ? t.deploying : t.deploy}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};