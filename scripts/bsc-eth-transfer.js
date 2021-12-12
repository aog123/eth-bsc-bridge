const BridgeBsc = artifacts.require('./BridgeBsc.sol');

module.exports = async done => {
  const accounts = await web3.eth.getAccounts();
  const bridgeBsc = await BridgeBsc.deployed();
  const amount = web3.utils.toWei('1000');
  await bridgeBsc.burn(accounts[1], amount, {from: accounts[1]});
  done();
}
