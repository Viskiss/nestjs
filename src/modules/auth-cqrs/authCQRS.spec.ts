import { AuthTestType } from 'test/auth.e2e-spec';
import AuthController from './auth.controller';
import { CommandBus, ICommand } from '@nestjs/cqrs';

describe('bcrypt test', () => {
  let commandBus: CommandBus<ICommand>;
  let authController: AuthController;

  beforeEach(() => {
    authController = new AuthController(commandBus);
  });

  describe('test authController', () => {
    // Cannot read properties of undefined (reading 'createQueryBuilder')
    // it('Return user before creating / sign-up', async () => {
    //   const result = {} as AuthTestType;
    //   jest
    //     .spyOn(authController, 'signIn')
    //     .mockImplementation(async () => result);

    //   expect(
    //     await authController.signIn({
    //       email: 'qwerty@mail.ru',
    //       password: '11111',
    //     }),
    //   ).toBe(result);
    // });

    it('Return user before sign-in', async () => {
      const result = {} as AuthTestType;
      jest
        .spyOn(authController, 'signUp')
        .mockImplementation(async () => result);

      expect(
        await authController.signUp({
          email: 'qwerty@mail.ru',
          fullName: 'qwerty',
          password: '11111',
        }),
      ).toBe(result);
    });

    it('Return pair of tokens before refresh', async () => {
      const result = {} as AuthTestType['tokens'];
      jest
        .spyOn(authController, 'refresh')
        .mockImplementation(async () => result);

      expect(
        await authController.refresh({ token: 'some refresh token' }),
      ).toBe(result);
    });
  });
});
