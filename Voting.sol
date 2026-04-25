// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Decentralized Voting System
 * @dev A smart contract that allows an admin to register candidates,
 *      and allows users to cast exactly one vote.
 */
contract Voting {
    // Stores the address of the administrator who deployed the contract
    address public admin;

    // Defines a Candidate structure with ID, name, and current vote count
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    // A mapping to store candidates. The key is the candidate ID.
    mapping(uint => Candidate) public candidates;
    
    // A mapping to keep track of addresses that have already voted
    mapping(address => bool) public voters;
    
    // Keeps track of the total number of candidates registered
    uint public candidatesCount;

    // Events to log activities on the blockchain
    event VotedEvent(uint indexed candidateId);
    event CandidateAdded(uint indexed candidateId, string name);

    /**
     * @dev Modifier to restrict access to only the admin.
     */
    modifier onlyAdmin() {
        require(msg.sender == admin, "Access denied: Only admin can perform this operation.");
        _;
    }

    /**
     * @dev Constructor is executed once when the contract is deployed.
     *      It sets the absolute owner (admin) of the contract.
     */
    constructor() {
        admin = msg.sender;
    }

    /**
     * @dev Allows the admin to add a new candidate to the election.
     * @param _name The name of the new candidate.
     */
    function addCandidate(string memory _name) public onlyAdmin {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
        emit CandidateAdded(candidatesCount, _name);
    }

    /**
     * @dev Allows any user to cast a vote for a registered candidate.
     * @param _candidateId The ID of the candidate the user wishes to vote for.
     */
    function vote(uint _candidateId) public {
        // Require that the user hasn't voted before
        require(!voters[msg.sender], "Vote failed: You have already voted.");

        // Require a valid candidate ID
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Vote failed: Invalid candidate ID.");

        // Record that the voter has cast their vote
        voters[msg.sender] = true;

        // Increment the candidate's vote count
        candidates[_candidateId].voteCount++;

        // Trigger the voted event for frontend listeners
        emit VotedEvent(_candidateId);
    }

    /**
     * @dev Helper function to fetch candidate details easily.
     * @param _candidateId The ID of the candidate.
     */
    function getCandidate(uint _candidateId) public view returns (uint, string memory, uint) {
        Candidate memory candidate = candidates[_candidateId];
        return (candidate.id, candidate.name, candidate.voteCount);
    }
}
