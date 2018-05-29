const sha256 = require('crypto-js/sha256')
const moment = require('moment')

class Transaction {
  constructor (to, from, account) {
    this.to = to
    this.from = from
    this.account = account
  }
}

class Block {
  constructor (data) {
    this.index = 0
    this.timestamp = moment().format('YYYY-MM-DD hh:mm:ss')
    this.data = data
    this.previousHash = '0'
    this.hash = this.calculateHash()
    this.nonce = 0
  }

  calculateHash () {
    return sha256(this.index + this.nonce + this.timestamp + JSON.stringify(this.data) + this.previousHash).toString()
  }

  miniBlack (difficulty) {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      this.nonce++
      this.hash = this.calculateHash()
    }
  }
}

class BlockChain {
  constructor () {
    this.chain = [this._createGenesis()]
    this.difficulty = 2
    this.rewards = 100
    this.pendingTansactions = []
  }

  _createGenesis () {
    return new Block('this is genesis block！')
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

  // 挖矿获取收益
  miniPendingTransactions (miniAddress) {
    let block = new Block(this.pendingTansactions)
    block.miniBlack(this.difficulty)
    block.previousHash = this.lastBlock().hash
    block.hash = block.calculateHash()
    console.log('挖矿成功...')
    this.chain.push(block)
    this.pendingTansactions = [
      new Transaction(null, miniAddress, this.rewards)
    ]
    return this
  }

  // 创建交易
  createTransaction (transaction) {
    this.pendingTansactions.push(transaction)
    return this
  }

  // 获取账户余额
  getBalance (address) {
    let balance = 0
    for (const block of this.chain) {
      for (const tran of block.data) {
        if (tran.to === address) {
          balance -= tran.account
        }
        if (tran.from === address) {
          balance += tran.account
        }
      }
    }
    return balance
  }

  // 创建新区块
  createBlock (newBlock) {
    newBlock.previousHash = this.lastBlock().hash
    newBlock.hash = newBlock.calculateHash()
    this.chain.push(newBlock)
    return this
  }
}

let address
const helloChain = new BlockChain()
for (let i = 0; i < 1000; i++) {
  const account = parseInt(Math.random() * 1000)
  const to = parseInt(Math.random() * 1000)
  const from = parseInt(Math.random() * 1000)
  address = to
  helloChain.createTransaction(new Transaction(`address${to}`, `address${from}`, account))
}
helloChain.miniPendingTransactions('hello')
for (let i = 0; i < 5000; i++) {
  const account = parseInt(Math.random() * 1000)
  const to = parseInt(Math.random() * 1000)
  const from = parseInt(Math.random() * 1000)
  address = to
  helloChain.createTransaction(new Transaction(`address${to}`, `address${from}`, account))
}
helloChain.miniPendingTransactions('hello')
// console.log(JSON.stringify(helloChain, null, 4))
console.log('address1', helloChain.getBalance('address1'))
console.log('address2', helloChain.getBalance('address2'))