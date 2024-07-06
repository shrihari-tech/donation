import { expect } from "chai";
import { ethers } from "hardhat";

describe("DonationTracker", function () {
    let DonationTracker;
    let donationTracker;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function () {
        DonationTracker = await ethers.getContractFactory("DonationTracker");
        [owner, addr1, addr2, _] = await ethers.getSigners();
        donationTracker = await DonationTracker.deploy();
        await donationTracker.deployed();
    });

    it("Should accept donations and emit event", async function () {
        await expect(donationTracker.connect(addr1).donate({ value: ethers.utils.parseEther("1.0") }))
            .to.emit(donationTracker, "NewDonation")
            .withArgs(addr1.address, ethers.utils.parseEther("1.0"), anyValue);

        const donationCount = await donationTracker.getDonationCount();
        expect(donationCount).to.equal(1);

        const totalDonations = await donationTracker.getTotalDonationsByDonor(addr1.address);
        expect(totalDonations).to.equal(ethers.utils.parseEther("1.0"));
    });

    it("Should store the donation details correctly", async function () {
        await donationTracker.connect(addr1).donate({ value: ethers.utils.parseEther("1.0") });
        await donationTracker.connect(addr2).donate({ value: ethers.utils.parseEther("2.0") });

        const donationCount = await donationTracker.getDonationCount();
        expect(donationCount).to.equal(2);

        const [amount, donor, timestamp] = await donationTracker.getDonation(0);
        expect(amount).to.equal(ethers.utils.parseEther("1.0"));
        expect(donor).to.equal(addr1.address);

        const [amount2, donor2, timestamp2] = await donationTracker.getDonation(1);
        expect(amount2).to.equal(ethers.utils.parseEther("2.0"));
        expect(donor2).to.equal(addr2.address);
    });

    it("Should get the total donations by a donor", async function () {
        await donationTracker.connect(addr1).donate({ value: ethers.utils.parseEther("1.0") });
        await donationTracker.connect(addr1).donate({ value: ethers.utils.parseEther("2.0") });

        const totalDonations = await donationTracker.getTotalDonationsByDonor(addr1.address);
        expect(totalDonations).to.equal(ethers.utils.parseEther("3.0"));
    });

    it("Should revert if donation is zero", async function () {
        await expect(donationTracker.connect(addr1).donate({ value: 0 })).to.be.revertedWith("Donation must be greater than 0");
    });
});
