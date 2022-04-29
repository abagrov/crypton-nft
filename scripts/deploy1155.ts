
import { ethers } from "hardhat";

async function main() {
  
  const factory = await ethers.getContractFactory("Erc1155");
  const erc1155 = await factory.deploy();

  await erc1155.deployed();

  console.log("Erc1155 deployed to address:", erc1155.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});