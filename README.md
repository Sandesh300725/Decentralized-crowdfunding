# 📌 Decentralized Crowdfunding Platform

## 📖 Project Overview

Decentralized Crowdfunding is a blockchain-based application that allows users to create and fund campaigns without relying on centralized platforms. The system uses smart contracts deployed on the Ethereum blockchain to ensure transparency, security, and trustless transactions between campaign creators and contributors.

Unlike traditional platforms, funds are managed automatically through smart contracts, eliminating intermediaries and reducing fraud risks.

---

## 🚀 Features

* 📝 Create fundraising campaigns
* 💰 Contribute Ether (ETH) to campaigns
* 🔒 Secure and transparent smart contract transactions
* 📊 View campaign details (goal, deadline, amount raised)
* ✅ Automatic fund transfer when goal is reached
* ❌ Refund contributors if goal is not met
* 🌐 Web3 wallet integration (MetaMask)

---

## 🛠️ Tech Stack

### 🔹 Blockchain

* Solidity
* Ethereum
* Smart Contracts

### 🔹 Development Framework

* Hardhat / Truffle
* Ethers.js / Web3.js

### 🔹 Frontend

* React.js
* HTML5
* CSS3
* JavaScript

### 🔹 Wallet

* MetaMask

---

## 🏗️ Architecture

1. User connects MetaMask wallet.
2. Campaign creator deploys a campaign via smart contract.
3. Contributors send ETH directly to the smart contract.
4. Smart contract stores funds securely.
5. If funding goal is reached → funds transferred to creator.
6. If deadline expires without reaching goal → contributors can claim refunds.

---

## 📂 Project Structure

```
decentralized-crowdfunding/
│
├── contracts/
│   └── Crowdfunding.sol
│
├── scripts/
│   └── deploy.js
│
├── frontend/
│   ├── components/
│   ├── pages/
│   └── App.js
│
├── test/
│   └── crowdfunding.test.js
│
├── hardhat.config.js
├── package.json
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/decentralized-crowdfunding.git
cd decentralized-crowdfunding
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Compile Smart Contracts

```bash
npx hardhat compile
```

### 4️⃣ Deploy Smart Contract

```bash
npx hardhat run scripts/deploy.js --network localhost
```

### 5️⃣ Start Frontend

```bash
cd frontend
npm start
```

---

## 🔐 Smart Contract Functions

* `createCampaign()`
* `contribute()`
* `withdrawFunds()`
* `refund()`
* `getCampaignDetails()`

---

## 🧪 Testing

Run smart contract tests using:

```bash
npx hardhat test
```

---

## 🌟 Advantages of Decentralized Crowdfunding

* Transparency
* No third-party interference
* Reduced platform fees
* Secure transactions
* Global accessibility

---

## 📌 Future Enhancements

* Multi-token support
* NFT-based rewards
* DAO governance integration
* Mobile application
* IPFS for campaign media storage

---

## 🤝 Contribution

Pull requests are welcome. For major changes, please open an issue first to discuss proposed changes.

---

## 📄 License

This project is licensed under the MIT License.

---

# 🔎 Short Project Description (For Resume / LinkedIn)

**Decentralized Crowdfunding Platform**
Developed a blockchain-based crowdfunding application using Solidity and Ethereum that enables users to create and fund campaigns securely without intermediaries. Implemented smart contracts for automated fund management, transparent transactions, and refund mechanisms, integrated with MetaMask and a React.js frontend.

