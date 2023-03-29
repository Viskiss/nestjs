/* eslint-disable @typescript-eslint/no-empty-function */
import { Test, TestingModule } from '@nestjs/testing';
import * as typeorm from 'typeorm';

import User from '../../db/entities/user.entity';
import { UsersService } from './users.service';
import { BcryptModule } from '../../services/bcrypt/bcrypt.module';
import { UserRepositoryFake } from '../../../test/fake.testDb';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueryBuilder, Repository, SelectQueryBuilder } from 'typeorm';

describe('UsersController test', () => {
  let usersService: UsersService;
  let userRepository: Repository<User>;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [BcryptModule],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: UserRepositoryFake,
        },
      ],
    }).compile();
    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get(getRepositoryToken(User));
  });

  it('Return array of users', async () => {
    const findAllUsers = await usersService.findAllUsers();

    expect(findAllUsers).not.toBeUndefined();
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

    const test_One = await usersService.findUserById(1);
    const test_Two = await usersService.findUserById(2);

    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue({} as User);

    expect(test_One).not.toBeUndefined();
    expect(test_One).toEqual(fakeUser1);
    expect(test_Two).not.toEqual(fakeUser2);
  });

  // it('Return user by email', async () => {
  //   const test_One = await usersService.findUserByEmail('email');

  //   jest.spyOn(typeorm, 'getRepository').mockImplementation(() => {
  //     const original = jest.requireActual('typeorm');
  //     return {
  //       ...original,
  //       createQueryBuilder: jest.fn().mockImplementation(() => ({
  //         addSelect: jest.fn().mockReturnThis() as unknown,
  //         where: jest.fn().mockReturnThis() as unknown,
  //         getMany: jest.fn().mockResolvedValue('') as unknown,
  //       })),
  //     };
  //   });

  //   expect(test_One).toBeFalsy();
  // });

  it('Return user by email', async () => {
    const test_One = await usersService.deleteUser(1);

    expect(test_One).toBeFalsy();
    expect(test_One).toBeTruthy();
  });

  afterAll(async () => {
    await module.close();
  });
});
