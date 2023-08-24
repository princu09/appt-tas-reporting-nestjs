import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method } = request;
    const userAgent = request.get('user-agent') || '';

    response.on('close', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');

      this.logger.log(
        `${method} ${request.path} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
        request.headers.authorization
          ? request.headers.authorization
          : 'no JWT',
      );
      this.logger.log(`BODY: ${JSON.stringify(request.body)}`);
      this.logger.log(`PARAMS: ${JSON.stringify(request.params)}`);
      this.logger.log(`QUERY: ${JSON.stringify(request.query)}`);
    });

    next();
  }
}
