//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract Erc1155 is ERC1155 {
    string public name = "Tectonic NFT 1155";
    string public symbol = "TNFT1155";
    address private _owner;

    modifier owner() {
        require(msg.sender == _owner, "You are not the contract owner.");
        _;
    }

    constructor()
        ERC1155(
            "https://ipfs.io/ipfs/QmPpCiuZF1MNLSYLhrANAR1Tdox3ETxnJtAYFHZqdfwDwY/{id}.json"
        )
    {
        _owner = msg.sender;
    }

    function mint(
        address _user,
        uint256 _tokenId,
        uint256 _amount,
        string memory _metadataUrl
    ) public owner {
        _mint(_user, _tokenId, _amount, "");
        _setURI(_metadataUrl);
    }
}
