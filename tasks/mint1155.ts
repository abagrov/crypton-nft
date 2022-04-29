import { task, types } from "hardhat/config";
import { getContractAt } from "@nomiclabs/hardhat-ethers/internal/helpers";

task("mint1155", "Stake tokens")
    .addParam("contractAddr", "Address of the deployed ERC1155 token contract", "0xc584239e584aC1d29dA27a43C823081eB98fD9BE")
    .addParam("userAddr", "Address of user to mint", "0x34f97ff8604cEaB6081B0F23E0A9B0b8B0Ee5497")
    .addParam("tokenId", "Id of token", 0, types.int)
    .addParam("amount", "Amount of token to mint", 10, types.int)
    .addParam("metadataUrl", "Metadata addr", "ipfs://QmPpCiuZF1MNLSYLhrANAR1Tdox3ETxnJtAYFHZqdfwDwY/{id}.json")

    .setAction(async (taskArgs, hre) => {

        const erc1155Contract = await getContractAt(hre, "Erc1155", taskArgs['contractAddr']);
        const mintTransaction = await erc1155Contract.mint(taskArgs['userAddr'], taskArgs['tokenId'], taskArgs['amount'], taskArgs['metadataUrl']);

        const rc = await mintTransaction.wait();

        console.log(
            `Minted ${taskArgs['amount']} tokens ${taskArgs['tokenId']} to ${taskArgs['userAddr']}\n`
        );
    });