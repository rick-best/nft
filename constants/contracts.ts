// IMPORTANT: To fix 'execution reverted' errors, you MUST compile the contracts in the /contracts folder
// and replace the BYTECODE strings below with your actual compiled artifacts.

// --- ERC-721A (Optimized) ---

export const STANDARD_NFT_ABI = [
  // Constructor for direct deployment via Ethers (matches ERC721Launchpad.sol)
  "constructor(string name, string symbol, string baseTokenURI, uint256 maxSupply, address initialOwner)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function owner() view returns (address)",
  "function totalSupply() view returns (uint256)",
  "function maxSupply() view returns (uint256)",
  // ERC721A minting:
  "function mint(uint256 quantity) external payable", 
  "function transferOwnership(address newOwner) public"
];

// ⚠️ PLACEHOLDER - REPLACE THIS WITH REAL COMPILED BYTECODE FROM REMIX/HARDHAT ⚠️
// If you use this dummy string, transactions will REVERT because the code is empty.
export const STANDARD_NFT_BYTECODE = "0x608060405234801561001057600080fd5b50610150806100206000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c806306fdde0314602d57806395d89b4114604b575b600080fd5b60336069565b6040518082815260200191505060405180910390f35b604d6071565b6040518082815260200191505060405180910390f35b60606002565b90565b60646002565b9056fea2646970667358221220a2";


// --- ERC-1155 ---

export const ERC1155_ABI = [
  "constructor(string uri)",
  "function uri(uint256) public view returns (string memory)",
  "function mint(address account, uint256 id, uint256 amount, bytes memory data) public",
  "function transferOwnership(address newOwner) public"
];

export const ERC1155_BYTECODE = "0x608060405234801561001057600080fd5b50610150806100206000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c806306fdde0314602d57806395d89b4114604b575b600080fd5b60336069565b6040518082815260200191505060405180910390f35b604d6071565b6040518082815260200191505060405180910390f35b60606002565b90565b60646002565b9056fea2646970667358221220a2";

// --- Factory ---

export const FACTORY_ADDRESSES: Record<number, string> = {
  11155111: "0x1234567890123456789012345678901234567890", // Sepolia Mock
  5: "0x0987654321098765432109876543210987654321", // Goerli Mock
};

export const FACTORY_ABI = [
  "function deployCollection(string name, string symbol, string baseTokenURI, uint256 maxSupply) external returns (address)"
];