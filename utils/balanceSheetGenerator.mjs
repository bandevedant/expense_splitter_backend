import { createObjectCsvWriter } from 'csv-writer';
import path from 'path';

export const generateBalanceSheet = async (expenses) => {
  const csvWriter = createObjectCsvWriter({
    path: path.join(__dirname, '../balance-sheets/balance-sheet.csv'),
    header: [
      { id: 'description', title: 'Description' },
      { id: 'amount', title: 'Amount' },
      { id: 'paidBy', title: 'Paid By' },
      { id: 'participants', title: 'Participants' },
    ],
  });

  const records = expenses.map((expense) => ({
    description: expense.description,
    amount: expense.amount,
    paidBy: expense.paidBy.name,
    participants: expense.participants.map((p) => `${p.user.name}: $${p.amountOwed}`).join(', '),
  }));

  await csvWriter.writeRecords(records);
};
