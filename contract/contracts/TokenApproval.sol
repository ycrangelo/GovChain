// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";


error notOwner(address _ownerAddress);
contract TokenApproval is ERC20{

    address[] public approverAddress;
    uint256 contractBalance = balanceOf(address(this));
    address immutable public i_owner;

    constructor() ERC20("TOKEN_APPROVAL", "TKNPRVL") {
        //giving the contract itself a token
        _mint(address(this), 1000);
        i_owner = msg.sender; //setting the owner of the contract
    }

    function returnContractBalance() public view returns (uint256) {
        return balanceOf(address(this));
    }

    function addApprovers(address[] memory _approverAddress) public OnlyOwner{ 
        //putting all of the approvers to the array of address
        for (uint256 i = 0; i < _approverAddress.length; i++) {
            approverAddress.push(_approverAddress[i]);
        }
    }

    function destributeToken() public  OnlyOwner{
        for (uint256 i = 0; i < approverAddress.length; i++) {
             _transfer(address(this), approverAddress[i], 1 * 10 ** decimals());
        }
    }


    modifier OnlyOwner(){
        if(msg.sender !=i_owner){
            revert notOwner(msg.sender);
        }
        _;
    }
}