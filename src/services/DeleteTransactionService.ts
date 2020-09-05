import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const entryToDelete = await transactionsRepository.findOne({ id });

    if (!entryToDelete) {
      throw new AppError('Invalid ID.');
    }

    await transactionsRepository.remove(entryToDelete);

    return;
  }
}

export default DeleteTransactionService;
