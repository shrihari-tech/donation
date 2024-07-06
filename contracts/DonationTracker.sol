// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DonationTracker {
    // Structure to hold donation details
    struct Donation {
        uint256 amount;
        address donor;
        uint256 timestamp;
    }

    // Array to store all donations
    Donation[] public donations;

    // Mapping to track total donations by each donor
    mapping(address => uint256) public totalDonationsByDonor;

    // Event to log new donations
    event NewDonation(address indexed donor, uint256 amount, uint256 timestamp);

    // Function to make a donation
    function donate() public payable {
        require(msg.value > 0, "Donation must be greater than 0");

        // Record the donation details
        donations.push(Donation({
            amount: msg.value,
            donor: msg.sender,
            timestamp: block.timestamp
        }));

        // Update the total donations for the donor
        totalDonationsByDonor[msg.sender] += msg.value;

        // Emit the donation event
        emit NewDonation(msg.sender, msg.value, block.timestamp);
    }

    // Function to get the total number of donations
    function getDonationCount() public view returns (uint256) {
        return donations.length;
    }

    // Function to get a donation by index
    function getDonation(uint256 index) public view returns (uint256, address, uint256) {
        require(index < donations.length, "Invalid index");

        Donation memory donation = donations[index];
        return (donation.amount, donation.donor, donation.timestamp);
    }

    // Function to get the total donations by a donor
    function getTotalDonationsByDonor(address donor) public view returns (uint256) {
        return totalDonationsByDonor[donor];
    }
}
