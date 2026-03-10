import { TransactionsService } from './transactions.service';
export declare class TransactionsController {
    private readonly svc;
    constructor(svc: TransactionsService);
    create(dto: any): Promise<import("./entities/transaction.entity").Transaction>;
    findAll(page?: string, limit?: string, status?: string): Promise<{
        data: import("./entities/transaction.entity").Transaction[];
        total: number;
    }>;
    getStats(): Promise<{
        total: number;
        completed: number;
        pending: number;
        totalAmount: number;
    }>;
    findOne(id: number): Promise<import("./entities/transaction.entity").Transaction>;
    update(id: number, dto: any): Promise<import("./entities/transaction.entity").Transaction>;
}
