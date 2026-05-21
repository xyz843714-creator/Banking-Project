import { User } from '../../user/user.entity';
export declare class Loan {
    id: number;
    userId: number;
    requestedAmount: number;
    approvedAmount: number;
    salary: number;
    interestRate: number;
    emiCount: number;
    emiAmount: number;
    totalRepayment: number;
    status: string;
    createdAt: Date;
    user: User;
}
