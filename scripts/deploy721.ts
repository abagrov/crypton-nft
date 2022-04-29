
import { ethers } from "hardhat";

async function main() {
  
  const factory = await ethers.getContractFactory("Erc721");
  const erc721 = await factory.deploy();

  await erc721.deployed();

  console.log("Erc721 deployed to address:", erc721.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});