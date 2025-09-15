// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

error notOwner(address _ownerAddress);

contract GovToken is ERC20 {
    address[] public approverAddress;
    uint256 public countApprovers;
    address immutable public i_owner;

    // 📌 EVENTS
    event ApproverAdded(address indexed approver);
    event ApproversBatchAdded(address[] approvers);
    event TokenDistributed(address indexed to, uint256 amount);
    event OwnerSet(address indexed owner);
    
    constructor() ERC20("TOKEN_APPROVAL", "TKNPRVL") {
        // mint tokens to the contract itself
        _mint(address(this), 2000);
        i_owner = msg.sender;

        emit OwnerSet(msg.sender);
    }

    function returnContractBalance() public view returns (uint256) {
        return balanceOf(address(this));
    }

    function addApprovers(address[] memory _approverAddress) public OnlyOwner {
        // putting all of the approvers to the array of address
        for (uint256 i = 0; i < _approverAddress.length; i++) {
            approverAddress.push(_approverAddress[i]);
            countApprovers++;

            emit ApproverAdded(_approverAddress[i]);
        }

        emit ApproversBatchAdded(_approverAddress);
    }

    function distributeToken() public OnlyOwner {
        for (uint256 i = 0; i < approverAddress.length; i++) {
            _transfer(address(this), approverAddress[i], 1);

            emit TokenDistributed(approverAddress[i], 1);
        }
    }

    modifier OnlyOwner() {
        if (msg.sender != i_owner) {
            revert notOwner(msg.sender);
        }
        _;
    }
}
