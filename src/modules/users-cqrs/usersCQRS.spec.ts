import { CommandBus, ICommand } from '@nestjs/cqrs';
import UsersController from './users.controller';

describe('bcrypt test', () => {
  let commandBus: CommandBus<ICommand>;
  let usersController: UsersController;

  beforeEach(() => {
    usersController = new UsersController(commandBus);
  });

  describe('test authController', () => {
    it('Return user before creating / sign-up', async () => {
      const result = '';
      jest
        .spyOn(usersController, 'deleteUser')
        .mockImplementation(async () => result);

      expect(await usersController.deleteUser(1)).toBe(result);
    });

    // it('Return user before sign-in', async () => {
    //   const result = {} as AuthTestType;
    //   jest
    //     .spyOn(authController, 'signUp')
    //     .mockImplementation(async () => result);

    //   expect(
    //     await authController.signUp({
    //       email: 'qwerty@mail.ru',
    //       fullName: 'qwerty',
    //       password: '11111',
    //     }),
    //   ).toBe(result);
    // });

    // it('Return pair of tokens before refresh', async () => {
    //   const result = {} as AuthTestType['tokens'];
    //   jest
    //     .spyOn(authController, 'refresh')
    //     .mockImplementation(async () => result);

    //   expect(
    //     await authController.refresh({ token: 'some refresh token' }),
    //   ).toBe(result);
    // });
  });
});
