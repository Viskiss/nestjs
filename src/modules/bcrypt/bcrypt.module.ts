import { Module } from '@nestjs/common';
import { BcryptService } from './bcrypt.service';

@Module({
  imports: [],
  providers: [BcryptService],
  controllers: [BcryptService],
})
export class BcruptModule {}
