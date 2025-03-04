import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RouteNotFoundMiddleware implements NestMiddleware {
    private readonly logger = new Logger('RouteNotFound');

    use(req: Request, res: Response, next: NextFunction) {
        const error = new Error('Route not found');
        this.logger.error(`Route not found - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.ip}]`);

        res.status(404).json({ error: error.message });
    }
}