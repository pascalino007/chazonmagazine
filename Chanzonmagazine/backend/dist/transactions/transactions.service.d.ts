import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
export declare class TransactionsService {
    private repo;
    constructor(repo: Repository<Transaction>);
    create(dto: Partial<Transaction>): Promise<Transaction>;
    findAll(page?: number, limit?: number, status?: string): Promise<{
        data: Transaction[];
        total: number;
    }>;
    findOne(id: number): Promise<Transaction>;
    update(id: number, dto: Partial<Transaction>): Promise<Transaction>;
    getStats(): Promise<{
        total: number;
        completed: number;
        pending: number;
        totalAmount: number;
    }>;
}
