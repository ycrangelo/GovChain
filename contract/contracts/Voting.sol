// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./IGovProjects.sol";

error NotEnoughBalance();
error AlreadyVoted();
error NoVoteCast();
error NotEligibleVoter();

contract Voting {
    IERC20 internal immutable i_govToken;
    IGovProjects internal immutable i_govProjects;

    constructor(address _govToken, address _projectContract) {
        i_govToken = IERC20(_govToken); // governance token contract
        i_govProjects = IGovProjects(_projectContract); // project/nft contract
    }

    struct Vote {
        uint256 yes;
        uint256 no;
        address[] eligibleVoters;
        uint256 votedCount;
        bool finalized;
        mapping(address => bool) hasVoted; 
        mapping(address => bool) votedYes;
        mapping(address => bool) votedNo;
        mapping(address => bool) isEligible;
    }

    mapping(uint256 => Vote) private votes;
    uint256 public approvalThreshold = 70; // 70%

    // ------------------------
    // EVENTS
    // ------------------------
    event VoteSessionCreated(uint256 indexed projectId, address[] eligibleVoters);
    event VoteCast(uint256 indexed projectId, address indexed voter, bool approved, uint256 weight);
    event VoteFinalized(uint256 indexed projectId, bool approved, uint256 yesVotes, uint256 noVotes);

    /// @notice Create a vote session with eligible voters
    function createVoteSession(uint256 _projectId, address[] calldata _eligibleVoters) external {
        Vote storage voter = votes[_projectId];
        require(voter.eligibleVoters.length == 0, "Vote session already exists");

        for (uint256 i = 0; i < _eligibleVoters.length; i++) {
            voter.eligibleVoters.push(_eligibleVoters[i]);
            voter.isEligible[_eligibleVoters[i]] = true;
        }

        emit VoteSessionCreated(_projectId, _eligibleVoters);
    }

    /// @notice Cast a vote
    function vote(uint256 _projectId, bool approve) 
        external 
        checkBalance 
        checkEligibility(_projectId) 
        checkHasNotVoted(_projectId) 
    {
        Vote storage voter = votes[_projectId];
        uint256 voterBalance = i_govToken.balanceOf(msg.sender);

        if (approve) {
            voter.yes += voterBalance;
            voter.votedYes[msg.sender] = true;
        } else {
            voter.no += voterBalance;
            voter.votedNo[msg.sender] = true;
        }

        voter.hasVoted[msg.sender] = true;
        voter.votedCount++;

        emit VoteCast(_projectId, msg.sender, approve, voterBalance);

        //  Auto-finalize if all voters already voted
        if (voter.votedCount == voter.eligibleVoters.length) {
            autoFinalize(_projectId);
        }
    }

    /// @notice Finalize results manually (optional if not all voted yet)
    function ManualFinalize(uint256 _projectId) external {
        autoFinalize(_projectId);
    }

    /// @notice Internal finalize logic
    function autoFinalize(uint256 _projectId) internal {
        Vote storage voter = votes[_projectId];

        require(!voter.finalized, "Already finalized");

        uint256 yesVotes = voter.yes;
        uint256 noVotes = voter.no;

        uint256 totalVotes = yesVotes + noVotes;
        if (totalVotes == 0) {
            revert NoVoteCast();
        }

        uint256 yesPercent = (yesVotes * 100) / totalVotes;
        bool approved = yesPercent >= approvalThreshold;

        if (approved) {
            i_govProjects.updateStatus(_projectId, IGovProjects.Status.Approved);
        } else {
            i_govProjects.updateStatus(_projectId, IGovProjects.Status.Rejected);
        }

        voter.finalized = true;

        emit VoteFinalized(_projectId, approved, yesVotes, noVotes);
    }

    /// @notice Check if all eligible voters have voted
    function allVoted(uint256 _projectId) external view returns (bool) {
        Vote storage voter = votes[_projectId];
        return voter.votedCount == voter.eligibleVoters.length;
    }

    // ------------------------
    // MODIFIERS
    // ------------------------

    modifier checkBalance() {
        if (i_govToken.balanceOf(msg.sender) < 1) {
            revert NotEnoughBalance();
        }
        _;
    }

    modifier checkHasNotVoted(uint256 _projectId) {
        if (votes[_projectId].hasVoted[msg.sender]) {
            revert AlreadyVoted();
        }
        _;
    }

    modifier checkEligibility(uint256 _projectId) {
        if (!votes[_projectId].isEligible[msg.sender]) {
            revert NotEligibleVoter();
        }
        _;
    }
}
