// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;


import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";



error ProjectNotExist(uint256 _projectId);
error notOwner(address _ownerAddress);

contract Projects is ERC721  { 


    address immutable public i_owner;
    uint256 public nextProjectId =1;
    enum Status { Pending, Rejected, Approved, Ongoing, Completed }

    constructor() ERC721("DPWH_PROJECTS", "DPWHP") {
        i_owner = msg.sender; //setting the owner of the contract
    }


    struct Project{
        uint256   projectId;
        string    projectName;
        string    location;
        uint      budgetPeso;
        address[] signatories;
        address[] engineers;
        address[] contractors;
        string    timelineStart;
        string    timelineEnd;
        Status    status;
        string    proposalLink;   // IPFS link to proposal
    }

    // Mapping from project ID to Project struct
    mapping(uint256 => Project) public projects;


    //creating nft for dpwh project // cost a gas  // minting nft
    function createProjectNft(        
        string memory _name,
        string memory _location,
        uint256 _budget,
        address[] memory _signatories,
        address[] memory _engineers,
        address[] memory _contractors,
        string memory _timelineStart,
        string memory _timelineEnd,
        string memory _proposalLink
        ) external OnlyOwner{

        projects[nextProjectId] = Project(
            nextProjectId,
            _name,
            _location,
            _budget,
            _signatories,
            _engineers,
            _contractors,
            _timelineStart,
            _timelineEnd,
            Status.Pending,
            _proposalLink
        );

        _mint(msg.sender, nextProjectId);
        nextProjectId++;
    }


    // updating the status of the project // cost a gas // modifying record
    function updateStatus( uint256 _projectId, Status _status ) external checkProjectExist(_projectId) {
       // checking if the project is exist
       projects[_projectId].status = _status;

    }
    // Function to get proposal PDF link
    function getPDF(uint8 _projectId) checkProjectExist(_projectId) external view returns (string memory) {
        return projects[_projectId].proposalLink;
    }

    //checking if you are the owner
    modifier OnlyOwner(){
        if(msg.sender !=i_owner){
            revert notOwner(msg.sender);
        }
        _;
    }
        //checking if project exsit
        modifier checkProjectExist(uint256 _projectId){
        if(projects[_projectId].budgetPeso == 0){
            revert ProjectNotExist(_projectId);
        }
        _;
    }

}
