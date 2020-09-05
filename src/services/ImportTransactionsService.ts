import parse from 'csv-parse/lib/sync';

import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import CreateTransactionService from '../services/CreateTransactionService';

interface Request {
  fileName: string;
  buffer: Buffer;
  type: string;
}

class ImportTransactionsService {
  async execute({ fileName, buffer, type }: Request): Promise<Transaction[]> {
    console.log('reading file', fileName);

    if (!type.includes('/csv')) {
      throw new AppError('Input file must be csv.');
    }

    const transactionsToImport = parse(buffer, {
      columns: true,
      trim: true,
    });

    const createTransaction = new CreateTransactionService();

    const transactions: Transaction[] = [];

    for (let i = 0; i < transactionsToImport.length; i++) {
      const transactionToImport = transactionsToImport[i];
      const { title, type, value, category } = transactionToImport;
      const transaction = await createTransaction.execute({
        title,
        value,
        type,
        categoryTitle: category,
      });
      transactions.push(transaction);
    }

    return transactions;
  }
}

export default ImportTransactionsService;
