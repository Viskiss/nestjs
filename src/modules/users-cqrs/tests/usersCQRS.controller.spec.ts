import { ExecutionContext, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CommandBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';

import { AccessGuard } from '../../../common/authGuard';

import UsersController from '../users.controller';

describe('userCQRS controller test', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        CommandBus,
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn((entity) => entity),
            GetAllUsersHandler: jest.fn((entity) => entity),
            UpdateUserHandler: jest.fn((entity) => entity),
            UpdateUserAvatarHandler: jest.fn((entity) => entity),
            UpdateUserPasswordHandler: jest.fn((entity) => entity),
            DeleteUserHandler: jest.fn((entity) => entity),
            GetUserHandler: jest.fn((entity) => entity),
          },
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
    await app.init();
  });

  it('Return users array / sign-up', async () => {
    await request(app.getHttpServer()).get('/users/getAll').expect(200);
  });

  it('Return user by id (error) / sign-up', async () => {
    const test = await request(app.getHttpServer()).get('/users/f').expect(400);

    expect(
      test.text.includes(
        '"message":"Validation failed (numeric string is expected)"',
      ),
    ).toBe(true);
  });

  it('Return user by id / sign-up', async () => {
    await request(app.getHttpServer()).get('/users/1').expect(200);
  });

  it('Return user after update (error) / sign-up', async () => {
    await request(app.getHttpServer())
      .patch('/users/ttt')
      .send({
        email: '',
      })
      .query({ id: 1 })
      .expect(400);
  });

  it('Return user after update (error) / update user', async () => {
    const test = await request(app.getHttpServer())
      .patch('/users/1')
      .send({
        email: '',
      })
      .expect(400);

    expect(
      test.text.includes(
        '"message":["email must be an email","Email is too short"]',
      ),
    ).toBe(true);
  });

  it('Return user after update (error) / update user', async () => {
    const test = await request(app.getHttpServer())
      .patch('/users/1')
      .send({
        email: '',
      })
      .expect(400);

    expect(
      test.text.includes(
        '"message":["email must be an email","Email is too short"]',
      ),
    ).toBe(true);
  });

  it('Return user after update / update user', async () => {
    const test = await request(app.getHttpServer())
      .patch('/users/1')
      .send({
        email: 'qwerty@mail.ru',
      })
      .expect(200);

    expect(test.clientError).toBeFalsy();
  });

  it('Return user after update (error) / update user password', async () => {
    const test = await request(app.getHttpServer())
      .patch('/users/password/1')
      .send({})
      .expect(400);

    expect(
      test.text.includes(
        '"message":["Password length min 5, max 20","New password name is too long","New password name is too short"]',
      ),
    ).toBe(true);
  });

  it('Return user after update (error) / update user password', async () => {
    const test = await request(app.getHttpServer())
      .patch('/users/password/1')
      .send({ password: '11111', newPassword: '22222' })
      .expect(200);

    expect(test.clientError).toBeFalsy();
  });

  it('Return true after update (error) / update user avatar', async () => {
    const test = await request(app.getHttpServer())
      .patch('/users/avatar/1')
      .send({})
      .expect(400);

    expect(test.text.includes('"message":["Avatar data too short"]')).toBe(
      true,
    );
  });

  it('Return true after update / update user avatar', async () => {
    const test = await request(app.getHttpServer())
      .patch('/users/avatar/1')
      .send({ avatar: 'some avatar data' })
      .expect(200);

    expect(test.clientError).toBeFalsy();
  });

  it('Return true after deleting user (error) / delete user', async () => {
    const test = await request(app.getHttpServer())
      .delete('/users/delete/t')
      .send({})
      .expect(400);

    expect(
      test.text.includes(
        '"message":"Validation failed (numeric string is expected)"',
      ),
    ).toBe(true);
  });

  it('Return true after deleting user (error) / delete user', async () => {
    const test = await request(app.getHttpServer())
      .delete('/users/delete/1')
      .send({})
      .expect(200);

    expect(test.clientError).toBeFalsy();
  });

  afterAll(async () => {
    await app.close();
  });
});
