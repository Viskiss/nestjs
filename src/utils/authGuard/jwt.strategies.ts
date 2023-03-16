import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import config from 'src/configs/env.config';

interface JwtPayload {
  iat: number;
  exp: number;
  id: string;
}

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.verify.jwtSecret,
    });
  }

  async validate(payload: JwtPayload): Promise<{ id: string }> {
    return { id: payload.id };
  }
}
