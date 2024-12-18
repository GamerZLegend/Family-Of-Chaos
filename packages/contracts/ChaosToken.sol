// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ChaosToken is ERC20, ERC20Burnable, Pausable, Ownable {
    // Mapping for rewards claiming
    mapping(address => uint256) private _pendingRewards;
    
    // Events
    event RewardAdded(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 amount);

    constructor() ERC20("ChaosToken", "CHAOS") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function addReward(address user, uint256 amount) public onlyOwner {
        require(amount > 0, "Amount must be greater than 0");
        _pendingRewards[user] += amount;
        emit RewardAdded(user, amount);
    }

    function claimRewards() public {
        uint256 amount = _pendingRewards[msg.sender];
        require(amount > 0, "No rewards to claim");
        
        _pendingRewards[msg.sender] = 0;
        _mint(msg.sender, amount);
        
        emit RewardClaimed(msg.sender, amount);
    }

    function getPendingRewards(address user) public view returns (uint256) {
        return _pendingRewards[user];
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(from, to, amount);
    }
}
