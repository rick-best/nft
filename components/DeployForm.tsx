import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { 
  FACTORY_ADDRESSES, 
  FACTORY_ABI, 
  STANDARD_NFT_ABI, 
  STANDARD_NFT_BYTECODE,
  ERC1155_ABI,
  ERC1155_BYTECODE 
} from '../constants/contracts';
import { ContractType } from '../types';

interface DeployFormProps {
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  account: string | null;
  chainId: number | null;
  onOpenCustomChainModal: () => void;
  onSuccess: (address: string, type: ContractType, name: string) => void;
}

export const DeployForm: React.FC<DeployFormProps> = ({ 
  provider, 
  signer, 
  account, 
  chainId, 
  onOpenCustomChainModal,
  onSuccess
}) => {
  const { t } = useLanguage();
  const [contractType, setContractType] = useState<ContractType>('ERC721');
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [maxSupply, setMaxSupply] = useState('10000');
  const [isDeploying, setIsDeploying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Image Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [ipfsUrl, setIpfsUrl] = useState('');

  // Pinata Keys
  const PINATA_API_KEY = "06fd7d4dd9331ae8847d";
  const PINATA_SECRET_KEY = "ac90ff56f19d1653ab90514e77a531ae17d0aaa482c87f216aa47bc0018bfd55";

  // Determine Deployment Mode
  // Factory currently only supports 721 in this demo.
  const isFactorySupported = chainId && FACTORY_ADDRESSES[chainId] && contractType === 'ERC721';

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_KEY,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Pinata upload failed');
      }

      const data = await response.json();
      const url = `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
      setIpfsUrl(url);
    } catch (err: any) {
      console.error(err);
      setError("Image Upload Failed: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signer || !chainId) return;
    
    setIsDeploying(true);
    setError(null);

    try {
      let address = '';

      if (contractType === 'ERC721') {
        if (isFactorySupported) {
          // Mode A: Factory Deployment (721)
          const factoryAddress = FACTORY_ADDRESSES[chainId];
          const factory = new ethers.Contract(factoryAddress, FACTORY_ABI, signer);
          console.log(`Deploying ERC721 via Factory at ${factoryAddress}...`);
          // Pass maxSupply
          const tx = await factory.deployCollection(name, symbol, ipfsUrl, maxSupply);
          await tx.wait();
          address = "0x... (Check Explorer)"; 
        } else {
          // Mode B: Direct Deployment (721)
          // Uses Standard ABI with maxSupply in constructor
          console.log("Deploying ERC721 directly...");
          const factory = new ethers.ContractFactory(STANDARD_NFT_ABI, STANDARD_NFT_BYTECODE, signer);
          const contract = await factory.deploy(name, symbol, ipfsUrl, maxSupply); 
          await contract.waitForDeployment();
          address = await contract.getAddress();
        }
      } else {
        // Mode C: Direct Deployment (1155)
        // Note: 1155 constructor args: (uri)
        // Direct deployment inherently makes msg.sender (signer) the owner.
        console.log("Deploying ERC1155 directly...");
        const factory = new ethers.ContractFactory(ERC1155_ABI, ERC1155_BYTECODE, signer);
        const contract = await factory.deploy(ipfsUrl); 
        await contract.waitForDeployment();
        address = await contract.getAddress();
      }

      // Trigger Success Callback
      onSuccess(address, contractType, name || "My Collection");

    } catch (err: any) {
      console.error(err);
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
          
          <div className="mt-4 flex justify-center space-x-4">
             {/* Radio Group for Standard */}
             <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-700">
               <button
                 type="button"
                 onClick={() => setContractType('ERC721')}
                 className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                   contractType === 'ERC721' ? 'bg-brand-600 text-white shadow' : 'text-slate-400 hover:text-white'
                 }`}
               >
                 {t.std721}
               </button>
               <button
                 type="button"
                 onClick={() => setContractType('ERC1155')}
                 className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                   contractType === 'ERC1155' ? 'bg-brand-600 text-white shadow' : 'text-slate-400 hover:text-white'
                 }`}
               >
                 {t.std1155}
               </button>
             </div>
          </div>
          <p className="text-center text-xs text-slate-500 mt-2">
            {contractType === 'ERC721' ? t.std721Desc : t.std1155Desc}
          </p>

          {!isFactorySupported && contractType === 'ERC721' && (
            <div className="mt-4 text-center">
               <p className="text-sm text-slate-400 mb-2">Chain ID: {chainId} not in factory list.</p>
               <Button variant="secondary" onClick={onOpenCustomChainModal} className="text-xs">
                 {t.addCustomChain}
               </Button>
            </div>
          )}
        </div>
        
        <form onSubmit={handleDeploy} className="p-6 space-y-6">
          {/* File Upload Section */}
          <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 border-dashed">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              {t.uploadImage}
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading || isDeploying}
                className="block w-full text-sm text-slate-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-brand-600 file:text-white
                  hover:file:bg-brand-700
                  cursor-pointer"
              />
              {isUploading && <span className="text-brand-400 text-sm animate-pulse">{t.uploading}</span>}
            </div>
            {ipfsUrl && (
              <div className="mt-3 p-2 bg-green-900/20 rounded border border-green-800/50">
                <p className="text-xs text-green-400 font-medium mb-1">✅ {t.imageUploaded}</p>
                <p className="text-xs text-slate-500 break-all">{ipfsUrl}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label={t.collectionName} 
              placeholder={contractType === 'ERC721' ? "e.g. Bored Apes" : "e.g. Game Items"} 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            
            {/* Symbol is only for ERC721 */}
            {contractType === 'ERC721' && (
              <Input 
                label={t.collectionSymbol} 
                placeholder="e.g. BAYC" 
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                required
              />
            )}
          </div>

          {/* New Max Supply Input for ERC721 */}
          {contractType === 'ERC721' && (
             <Input 
               label={t.maxSupply}
               type="number"
               placeholder="10000" 
               value={maxSupply}
               onChange={(e) => setMaxSupply(e.target.value)}
               required
             />
          )}

          {/* Hidden/Read-only IPFS Input display */}
          {ipfsUrl && (
             <Input 
               label={t.ipfsUrlLabel} 
               value={ipfsUrl} 
               readOnly 
               className="bg-slate-900 text-slate-500 cursor-not-allowed"
             />
          )}

          {error && (
            <div className="p-4 bg-red-900/50 border border-red-800 rounded-md">
              <p className="text-sm text-red-200">{t.error} {error}</p>
            </div>
          )}

          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full text-lg py-4" 
              isLoading={isDeploying}
              disabled={!name || (!symbol && contractType === 'ERC721') || !ipfsUrl}
            >
              {isDeploying ? t.deploying : t.deploy}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};