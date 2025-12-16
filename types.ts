export type Language = 'en' | 'zh';

export interface Translations {
  connectWallet: string;
  connected: string;
  deployCollection: string;
  collectionName: string;
  collectionSymbol: string;
  deploy: string;
  deploying: string;
  success: string;
  error: string;
  switchNetwork: string;
  addCustomChain: string;
  networkName: string;
  rpcUrl: string;
  chainId: string;
  currencySymbol: string;
  blockExplorer: string;
  addAndSwitch: string;
  cancel: string;
  modeSupported: string;
  modeCustom: string;
  contractAddress: string;
  viewOnExplorer: string;
  launchpadTitle: string;
  launchpadSubtitle: string;
  required: string;
  uploadImage: string;
  uploading: string;
  imageUploaded: string;
  ipfsUrlLabel: string;
}

export interface ChainConfig {
  chainId: number;
  name: string;
  rpc: string;
  explorer: string;
  factoryAddress?: string; // If present, use Factory mode
}

export interface CustomChainParams {
  chainId: string; // Hex string
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: 18;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
}