const TokenBsc = artifacts.require('TokenBsc.sol');
const BridgeEth = artifacts.require('BridgeEth.sol');
const BridgeBsc = artifacts.require('BridgeBsc.sol');

const tokenContractAOG = "0x8578530205CEcbe5DB83F7F29EcfEEC860C297C2";

module.exports = async function (deployer, network) {
  if(network === 'ethTestnet' || network === 'ethMainnet') {
    await deployer.deploy(BridgeEth, tokenContractAOG);
    await BridgeEth.deployed();
  }
  if(network === 'bscTestnet' || network === 'bscMainnet') {
    await deployer.deploy(TokenBsc);
    const tokenBsc = await TokenBsc.deployed();
    await deployer.deploy(BridgeBsc, tokenBsc.address);
    const bridgeBsc = await BridgeBsc.deployed();
    await tokenBsc.updateAdmin(bridgeBsc.address);
  }
};
