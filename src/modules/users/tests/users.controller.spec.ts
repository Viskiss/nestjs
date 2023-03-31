import * as request from 'supertest';
import { Test } from '@nestjs/testing';

import { UsersService } from '../users.service';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import User from '../../../db/entities/user.entity';
import { fakeUser, repositoryMockFactory } from '../../../../test/fake.testDb';
import { UsersController } from '../users.controller';
import { BcryptService } from '../../../services/bcrypt/bcrypt.service';
import { AccessGuard } from '../../../common/authGuard';
import { Repository } from 'typeorm';

describe('Cats', () => {
  let app: INestApplication;
  let usersService: UsersService;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        BcryptService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
      ],
    })
      .overrideGuard(AccessGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = { id: 1 };
          return true;
        },
      })
      .compile();

    app = module.createNestApplication();
    usersService = module.get(UsersService);
    userRepository = module.get(getRepositoryToken(User));
    await app.init();
  });

  it(`/GET all users`, async () => {
    jest
      .spyOn(usersService, 'findAllUsers')
      .mockImplementation(async () => [] as User[]);

    request(app.getHttpServer())
      .get('/users/getAll')
      .expect(200)
      .expect(await usersService.findAllUsers());
  });

  it(`/GET user by id`, async () => {
    jest
      .spyOn(usersService, 'findUserById')
      .mockImplementation(async () => fakeUser);

    request(app.getHttpServer())
      .get('/users/1')
      .expect(200)
      .expect(await usersService.findUserById(1));
  });

  it(`/PATCH update user`, async () => {
    request(app.getHttpServer())
      .patch('/users/1')
      .expect(200)
      .expect(
        await usersService.updateUser(
          {
            email: 'qwerty',
            fullName: 'qwerty',
          },
          1,
        ),
      );
  });

  it(`/PATCH update password user`, async () => {
    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(fakeUser);
    jest.spyOn(usersService, 'findUserByEmail').mockResolvedValue(fakeUser);

    request(app.getHttpServer())
      .patch('/users/password/1')
      .expect(200)
      .expect(
        await usersService.updateUserPassword(
          {
            password: '11111',
            newPassword: '2222',
          },
          1,
        ),
      );
  });

  it(`/PATCH update avatar user`, async () => {
    request(app.getHttpServer())
      .patch('/users/avatar/1')
      .expect(200)
      .expect(await usersService.uploadUserAvatar(1, { avatar: '' }));
  });

  it(`/DELETE user`, async () => {
    request(app.getHttpServer())
      .patch('/users/avatar/1')
      .expect(200)
      .expect(await usersService.deleteUser(1));
  });

  afterAll(async () => {
    await app.close();
  });
});
