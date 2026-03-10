export declare class Transaction {
    id: number;
    reference: string;
    donorName: string;
    donorEmail: string;
    amount: number;
    currency: string;
    message: string;
    projectId: number;
    status: string;
    paymentMethod: string;
    paymentRef: string;
    isAnonymous: boolean;
    createdAt: Date;
    updatedAt: Date;
}
