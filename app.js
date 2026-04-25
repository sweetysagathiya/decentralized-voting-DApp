// =======================================================
// 1. UPDATE THIS ADDRESS AFTER DEPLOYING IN REMIX
// =======================================================
const contractAddress = "0xE5a03665DD7B3E9354648133aC24F7d765C77E2E";

// The ABI matches the Voting.sol contract
const contractABI = [
	[
		{
			"inputs": [
				{
					"internalType": "string",
					"name": "_name",
					"type": "string"
				}
			],
			"name": "addCandidate",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [],
			"stateMutability": "nonpayable",
			"type": "constructor"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "candidateId",
					"type": "uint256"
				},
				{
					"indexed": false,
					"internalType": "string",
					"name": "name",
					"type": "string"
				}
			],
			"name": "CandidateAdded",
			"type": "event"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "_candidateId",
					"type": "uint256"
				}
			],
			"name": "vote",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "address",
					"name": "voter",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "candidateId",
					"type": "uint256"
				}
			],
			"name": "Voted",
			"type": "event"
		},
		{
			"inputs": [],
			"name": "administrator",
			"outputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"name": "candidates",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "id",
					"type": "uint256"
				},
				{
					"internalType": "string",
					"name": "name",
					"type": "string"
				},
				{
					"internalType": "uint256",
					"name": "voteCount",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "candidatesCount",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "getAllCandidates",
			"outputs": [
				{
					"components": [
						{
							"internalType": "uint256",
							"name": "id",
							"type": "uint256"
						},
						{
							"internalType": "string",
							"name": "name",
							"type": "string"
						},
						{
							"internalType": "uint256",
							"name": "voteCount",
							"type": "uint256"
						}
					],
					"internalType": "struct Voting.Candidate[]",
					"name": "",
					"type": "tuple[]"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"name": "voters",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		}
	]
];

let provider;
let signer;
let votingContract;

const connectWalletBtn = document.getElementById("connect-wallet");
const accountAddressEl = document.getElementById("account-address");
const votingSection = document.getElementById("voting-section");
const candidatesListEl = document.getElementById("candidates-list");
const candidateSelect = document.getElementById("candidate-select");
const voteBtn = document.getElementById("vote-btn");
const messageEl = document.getElementById("message");

async function init() {
	// Check if MetaMask is installed
	if (typeof window.ethereum !== 'undefined') {
		try {
			// Request account access
			const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
			const account = accounts[0];
			accountAddressEl.innerText = `Connected: ${account.substring(0, 6)}...${account.substring(38)}`;

			// Connect to the provider (MetaMask)
			provider = new ethers.providers.Web3Provider(window.ethereum);
			signer = provider.getSigner();

			if (contractAddress === "YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE") {
				messageEl.innerText = "Please update the contract address in app.js (line 4) after deploying via Remix.";
				return;
			}

			// Create contract instance
			votingContract = new ethers.Contract(contractAddress, contractABI, signer);

			// Show UI
			connectWalletBtn.style.display = 'none';
			votingSection.classList.remove('hidden');

			await loadCandidates();

			// Listen for account changes
			window.ethereum.on('accountsChanged', function () {
				window.location.reload();
			});

		} catch (error) {
			console.error("User denied account access or error occurred");
			messageEl.innerText = "Failed to connect wallet.";
		}
	} else {
		messageEl.innerText = "Please install MetaMask to use this dApp!";
	}
}

async function loadCandidates() {
	try {
		candidatesListEl.innerHTML = "";
		candidateSelect.innerHTML = '<option value="0">Select a candidate...</option>';

		// Get the total number of candidates
		const count = await votingContract.candidatesCount();
		const candidatesCount = count.toNumber();

		if (candidatesCount === 0) {
			candidatesListEl.innerHTML = "<p style='padding: 15px;'>No candidates found.</p>";
			return;
		}

		// Fetch each candidate and render
		for (let i = 1; i <= candidatesCount; i++) {
			const candidate = await votingContract.candidates(i);
			const id = candidate.id.toNumber();
			const name = candidate.name;
			const voteCount = candidate.voteCount.toNumber();

			// Render to list
			const candidateDiv = document.createElement("div");
			candidateDiv.className = "candidate-item";
			candidateDiv.innerHTML = `<span class="candidate-name">${name}</span> <span class="candidate-votes">${voteCount} votes</span>`;
			candidatesListEl.appendChild(candidateDiv);

			// Render to dropdown
			const option = document.createElement("option");
			option.value = id;
			option.innerText = name;
			candidateSelect.appendChild(option);
		}
	} catch (error) {
		console.error("Error loading candidates:", error);
		candidatesListEl.innerHTML = "<p style='padding: 15px; color: red;'>Error loading candidates. Ensure you are on the correct network (Testnet/Local) and the contract address is correct.</p>";
	}
}

async function castVote() {
	const candidateId = candidateSelect.value;
	if (candidateId == 0) {
		messageEl.innerText = "Please select a candidate.";
		messageEl.style.color = "#d32f2f";
		return;
	}

	try {
		messageEl.innerText = "Sending transaction... please confirm in MetaMask.";
		messageEl.style.color = "#f57c00"; // orange

		const tx = await votingContract.vote(candidateId);

		messageEl.innerText = "Waiting for block confirmation...";
		messageEl.style.color = "#1976d2"; // blue

		await tx.wait(); // Wait for transaction to be mined

		messageEl.innerText = "Vote successfully cast! 🎉";
		messageEl.style.color = "#388e3c"; // green

		// Refresh the candidates list
		await loadCandidates();
	} catch (error) {
		console.error("Error casting vote:", error);
		// Error messages often come buried in the ethers error object
		const reason = error.reason || (error.data && error.data.message) || error.message || "Failed to cast vote.";
		if (reason.includes("You have already voted")) {
			messageEl.innerText = "Error: You have already voted!";
		} else {
			messageEl.innerText = reason;
		}
		messageEl.style.color = "#d32f2f"; // red
	}
}

connectWalletBtn.addEventListener("click", init);
voteBtn.addEventListener("click", castVote);
