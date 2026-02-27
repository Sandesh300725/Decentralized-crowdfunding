import React from "react";
import { Link } from "react-router-dom";
import { useWeb3 } from "../context/Web3Context";
import CampaignCard from "../components/CampaignCard";

export default function MyCampaigns() {
  const { campaigns, account, connectWallet, loading } = useWeb3();
  const mine = campaigns.filter(c => c.owner?.toLowerCase() === account?.toLowerCase());
  const contributed = campaigns.filter(c => c.id); // simplified - show all for demo

  if (!account) return (
    <div className="max-w-lg mx-auto text-center py-20 card">
      <p className="text-4xl mb-4">👛</p>
      <h2 className="text-2xl font-bold text-white mb-3">Connect Your Wallet</h2>
      <p className="text-gray-400 mb-6">Connect your wallet to view your campaigns.</p>
      <button onClick={connectWallet} className="btn-primary">Connect Wallet</button>
    </div>
  );

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">My Campaigns</h1>
        <p className="text-gray-400 text-sm font-mono">{account}</p>
      </div>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Campaigns I Created ({mine.length})</h2>
          <Link to="/create" className="btn-primary text-sm">+ New Campaign</Link>
        </div>
        {loading ? <div className="text-gray-400">Loading...</div>
          : mine.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-4xl mb-3">🌱</p>
              <h3 className="text-white font-semibold mb-2">No campaigns yet</h3>
              <p className="text-gray-400 mb-4">You haven't created any campaigns yet.</p>
              <Link to="/create" className="btn-primary">Create Your First Campaign</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mine.map(c => <CampaignCard key={c.id} campaign={c} />)}
            </div>
          )}
      </section>
    </div>
  );
}
