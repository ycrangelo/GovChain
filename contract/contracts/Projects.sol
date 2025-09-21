// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol"; // For uint256 to string conversion
import "@openzeppelin/contracts/utils/Base64.sol";  // For Base64 encoding

error ProjectNotExist(uint256 _projectId);
error notOwner(address _ownerAddress);

contract Projects is ERC721 {
    using Strings for uint256;

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

    mapping(uint256 => Project) public projects;
    mapping(uint256 => string) private _projectImages;

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

    // Create NFT for project
    function createProjectNft(
        string memory _name,
        string memory _location,
        uint256 _budget,
        address[] memory _signatories,
        string memory _timelineStart,
        string memory _timelineEnd,
        string memory _proposalLink,
        string memory _image
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

        _projectImages[nextProjectId] = _image;

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

    // Update status
    function updateStatus(uint256 _projectId, Status _status) 
        external 
        checkProjectExist(_projectId) 
    {
        Status oldStatus = projects[_projectId].status;
        projects[_projectId].status = _status;

        emit ProjectStatusUpdated(_projectId, oldStatus, _status);
    }

    // ERC721 tokenURI override for on-chain metadata
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(projects[tokenId].budgetPeso != 0, "Project does not exist");

        Project memory p = projects[tokenId];
        string memory image = _projectImages[tokenId];

        // Convert signatories addresses to string array
        string memory signatoriesStr = "[";
        for (uint i = 0; i < p.signatories.length; i++) {
            signatoriesStr = string(abi.encodePacked(
                signatoriesStr,
                '"', Strings.toHexString(uint160(p.signatories[i]), 20), '"',
                i < p.signatories.length - 1 ? "," : ""
            ));
        }
        signatoriesStr = string(abi.encodePacked(signatoriesStr, "]"));

        // Construct JSON metadata
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name":"', p.projectName,
                        '","description":"DPWH Project NFT",',
                        '"image":"', image,
                        '","attributes":[',
                            '{"trait_type":"Location","value":"', p.location, '"},',
                            '{"trait_type":"Budget","value":', p.budgetPeso.toString(), '},',
                            '{"trait_type":"Timeline Start","value":"', p.timelineStart, '"},',
                            '{"trait_type":"Timeline End","value":"', p.timelineEnd, '"},',
                            '{"trait_type":"Status","value":"', _statusToString(p.status), '"},',
                            '{"trait_type":"Signatories","value":', signatoriesStr, '},',
                            '{"trait_type":"Proposal Link","value":"', p.proposalLink, '"}',
                        ']}'
                    )
                )
            )
        );

        return string(abi.encodePacked("data:application/json;base64,", json));
    }

    // Helper to convert Status enum to string
    function _statusToString(Status _status) internal pure returns (string memory) {
        if (_status == Status.Pending) return "Pending";
        if (_status == Status.Rejected) return "Rejected";
        if (_status == Status.Approved) return "Approved";
        if (_status == Status.Ongoing) return "Ongoing";
        if (_status == Status.Completed) return "Completed";
        return "";
    }

    // Modifiers
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
