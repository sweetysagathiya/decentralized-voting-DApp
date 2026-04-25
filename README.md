# Decentralized Voting DApp Setup Guide

Welcome to the Decentralized Voting application! This guide will walk you through compiling your smart contract, deploying it via the Remix IDE, and hooking it up to the beautiful web frontend provided.

## Technical Details
* **Solidity Version**: `^0.8.0`
* **Frontend Library**: Web3 integration through `ethers.js` (loaded via CDN)
* **Architecture**: A single `Voting.sol` contract and a single `index.html` frontend. UI styling features glassmorphism and modern colors.

---

## 🛠️ Step 1: Compiling the Smart Contract in Remix

1. Open your web browser and navigate to [Remix IDE (https://remix.ethereum.org/)](https://remix.ethereum.org/).
2. In the "File Explorer" tab (folder icon on the left), click the **Create New File** icon under the `contracts` folder and name it `Voting.sol`.
3. Copy the entire contents of the `Voting.sol` file from this project and paste it into the new file on Remix.
4. Go to the **Solidity Compiler** tab (the "S" icon on the left sidebar).
5. Ensure the compiler version is at least `0.8.0` (e.g. `0.8.26`).
6. Click the large **Compile Voting.sol** button. If you see a green checkmark on the icon, compilation is successful.

## 🚀 Step 2: Deploying the Contract

1. Go to the **Deploy & Run Transactions** tab (the Ethereum icon below the compiler).
2. Look at the **Environment** dropdown menu. Click it and select **Injected Provider - MetaMask**.
   * *If prompted, sign in to your MetaMask wallet and connect your active account.*
3. Ensure your desired account address is showing under "Account". Note: This account will become the **Administrator**, meaning ONLY this account can add new candidates.
4. Ensure the **Contract** drop-down says `Voting - contracts/Voting.sol`.
5. Click **Deploy**.
6. MetaMask will pop up asking you to confirm the transaction. Confirm it.
7. Wait a few seconds for blockchain confirmation. Once successful, you will see your deployed contract at the bottom left under **"Deployed Contracts"**.

## 🔌 Step 3: Connecting the Frontend

Your `index.html` file needs to know _where_ the contract is and _how_ to interact with it.

### A) Getting the Contract Address
1. In Remix, locate your newly deployed contract under **"Deployed Contracts"**.
2. Click the **"Copy" icon** next to the contract memory address (e.g., `0x123...abc`).
3. Open the `index.html` file in your preferred code editor.
4. Locate the configuration block (around Line 188) and paste your address between the quotes:
   ```javascript
   const CONTRACT_ADDRESS = "0xYourCopiedContractAddressHere";
   ```

### B) Getting the ABI (Application Binary Interface)
1. In Remix, go back to the **Solidity Compiler** tab.
2. At the very bottom of this panel, you will see a small button labeled **ABI**. Click it to copy the ABI JSON object to your clipboard.
3. Switch back to your code editor with `index.html` open.
4. Locate the `CONTRACT_ABI` configuration array underneath the address configuration.
5. Highlight the array brackets `[]` and Paste your clipboard to completely replace it:
   ```javascript
   const CONTRACT_ABI = [ { ... }, { ... } ]; // Should result in a large array of objects
   ```

## 🎮 Step 4: Testing Your Application

1. Save the changes to your `index.html` file.
2. Open `index.html` directly in your web browser (Double click it, or use a Live Server extension).
3. **Connect Wallet:** Click the "Connect Wallet" button on the top right. MetaMask will ask you to connect to the site. 
4. **Admin Controls:** Since you deployed the contract, the application will detect you as the Administrator! You will see the "Administration Panel".
5. **Register Candidates:** Use the panel to add 2 or 3 candidates (e.g., Alice, Bob). Confirm the transactions in MetaMask.
6. **Cast a Vote:** Switch to another MetaMask account to impersonate another user. Reload the page and connect. Notice the Admin panel disappears! Click "Vote" on a candidate. Approve the transaction.
7. Attempt to vote again and verify that the contract restricts you to exactly one vote. 

---
*Created for your Decentralized Voting DApp Project.*
