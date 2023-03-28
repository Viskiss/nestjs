import { Repository } from 'typeorm';

import { BcryptService } from 'src/services/bcrypt/bcrypt.service';
import User from 'src/db/entities/user.entity';
import { UsersService } from './users.service';

describe('UsersController (e2e)', () => {
  let usersService: UsersService;
  let userRepo: Repository<User>;
  let bcryptService: BcryptService;

  beforeEach(() => {
    usersService = new UsersService(userRepo, bcryptService);
  });

  describe('test usersController', () => {
    it('Return array of users', async () => {
      const result = [] as User[];
      jest
        .spyOn(usersService, 'findAllUsers')
        .mockImplementation(async () => result);

      expect(await usersService.findAllUsers()).toBe(result);
    });

    it('Retyrn user by id', async () => {
      const result = {} as User;
      jest
        .spyOn(usersService, 'findUserById')
        .mockImplementation(async () => result);

      expect(await usersService.findUserById(1)).toBe(result);
    });

    it('Return boolean result deleting user', async () => {
      const result = true;
      jest
        .spyOn(usersService, 'deleteUser')
        .mockImplementation(async () => result);

      expect(await usersService.deleteUser(1)).toBe(result);
    });

    it('Return user before update with new data', async () => {
      const result = {} as User;
      jest
        .spyOn(usersService, 'updateUser')
        .mockImplementation(async () => result);

      expect(
        await usersService.updateUser(
          {
            email: 'qwerty@mail.ru',
            fullName: 'qwerty',
          },
          1,
        ),
      ).toBe(result);
    });

    it('Return boolean result before update avatar data', async () => {
      const result = true;
      jest
        .spyOn(usersService, 'uploadUserAvatar')
        .mockImplementation(async () => result);

      expect(
        await usersService.uploadUserAvatar(1, {
          avatar: '1111111111111',
        }),
      ).toBe(result);
    });
  });

  it('Return boolean result before update avatar data', async () => {
    const result = {} as User;
    jest
      .spyOn(usersService, 'updateUserPassword')
      .mockImplementation(async () => result);

    expect(
      await usersService.updateUserPassword(
        {
          password: '11111',
          newPassword: '11111',
        },
        1,
      ),
    ).toBe(result);
  });
});
