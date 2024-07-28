import express from 'express';
import { addExpense, getUserExpenses, getAllExpenses } from '../controllers/expenseController.mjs';
import { validateExpense } from '../middleware/validation.mjs';

const router = express.Router();

router.post('/', validateExpense, addExpense);
router.get('/user/:userId', getUserExpenses);
router.get('/', getAllExpenses);

export default router;
