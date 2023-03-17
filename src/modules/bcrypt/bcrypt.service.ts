import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import config from 'src/configs/env.config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  private readonly saltRounds = +config.verify.passwordSalt;
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
