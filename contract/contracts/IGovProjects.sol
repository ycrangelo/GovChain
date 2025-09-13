// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IGovProjects {
    enum Status { Pending, Rejected, Approved, Ongoing, Completed }

    function updateStatus(uint256 _projectId, Status _status) external;

    function getPDF(uint8 _projectId)  external view returns (string memory);

    function projects(uint256 _projectId) external view returns (
        uint256 projectId,
        string memory projectName,
        string memory location,
        uint budgetPeso,
        address[] memory signatories,
        address[] memory engineers,
        address[] memory contractors,
        string memory timelineStart,
        string memory timelineEnd,
        Status status,
        string memory proposalLink
    );
}