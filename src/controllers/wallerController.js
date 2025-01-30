const Wallet = require("../models/walletSchema");
const Transaction = require("../models/transactionSchema");
const { sendError, sendSuccess } = require("../utils/responseService");

const createWallet = async (req, res) => {
  try {
    const { userId, roles } = req.body;

    const existingWallet = await Wallet.findOne({ userId });
    if (existingWallet) {
      return sendError(res, "Wallet already exists", null, 400);
    }

    const wallet = new Wallet({ userId, roles });
    await wallet.save();

    sendSuccess(res, "Wallet created successfully", wallet);
  } catch (error) {
    sendError(res, "Failed to create wallet", error);
  }
};

const getWallet = async (req, res) => {
  try {
    const { userId, roles } = req.query;

    const wallet = await Wallet.findOne({ userId }).populate("userId");
    if (!wallet) {
      return sendError(res, "Wallet not found", null, 404);
    }

    sendSuccess(res, "Wallet details fetched", wallet);
  } catch (error) {
    sendError(res, "Failed to fetch wallet details", error);
  }
};

const updateWallet = async (req, res) => {
  try {
    const { userId, walletId, roles, amount, type, reason } = req.body;

    const wallet = await Wallet.findOne({ _id: walletId });
    if (!wallet) return sendError(res, "Wallet not found", null, 404);

    if (type === "DEBIT" && wallet.balance < amount) {
      return sendError(res, "Insufficient balance", null, 400);
    }

    const newBalance =
      type === "CREDIT" ? wallet.balance + amount : wallet.balance - amount;
    wallet.balance = newBalance;

    const transaction = new Transaction({
      walletId: wallet._id,
      userId,
      roles,
      amount,
      type,
      reason,
      status: "COMPLETED",
    });

    wallet.transactions.push(transaction._id);
    await transaction.save();
    await wallet.save();

    sendSuccess(res, `Wallet ${type.toLowerCase()} successful`, {
      wallet,
      transaction,
    });
  } catch (error) {
    sendError(res, "Failed to update wallet", error);
  }
};

module.exports = { createWallet, getWallet, updateWallet };
