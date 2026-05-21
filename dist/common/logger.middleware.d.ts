import { NestMiddleware } from '@nestjs/common';
export declare class LoggerMiddleware implements NestMiddleware {
    private readonly logger;
    use(req: any, res: any, next: () => void): void;
}
