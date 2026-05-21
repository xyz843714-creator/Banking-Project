import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: any, res: any, next: () => void) {
    const start = Date.now();
    const { method, url, body, headers, params, query } = req;

    this.logger.log(`[${new Date().toLocaleString('en-IN')}] ${method} ${url}`);
    this.logger.log(`Params: ${JSON.stringify(params)}`);
    this.logger.log(`Query: ${JSON.stringify(query)}`);
    this.logger.log(`Body: ${JSON.stringify(body)}`);
    this.logger.log(`Authorization: ${headers.authorization ?? 'Not Present'}`);
    this.logger.log(`Content-Type: ${headers['content-type'] ?? 'Not Present'}`);

    const originalSend = res.send.bind(res);
    let responseBody: any;

    res.send = (data: any) => {
      responseBody = data;
      return originalSend(data);
    };

    res.on('finish', () => {
      const duration = Date.now() - start;
      const { statusCode } = res;

      if (statusCode < 400) {
        this.logger.log(`[${method} ${url}] Status: ${statusCode} | Time: ${duration}ms`);
        this.logger.log(`Response: ${responseBody?.toString()}`);
      } else {
        this.logger.error(`[${method} ${url}] Status: ${statusCode} | Time: ${duration}ms`);
        this.logger.error(`Error: ${responseBody?.toString()}`);
      }
    });

    next();
  }
}