//const TokenEth = artifacts.require('./TokenEth.sol');

module.exports = async done => {
  const [sender, sender2, _] = await web3.eth.getAccounts();
//  const tokenEth = await TokenEth.deployed();
//  const balance = await tokenEth.balanceOf(sender2);
  console.log(sender2);
  done();
}
