const Web3 = require('web3');
const BridgeEth = require('../build/contracts/BridgeEth.json');
const BridgeBsc = require('../build/contracts/BridgeBsc.json');

const web3Eth = new Web3('wss://mainnet.infura.io/ws/v3/ffdd55345da6440fb4fff0ce84074f38');
const web3Bsc = new Web3('wss://bsc.getblock.io/mainnet/?api_key=e606c9e1-05e1-4b85-b233-2f95c773a3bf');
const adminPrivKey = ' ';
const { address: admin } = web3Eth.eth.accounts.wallet.add(adminPrivKey);
const { address: newAdmin } = web3Bsc.eth.accounts.wallet.add(adminPrivKey);

const bridgeEth = new web3Eth.eth.Contract(
  BridgeEth.abi,
  BridgeEth.networks['1'].address
);

const bridgeBsc = new web3Bsc.eth.Contract(
  BridgeBsc.abi,
  BridgeBsc.networks['56'].address
);

bridgeEth.events.Transfer(
  {fromBlock: 0, step: 0}
)
.on('data', async event => {
  try {
    const { from, to, amount, date, nonce, step } = event.returnValues;
    console.log("bridgeEth step: ", step);
    if (step == 1) {
      return;
    }
  
    const tx = bridgeBsc.methods.mint(to, amount, nonce);
    const [gasPrice, gasCost] = await Promise.all([
      web3Bsc.eth.getGasPrice(),
      tx.estimateGas({from: admin}),
    ]);
    const data = tx.encodeABI();
    const txData = {
      from: admin,
      to: bridgeBsc.options.address,
      data,
      gas: gasCost,
      gasPrice
    };
    const receipt = await web3Bsc.eth.sendTransaction(txData);
    console.log(`Transaction hash: ${receipt.transactionHash}`);
    console.log(`
      Processed transfer:
      - from ${from} 
      - to ${to} 
      - amount ${amount} tokens
      - date ${date}
    `);  
  } catch(err) {
    console.log("bridgeEth: ERROR: ", err.message);
  }
});

bridgeBsc.events.Transfer(
  {fromBlock: 0, step: 0}
)
.on('data', async event => {
  try {
    const { from, to, amount, date, nonce, step } = event.returnValues;
    console.log("bridgeBsc step: ", step);
    if (step == 1) {
      return;
    }
  
    const tx = bridgeEth.methods.mint(to, amount, nonce);

    const [gasPrice, gasCost] = await Promise.all([
      web3Eth.eth.getGasPrice(),
      tx.estimateGas({from: admin}),
    ]);
    const data = tx.encodeABI();
    const txData = {
      from: admin,
      to: bridgeEth.options.address,
      data,
      gas: gasCost,
      gasPrice
    };
    const receipt = await web3Eth.eth.sendTransaction(txData);
    console.log(`Transaction hash: ${receipt.transactionHash}`);
    console.log(`
      Processed transfer:
      - from ${from} 
      - to ${to} 
      - amount ${amount} tokens
      - date ${date}
    `);
  } catch(err) {
    console.log("bridgeBsc: ERROR: ", err.message);
  }
});
