import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';

import { BcryptModule } from './../../services/bcrypt/bcrypt.module';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import User from '../../db/entities/user.entity';
import { repositoryMockFactory } from '../../../test/fake.testDb';

describe('Cats', () => {
  let module: TestingModule;
  let usersController: UsersController;
  let usersService: UsersService;

  // const requestMock = {
  //   query: {},
  // } as unknown as Request;

  // const statusResponseMock = {
  //   send: jest.fn((x) => x),
  // };

  // const responceMock = {
  //   status: jest.fn((x) => statusResponseMock),
  //   send: jest.fn((x) => x),
  // } as unknown as Response;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [BcryptModule],
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();
    usersController = module.get(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('/GET all users', async () => {
    const result = [] as User[];
    jest
      .spyOn(usersService, 'findAllUsers')
      .mockImplementation(async () => result);

    expect(await usersController.findAll()).toBe(result);
  });

  it(`/GET user`, async () => {
    const user = await usersController.findOne(1);
    expect(user).not.toBeUndefined();
  });
});
