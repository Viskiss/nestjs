import { CreateUserDto, SignInUserDto } from '../auth.dto';

export class SignInCommand {
  constructor(public readonly body: SignInUserDto) {}
}

export class SignUpCommand {
  constructor(public readonly body: CreateUserDto) {}
}

export class RefreshTokenCommand {
  constructor(public readonly token: string) {}
}
