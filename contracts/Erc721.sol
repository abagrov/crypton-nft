//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Erc721 is ERC721URIStorage {
    uint256 public tokenCount;
    address private _owner;

    modifier owner() {
        require(msg.sender == _owner, "You are not the contract owner.");
        _;
    }

    constructor() ERC721("TectonicNFT", "TNFT") {
        tokenCount = 0;
        _owner = msg.sender;
    }

    function mint(address _user, string memory _tokenUrl)
        public
        owner
        returns (uint256 tokenId)
    {
        _mint(_user, tokenCount);
        _setTokenURI(tokenCount, _tokenUrl);
        tokenId = tokenCount;
        tokenCount++;
    }
}
