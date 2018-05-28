const sha256 = require('crypto-js/sha256')
const moment = require('moment')

class Block {
  constructor (data) {
    this.index = 0
    this.timestamp = moment().format('YYYY-MM-DD hh:mm:ss')
    this.data = data
    this.previousHash = '0'
    this.hash = this.calculateHash()
  }

  calculateHash () {
    return sha256(this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash).toString()
  }

}

class BlockChain {
  constructor () {
    this.chain = [this._createGenesis()]
  }

  _createGenesis () {
    return new Block(0, 'Hi, Genesis Block!')
  }

  isValidChain () {
    const len = this.chain.length
    for (let i = 1; i < len; i++) {
      const currentBlock = this.chain[i]
      const previousBlock = this.chain[i - 1]
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false
      }
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false
      }
    }
    return true
  }

  lastBlock () {
    return this.chain[this.chain.length - 1]
  }

  createBlock (newBlock) {
    newBlock.previousHash = this.lastBlock().hash
    newBlock.hash = newBlock.calculateHash()
    this.chain.push(newBlock)
    return this
  }
}

const helloChain = new BlockChain()
helloChain.createBlock(new Block({account: 10}))
  .createBlock(new Block({account: 400}))
  .createBlock(new Block({account: 520}))
// helloChain.chain[1].data = {account: 10000}
// console.log('is valid block chain?', helloChain.isValidChain())
console.log(JSON.stringify(helloChain, null, 4))