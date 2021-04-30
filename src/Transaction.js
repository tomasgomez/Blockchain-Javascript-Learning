const SHA256 = require("crypto-js/sha256");
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

module.exports = class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    calculateHash() {
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }

    /*
    * It signs a transaction with fromAddress private key and new calculate Transaction Hash
    * using fromAddress + toAddress + amount and then sign it with the key
    */
    signTransaction(signingKey) {
        if(signingKey.getPublic('hex') !== this.fromAddress) {
            throw new Error('You cannot sign transactions for other wallets.');
        }

        const hashTrx = this.calculateHash();
        const sig = signingKey.sign(hashTrx, 'base64');
        this.signature = sig.toDER('hex');
    }

    /*
    * It checks if has no Address so should come from the system
    * if there is not a signature so is not valid, and then it checks
    * with the public key if the hash is the same as the signature
    */
    isValid() {
        if(this.fromAddress === null) return true;

        if(!this.signature || this.signature.length === 0) {
            throw new Error('No signature for this transaction');
        }

        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}