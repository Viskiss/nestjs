import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExecutionContext, INestApplication } from '@nestjs/common';

import { UsersService } from '../users.service';
import { BcryptService } from '../../../services/bcrypt/bcrypt.service';

import { UsersController } from '../users.controller';

import { AccessGuard } from '../../../common/authGuard';

import User from '../../../db/entities/user.entity';

import { repositoryMockFactory } from '../../../../test/fake.testDb';

describe('Users controller', () => {
  let app: INestApplication;

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
    await app.init();
  });

  it('Return users / get users', async () => {
    const test = await request(app.getHttpServer())
      .get('/users/getAll')
      .expect(200);

    expect(test.clientError).toBeFalsy();
  });

  it('Return user (error) / get user', async () => {
    const test = await request(app.getHttpServer()).get('/users/q').expect(400);

    expect(
      test.text.includes(
        '"message":"Validation failed (numeric string is expected)"',
      ),
    ).toBeTruthy();
  });

  it('Return user / get user', async () => {
    const test = await request(app.getHttpServer()).get('/users/1').expect(200);

    expect(test.clientError).toBeFalsy();
  });

  it('Return user after update (error) / update user', async () => {
    const test = await request(app.getHttpServer())
      .patch('/users/1')
      .send({ email: '', fullName: '' })
      .expect(400);

    expect(
      test.text.includes(
        '"message":["email must be an email","Email is too short","Full name is too short"]',
      ),
    ).toBeTruthy();
  });

  it('Return user after update (error) / update user', async () => {
    const test = await request(app.getHttpServer())
      .patch('/users/1')
      .send({ e: 'q' })
      .expect(400);

    expect(test.text.includes('"message":"Nothing to update"')).toBeTruthy();
  });

  it('Return user after update / update user user', async () => {
    const test = await request(app.getHttpServer())
      .patch('/users/1')
      .send({ email: 'qwerty@mail.ru' })
      .expect(200);

    expect(test.clientError).toBeFalsy();
  });

  it('Return user after update password (error) / update user password', async () => {
    const test = await request(app.getHttpServer())
      .patch('/users/password/1')
      .send({ password: '' })
      .expect(400);

    expect(
      test.text.includes(
        '"message":["Password length min 5, max 20","New password name is too long","New password name is too short"]',
      ),
    ).toBeTruthy();
  });

  it('Return user after update password / update user password', async () => {
    const test = await request(app.getHttpServer())
      .patch('/users/password/1')
      .send({ password: '12345', newPassword: '22222' })
      .expect(500);

    expect(test.clientError).toBeFalsy();
    expect(test.serverError).toBeTruthy();
  });

  it('Return user after update avatar (error) / update user avatar', async () => {
    const test = await request(app.getHttpServer())
      .patch('/users/avatar/1')
      .send({ avatar: '' })
      .expect(400);

    expect(
      test.text.includes('"message":["Avatar data too short"]'),
    ).toBeTruthy();
  });

  it('Return user after update avatar / update user avatar', async () => {
    const test = await request(app.getHttpServer())
      .patch('/users/avatar/1')
      .send({ avatar: 'some avatar data' })
      .expect(200);

    expect(test.clientError).toBeFalsy();
  });

  it('Return true after delete user (error) / delete user', async () => {
    const test = await request(app.getHttpServer())
      .delete('/users/delete/q')
      .expect(400);

    expect(
      test.text.includes(
        '"message":"Validation failed (numeric string is expected)"',
      ),
    ).toBeTruthy();
  });

  it('Return true after delete user (error) / delete user', async () => {
    const test = await request(app.getHttpServer())
      .delete('/users/delete/1')
      .expect(200);

    expect(test.clientError).toBeFalsy();
  });

  afterAll(async () => {
    await app.close();
  });
});
