// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title Crowdfunding
 * @dev Decentralized crowdfunding platform on Ethereum
 * @author Your Name
 */
contract Crowdfunding {

    // ─── Structs ─────────────────────────────────────────────────────────────

    struct Campaign {
        uint256 id;
        address payable owner;
        string title;
        string description;
        string imageUrl;
        string category;
        uint256 goal;           // in wei
        uint256 deadline;       // Unix timestamp
        uint256 amountRaised;
        bool claimed;
        bool active;
    }

    struct Contribution {
        address contributor;
        uint256 amount;
        uint256 timestamp;
    }

    // ─── State Variables ──────────────────────────────────────────────────────

    uint256 public campaignCount;
    uint256 public platformFeePercent = 2; // 2% platform fee
    address public owner;

    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => Contribution[]) public contributions;
    mapping(uint256 => mapping(address => uint256)) public contributorAmount;

    // ─── Events ───────────────────────────────────────────────────────────────

    event CampaignCreated(
        uint256 indexed id,
        address indexed owner,
        string title,
        uint256 goal,
        uint256 deadline
    );

    event ContributionMade(
        uint256 indexed campaignId,
        address indexed contributor,
        uint256 amount
    );

    event FundsClaimed(
        uint256 indexed campaignId,
        address indexed owner,
        uint256 amount
    );

    event RefundIssued(
        uint256 indexed campaignId,
        address indexed contributor,
        uint256 amount
    );

    event CampaignCancelled(uint256 indexed campaignId);

    // ─── Modifiers ────────────────────────────────────────────────────────────

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the platform owner");
        _;
    }

    modifier campaignExists(uint256 _id) {
        require(_id > 0 && _id <= campaignCount, "Campaign does not exist");
        _;
    }

    modifier onlyCampaignOwner(uint256 _id) {
        require(campaigns[_id].owner == msg.sender, "Not the campaign owner");
        _;
    }

    // ─── Constructor ──────────────────────────────────────────────────────────

    constructor() {
        owner = msg.sender;
    }

    // ─── Core Functions ───────────────────────────────────────────────────────

    /**
     * @dev Create a new crowdfunding campaign
     */
    function createCampaign(
        string memory _title,
        string memory _description,
        string memory _imageUrl,
        string memory _category,
        uint256 _goal,
        uint256 _durationInDays
    ) external returns (uint256) {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(_goal > 0, "Goal must be greater than 0");
        require(_durationInDays > 0 && _durationInDays <= 365, "Duration must be 1-365 days");

        campaignCount++;
        uint256 deadline = block.timestamp + (_durationInDays * 1 days);

        campaigns[campaignCount] = Campaign({
            id: campaignCount,
            owner: payable(msg.sender),
            title: _title,
            description: _description,
            imageUrl: _imageUrl,
            category: _category,
            goal: _goal,
            deadline: deadline,
            amountRaised: 0,
            claimed: false,
            active: true
        });

        emit CampaignCreated(campaignCount, msg.sender, _title, _goal, deadline);
        return campaignCount;
    }

    /**
     * @dev Contribute ETH to a campaign
     */
    function contribute(uint256 _campaignId)
        external
        payable
        campaignExists(_campaignId)
    {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.active, "Campaign is not active");
        require(block.timestamp < campaign.deadline, "Campaign has ended");
        require(msg.value > 0, "Contribution must be greater than 0");

        campaign.amountRaised += msg.value;
        contributorAmount[_campaignId][msg.sender] += msg.value;

        contributions[_campaignId].push(Contribution({
            contributor: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp
        }));

        emit ContributionMade(_campaignId, msg.sender, msg.value);
    }

    /**
     * @dev Campaign owner claims funds after successful campaign
     */
    function claimFunds(uint256 _campaignId)
        external
        campaignExists(_campaignId)
        onlyCampaignOwner(_campaignId)
    {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.active, "Campaign is not active");
        require(block.timestamp >= campaign.deadline, "Campaign has not ended yet");
        require(campaign.amountRaised >= campaign.goal, "Funding goal not reached");
        require(!campaign.claimed, "Funds already claimed");

        campaign.claimed = true;
        campaign.active = false;

        uint256 fee = (campaign.amountRaised * platformFeePercent) / 100;
        uint256 payout = campaign.amountRaised - fee;

        // Transfer fee to platform
        payable(owner).transfer(fee);

        // Transfer funds to campaign owner
        campaign.owner.transfer(payout);

        emit FundsClaimed(_campaignId, msg.sender, payout);
    }

    /**
     * @dev Contributors claim refund if campaign failed
     */
    function claimRefund(uint256 _campaignId)
        external
        campaignExists(_campaignId)
    {
        Campaign storage campaign = campaigns[_campaignId];
        require(block.timestamp >= campaign.deadline, "Campaign has not ended yet");
        require(
            campaign.amountRaised < campaign.goal || !campaign.active,
            "Campaign succeeded — no refund available"
        );

        uint256 amount = contributorAmount[_campaignId][msg.sender];
        require(amount > 0, "No contribution found");

        contributorAmount[_campaignId][msg.sender] = 0;
        payable(msg.sender).transfer(amount);

        emit RefundIssued(_campaignId, msg.sender, amount);
    }

    /**
     * @dev Campaign owner cancels their campaign (only before deadline)
     */
    function cancelCampaign(uint256 _campaignId)
        external
        campaignExists(_campaignId)
        onlyCampaignOwner(_campaignId)
    {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.active, "Campaign already inactive");
        require(block.timestamp < campaign.deadline, "Campaign has already ended");

        campaign.active = false;
        emit CampaignCancelled(_campaignId);
    }

    // ─── View Functions ───────────────────────────────────────────────────────

    function getCampaign(uint256 _id)
        external
        view
        campaignExists(_id)
        returns (Campaign memory)
    {
        return campaigns[_id];
    }

    function getAllCampaigns() external view returns (Campaign[] memory) {
        Campaign[] memory all = new Campaign[](campaignCount);
        for (uint256 i = 1; i <= campaignCount; i++) {
            all[i - 1] = campaigns[i];
        }
        return all;
    }

    function getContributions(uint256 _campaignId)
        external
        view
        returns (Contribution[] memory)
    {
        return contributions[_campaignId];
    }

    function getContributorAmount(uint256 _campaignId, address _contributor)
        external
        view
        returns (uint256)
    {
        return contributorAmount[_campaignId][_contributor];
    }

    function getCampaignProgress(uint256 _campaignId)
        external
        view
        campaignExists(_campaignId)
        returns (uint256 percent)
    {
        Campaign memory c = campaigns[_campaignId];
        if (c.goal == 0) return 0;
        return (c.amountRaised * 100) / c.goal;
    }

    function isExpired(uint256 _campaignId)
        external
        view
        campaignExists(_campaignId)
        returns (bool)
    {
        return block.timestamp >= campaigns[_campaignId].deadline;
    }

    // ─── Admin Functions ──────────────────────────────────────────────────────

    function updatePlatformFee(uint256 _newFee) external onlyOwner {
        require(_newFee <= 10, "Fee cannot exceed 10%");
        platformFeePercent = _newFee;
    }

    receive() external payable {}
}
