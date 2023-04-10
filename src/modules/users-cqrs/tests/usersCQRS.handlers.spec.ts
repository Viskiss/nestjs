import { CommandBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import UsersController from '../users.controller';

import {
  DeleteUserHandler,
  GetAllUsersHandler,
  GetUserHandler,
  UpdateUserAvatarHandler,
  UpdateUserHandler,
  UpdateUserPasswordHandler,
} from '../eventHendlers';

import { BcryptService } from '../../../services/bcrypt/bcrypt.service';

import { UsersCQRSModule } from '../users.module';

import User from '../../../db/entities/user.entity';

import {
  fakeUser,
  repositoryMockFactory,
} from '../../../common/testing/fake.testDb';

describe('userCQRS handlers test', () => {
  let getAllUsers: GetAllUsersHandler;
  let deleteUser: DeleteUserHandler;
  let getUser: GetUserHandler;
  let updateUser: UpdateUserHandler;
  let updateAvatar: UpdateUserAvatarHandler;
  let updatePassword: UpdateUserPasswordHandler;
  let userRepository;
  let bcryptService: BcryptService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersCQRSModule,
        BcryptService,
        CommandBus,
        GetAllUsersHandler,
        GetUserHandler,
        DeleteUserHandler,
        UpdateUserHandler,
        UpdateUserAvatarHandler,
        UpdateUserPasswordHandler,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();
    userRepository = module.get(getRepositoryToken(User));

    bcryptService = module.get(BcryptService);

    getAllUsers = module.get(GetAllUsersHandler);
    deleteUser = module.get(DeleteUserHandler);
    getUser = module.get(GetUserHandler);
    updateUser = module.get(UpdateUserHandler);
    updateAvatar = module.get(UpdateUserAvatarHandler);
    updatePassword = module.get(UpdateUserPasswordHandler);

    await module.init();
  });

  it('Return users array (error) / getAllUsers', async () => {
    const test = getAllUsers.execute();
    expect(test).rejects.toThrow('Unable get all users');
    expect(test).rejects.toBeInstanceOf(BadRequestException);
  });

  it('Return users array / getAllUsers', async () => {
    jest.spyOn(userRepository, 'find').mockResolvedValue([] as User[]);
    const test = await getAllUsers.execute();
    expect(test).toStrictEqual([]);
  });

  it('Return user (error) / get User', async () => {
    const test = getUser.execute({
      id: 1,
    });
    expect(test).rejects.toThrow('Unable get user');
    expect(test).rejects.toBeInstanceOf(BadRequestException);
  });

  it('Return user / get User', async () => {
    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(fakeUser);
    const test = await getUser.execute({
      id: 1,
    });
    expect(test).toBe(fakeUser);
  });

  it('Delete user (error) / delete User', async () => {
    jest
      .spyOn(userRepository, 'delete')
      .mockResolvedValue({ affected: 0, raw: 0 });

    const test = deleteUser.execute({
      userId: 1,
    });

    expect(test).rejects.toThrow('Unable delete user');
    expect(test).rejects.toBeInstanceOf(BadRequestException);
  });

  it('Delete user / delete User', async () => {
    jest
      .spyOn(userRepository, 'delete')
      .mockResolvedValue({ affected: 1, raw: 0 });

    const test = await deleteUser.execute({
      userId: 1,
    });

    expect(test).toBe(true);
  });

  it('Return user after update (error) / update user', async () => {
    const test = updateUser.execute({
      id: 1,
      body: { email: '', fullName: '' },
    });

    expect(test).rejects.toThrow('Nothing to update');
    expect(test).rejects.toBeInstanceOf(BadRequestException);
  });

  it('Return user after update (error) / update user', async () => {
    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(fakeUser);

    const test = updateUser.execute({
      id: 1,
      body: { email: '1@mail.ru', fullName: null },
    });

    expect(test).rejects.toThrow('Update needs a new value');
    expect(test).rejects.toBeInstanceOf(BadRequestException);
  });

  it('Return user after update / update user', async () => {
    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(fakeUser);

    const test = await updateUser.execute({
      id: 1,
      body: { email: '11@mail.ru', fullName: 'Aboba' },
    });

    expect(test).toBe(fakeUser);
    expect(test.fullName).toBe('Aboba');
    expect(test.email).toBe('11@mail.ru');
  });

  it('Return user after update / update user', async () => {
    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(fakeUser);

    const test = await updateUser.execute({
      id: 1,
      body: { email: '', fullName: 'Aboba' },
    });

    expect(test).toBe(fakeUser);
    expect(test.fullName).toBe('Aboba');
    expect(test.email).toBe('11@mail.ru');
  });

  it('Return user after update / update user', async () => {
    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(fakeUser);

    const test = await updateUser.execute({
      id: 1,
      body: { email: 'new@mail.ru', fullName: '' },
    });

    expect(test).toBe(fakeUser);
    expect(test.fullName).toBe('Aboba');
    expect(test.email).toBe('new@mail.ru');
  });

  it('Return true after update avatar (error) / update user avatar', async () => {
    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(undefined);

    const test = updateAvatar.execute({
      id: 1,
      body: { avatar: 'str' },
    });

    expect(test).rejects.toThrow('User not found');
    expect(test).rejects.toBeInstanceOf(NotFoundException);
  });

  it('Return true after update avatar / update user avatar', async () => {
    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(fakeUser);

    const test = await updateAvatar.execute({
      id: 1,
      body: { avatar: 'str' },
    });

    expect(test).toBe(true);
  });

  it('Return user after update password (error) / update user password', async () => {
    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(undefined);

    const test = updatePassword.execute({
      id: 1,
      body: { password: '', newPassword: '' },
    });

    expect(test).rejects.toThrow('User not found');
    expect(test).rejects.toBeInstanceOf(NotFoundException);
  });

  it('Return user after update password (error) / update user password', async () => {
    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(fakeUser);

    jest.spyOn(userRepository, 'createQueryBuilder').mockImplementation(() => ({
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(fakeUser),
    }));

    jest.spyOn(bcryptService, 'compare').mockResolvedValue(false);

    const test = updatePassword.execute({
      id: 1,
      body: { password: '11111', newPassword: '11111' },
    });

    expect(test).rejects.toThrow('Your password is invalid');
    expect(test).rejects.toBeInstanceOf(BadRequestException);
  });

  it('Return user after update password (error) / update user password', async () => {
    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(fakeUser);

    jest.spyOn(userRepository, 'createQueryBuilder').mockImplementation(() => ({
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(fakeUser),
    }));

    jest.spyOn(bcryptService, 'compare').mockResolvedValue(true);

    const test = updatePassword.execute({
      id: 1,
      body: { password: '11111', newPassword: '11111' },
    });

    expect(test).rejects.toThrow('Password and new password must be different');
    expect(test).rejects.toBeInstanceOf(BadRequestException);
  });

  it('Return user after update password (error) / update user password', async () => {
    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(fakeUser);

    jest.spyOn(userRepository, 'createQueryBuilder').mockImplementation(() => ({
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(fakeUser),
    }));

    jest.spyOn(bcryptService, 'compare').mockResolvedValue(true);

    const test = await updatePassword.execute({
      id: 1,
      body: { password: '11111', newPassword: '22222' },
    });

    expect(test).toBe(fakeUser);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await module.close();
  });
});
