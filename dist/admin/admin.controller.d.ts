import { AdminService } from './admin.service';
export declare class AdminController {
    private adminService;
    constructor(adminService: AdminService);
    signup(email: string, password: string): Promise<any>;
    login(email: string, password: string): Promise<any>;
    approveEmployment(userId: number, salary: number): Promise<any>;
}
