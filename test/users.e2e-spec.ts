import { UsersController } from '../src/modules/users/users.controller';
import { UsersService } from '../src/modules/users/users.service';
import User from '../src/db/entities/user.entity';

import { Repository } from 'typeorm';

import { BcryptService } from 'src/services/bcrypt/bcrypt.service';

describe('UsersController (e2e)', () => {
  let usersController: UsersController;
  let usersService: UsersService;
  let userRepo: Repository<User>;
  let bcryptService: BcryptService;

  beforeEach(() => {
    usersService = new UsersService(userRepo, bcryptService);
    usersController = new UsersController(usersService);
  });

  describe('test usersController', () => {
    it('Return array of users', async () => {
      const result = [] as User[];
      jest
        .spyOn(usersService, 'findAllUsers')
        .mockImplementation(async () => result);

      expect(await usersController.findAll()).toBe(result);
    });

    it('Retyrn user by id', async () => {
      const result = {} as User;
      jest
        .spyOn(usersService, 'findUserById')
        .mockImplementation(async () => result);

      expect(await usersController.findOne(1)).toBe(result);
    });

    it('Return boolean result deleting user', async () => {
      const result = true;
      jest
        .spyOn(usersService, 'deleteUser')
        .mockImplementation(async () => result);

      expect(await usersController.deleteUser(1)).toBe(result);
    });

    it('Return user before update with new data', async () => {
      const result = {} as User;
      jest
        .spyOn(usersService, 'updateUser')
        .mockImplementation(async () => result);

      expect(
        await usersController.updateUser(1, {
          email: 'qwerty@mail.ru',
          fullName: 'qwerty',
        }),
      ).toBe(result);
    });

    it('Return boolean result before update avatar data', async () => {
      const result = true;
      jest
        .spyOn(usersService, 'uploadUserAvatar')
        .mockImplementation(async () => result);

      expect(
        await usersController.updateUserAvatar(1, {
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
      await usersController.updateUserPassword(1, {
        password: '11111',
        newPassword: '11111',
      }),
    ).toBe(result);
  });
});

// it('/ (GET)', () => {
//   return request(usersController.getHttpServer())
//     .get('getAll')
//     .expect(200)
//     .expect('Hello World!');
// });

// afterAll(async () => {
//   await usersController.close();
// });
