export declare class EmiPayment {
    id: number;
    loanId: number;
    userId: number;
    emiNumber: number;
    emiAmount: number;
    penaltyAmount: number;
    totalPaid: number;
    dueDate: Date;
    paidDate: Date;
    status: string;
}
