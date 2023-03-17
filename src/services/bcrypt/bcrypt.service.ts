import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  private readonly saltRounds = +process.env.PASSWORD_HASH_SALT_ROUND;
  private readonly logger = new Logger(BcryptService.name);

  async compare(reqPassword: string, dbPassword: string) {
    try {
      return bcrypt.compareSync(reqPassword, dbPassword);
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async hash(password: string) {
    try {
      return bcrypt.hashSync(password, this.saltRounds);
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error);
    }
  }
}
