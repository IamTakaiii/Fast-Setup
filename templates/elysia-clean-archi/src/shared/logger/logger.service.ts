import { injectable } from "tsyringe";
import pino from "pino";
import type { ILogger } from "@shared/logger/logger.port";

@injectable()
export class LoggerService implements ILogger {
    private logger = pino();

    info(message: string, meta?: unknown): void {
        this.logger.info(meta, message);
    }

    error(message: string, meta?: unknown): void {
        this.logger.error(meta, message);
    }

    warn(message: string, meta?: unknown): void {
        this.logger.warn(meta, message);
    }

    debug(message: string, meta?: unknown): void {
        this.logger.debug(meta, message);
    }
}
