const BridgeEth = artifacts.require('./BridgeEth.sol');

module.exports = async done => {
  const accounts = await web3.eth.getAccounts();
  const bridgeEth = await BridgeEth.deployed();
  const amount = web3.utils.toWei('200000000');
  console.log(accounts);
  await bridgeEth.burn('0x', amount, {from: accounts[0]});
  done();
}
