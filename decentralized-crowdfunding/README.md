# Decentralized Crowdfunding Platform

A fully decentralized crowdfunding platform built on Ethereum with Solidity smart contracts and a React frontend.

## Tech Stack
- Smart Contract: Solidity 0.8.19 + Hardhat
- Frontend: React 18 + Vite + Tailwind CSS + ethers.js v6
- Testing: Chai + Hardhat Network Helpers

## Quick Start

### 1. Install dependencies
```bash
npm install
cd frontend && npm install && cd ..
```

### 2. Start local blockchain
```bash
npx hardhat node
```

### 3. Deploy contract
```bash
npx hardhat run scripts/deploy.js --network localhost
```

### 4. Set contract address in frontend
Edit `frontend/.env` and set `VITE_CONTRACT_ADDRESS=0xYourAddress`

### 5. Start frontend
```bash
cd frontend && npm run dev
```

Open http://localhost:5173 and connect MetaMask (chain 31337, RPC http://127.0.0.1:8545)

## Features
- Create crowdfunding campaigns with ETH goals and deadlines
- Contribute ETH to any active campaign
- Campaign owners claim funds after reaching their goal
- Contributors get automatic refunds if campaign fails
- Search and filter campaigns by category and status
- Fully responsive dark-mode UI

## Project Structure
```
contracts/          Solidity smart contracts
scripts/            Deployment scripts
test/               Hardhat tests
frontend/src/       React application
  context/          Web3Context (wallet + contract state)
  components/       Reusable UI components
  pages/            Route pages
  utils/            Contract ABI and helpers
```

## Deploy to Testnet (Sepolia)
1. Add keys to `.env`: SEPOLIA_RPC_URL, PRIVATE_KEY, ETHERSCAN_API_KEY
2. Run: `npx hardhat run scripts/deploy.js --network sepolia`
3. Update `frontend/.env` with deployed address

## Run Tests
```bash
npx hardhat test
```

## License
MIT
