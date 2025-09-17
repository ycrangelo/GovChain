// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

error ProjectNotExist(uint256 _projectId);
error notOwner(address _ownerAddress);

contract Projects is ERC721 {
    address immutable public i_owner;
    uint256 public nextProjectId = 1;

    enum Status { Pending, Rejected, Approved, Ongoing, Completed }

    struct Project {
        uint256   projectId;
        string    projectName;
        string    location;
        uint256   budgetPeso;
        address[] signatories;
        string    timelineStart;
        string    timelineEnd;
        Status    status;
        string    proposalLink;   // IPFS link to proposal
    }

    // Mapping from project ID to Project struct
    mapping(uint256 => Project) public projects;

    //  EVENTS
    event ProjectCreated(
        uint256 indexed projectId,
        string projectName,
        string location,
        uint256 budgetPeso,
        string timelineStart,
        string timelineEnd,
        string proposalLink
    );

    event ProjectStatusUpdated(
        uint256 indexed projectId,
        Status oldStatus,
        Status newStatus
    );


    event OwnerSet(address indexed owner);

    constructor() ERC721("DPWH_PROJECTS", "DPWHP") {
        i_owner = msg.sender;
        emit OwnerSet(msg.sender);
    }

    //  Create NFT for project
    function createProjectNft(        
        string memory _name,
        string memory _location,
        uint256 _budget,
        address[] memory _signatories,
        string memory _timelineStart,
        string memory _timelineEnd,
        string memory _proposalLink
    ) external OnlyOwner {
        projects[nextProjectId] = Project(
            nextProjectId,
            _name,
            _location,
            _budget,
            _signatories,
            _timelineStart,
            _timelineEnd,
            Status.Pending,
            _proposalLink
        );

        _mint(msg.sender, nextProjectId);

        emit ProjectCreated(
            nextProjectId,
            _name,
            _location,
            _budget,
            _timelineStart,
            _timelineEnd,
            _proposalLink
        );

        nextProjectId++;
    }

    // ✅ Update status
    function updateStatus(uint256 _projectId, Status _status) 
        external 
        checkProjectExist(_projectId) 
    {
        Status oldStatus = projects[_projectId].status;
        projects[_projectId].status = _status;

        emit ProjectStatusUpdated(_projectId, oldStatus, _status);
    }

    // ✅ Modifiers
    modifier OnlyOwner() {
        if (msg.sender != i_owner) {
            revert notOwner(msg.sender);
        }
        _;
    }

    modifier checkProjectExist(uint256 _projectId) {
        if (projects[_projectId].budgetPeso == 0) {
            revert ProjectNotExist(_projectId);
        }
        _;
    }
}
