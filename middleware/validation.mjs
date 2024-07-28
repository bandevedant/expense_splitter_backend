export const validateExpense = (req, res, next) => {
    const { amount, participants, splitMethod, exactAmounts, percentages } = req.body;
  
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than zero' });
    }
  
    if (!participants || participants.length === 0) {
      return res.status(400).json({ message: 'Participants are required' });
    }
  
    if (splitMethod === 'exact' && (!exactAmounts || exactAmounts.length !== participants.length)) {
      return res.status(400).json({ message: 'Exact amounts must match the number of participants' });
    }
  
    if (splitMethod === 'percentage') {
      const totalPercentage = percentages.reduce((acc, curr) => acc + curr, 0);
      if (!percentages || percentages.length !== participants.length || totalPercentage !== 100) {
        return res.status(400).json({ message: 'Percentages must match the number of participants and add up to 100' });
      }
    }
  
    next();
  };
  