export type Language = 'en' | 'zh';
export type ContractType = 'ERC721' | 'ERC1155';

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
  // Network Search
  searchNetwork: string;
  loadingNetworks: string;
  selectNetwork: string;
  manualEntry: string;
  noResults: string;
  // New keys for Upgrade
  selectStandard: string;
  std721: string;
  std721Desc: string;
  std1155: string;
  std1155Desc: string;
  mintDashboard: string;
  mintingFor: string;
  mintQuantity: string;
  tokenId: string;
  amount: string;
  mint: string;
  minting: string;
  mintSuccess: string;
  backToDeploy: string;
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

export interface ChainData {
  name: string;
  chainId: number;
  shortName: string;
  chain: string;
  networkId: number;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpc: string[];
  faucets: string[];
  explorers?: {
    name: string;
    url: string;
    standard: string;
  }[];
}