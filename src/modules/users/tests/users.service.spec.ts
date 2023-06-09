import {
  fakeUser,
  fakeUser2,
  repositoryMockFactory,
} from '../../../common/testing/fake.testDb';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  BadRequestException,
  HttpException,
  NotFoundException,
} from '@nestjs/common';

import { UsersService } from '../users.service';
import { BcryptService } from '../../../services/bcrypt/bcrypt.service';

import { BcryptModule } from '../../../services/bcrypt/bcrypt.module';
import { UsersModule } from '../users.module';

import User from '../../../db/entities/user.entity';

describe('users service test', () => {
  let usersService: UsersService;
  let userRepository;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [BcryptModule],
      providers: [
        UsersModule,
        BcryptService,
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    usersService = module.get(UsersService);
    userRepository = module.get(getRepositoryToken(User));
    await module.init();
  });

  it('Return array of users', async () => {
    jest.spyOn(userRepository, 'find').mockImplementation(async () => []);

    const test = await usersService.findAllUsers();

    expect(test).toStrictEqual([] as User[]);
    expect(test).toBeInstanceOf(Array as unknown as User[]);
  });

  it('Return array of users (error)', async () => {
    jest.spyOn(userRepository, 'find').mockImplementation(() => {
      throw new TypeError();
    });

    const test = usersService.findAllUsers();
    expect(test).rejects.toThrow(HttpException);
    expect(test).rejects.toThrowError('INTERNAL_SERVER_ERROR');
  });

  it('Return user by id', async () => {
    jest
      .spyOn(userRepository, 'findOneBy')
      .mockImplementation(async () => fakeUser);

    const test = await usersService.findUserById(1);

    expect(test).not.toBeUndefined();
    expect(test).toEqual(fakeUser);
  });

  it('Return user by id (error)', async () => {
    jest.spyOn(userRepository, 'findOneBy').mockImplementation(() => {
      throw new TypeError();
    });

    const test = usersService.findUserById(1);

    expect(test).rejects.toThrow('INTERNAL_SERVER_ERROR');
  });

  it('Return user by email', async () => {
    jest.spyOn(userRepository, 'createQueryBuilder').mockImplementation(() => ({
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(fakeUser),
    }));

    const test = await usersService.findUserByEmail('email');

    expect(test).toStrictEqual(fakeUser);
  });

  it('Return number after deleting user (error)', async () => {
    jest.spyOn(userRepository, 'delete').mockResolvedValue({ affected: 0 });

    const test = usersService.deleteUser(1);

    expect(test).rejects.toThrow('Unable delete user');
    expect(test).rejects.toBeInstanceOf(BadRequestException);
  });

  it('Return number after deleting user', async () => {
    jest.spyOn(userRepository, 'delete').mockResolvedValue({ affected: 1 });

    const test = await usersService.deleteUser(1);

    expect(test).toBeTruthy();
  });

  it('Return user after creating', async () => {
    const test = await usersService.createUser({
      email: 'qwerty@mail.ru',
      fullName: 'qwerty',
      password: '11111',
    });
    expect(test).toEqual({ email: 'qwerty@mail.ru', fullName: 'qwerty' });
    expect(test).toHaveProperty('email');
    expect(test).toHaveProperty('fullName');
    expect(test).not.toHaveProperty('password');
    expect(test.fullName).toHaveLength(test.fullName.length);
    expect(test.email).toHaveLength(test.email.length);
  });

  it('Return user after update data (error)', async () => {
    const test = usersService.updateUser(
      {
        email: '',
        fullName: '',
      },
      1,
    );

    expect(test).rejects.toThrow('Nothing to update');
    expect(test).rejects.toBeInstanceOf(BadRequestException);
  });

  it('Return user after update data (error)', async () => {
    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(fakeUser);

    const test = usersService.updateUser(
      {
        email: '1@mail.ru',
        fullName: null,
      },
      1,
    );

    expect(test).rejects.toThrow('Update needs a new value');
    expect(test).rejects.toBeInstanceOf(BadRequestException);
  });

  it('Return user after update data (error)', async () => {
    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(fakeUser);

    const test = await usersService.updateUser(
      {
        email: 'newEmail@mail',
        fullName: 'name',
      },
      1,
    );

    expect(test.email).toBe('newEmail@mail');
    expect(test.fullName).toBe('name');
  });

  it('Return user after update data (error)', async () => {
    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(fakeUser);

    const test = await usersService.updateUser(
      {
        email: '',
        fullName: 'newName',
      },
      1,
    );

    expect(test.email).toBe(fakeUser.email);
    expect(test.fullName).toBe('newName');
  });

  it('Return user after updating password (error)', async () => {
    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(undefined);

    const test = usersService.updateUserPassword(
      { newPassword: '', password: '' },
      1,
    );

    expect(test).rejects.toThrow('User not found');
    expect(test).rejects.toBeInstanceOf(NotFoundException);
  });

  it('Return user after updating password (error)', async () => {
    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(fakeUser);
    jest.spyOn(userRepository, 'createQueryBuilder').mockImplementation(() => ({
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue({
        password:
          '$2a$10$ujcELjzFJuKQdZ8ad6rdxus32l4SUqU21oBqgbTSeMTCARmOuNeEe',
      } as User),
    }));

    const test = usersService.updateUserPassword(
      { newPassword: '11111', password: '2222' },
      1,
    );

    expect(test).rejects.toThrow('Your password is invalid');
    expect(test).rejects.toBeInstanceOf(BadRequestException);
  });

  it('Return user after updating password (error)', async () => {
    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(fakeUser);
    jest.spyOn(userRepository, 'createQueryBuilder').mockImplementation(() => ({
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue({
        password:
          '$2a$10$ujcELjzFJuKQdZ8ad6rdxus32l4SUqU21oBqgbTSeMTCARmOuNeEe',
      } as User),
    }));

    const test = usersService.updateUserPassword(
      { newPassword: '11111', password: '11111' },
      1,
    );

    expect(test).rejects.toThrow('Password and new password must be different');
    expect(test).rejects.toBeInstanceOf(BadRequestException);
  });

  it('Return user after updating password', async () => {
    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(fakeUser2);
    jest.spyOn(userRepository, 'createQueryBuilder').mockImplementation(() => ({
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue({
        password:
          '$2a$10$ujcELjzFJuKQdZ8ad6rdxus32l4SUqU21oBqgbTSeMTCARmOuNeEe',
      } as User),
    }));

    const test = await usersService.updateUserPassword(
      { newPassword: '2222', password: '11111' },
      2,
    );

    expect(test.email).toBe(fakeUser2.email);
  });

  it('Return user after update data (error)', async () => {
    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(undefined);
    const test = usersService.uploadUserAvatar(1, {
      avatar: 'some avatar data',
    });

    expect(test).rejects.toThrow('User not found');
    expect(test).rejects.toBeInstanceOf(NotFoundException);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await module.close();
  });
});
