const Blockchain = require('./Blockchain');
const Transaction = require('./Transaction');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

// Private and public keys to simulate a wallet
const myKey = ec.keyFromPrivate('18c77ac31812b8370c7d4c9968e02f5e97e9eb340ce089f61949663b45ee2472');
const myWalletAddress = myKey.getPublic('hex');

// Creating an own blockchain
let altoCoin = new Blockchain();

const trx1 = new Transaction(myWalletAddress, 'public key to send amount goes here', 0);
trx1.signTransaction(myKey);
altoCoin.addTransaction(trx1);


console.log('\n Starting a miner... ');
altoCoin.minePendingTransactions(myWalletAddress);

console.log('\n Balance of CustomAddress is', altoCoin.getBalanceOfAdress(myWalletAddress));
