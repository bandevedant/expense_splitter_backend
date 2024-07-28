import Expense from '../models/expenseModel.mjs';
import User from '../models/userModel.mjs';

// Helper function to split expenses equally
const splitEqually = (amount, participants) => {
  const splitAmount = amount / participants.length;
  return participants.map((participant) => ({
    user: participant,
    amountOwed: splitAmount,
  }));
};

// Helper function to split expenses exactly
const splitExactly = (amount, participants, amounts) => {
  return participants.map((participant, index) => ({
    user: participant,
    amountOwed: amounts[index],
  }));
};

// Helper function to split expenses by percentage
const splitByPercentage = (amount, participants, percentages) => {
  return participants.map((participant, index) => ({
    user: participant,
    amountOwed: (amount * percentages[index]) / 100,
  }));
};


export const addExpense = async (req, res) => {
  try {
    const { description, amount, paidBy, splitMethod, participants, exactAmounts, percentages } = req.body;

    const user = await User.findById(paidBy);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let splitParticipants = [];

    // Calculate the amount each participant owes based on the split method
    switch (splitMethod) {
      case 'equal':
        splitParticipants = splitEqually(amount, participants);
        break;
      case 'exact':
        if (!exactAmounts || exactAmounts.length !== participants.length) {
          return res.status(400).json({ message: 'Exact amounts must match the number of participants' });
        }
        splitParticipants = splitExactly(amount, participants, exactAmounts);
        break;
      case 'percentage':
        const totalPercentage = percentages.reduce((acc, curr) => acc + curr, 0);
        if (!percentages || percentages.length !== participants.length || totalPercentage !== 100) {
          return res.status(400).json({ message: 'Percentages must match the number of participants and add up to 100' });
        }
        splitParticipants = splitByPercentage(amount, participants, percentages);
        break;
      default:
        return res.status(400).json({ message: 'Invalid split method' });
    }

    const expense = await Expense.create({
      description,
      amount,
      paidBy,
      splitMethod,
      participants: splitParticipants,
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getUserExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ 'participants.user': req.params.userId });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Public
export const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().populate('paidBy participants.user', 'name email');

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};