import React from "react";
import { Link } from "react-router-dom";
import { daysLeft, formatEth } from "../utils/contract";

export default function CampaignCard({ campaign }) {
  const { id, title, description, imageUrl, category, goal, amountRaised, deadline, active, progress } = campaign;
  const expired = Date.now() >= deadline;
  const fallbackImg = `https://picsum.photos/seed/${id}/400/200`;

  return (
    <Link to={`/campaigns/${id}`} className="group block h-full">
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 h-full flex flex-col">
        <div className="relative h-44 overflow-hidden bg-gray-800">
          <img src={imageUrl || fallbackImg} alt={title} onError={e => e.target.src = fallbackImg}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          <div className="absolute top-3 right-3">
            {!active ? <span className="bg-gray-900/90 text-gray-400 text-xs px-2 py-1 rounded-full">Inactive</span>
              : expired ? <span className="bg-orange-900/90 text-orange-400 text-xs px-2 py-1 rounded-full">Ended</span>
              : <span className="bg-green-900/90 text-green-400 text-xs px-2 py-1 rounded-full">● Live</span>}
          </div>
          <div className="absolute top-3 left-3">
            <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full">{category}</span>
          </div>
        </div>
        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">{title}</h3>
          <p className="text-gray-400 text-sm line-clamp-2 mb-4 flex-1">{description}</p>
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>{progress}% funded</span>
              <span>{daysLeft(deadline)}</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all" style={{ width: `${Math.min(progress, 100)}%` }} />
            </div>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-gray-800">
            <div>
              <p className="text-white font-bold">{formatEth(amountRaised)} ETH</p>
              <p className="text-gray-500 text-xs">of {formatEth(goal)} ETH goal</p>
            </div>
            <span className="text-blue-400 text-sm">View →</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
