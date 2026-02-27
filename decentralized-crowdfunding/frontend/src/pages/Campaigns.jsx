import React, { useState } from "react";
import { useWeb3 } from "../context/Web3Context";
import CampaignCard from "../components/CampaignCard";

const CATEGORIES = ["All", "Technology", "Environment", "Health", "Education", "Art", "Other"];
const FILTERS = ["All", "Active", "Ended", "Successful"];

export default function Campaigns() {
  const { campaigns, loading } = useWeb3();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [filter, setFilter] = useState("All");

  const filtered = campaigns.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || c.category === category;
    const expired = Date.now() >= c.deadline;
    const matchFilter = filter === "All" || (filter === "Active" && c.active && !expired) || (filter === "Ended" && expired) || (filter === "Successful" && c.claimed);
    return matchSearch && matchCat && matchFilter;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">All Campaigns</h1>
        <p className="text-gray-400">Discover and support projects making a difference.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <input type="text" placeholder="Search campaigns..." value={search} onChange={e => setSearch(e.target.value)} className="input flex-1" />
        <select value={category} onChange={e => setCategory(e.target.value)} className="input md:w-48">
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="input md:w-40">
          {FILTERS.map(f => <option key={f}>{f}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <div key={i} className="h-80 bg-gray-900 border border-gray-800 rounded-xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 card">
          <p className="text-4xl mb-4">🔍</p>
          <h3 className="text-white text-xl font-semibold mb-2">No campaigns found</h3>
          <p className="text-gray-400">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <>
          <p className="text-gray-400 text-sm">{filtered.length} campaign{filtered.length !== 1 ? "s" : ""} found</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(c => <CampaignCard key={c.id} campaign={c} />)}
          </div>
        </>
      )}
    </div>
  );
}
