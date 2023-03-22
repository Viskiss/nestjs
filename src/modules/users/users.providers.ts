import User from '../../db/entities/user.entity';

export const usersProvider = [
  {
    provide: 'USER_REPOSITORY',
    useValue: User,
  },
];
