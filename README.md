# Project Overview:

### GovChain is a decentralized Web3 platform designed to bring full transparency to government projects. By leveraging blockchain technology, GovChain ensures that public initiatives ranging from infrastructure development to community programs are fully verifiable, auditable, and tamper-proof.

### Each project is represented as a unique NFT (ERC-721), storing essential details such as budget, timeline, location, and proposal documents (PDFs). Stakeholders and authorized approvers receive governance tokens (ERC-20) to vote on project approvals, making the process secure, immutable, and publicly accountable.

### With GovChain, citizens, auditors, and government officials can track project progress in real-time, verify funding allocations, and participate in decentralized governance, creating a transparent and trustable public project ecosystem.

# Tech Stack
* Smart Contracts: Solidity, Hardhat, openzeppelin
* Blockchain: sepolia testnet
* Storage: Pinata (IPFS), Mongodb
* Frontend: Next.js, Tailwind CSS, Ethers.js, HeroUI, Infura
* Wallet Integration: MetaMask

# Key features
### 1. Project NFT (ERC-721)
* Each project is minted as an NFT.
* NFT metadata includes:
  * Project Name & Location
  * Budget Allocation
  * Start and End Dates
  * Signatories / Approvers
  * PDF Proposal (stored on IPFS)
  * Status (Pending, Approved, Ongoing, Completed)
### 2. Governance Token (ERC-20)
* Each approver receives 1 token to represent voting power.
* Only token holders can vote on project proposals.
* Ensures equal voting rights among stakeholders.
### 3. Voting Mechanism
* Token holders can approve or reject project NFTs.
* Votes are recorded on-chain and immutable.
* Voting thresholds determine project approval.
### 3. Decentralized Storage
* Project PDFs and metadata are stored on IPFS / Arweave, ensuring tamper-proof records.
### 4. Public Dashboard
* Citizens can view all projects, budgets, timelines, and approvals.
* Transparent view of how public funds are allocated.
### 5. Frontend DApp
* Wallet integration (MetaMask) for stakeholders to vote.
* Public users can verify project authenticity via blockchain transactions and IPFS links.
  
    
