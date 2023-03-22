import User from 'src/db/entities/user.entity';

export type RequestWithUser = {
  user: User;
};
