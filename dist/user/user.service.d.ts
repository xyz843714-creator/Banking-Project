import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class UserService {
    private userRepository;
    createUser: any;
    getAllUsers: any;
    constructor(userRepository: Repository<User>);
    create(userData: Partial<User>): Promise<User>;
    findOne(options: any): Promise<User | null>;
}
