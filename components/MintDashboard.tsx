import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { ContractType } from '../types';
import { STANDARD_NFT_ABI, ERC1155_ABI } from '../constants/contracts';

interface MintDashboardProps {
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  contractAddress: string;
  contractType: ContractType;
  collectionName: string;
  onBack: () => void;
}

export const MintDashboard: React.FC<MintDashboardProps> = ({
  signer,
  contractAddress,
  contractType,
  collectionName,
  onBack
}) => {
  const { t } = useLanguage();
  const [isMinting, setIsMinting] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 721 Inputs
  const [quantity, setQuantity] = useState('1');

  // 1155 Inputs
  const [tokenId, setTokenId] = useState('1');
  const [amount, setAmount] = useState('1');

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signer || !contractAddress) return;

    setIsMinting(true);
    setError(null);
    setTxHash(null);

    try {
      const userAddress = await signer.getAddress();
      
      if (contractType === 'ERC721') {
        const contract = new ethers.Contract(contractAddress, STANDARD_NFT_ABI, signer);
        const qty = parseInt(quantity);
        
        // Loop mint based on standard ABI provided which only has mint(to)
        // In prod, use ERC721A or batchMint for gas efficiency.
        for (let i = 0; i < qty; i++) {
          const tx = await contract.mint(userAddress);
          if (i === qty - 1) {
            setTxHash(tx.hash); // Show last hash
            await tx.wait();
          } else {
             await tx.wait(); // Wait for sequence
          }
        }

      } else {
        // ERC-1155
        const contract = new ethers.Contract(contractAddress, ERC1155_ABI, signer);
        const data = "0x"; // Empty bytes
        const tx = await contract.mint(userAddress, tokenId, amount, data);
        setTxHash(tx.hash);
        await tx.wait();
      }

    } catch (err: any) {
      console.error("Minting failed", err);
      setError(err.message || "Minting Failed");
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="text-sm">
          {t.backToDeploy}
        </Button>
      </div>

      <div className="bg-slate-800 shadow-xl rounded-lg border border-slate-700 overflow-hidden">
        <div className="px-6 py-8 border-b border-slate-700 bg-slate-800/50">
          <h2 className="text-2xl font-bold text-white text-center">{t.mintDashboard}</h2>
          <div className="mt-2 text-center">
            <p className="text-slate-400 text-sm">{t.mintingFor} <span className="text-white font-medium">{collectionName}</span></p>
            <div className="flex justify-center gap-2 mt-2">
              <span className="px-2 py-0.5 rounded text-xs font-mono bg-slate-900 text-slate-300 border border-slate-600">
                {contractAddress}
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-brand-900 text-brand-200 border border-brand-700">
                {contractType}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleMint} className="p-6 space-y-6">
          
          {contractType === 'ERC721' ? (
             // ERC-721 Form
             <div>
               <Input 
                 label={t.mintQuantity}
                 type="number"
                 min="1"
                 max="20"
                 value={quantity}
                 onChange={(e) => setQuantity(e.target.value)}
                 required
               />
               <p className="text-xs text-slate-500 mt-2">Minting {quantity} unique tokens to yourself.</p>
             </div>
          ) : (
             // ERC-1155 Form
             <div className="grid grid-cols-2 gap-6">
                <Input 
                 label={t.tokenId}
                 type="number"
                 min="1"
                 value={tokenId}
                 onChange={(e) => setTokenId(e.target.value)}
                 required
               />
               <Input 
                 label={t.amount}
                 type="number"
                 min="1"
                 value={amount}
                 onChange={(e) => setAmount(e.target.value)}
                 required
               />
             </div>
          )}

          {error && (
            <div className="p-4 bg-red-900/50 border border-red-800 rounded-md">
              <p className="text-sm text-red-200">{t.error} {error}</p>
            </div>
          )}

          {txHash && (
            <div className="p-4 bg-green-900/50 border border-green-800 rounded-md">
              <h4 className="text-sm font-medium text-green-200 mb-2">{t.mintSuccess}</h4>
              <a 
                   href="#" 
                   className="text-xs text-brand-400 hover:text-brand-300 underline"
                   onClick={(e) => e.preventDefault()}
              >
                   {t.viewOnExplorer} (Tx: {txHash.slice(0, 10)}...)
              </a>
            </div>
          )}

          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full text-lg py-4" 
              isLoading={isMinting}
            >
              {isMinting ? t.minting : t.mint}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};