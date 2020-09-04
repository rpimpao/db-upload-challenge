import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateCategoryService from '../services/CreateCategoryService';

interface Request {
  title: string;
  value: number;
  type: string;
  categoryTitle: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    categoryTitle,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    if (type !== 'income' && type !== 'outcome') {
      throw new AppError('Transaction type must be "income" or "outcome"', 400);
    }

    const createCategory = new CreateCategoryService();

    // create a new category or return the existing one
    const category = await createCategory.execute({ title: categoryTitle });

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: category.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
