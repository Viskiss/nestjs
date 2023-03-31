import { fakeUser, repositoryMockFactory } from '../../../../test/fake.testDb';
import { Test, TestingModule } from '@nestjs/testing';

import User from '../../../db/entities/user.entity';
import { UsersService } from '../users.service';
import { BcryptModule } from '../../../services/bcrypt/bcrypt.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { BcryptService } from '../../../services/bcrypt/bcrypt.service';

describe('UsersService test', () => {
  let usersService: UsersService;
  let userRepository: Repository<User>;
  let bctyptService: BcryptService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [BcryptModule],
      providers: [
        BcryptService,
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    bctyptService = module.get<BcryptService>(UsersService);
    userRepository = module.get(getRepositoryToken(User));
    await module.init();
  });

  it('Return array of users', async () => {
    jest.spyOn(userRepository, 'find').mockImplementation(async () => []);

    const findAllUsers = await usersService.findAllUsers();

    expect(findAllUsers).toStrictEqual([] as User[]);
    expect(findAllUsers).toBeInstanceOf(Array as unknown as User[]);
  });

  it('Return user by id', async () => {
    const fakeUser1 = {
      id: 1,
      email: '1@mail.ru',
      password: '$2a$10$ujcELjzFJuKQdZ8ad6rdxus32l4SUqU21oBqgbTSeMTCARmOuNeEe',
      fullName: null,
      avatar: null,
    };
    const fakeUser2 = {
      id: 2,
      email: '1@mail.ru',
      password: '$2a$10$ujcELjzFJuKQdZ8ad6rdxus32l4SUqU21oBqgbTSeMTCARmOuNeEe',
      fullName: null,
      avatar: null,
    };

    jest
      .spyOn(userRepository, 'findOneBy')
      .mockImplementation(async () => fakeUser1);

    const test_One = await usersService.findUserById(1);
    const test_Two = await usersService.findUserById(2);

    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue({} as User);

    expect(test_One).not.toBeUndefined();
    expect(test_One).toEqual(fakeUser1);
    expect(test_Two).not.toEqual(fakeUser2);
  });

  it('Return user by email', async () => {
    const task_One = await usersService.findUserByEmail('email');

    expect(task_One).toStrictEqual({} as User);
  });

  it('Return number after deleting user', async () => {
    const test_One = await usersService.deleteUser(1);
    expect(test_One).toBeTruthy();

    jest
      .spyOn(userRepository, 'delete')
      .mockResolvedValue({ affected: 0, raw: 0 });

    expect(
      async () => await usersService.deleteUser('' as unknown as number),
    ).rejects.toThrow(new BadRequestException('Unable delete user'));
  });

  it('Return user after creating', async () => {
    const test_One = await usersService.createUser({
      email: 'qwerty@mail.ru',
      fullName: 'qwerty',
      password: '11111',
    });

    const test_Two = await usersService.createUser({
      email: '',
      fullName: '',
      password: '11111',
    });

    expect(test_One).toEqual({ email: 'qwerty@mail.ru', fullName: 'qwerty' });
    expect(test_One).toHaveProperty('email');
    expect(test_One).toHaveProperty('fullName');
    expect(test_One).not.toHaveProperty('password');
    expect(test_One.fullName).toHaveLength(test_One.fullName.length);
    expect(test_One.email).toHaveLength(test_One.email.length);

    expect(test_Two).toHaveProperty('email');
    expect(test_Two).toHaveProperty('fullName');
    expect(test_Two).not.toEqual({
      email: 'qwerty@mail.ru',
      fullName: 'qwerty',
    });
    expect(test_Two.fullName).toHaveLength(test_Two.fullName.length);
    expect(test_Two.email).toHaveLength(test_Two.email.length);
  });

  it('Return user after update data', async () => {
    expect(
      async () =>
        await usersService.updateUser(
          {
            email: '',
            fullName: '',
          },
          1,
        ),
    ).rejects.toThrow(new BadRequestException('Nothing to update'));

    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue({
      email: 'qwerty',
      fullName: 'qwerty',
      id: 1,
      avatar: null,
      password: '',
    });

    expect(
      async () =>
        await usersService.updateUser(
          {
            email: 'qwerty',
            fullName: 'qwerty',
          },
          1,
        ),
    ).rejects.toThrow(new BadRequestException('Update needs a new value'));
  });

  it('Return user afret updating password', async () => {
    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(undefined);

    expect(
      async () =>
        await usersService.updateUserPassword(
          { newPassword: '', password: '' },
          1,
        ),
    ).rejects.toThrow(new BadRequestException('User not found'));

    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(fakeUser);
    jest.spyOn(usersService, 'findUserByEmail').mockResolvedValue(fakeUser);

    expect(
      async () =>
        await usersService.updateUserPassword(
          { newPassword: '11111', password: '11111' },
          1,
        ),
    ).rejects.toThrow(
      new BadRequestException('Password and new password must be different'),
    );

    jest.fn(bctyptService.compare).mockImplementation(async () => false);

    expect(
      async () =>
        await usersService.updateUserPassword(
          { newPassword: '11111', password: '2222' },
          1,
        ),
    ).rejects.toThrow(new BadRequestException('Your password is invalid'));
  });

  afterAll(async () => {
    await module.close();
  });
});
