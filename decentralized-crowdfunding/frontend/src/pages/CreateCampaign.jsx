import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWeb3 } from "../context/Web3Context";
import toast from "react-hot-toast";

const CATEGORIES = ["Technology", "Environment", "Health", "Education", "Art", "Other"];

export default function CreateCampaign() {
  const { account, connectWallet, createCampaign } = useWeb3();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", imageUrl: "", category: "Technology", goal: "", duration: "30" });

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!account) return toast.error("Connect your wallet first!");
    if (!form.title || !form.description || !form.goal) return toast.error("Please fill all required fields.");
    if (parseFloat(form.goal) <= 0) return toast.error("Goal must be greater than 0.");
    setLoading(true);
    const success = await createCampaign(form.title, form.description, form.imageUrl, form.category, form.goal, parseInt(form.duration));
    setLoading(false);
    if (success) navigate("/campaigns");
  };

  if (!account) return (
    <div className="max-w-lg mx-auto text-center py-20 card">
      <p className="text-4xl mb-4">🔗</p>
      <h2 className="text-2xl font-bold text-white mb-3">Connect Your Wallet</h2>
      <p className="text-gray-400 mb-6">You need to connect your MetaMask wallet to create a campaign.</p>
      <button onClick={connectWallet} className="btn-primary">Connect Wallet</button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Create a Campaign</h1>
        <p className="text-gray-400">Fill in the details to launch your crowdfunding campaign on the blockchain.</p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Campaign Title *</label>
          <input name="title" value={form.title} onChange={handleChange} placeholder="Give your campaign a clear, catchy title" className="input" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={5} placeholder="Describe your campaign, what you're building, and why people should support it." className="input resize-none" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
          <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://example.com/image.jpg (optional)" className="input" />
          {form.imageUrl && <img src={form.imageUrl} alt="preview" className="mt-3 rounded-lg h-40 w-full object-cover" onError={e => e.target.style.display='none'} />}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
            <select name="category" value={form.category} onChange={handleChange} className="input">
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Duration (days) *</label>
            <input type="number" name="duration" value={form.duration} onChange={handleChange} min="1" max="365" className="input" required />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Funding Goal (ETH) *</label>
          <div className="relative">
            <input type="number" name="goal" value={form.goal} onChange={handleChange} step="0.001" min="0.001" placeholder="0.000" className="input pr-16" required />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">ETH</span>
          </div>
          <p className="text-gray-500 text-xs mt-1">A 2% platform fee is deducted from successfully funded campaigns.</p>
        </div>

        <div className="flex gap-4 pt-2">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary flex-1">
            {loading ? "Launching..." : "🚀 Launch Campaign"}
          </button>
        </div>
      </form>
    </div>
  );
}
