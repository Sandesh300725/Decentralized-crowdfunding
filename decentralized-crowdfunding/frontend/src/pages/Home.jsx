import React from "react";
import { Link } from "react-router-dom";
import { useWeb3 } from "../context/Web3Context";
import CampaignCard from "../components/CampaignCard";

export default function Home() {
  const { campaigns, loading, account, connectWallet } = useWeb3();
  const active = campaigns.filter(c => c.active && Date.now() < c.deadline).slice(0, 3);
  const totalRaised = campaigns.reduce((s, c) => s + parseFloat(c.amountRaised), 0);

  return (
    <div className="space-y-16">
      <section className="text-center py-16">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm px-4 py-2 rounded-full mb-6">
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span> Powered by Ethereum
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Fund Ideas.<br /><span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Change the World.</span>
        </h1>
        <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-10">Transparent, trustless crowdfunding on Ethereum. No middlemen, no hidden fees.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/campaigns" className="btn-primary text-base px-8 py-3">Browse Campaigns</Link>
          <Link to="/create" className="btn-secondary text-base px-8 py-3">Start a Campaign</Link>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[{ label: "Total Campaigns", value: campaigns.length }, { label: "ETH Raised", value: `${totalRaised.toFixed(3)} ETH` }, { label: "Active Campaigns", value: active.length }].map(s => (
          <div key={s.label} className="card text-center">
            <p className="text-4xl font-bold text-white mb-1">{s.value}</p>
            <p className="text-gray-400 text-sm">{s.label}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-2xl font-bold text-white mb-8 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[{ icon:"🔗", title:"Connect Wallet", desc:"Connect MetaMask. No sign-up required." }, { icon:"🚀", title:"Create or Fund", desc:"Launch a campaign or contribute ETH to ideas you believe in." }, { icon:"✅", title:"Transparent Results", desc:"Goal met → creator gets funds. Goal missed → contributors get refunds." }].map(i => (
            <div key={i.title} className="card">
              <div className="text-3xl mb-3">{i.icon}</div>
              <h3 className="text-white font-semibold text-lg mb-2">{i.title}</h3>
              <p className="text-gray-400 text-sm">{i.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {loading ? <div className="text-center text-gray-400 py-12">Loading campaigns...</div>
        : active.length > 0 ? (
          <section>
            <div className="flex justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Featured Campaigns</h2>
              <Link to="/campaigns" className="text-blue-400 text-sm">View all →</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {active.map(c => <CampaignCard key={c.id} campaign={c} />)}
            </div>
          </section>
        ) : (
          <section className="text-center py-16 card">
            <p className="text-4xl mb-4">🌱</p>
            <h3 className="text-white text-xl font-semibold mb-2">No campaigns yet</h3>
            <p className="text-gray-400 mb-6">Be the first to launch on FundChain!</p>
            {!account ? <button onClick={connectWallet} className="btn-primary">Connect Wallet to Start</button>
              : <Link to="/create" className="btn-primary">Create First Campaign</Link>}
          </section>
        )}

      <section className="card bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-500/30 text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-3">Ready to launch your idea?</h2>
        <p className="text-gray-400 mb-6">Create a campaign in minutes. Connect your wallet and start raising on the blockchain.</p>
        <Link to="/create" className="btn-primary text-base px-8 py-3">Launch Your Campaign 🚀</Link>
      </section>
    </div>
  );
}
