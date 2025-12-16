// This represents a standard OpenZeppelin ERC721PresetMinterPauserAutoId or similar
// For the sake of this demo, we use a minimal ABI and a placeholder Bytecode.
// In a real app, this would be the full compiled output.

// UPGRADE: Switched to ERC721A ABI for Gas Optimization
export const STANDARD_NFT_ABI = [
  "constructor(string name, string symbol, string baseTokenURI, uint256 maxSupply)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function owner() view returns (address)",
  "function mint(uint256 quantity) public payable", // ERC721A: Mint to msg.sender
  "function transferOwnership(address newOwner) public"
];

// Placeholder Bytecode for 721 (ERC721A Optimized)
export const STANDARD_NFT_BYTECODE = "0x608060405234801561001057600080fd5b50610150806100206000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c806306fdde0314602d57806395d89b4114604b575b600080fd5b60336069565b6040518082815260200191505060405180910390f35b604d6071565b6040518082815260200191505060405180910390f35b60606002565b90565b60646002565b9056fea2646970667358221220a2";


// --- ERC-1155 ---

export const ERC1155_ABI = [
  "constructor(string uri)",
  "function uri(uint256) public view returns (string memory)",
  "function mint(address to, uint256 id, uint256 amount, bytes memory data) public",
  "function transferOwnership(address newOwner) public"
];

// Placeholder Bytecode for 1155 - Replace with real bytecode for production
export const ERC1155_BYTECODE = "0x608060405234801561001057600080fd5b50610150806100206000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c806306fdde0314602d57806395d89b4114604b575b600080fd5b60336069565b6040518082815260200191505060405180910390f35b604d6071565b6040518082815260200191505060405180910390f35b60606002565b90565b60646002565b9056fea2646970667358221220a2";

// Supported chains where we have a factory deployed
// This allows for gas-optimized proxy deployments (Mode A)
export const FACTORY_ADDRESSES: Record<number, string> = {
  11155111: "0x1234567890123456789012345678901234567890", // Sepolia Mock
  5: "0x0987654321098765432109876543210987654321", // Goerli Mock
};

// Updated Factory ABI to include maxSupply for 721 deployments
export const FACTORY_ABI = [
  "function deployCollection(string name, string symbol, string baseTokenURI, uint256 maxSupply) external returns (address)"
];