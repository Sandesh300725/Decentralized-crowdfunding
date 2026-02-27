import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import toast from "react-hot-toast";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../utils/contract";

const Web3Context = createContext(null);

export const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) { toast.error("MetaMask not found!"); return; }
    try {
      setIsConnecting(true);
      const _provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await _provider.send("eth_requestAccounts", []);
      const _signer = await _provider.getSigner();
      const { chainId: _chainId } = await _provider.getNetwork();
      const _contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, _signer);
      setProvider(_provider); setSigner(_signer); setContract(_contract);
      setAccount(accounts[0]); setChainId(Number(_chainId));
      toast.success("Wallet connected!");
    } catch (err) { toast.error("Failed to connect wallet."); }
    finally { setIsConnecting(false); }
  }, []);

  const disconnectWallet = () => {
    setProvider(null); setSigner(null); setContract(null); setAccount(null); setChainId(null);
    toast("Wallet disconnected.");
  };

  useEffect(() => {
    if (!window.ethereum) return;
    const handleAccountsChanged = (accs) => { if (accs.length === 0) disconnectWallet(); else setAccount(accs[0]); };
    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", () => window.location.reload());
    return () => { window.ethereum.removeAllListeners(); };
  }, []);

  const loadCampaigns = useCallback(async () => {
    if (!contract) return;
    try {
      setLoading(true);
      const raw = await contract.getAllCampaigns();
      const parsed = raw.map((c) => ({
        id: Number(c.id), owner: c.owner, title: c.title,
        description: c.description, imageUrl: c.imageUrl, category: c.category,
        goal: ethers.formatEther(c.goal), deadline: Number(c.deadline) * 1000,
        amountRaised: ethers.formatEther(c.amountRaised), claimed: c.claimed, active: c.active,
        progress: c.goal > 0n ? Math.min(100, Math.round((Number(c.amountRaised) * 100) / Number(c.goal))) : 0,
      }));
      setCampaigns(parsed);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [contract]);

  useEffect(() => { loadCampaigns(); }, [loadCampaigns]);

  const createCampaign = async (title, description, imageUrl, category, goalEth, durationDays) => {
    if (!contract) return toast.error("Connect wallet first.");
    const id = toast.loading("Creating campaign...");
    try {
      const tx = await contract.createCampaign(title, description, imageUrl, category, ethers.parseEther(String(goalEth)), durationDays);
      await tx.wait(); toast.success("Campaign created!", { id }); await loadCampaigns(); return true;
    } catch (err) { toast.error(err.reason || "Failed.", { id }); return false; }
  };

  const contribute = async (campaignId, amountEth) => {
    if (!contract) return toast.error("Connect wallet first.");
    const id = toast.loading("Processing...");
    try {
      const tx = await contract.contribute(campaignId, { value: ethers.parseEther(String(amountEth)) });
      await tx.wait(); toast.success("Contribution successful!", { id }); await loadCampaigns(); return true;
    } catch (err) { toast.error(err.reason || "Failed.", { id }); return false; }
  };

  const claimFunds = async (campaignId) => {
    if (!contract) return toast.error("Connect wallet first.");
    const id = toast.loading("Claiming funds...");
    try {
      const tx = await contract.claimFunds(campaignId);
      await tx.wait(); toast.success("Funds claimed!", { id }); await loadCampaigns(); return true;
    } catch (err) { toast.error(err.reason || "Failed.", { id }); return false; }
  };

  const claimRefund = async (campaignId) => {
    if (!contract) return toast.error("Connect wallet first.");
    const id = toast.loading("Processing refund...");
    try {
      const tx = await contract.claimRefund(campaignId);
      await tx.wait(); toast.success("Refund issued!", { id }); await loadCampaigns(); return true;
    } catch (err) { toast.error(err.reason || "Failed.", { id }); return false; }
  };

  return (
    <Web3Context.Provider value={{ account, chainId, isConnecting, campaigns, loading, connectWallet, disconnectWallet, createCampaign, contribute, claimFunds, claimRefund, loadCampaigns }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);
