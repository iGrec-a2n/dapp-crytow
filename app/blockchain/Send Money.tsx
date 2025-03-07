"use client";

import { useState } from "react";
import { ethers } from "ethers";
// import { HETIC_ABI } from "@/public/hetic";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Remplace par l'adresse de ton smart contract

export default function SendMoney() {
    const [privateKeyOrAccount, setPrivateKeyOrAccount] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [isRequestPending, setIsRequestPending] = useState(false);

    const connectWallet = async () => {
        if (!window.ethereum) {
            setMessage("MetaMask n'est pas installé.");
            return;
        }

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);

            // Vérifie si l'utilisateur est déjà connecté
            const accounts = await provider.send("eth_accounts", []);
            if (accounts.length === 0) {
                await provider.send("eth_requestAccounts", []);
            }

            setMessage("Connexion réussie !");
        } catch (error: any) {
            console.error(error);
            setMessage("Erreur lors de la connexion à MetaMask.");
        }
    };

    const handleSend = async () => {
        if (!privateKeyOrAccount || !amount) {
            setMessage("Veuillez remplir tous les champs.");
            return;
        }

        if (isNaN(Number(amount)) || Number(amount) <= 0) {
            setMessage("Veuillez entrer un montant valide.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            if (!window.ethereum) {
                setMessage("MetaMask n'est pas installé.");
                setLoading(false);
                return;
            }

            setIsRequestPending(true);

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            let recipient;
            let wallet;

            // Vérifie si c'est une clé privée ou une adresse Ethereum
            if (privateKeyOrAccount.startsWith("0x") && privateKeyOrAccount.length === 66) {
                wallet = new ethers.Wallet(privateKeyOrAccount, provider);
                recipient = wallet.address;
            } else if (ethers.isAddress(privateKeyOrAccount)) {
                recipient = privateKeyOrAccount;
            } else {
                setMessage("Adresse ou clé privée invalide.");
                setLoading(false);
                setIsRequestPending(false);
                return;
            }

            // Envoi des fonds
            const tx = await signer.sendTransaction({
                to: recipient,
                value: ethers.parseEther(amount),
            });

            await tx.wait();
            setMessage("Transaction réussie !");
        } catch (error) {
            console.error(error);
            setMessage("Erreur lors de la transaction.");
        }

        setLoading(false);
        setIsRequestPending(false);
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-4 text-center">Transfert d&apos;argent</h2>

            <ConnectButton />

            <label className="block text-gray-700">Clé privée ou adresse Ethereum</label>
            <input
                type="text"
                value={privateKeyOrAccount}
                onChange={(e) => setPrivateKeyOrAccount(e.target.value)}
                className="w-full p-2 border rounded-md mb-3"
                placeholder="0x... (Clé privée ou adresse ETH)"
            />

            <label className="block text-gray-700">Montant à envoyer (ETH)</label>
            <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 border rounded-md mb-3"
                placeholder="Montant en ETH"
            />

            <button
                onClick={handleSend}
                disabled={loading || isRequestPending}
                className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
                {loading ? "Envoi en cours..." : "Envoyer"}
            </button>

            {message && <p className="text-center mt-3 text-red-500">{message}</p>}
        </div>
    );
}

