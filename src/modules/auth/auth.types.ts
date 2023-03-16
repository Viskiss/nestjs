import { User } from '../user/user.entity';

export type RequestUser = Pick<User, 'id'>;

export type RequestGuardType = {
  user: RequestUser;
};

export type LoginProps = {
  id: number;
  email: string;
  password: string;
};

export type UserWithTokenType = {
  user: User;
  token: string;
};
