import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWeb3 } from "../context/Web3Context";
import { daysLeft, formatEth, formatAddress } from "../utils/contract";
import toast from "react-hot-toast";

export default function CampaignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { campaigns, account, connectWallet, contribute, claimFunds, claimRefund } = useWeb3();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const campaign = campaigns.find(c => c.id === parseInt(id));

  if (!campaign) return (
    <div className="text-center py-20">
      <p className="text-4xl mb-4">😕</p>
      <h2 className="text-2xl font-bold text-white mb-2">Campaign not found</h2>
      <p className="text-gray-400 mb-6">This campaign may not exist or hasn't loaded yet.</p>
      <button onClick={() => navigate("/campaigns")} className="btn-primary">Back to Campaigns</button>
    </div>
  );

  const { title, description, imageUrl, category, goal, amountRaised, deadline, claimed, active, progress, owner } = campaign;
  const expired = Date.now() >= deadline;
  const isOwner = account?.toLowerCase() === owner?.toLowerCase();
  const canContribute = active && !expired && account;
  const canClaim = isOwner && !claimed && expired && parseFloat(amountRaised) >= parseFloat(goal);
  const canRefund = !active && !claimed && account && !isOwner;
  const fallbackImg = `https://picsum.photos/seed/${id}/800/400`;

  const handleContribute = async () => {
    if (!amount || parseFloat(amount) <= 0) return toast.error("Enter a valid amount.");
    setLoading(true);
    await contribute(parseInt(id), amount);
    setAmount(""); setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white flex items-center gap-2 text-sm">← Back</button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left */}
        <div className="lg:col-span-2 space-y-6">
          <img src={imageUrl || fallbackImg} alt={title} onError={e => e.target.src = fallbackImg} className="w-full h-64 object-cover rounded-xl" />
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-blue-500/20 text-blue-400 text-xs px-3 py-1 rounded-full">{category}</span>
              {active && !expired ? <span className="bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full">● Live</span>
                : <span className="bg-gray-500/20 text-gray-400 text-xs px-3 py-1 rounded-full">Ended</span>}
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">{title}</h1>
            <p className="text-gray-400 leading-relaxed">{description}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-400 mb-1">Campaign Creator</p>
            <p className="text-white font-mono text-sm">{owner}</p>
          </div>
        </div>

        {/* Right — Action Panel */}
        <div className="space-y-4">
          <div className="card space-y-4">
            <div>
              <p className="text-3xl font-bold text-white">{formatEth(amountRaised)} ETH</p>
              <p className="text-gray-400 text-sm">raised of {formatEth(goal)} ETH goal</p>
            </div>
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>{progress}% funded</span><span>{daysLeft(deadline)}</span>
              </div>
              <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: `${Math.min(progress, 100)}%` }} />
              </div>
            </div>

            {!account ? (
              <button onClick={connectWallet} className="btn-primary w-full">Connect Wallet to Contribute</button>
            ) : canContribute ? (
              <div className="space-y-3">
                <div className="relative">
                  <input type="number" value={amount} onChange={e => setAmount(e.target.value)} step="0.001" min="0.001" placeholder="0.01" className="input pr-16" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">ETH</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {["0.01", "0.05", "0.1"].map(v => (
                    <button key={v} onClick={() => setAmount(v)} className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs py-2 rounded-lg border border-gray-700 transition-colors">{v} ETH</button>
                  ))}
                </div>
                <button onClick={handleContribute} disabled={loading || !amount} className="btn-primary w-full">{loading ? "Processing..." : "💸 Contribute"}</button>
              </div>
            ) : canClaim ? (
              <button onClick={() => claimFunds(parseInt(id))} className="btn-primary w-full bg-green-600 hover:bg-green-700">🎉 Claim Funds</button>
            ) : canRefund ? (
              <button onClick={() => claimRefund(parseInt(id))} className="btn-secondary w-full">↩ Claim Refund</button>
            ) : (
              <div className="text-center py-3 text-gray-400 text-sm bg-gray-800 rounded-lg">
                {expired && !canClaim ? "Campaign ended" : isOwner ? "You created this campaign" : "Campaign not available"}
              </div>
            )}
          </div>

          <div className="card space-y-3 text-sm">
            {[
              { label: "Deadline", value: new Date(deadline).toLocaleDateString() },
              { label: "Creator", value: formatAddress(owner) },
              { label: "Status", value: claimed ? "✅ Funded" : active && !expired ? "🟢 Active" : "🔴 Ended" },
            ].map(r => (
              <div key={r.label} className="flex justify-between">
                <span className="text-gray-400">{r.label}</span>
                <span className="text-white">{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
