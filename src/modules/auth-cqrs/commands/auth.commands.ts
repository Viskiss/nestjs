import { CreateUserDto, LoginUserDto } from '../auth.dto';

export class LogInCommand {
  constructor(public readonly body: LoginUserDto) {}
}

export class SignUpCommand {
  constructor(public readonly body: CreateUserDto) {}
}

export class RefreshTokenCommand {
  constructor(public readonly token: string) {}
}
