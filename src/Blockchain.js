const Block = require('./Block');
const Transaction = require('./Transaction')

module.exports = class Blockchain{
    constructor() {
        this.chain = [this.createGenesisBlock()]; // the chain, needs the first genesis block
        this.difficulty = 2; // difficultie of mining 1 block, it means how many 0's in front it needs
        this.pendingTransactions = []; // it represent pending transactions to respect time mining intervals
        this.miningReward = 100; // how many coins as rewards per mined block
    };

    createGenesisBlock() {
        return new Block(0, "01/01/2021", "Genesis block", "0");
    };

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    };

    /*
    * It gets the hash of the previous block, set as a previous hash attribute
    * then makes the block mining and then adds it to the chain
    */
    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    };

    /* 
    * miningRewardAddres: wallet Address
    * First it creates a new block and pass the pending transactions array
    * then it triggers the mineBlock method from that new block and pass
    * the difficulty of mining a block. So if the miner actually mine the block
    * this method finishes and adds the block to the chain
    * then adds a new transaction to the Pending Transactions array.
    * Because is the system that rewards there is no from address.
    */
    minePendingTransactions(miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined');
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward),
        ]

    }

    // It adds a transaction to the pending transaction array
    addTransaction(transaction) {

        if(!transaction.fromAddress || !transaction.toAddress) {
            throw new Error('Transaction must inlcude from and to address');
        }

        if(!transaction.isValid()) {
            throw new Error('Cannot add invalid transaction to chain');
        }

        this.pendingTransactions.push(transaction);
    }

    /*
    * Because there is no balance file, to get an address balance
    * is necessary to iterate over nodes counting the balance among transactions
    */
    getBalanceOfAdress(address) {
        let balance = 0;

        for(const block of this.chain) {
            for(const trans of block.transactions) {
                if(trans.fromAddress === address) {
                    balance -= trans.amount;
                }
                if(trans.toAddress === address) {
                    balance += trans.amount;
                }

            }
        }
        return balance;
    }

    /* 
    * It checks if there are any tamper or incorrect block
    * comparing hash from previousBlock with the hash of the current one
    * also compares the current block with a calculated has
    */
    isChainValid() {
        for(let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(!currentBlock.hasValidTransactions()) {
                return false;
            }

            if(currentBlock.hash !== currentBlock.calculateTheHash()){
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash){
                return false
            }
        }

        return true;
    }
}