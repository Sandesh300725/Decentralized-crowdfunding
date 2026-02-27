const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("Crowdfunding", function () {
  let crowdfunding;
  let owner, creator, donor1, donor2;
  const GOAL = ethers.parseEther("1.0"); // 1 ETH
  const DURATION = 30; // 30 days

  beforeEach(async () => {
    [owner, creator, donor1, donor2] = await ethers.getSigners();
    const CF = await ethers.getContractFactory("Crowdfunding");
    crowdfunding = await CF.deploy();
  });

  // ─── Campaign Creation ────────────────────────────────────────────────────

  describe("createCampaign", () => {
    it("should create a campaign successfully", async () => {
      await expect(
        crowdfunding.connect(creator).createCampaign(
          "Save the Rainforest",
          "Help us protect 1000 acres",
          "https://image.url",
          "Environment",
          GOAL,
          DURATION
        )
      ).to.emit(crowdfunding, "CampaignCreated");

      const campaign = await crowdfunding.getCampaign(1);
      expect(campaign.title).to.equal("Save the Rainforest");
      expect(campaign.goal).to.equal(GOAL);
      expect(campaign.active).to.be.true;
    });

    it("should revert if title is empty", async () => {
      await expect(
        crowdfunding.connect(creator).createCampaign("", "desc", "", "cat", GOAL, DURATION)
      ).to.be.revertedWith("Title cannot be empty");
    });

    it("should revert if goal is 0", async () => {
      await expect(
        crowdfunding.connect(creator).createCampaign("Title", "desc", "", "cat", 0, DURATION)
      ).to.be.revertedWith("Goal must be greater than 0");
    });
  });

  // ─── Contributions ────────────────────────────────────────────────────────

  describe("contribute", () => {
    beforeEach(async () => {
      await crowdfunding.connect(creator).createCampaign(
        "Test Campaign", "desc", "", "tech", GOAL, DURATION
      );
    });

    it("should accept contributions", async () => {
      const amount = ethers.parseEther("0.5");
      await expect(
        crowdfunding.connect(donor1).contribute(1, { value: amount })
      ).to.emit(crowdfunding, "ContributionMade").withArgs(1, donor1.address, amount);

      const campaign = await crowdfunding.getCampaign(1);
      expect(campaign.amountRaised).to.equal(amount);
    });

    it("should track multiple contributors", async () => {
      await crowdfunding.connect(donor1).contribute(1, { value: ethers.parseEther("0.3") });
      await crowdfunding.connect(donor2).contribute(1, { value: ethers.parseEther("0.4") });

      const campaign = await crowdfunding.getCampaign(1);
      expect(campaign.amountRaised).to.equal(ethers.parseEther("0.7"));
    });

    it("should revert after deadline", async () => {
      await time.increase(31 * 24 * 60 * 60); // 31 days
      await expect(
        crowdfunding.connect(donor1).contribute(1, { value: ethers.parseEther("0.1") })
      ).to.be.revertedWith("Campaign has ended");
    });
  });

  // ─── Claim Funds ──────────────────────────────────────────────────────────

  describe("claimFunds", () => {
    beforeEach(async () => {
      await crowdfunding.connect(creator).createCampaign(
        "Test", "desc", "", "tech", GOAL, DURATION
      );
      // Fund the campaign fully
      await crowdfunding.connect(donor1).contribute(1, { value: ethers.parseEther("0.6") });
      await crowdfunding.connect(donor2).contribute(1, { value: ethers.parseEther("0.5") });
      // Move past deadline
      await time.increase(31 * 24 * 60 * 60);
    });

    it("should allow creator to claim funds after success", async () => {
      const balanceBefore = await ethers.provider.getBalance(creator.address);
      await crowdfunding.connect(creator).claimFunds(1);
      const balanceAfter = await ethers.provider.getBalance(creator.address);
      expect(balanceAfter).to.be.gt(balanceBefore);
    });

    it("should revert if non-owner tries to claim", async () => {
      await expect(
        crowdfunding.connect(donor1).claimFunds(1)
      ).to.be.revertedWith("Not the campaign owner");
    });

    it("should revert if already claimed", async () => {
      await crowdfunding.connect(creator).claimFunds(1);
      await expect(
        crowdfunding.connect(creator).claimFunds(1)
      ).to.be.revertedWith("Funds already claimed");
    });
  });

  // ─── Refunds ─────────────────────────────────────────────────────────────

  describe("claimRefund", () => {
    beforeEach(async () => {
      await crowdfunding.connect(creator).createCampaign(
        "Test", "desc", "", "tech", GOAL, DURATION
      );
      // Contribute less than goal
      await crowdfunding.connect(donor1).contribute(1, { value: ethers.parseEther("0.3") });
      // Move past deadline (goal not reached)
      await time.increase(31 * 24 * 60 * 60);
    });

    it("should refund contributor if goal not reached", async () => {
      const balBefore = await ethers.provider.getBalance(donor1.address);
      await crowdfunding.connect(donor1).claimRefund(1);
      const balAfter = await ethers.provider.getBalance(donor1.address);
      expect(balAfter).to.be.gt(balBefore);
    });

    it("should revert if contributor has no funds", async () => {
      await expect(
        crowdfunding.connect(donor2).claimRefund(1)
      ).to.be.revertedWith("No contribution found");
    });
  });

  // ─── Cancel Campaign ──────────────────────────────────────────────────────

  describe("cancelCampaign", () => {
    beforeEach(async () => {
      await crowdfunding.connect(creator).createCampaign(
        "Test", "desc", "", "tech", GOAL, DURATION
      );
    });

    it("should allow creator to cancel before deadline", async () => {
      await expect(
        crowdfunding.connect(creator).cancelCampaign(1)
      ).to.emit(crowdfunding, "CampaignCancelled");

      const campaign = await crowdfunding.getCampaign(1);
      expect(campaign.active).to.be.false;
    });

    it("should revert if non-owner tries to cancel", async () => {
      await expect(
        crowdfunding.connect(donor1).cancelCampaign(1)
      ).to.be.revertedWith("Not the campaign owner");
    });
  });
});
