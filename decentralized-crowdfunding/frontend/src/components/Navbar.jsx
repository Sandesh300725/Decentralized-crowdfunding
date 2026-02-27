import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useWeb3 } from "../context/Web3Context";
import { formatAddress, SUPPORTED_CHAINS } from "../utils/contract";

export default function Navbar() {
  const { account, chainId, isConnecting, connectWallet, disconnectWallet } = useWeb3();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const navLinks = [{ to: "/", label: "Home" }, { to: "/campaigns", label: "Campaigns" }, { to: "/create", label: "Launch" }, { to: "/my-campaigns", label: "My Campaigns" }];
  const isActive = (p) => location.pathname === p;
  const networkName = chainId ? (SUPPORTED_CHAINS[chainId] || `Chain ${chainId}`) : null;

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-sm">F</div>
          <span className="font-bold text-lg">FundChain</span>
        </Link>
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(l.to) ? "bg-blue-600 text-white" : "text-gray-300 hover:text-white hover:bg-gray-800"}`}>{l.label}</Link>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-3">
          {account && networkName && <span className="text-xs text-gray-400 bg-gray-800 px-3 py-1 rounded-full border border-gray-700">{networkName}</span>}
          {account ? (
            <button onClick={disconnectWallet} className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-sm px-4 py-2 rounded-lg transition-colors">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>{formatAddress(account)}
            </button>
          ) : (
            <button onClick={connectWallet} disabled={isConnecting} className="btn-primary text-sm">{isConnecting ? "Connecting..." : "Connect Wallet"}</button>
          )}
        </div>
        <button className="md:hidden text-gray-300" onClick={() => setOpen(!open)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden px-4 pb-4 space-y-1 border-t border-gray-800 pt-2">
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className={`block px-4 py-2 rounded-lg text-sm ${isActive(l.to) ? "bg-blue-600 text-white" : "text-gray-300 hover:text-white hover:bg-gray-800"}`}>{l.label}</Link>
          ))}
          {account ? (
            <button onClick={disconnectWallet} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg">Disconnect ({formatAddress(account)})</button>
          ) : (
            <button onClick={connectWallet} disabled={isConnecting} className="btn-primary w-full text-sm mt-2">{isConnecting ? "Connecting..." : "Connect Wallet"}</button>
          )}
        </div>
      )}
    </nav>
  );
}
