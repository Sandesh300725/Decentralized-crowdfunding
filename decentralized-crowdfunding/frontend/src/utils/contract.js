// ─── Contract Address ──────────────────────────────────────────────────────────
// After deploying, paste your contract address here OR set VITE_CONTRACT_ADDRESS in .env
export const CONTRACT_ADDRESS =
  import.meta.env.VITE_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";

// ─── ABI ─────────────────────────────────────────────────────────────────────
export const CONTRACT_ABI = [
  // Events
  "event CampaignCreated(uint256 indexed id, address indexed owner, string title, uint256 goal, uint256 deadline)",
  "event ContributionMade(uint256 indexed campaignId, address indexed contributor, uint256 amount)",
  "event FundsClaimed(uint256 indexed campaignId, address indexed owner, uint256 amount)",
  "event RefundIssued(uint256 indexed campaignId, address indexed contributor, uint256 amount)",
  "event CampaignCancelled(uint256 indexed campaignId)",

  // View functions
  "function campaignCount() view returns (uint256)",
  "function getAllCampaigns() view returns (tuple(uint256 id, address owner, string title, string description, string imageUrl, string category, uint256 goal, uint256 deadline, uint256 amountRaised, bool claimed, bool active)[])",
  "function getCampaign(uint256 _id) view returns (tuple(uint256 id, address owner, string title, string description, string imageUrl, string category, uint256 goal, uint256 deadline, uint256 amountRaised, bool claimed, bool active))",
  "function getContributions(uint256 _campaignId) view returns (tuple(address contributor, uint256 amount, uint256 timestamp)[])",
  "function getContributorAmount(uint256 _campaignId, address _contributor) view returns (uint256)",
  "function getCampaignProgress(uint256 _campaignId) view returns (uint256)",
  "function isExpired(uint256 _campaignId) view returns (bool)",
  "function platformFeePercent() view returns (uint256)",

  // Write functions
  "function createCampaign(string _title, string _description, string _imageUrl, string _category, uint256 _goal, uint256 _durationInDays) returns (uint256)",
  "function contribute(uint256 _campaignId) payable",
  "function claimFunds(uint256 _campaignId)",
  "function claimRefund(uint256 _campaignId)",
  "function cancelCampaign(uint256 _campaignId)",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const SUPPORTED_CHAINS = {
  31337: "Hardhat Local",
  11155111: "Sepolia Testnet",
  80001: "Mumbai Testnet",
};

export const formatAddress = (addr) =>
  addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

export const daysLeft = (deadline) => {
  const diff = deadline - Date.now();
  if (diff <= 0) return "Ended";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  return days > 0 ? `${days}d ${hours}h left` : `${hours}h left`;
};

export const formatEth = (val) => {
  const num = parseFloat(val);
  return num < 0.001 ? "<0.001" : num.toFixed(4);
};
