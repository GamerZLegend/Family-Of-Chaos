// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ChaosNFT is ERC721, ERC721URIStorage, Pausable, Ownable, ERC721Burnable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    
    // Mapping from token ID to price
    mapping(uint256 => uint256) private _tokenPrices;
    
    // Mapping from token ID to listing status
    mapping(uint256 => bool) private _tokenListings;

    constructor() ERC721("ChaosNFT", "CHAOS") {}

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function listToken(uint256 tokenId, uint256 price) public {
        require(ownerOf(tokenId) == msg.sender, "Not token owner");
        require(price > 0, "Price must be greater than 0");
        _tokenPrices[tokenId] = price;
        _tokenListings[tokenId] = true;
    }

    function unlistToken(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Not token owner");
        _tokenListings[tokenId] = false;
    }

    function buyToken(uint256 tokenId) public payable {
        require(_tokenListings[tokenId], "Token not listed for sale");
        require(msg.value >= _tokenPrices[tokenId], "Insufficient payment");
        
        address seller = ownerOf(tokenId);
        _tokenListings[tokenId] = false;
        _transfer(seller, msg.sender, tokenId);
        
        // Transfer payment to seller
        payable(seller).transfer(msg.value);
    }

    function getTokenPrice(uint256 tokenId) public view returns (uint256) {
        return _tokenPrices[tokenId];
    }

    function isTokenListed(uint256 tokenId) public view returns (bool) {
        return _tokenListings[tokenId];
    }

    // Override required functions
    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
