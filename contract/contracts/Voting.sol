// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./IGovProjects.sol";


error notEnoughBalance();
error alreadyVote();
error noVoteCast();
contract Voting{

    IERC20 internal immutable i_govToken;
    IGovProjects internal immutable i_govProjects;

    constructor(address _govToken, address _projectContract) {
        i_govToken = IERC20(_govToken); // save your token contract
        i_govProjects = IGovProjects(_projectContract);    // save your project/nft contract
    }

    struct Vote {
        uint256 yes;
        uint256 no;
                //address of user/voters  //kong nag boto na ba
        mapping(address => bool) hasVoted; // Tracks if address already voted
        mapping(address => bool) votedYes; // Tracks if address voted YES
        mapping(address => bool) votedNo;  // Tracks if address voted NO
    }

    
    mapping(uint256 => Vote) public votes;
    uint256 public approvalThreshold = 70; //70%

        // Vote on a project
    function vote(uint256 _projectId, bool approve) external checkBalance() checkHasVote(_projectId) {
        Vote storage voter = votes[_projectId];
        uint256 voterBalance = i_govToken.balanceOf(msg.sender);

        if (approve) {
            voter.yes += voterBalance;
             //putting in the mapping for yes vote
            voter.votedYes[msg.sender] = true;
        } else {
            voter.no += voterBalance;
            //putting in the mapping for no vote
            voter.votedNo[msg.sender] = true;
        }
        //putting in the mapping for has voted
        voter.hasVoted[msg.sender] = true;
    }

        //result na 
    function finalize(uint256 _projectId) external {
        uint256 yesVotes = votes[_projectId].yes;
        uint256 noVotes = votes[_projectId].no;

        uint256 totalVotes = yesVotes + noVotes;

        if(totalVotes == 0){
            revert noVoteCast();
        }

        uint256 yesPercent = (yesVotes * 100) / totalVotes;

        if (yesPercent >= approvalThreshold) {
            i_govProjects.updateStatus(_projectId, IGovProjects.Status.Approved);
        } else {
            i_govProjects.updateStatus(_projectId, IGovProjects.Status.Rejected);
        }
    }


    modifier checkBalance(){
        if(i_govToken.balanceOf(msg.sender) < 1){
            revert notEnoughBalance();
        }
        _;
    }

    modifier checkHasVote( uint256 _projectId){
        if(votes[_projectId].hasVoted[msg.sender]){
            revert alreadyVote();
        }
        _;
    }
}