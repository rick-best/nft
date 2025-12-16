// This represents a standard OpenZeppelin ERC721PresetMinterPauserAutoId or similar
// For the sake of this demo, we use a minimal ABI and a placeholder Bytecode.
// In a real app, this would be the full compiled output.

export const STANDARD_NFT_ABI = [
  "constructor(string name, string symbol, string baseTokenURI)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function owner() view returns (address)",
  "function mint(address to) public"
];

// Placeholder Bytecode - A real bytecode string is very long.
// This is a dummy hex to simulate the structure.
// IF YOU RUN THIS FOR REAL, REPLACE WITH REAL COMPILED BYTECODE (e.g., from Hardhat/Foundry)
export const STANDARD_NFT_BYTECODE = "0x608060405234801561001057600080fd5b50610150806100206000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c806306fdde0314602d57806395d89b4114604b575b600080fd5b60336069565b6040518082815260200191505060405180910390f35b604d6071565b6040518082815260200191505060405180910390f35b60606002565b90565b60646002565b9056fea2646970667358221220a2";

// Supported chains where we have a factory deployed
// This allows for gas-optimized proxy deployments (Mode A)
export const FACTORY_ADDRESSES: Record<number, string> = {
  11155111: "0x1234567890123456789012345678901234567890", // Sepolia Mock
  5: "0x0987654321098765432109876543210987654321", // Goerli Mock
};

export const FACTORY_ABI = [
  "function deployCollection(string name, string symbol) external returns (address)"
];