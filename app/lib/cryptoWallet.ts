import { createPublicClient, createWalletClient, getContract, http } from "viem";
import { hardhat } from "viem/chains";

const CONTRACT_ADDRESS: `0x${string}` = `0x${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!.replace(/^0x/, '')}`;
const ABI = [
  {
    "inputs": [],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
    "name": "getBalance",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Client pour lire les infos du contrat
export const publicClient = createPublicClient({
  chain: hardhat,
  transport: http(process.env.NEXT_PUBLIC_RPC_URL),
});

// Client pour envoyer des transactions
export const walletClient = createWalletClient({
  chain: hardhat,
  transport: http(process.env.NEXT_PUBLIC_RPC_URL),
});

// Contrat connecté à Viem
export const cryptoWalletContract = getContract({
  address: CONTRACT_ADDRESS,
  abi: ABI,
  client: walletClient,
});
