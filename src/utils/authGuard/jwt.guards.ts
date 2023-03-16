import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AccessGuard extends AuthGuard('jwt') {
  handleRequest(_, user) {
    if (!user) {
      throw new UnauthorizedException('Invalid token!');
    }
    return user;
  }
}
