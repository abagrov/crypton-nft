import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

describe("Assert 721", function () {
  let contract721: Contract;
  let owner: SignerWithAddress, user1: SignerWithAddress, user2: SignerWithAddress;

  this.beforeEach(async () => {
    const factory = await ethers.getContractFactory("Erc721");
    contract721 = await factory.deploy();
    [owner, user1, user2] = await ethers.getSigners();
  })

  it("Assert balance correctness", async () => {
    expect(await contract721.balanceOf(user1.address)).to.equal(0);

    await contract721.mint(user1.address, "");
    expect(await contract721.balanceOf(user1.address)).to.equal(1);

    await contract721.mint(user1.address, "");
    expect(await contract721.balanceOf(user1.address)).to.equal(2);
  });

  it("Assert ownerOf correctness", async () => {
    const mintTransaction = await contract721.mint(user1.address, "");
    const rc = await mintTransaction.wait();
    
    const transferEvent = rc.events!.find((e: { event: string; }) => e.event == 'Transfer');
    const [from, to, tokenId] = transferEvent!.args!;

    expect(await contract721.ownerOf(tokenId)).to.equal(user1.address);
  });

  it("Assert token url correctness", async () => {
    const dumbUrl = "ipfs://Assert";
    const mintTransaction = await contract721.mint(user1.address, dumbUrl);
    const rc = await mintTransaction.wait();
    const transferEvent = rc.events!.find((e: { event: string; }) => e.event == 'Transfer');
    const [from, to, tokenId] = transferEvent!.args!;

    expect(await contract721.tokenURI(tokenId)).to.equal(dumbUrl);
  });

  it("Assert approving", async () => {
    const mintTransaction = await contract721.mint(owner.address, "");
    const transferRc = await mintTransaction.wait();
    const transferEvent = transferRc.events!.find((e: { event: string; }) => e.event == 'Transfer');
    const [from, to, tokenId] = transferEvent!.args!;

    expect(await contract721.getApproved(tokenId)).to.equal("0x0000000000000000000000000000000000000000"); 

    const approveTransaction = await contract721.approve(user1.address, tokenId);
    const approveRc = await approveTransaction.wait();

    expect(await contract721.getApproved(tokenId)).to.equal(user1.address); 

  })

  it("Assert transfer from", async () => {
    const mintTransaction = await contract721.mint(owner.address, "");
    const transferRc = await mintTransaction.wait();
    
    const transferEvent = transferRc.events!.find((e: { event: string; }) => e.event == 'Transfer');
    const [from, to, tokenId] = transferEvent!.args!;
    await contract721.approve(user1.address, tokenId);
    expect(await contract721.balanceOf(user2.address)).to.equal(0);
    await contract721.connect(user1).transferFrom(owner.address, user2.address, tokenId);
    expect(await contract721.balanceOf(user2.address)).to.equal(1);
  })

  it("Assert that only owner can mint", async function () {
    await expect(contract721.connect(user1).mint(user1.address, "")).to.be.reverted;
  });
});


describe("1155", function () {
  let contract1155: Contract;
  let owner: SignerWithAddress, user1: SignerWithAddress, user2: SignerWithAddress;

  const token1Id = 1;
  const amount1 = 100n;

  const token2Id = 2;
  const amount2 = 200n;

  this.beforeEach(async () => {
    const factory = await ethers.getContractFactory("Erc1155");
    contract1155 = await factory.deploy();
    [owner, user1, user2] = await ethers.getSigners();
  })

  it("Assert balance", async () => {
    expect(await contract1155.balanceOf(user1.address, token1Id)).to.equal(0);
    await contract1155.mint(user1.address, token1Id, amount1, "");
    expect(await contract1155.balanceOf(user1.address, token1Id)).to.equal(amount1);
  })

  it("Assert approving for all", async () => {
    await contract1155.mint(owner.address, token1Id, amount1, "");

    expect(await contract1155.isApprovedForAll(owner.address, user1.address)).to.equal(false);

    const approveTransaction = await contract1155.setApprovalForAll(user1.address, true);
    const approveRc = await approveTransaction.wait();
    const approveEvent = approveRc.events!.find((e: { event: string; }) => e.event == 'ApprovalForAll');
    
    expect(approveEvent).to.be.an('object');
    expect(await contract1155.isApprovedForAll(owner.address, user1.address)).to.equal(true);
  })

  it("Assert transfer from", async () => {
    await contract1155.mint(owner.address, token1Id, amount1, "");
    await contract1155.setApprovalForAll(user1.address, true);
    await contract1155.connect(user1).safeTransferFrom(owner.address, user2.address, token1Id, amount1, 0x00);
    expect(await contract1155.balanceOf(user2.address, token1Id)).to.equal(amount1);
  })

  it("Assert batch transfer from", async () => {
    await contract1155.mint(owner.address, token1Id, amount1, "");
    await contract1155.mint(owner.address, token2Id, amount2, "");

    await contract1155.setApprovalForAll(user1.address, true);
    await contract1155.connect(user1).safeBatchTransferFrom(owner.address, user2.address, [token1Id, token2Id], [amount1, amount2], 0x00);

    expect(await contract1155.balanceOf(user2.address, token1Id)).to.equal(amount1);
    expect(await contract1155.balanceOf(user2.address, token2Id)).to.equal(amount2);
  });

  it("Assert that only owner can mint", async function () {
    await expect(contract1155.connect(user1).mint(owner.address, token1Id, amount1, "")).to.be.reverted;
  });
});