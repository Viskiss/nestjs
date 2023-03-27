import {
  UpdateUserAvatarDto,
  UpdateUserDto,
  UpdateUserPasswordDto,
} from '../users.dto';

export class GetAllUsersCommand {}

export class GetUserCommand {
  constructor(public readonly id: number) {}
}

export class UpdateUserCommand {
  constructor(
    public readonly id: number,
    public readonly body: UpdateUserDto,
  ) {}
}

export class UpdateUserPasswordCommand {
  constructor(
    public readonly id: number,
    public readonly body: UpdateUserPasswordDto,
  ) {}
}

export class UpdateUserAvatarCommand {
  constructor(
    public readonly id: number,
    public readonly body: UpdateUserAvatarDto,
  ) {}
}

export class DeleteUserProfileCommand {
  constructor(public readonly userId: number) {}
}
