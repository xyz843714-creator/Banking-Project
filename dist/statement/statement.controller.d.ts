import { StatementService } from './statement.service';
export declare class StatementController {
    private statementService;
    constructor(statementService: StatementService);
    funcSubmitBankDetails(): Promise<any>;
    summary(requestId: string): Promise<any>;
    getOne(requestId: string): Promise<any>;
}
