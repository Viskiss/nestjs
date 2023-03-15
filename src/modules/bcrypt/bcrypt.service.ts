import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import config from 'src/config/configuration';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  private readonly saltRounds = config.verify.passwordSalt;
  private readonly logger = new Logger(BcryptService.name);

  async compare(reqPassword: string, dbPassword: string): Promise<boolean> {
    try {
      return bcrypt.compare(reqPassword, dbPassword);
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async hash(password: string): Promise<string> {
    try {
      return bcrypt.hash(password, this.saltRounds);
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }
}
