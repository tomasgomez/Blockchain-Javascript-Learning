const SHA256 = require('crypto-js/sha256');

module.exports = class Block {
    constructor( timestamp, transactions, previousHash = '') {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateTheHash();
    }

    calculateTheHash() {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    /*
    * Everytime a block is created it is added and its mineBlock method triggered
    * for the block be accepted is necessary to find the 0's hashes depending on the
    * setted difficulty
    */
    mineBlock(difficulty) {
        let countingHashes = 0;
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateTheHash();
            countingHashes++
        }
        console.log(`Tried ${countingHashes} hashes before creating a new block.`)
        console.log("Block mined: " + this.hash);
    }

    /**
     * It checks if all the transactions from the block transactions array are valid
     * @returns boolean
     */
    hasValidTransactions() {
        for(const trx of this.transactions) {
            if(!trx.isValid()) {
                return false;
            }
        }

        return true;
    }
}
