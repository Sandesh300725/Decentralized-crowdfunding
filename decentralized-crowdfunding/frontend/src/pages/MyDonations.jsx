import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useWeb3 } from "../context/Web3Context";

export default function MyDonations() {
  const { getAllCampaigns, getCampaignDonations, account, connectWallet } = useWeb3();
  const [myDonations, setMyDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!account) { setLoading(false); return; }
      try {
        const campaigns = await getAllCampaigns();
        const result = [];
        for (const campaign of campaigns) {
          const donations = await getCampaignDonations(campaign.id);
          const mine = donations.filter((d) => d.donor.toLowerCase() === account.toLowerCase());
          if (mine.length > 0) {
            const total = mine.reduce((s, d) => s + parseFloat(d.amount), 0);
            result.push({ campaign, donations: mine, total });
          }
        }
        setMyDonations(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [account]);

  if (!account) {
    return (
      <div className="page center-page">
        <div className="connect-prompt">
          <h2>🔒 Wallet Required</h2>
          <p>Connect your wallet to view your donation history.</p>
          <button className="btn btn-primary btn-lg" onClick={connectWallet}>🦊 Connect Wallet</button>
        </div>
      </div>
    );
  }

  const totalDonated = myDonations.reduce((s, d) => s + d.total, 0).toFixed(4);

  return (
    <div className="page">
      <h1 className="page-title">💸 My Donations</h1>
      {myDonations.length > 0 && (
        <div className="donations-summary">
          <span>🏦 Total Donated: <strong>{totalDonated} ETH</strong></span>
          <span>📋 Campaigns Supported: <strong>{myDonations.length}</strong></span>
        </div>
      )}
      {loading ? (
        <div className="loading-grid">{[1,2,3].map(i => <div key={i} className="card-skeleton"/>)}</div>
      ) : myDonations.length === 0 ? (
        <div className="empty-state">
          <p>You haven't donated to any campaigns yet.</p>
          <Link to="/" className="btn btn-primary">🔍 Explore Campaigns</Link>
        </div>
      ) : (
        <div className="my-donations-list">
          {myDonations.map(({ campaign, donations, total }) => (
            <div key={campaign.id} className="my-donation-card">
              <div className="my-donation-header">
                <Link to={`/campaign/${campaign.id}`} className="my-donation-title">
                  {campaign.title}
                </Link>
                <span className="my-donation-total">{total.toFixed(4)} ETH donated</span>
              </div>
              <div className="my-donation-body">
                {donations.map((d, i) => (
                  <div key={i} className="donation-row">
                    <span>{parseFloat(d.amount).toFixed(4)} ETH</span>
                    <span>{d.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
