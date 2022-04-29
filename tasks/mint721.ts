import { task } from "hardhat/config";
import { getContractAt } from "@nomiclabs/hardhat-ethers/internal/helpers";

task("mint721", "Stake tokens")
    .addParam("contractAddr", "Address of the ERC721 contract", "0xFAAeb16893f919BFaB92fe4e9C86998f6e0b2d2A")
    .addParam("userAddr", "Address of user to mint", "0x34f97ff8604cEaB6081B0F23E0A9B0b8B0Ee5497")
    .addParam("tokenUrl", "Address of metadata", "ipfs://QmPPbH4oN4BbvxUhqRU7yd8wzc8aHjecEKuBD6Jkojgtze")

    .setAction(async (taskArgs, hre) => {

        const erc721Contract = await getContractAt(hre, "Erc721", taskArgs['contractAddr']);
        const mintTransaction = await erc721Contract.mint(taskArgs['userAddr'], taskArgs['tokenUrl']);

        const rc = await mintTransaction.wait();

        console.log(
            `Minted token to ${taskArgs['userAddr']}\n`
        );
    });