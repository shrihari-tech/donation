require("@nomicfoundation/hardhat-toolbox");
// import { task } from "hardhat/config";
require( "@nomiclabs/hardhat-waffle");
require( "@nomiclabs/hardhat-ethers");
require( "@nomiclabs/hardhat-etherscan");
require( "solidity-coverage");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
};
