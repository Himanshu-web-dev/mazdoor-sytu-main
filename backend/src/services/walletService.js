// src/services/walletService.js
const firebaseService = require('./firebaseService')
const { generateId } = require('../utils/generateId')
const { PAYMENT_TYPES } = require('../utils/constants')
const { rupeesToPaise, paiseToRupees } = require('../utils/helpers')

const walletService = {
  /**
   * Get wallet balance and transaction ledger from wallets/{userId}
   */
  async getWallet(userId) {
    const walletDoc = await firebaseService.getDocument('wallets', userId)
    if (!walletDoc) {
      const now = new Date().toISOString()
      const initialWallet = {
        id: userId,
        userId,
        balancePaise: 0,
        balance: 0,
        pendingWithdrawalsPaise: 0,
        pendingWithdrawals: 0,
        transactions: [],
        createdAt: now,
        updatedAt: now
      }
      await firebaseService.setDocument('wallets', userId, initialWallet)
      return initialWallet
    }
    return walletDoc
  },

  /**
   * Credit worker net earnings into wallet
   */
  async creditWorkerEarnings(workerId, amount, note = 'Job Payout') {
    const wallet = await this.getWallet(workerId)
    const creditPaise = amount > 5000 ? Math.round(Number(amount)) : rupeesToPaise(amount)
    const currentBalancePaise = wallet.balancePaise !== undefined ? wallet.balancePaise : rupeesToPaise(wallet.balance || 0)
    const newBalancePaise = currentBalancePaise + creditPaise
    const now = new Date().toISOString()

    const txnId = generateId('WTXN')
    const txnRecord = {
      id: txnId,
      type: 'credit',
      amountPaise: creditPaise,
      amount: paiseToRupees(creditPaise),
      note,
      status: 'completed',
      timestamp: now
    }

    // 1. Add to subcollection wallets/{userId}/transactions/{txId}
    await firebaseService.setDocument(`wallets/${workerId}/transactions`, txnId, txnRecord)

    // 2. Update wallet root balance and recent cache array
    const updatedTransactions = [txnRecord, ...(wallet.transactions || [])].slice(0, 50)

    return firebaseService.setDocument('wallets', workerId, {
      balancePaise: newBalancePaise,
      balance: paiseToRupees(newBalancePaise),
      transactions: updatedTransactions,
      updatedAt: now
    }, true)
  },

  /**
   * Request bank / UPI withdrawal
   */
  async requestWithdrawal(workerId, amount, bankDetails) {
    const wallet = await this.getWallet(workerId)
    const withdrawPaise = amount > 5000 ? Math.round(Number(amount)) : rupeesToPaise(amount)
    const currentBalancePaise = wallet.balancePaise !== undefined ? wallet.balancePaise : rupeesToPaise(wallet.balance || 0)

    if (currentBalancePaise < withdrawPaise) {
      throw new Error(`Insufficient wallet balance. Available: ₹${paiseToRupees(currentBalancePaise)}, Requested: ₹${paiseToRupees(withdrawPaise)}`)
    }

    const now = new Date().toISOString()
    const withdrawalId = generateId('WTXN')
    const newBalancePaise = currentBalancePaise - withdrawPaise

    const txnRecord = {
      id: withdrawalId,
      type: 'withdrawal',
      amountPaise: withdrawPaise,
      amount: paiseToRupees(withdrawPaise),
      status: 'processed',
      bankDetails,
      timestamp: now
    }

    // 1. Add to subcollection
    await firebaseService.setDocument(`wallets/${workerId}/transactions`, withdrawalId, txnRecord)

    // 2. Also record in payments collection as worker_withdrawal
    const payId = generateId('PAY')
    await firebaseService.setDocument('payments', payId, {
      id: payId,
      workerId,
      paymentType: PAYMENT_TYPES.WORKER_WITHDRAWAL,
      amountPaise: withdrawPaise,
      amount: paiseToRupees(withdrawPaise),
      paymentMethod: bankDetails?.upiId ? 'UPI' : 'NetBanking',
      transactionRef: `WITHDRAW-${Date.now()}`,
      status: 'completed',
      bankDetails,
      createdAt: now
    })

    // 3. Update wallet root
    const updatedTransactions = [txnRecord, ...(wallet.transactions || [])]

    await firebaseService.setDocument('wallets', workerId, {
      balancePaise: newBalancePaise,
      balance: paiseToRupees(newBalancePaise),
      lastPayoutAmountPaise: withdrawPaise,
      lastPayoutAmount: paiseToRupees(withdrawPaise),
      lastPayoutDate: now,
      transactions: updatedTransactions,
      updatedAt: now
    }, true)

    return txnRecord
  }
}

module.exports = walletService
