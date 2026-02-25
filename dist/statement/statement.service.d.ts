import { HttpService } from '@nestjs/axios';
import { Repository } from 'typeorm';
import { BankStatement } from './entities/bank-statement.entity';
export declare class StatementService {
    private httpService;
    private statementRepo;
    constructor(httpService: HttpService, statementRepo: Repository<BankStatement>);
    uploadStatement(): Promise<any>;
    getSummaryAndSave(requestId: string): Promise<any>;
    findOneStatement(requestId: string): Promise<any>;
}
