import { ExecutionContext, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CommandBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';

import { RefreshGuard } from '../../../common/authGuard';
import AuthController from '../auth.controller';

describe('userCQRSController test', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        CommandBus,
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn((entity) => entity),
            AuthSignInHandler: jest.fn((entity) => entity),
            AuthSignUpHandler: jest.fn((entity) => entity),
            RefreshTokenHandler: jest.fn((entity) => entity),
          },
        },
      ],
    })
      .overrideGuard(RefreshGuard)
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

  it('Return user, tokens after sign-in (error)/ sign-in', async () => {
    const test = await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send({})
      .expect(400);

    expect(
      test.text.includes(
        '"message":["Email is too long","Email is too short","email must be an email","email must be a string","Password length min 5, max 20","password must be a string"]',
      ),
    ).toBeTruthy();
    expect(test.clientError).toBeTruthy();
  });

  it('Return user, tokens after sign-in/ sign-in', async () => {
    const test = await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send({ email: 'qwertyu@mail.ru', password: '11111' })
      .expect(201);

    expect(test.error).toBeFalsy();
    expect(test.clientError).toBeFalsy();
  });

  it('Return user, tokens after sign-up (error)/ sign-up', async () => {
    const test = await request(app.getHttpServer())
      .post('/auth/sign-up')
      .send({ email: '', password: '' })
      .expect(400);

    expect(
      test.text.includes(
        '"message":["Email is too short","email must be an email","Password length min 5, max 20"]',
      ),
    ).toBeTruthy();
    expect(test.clientError).toBeTruthy();
  });

  it('Return user, tokens after sign-up/ sign-up', async () => {
    const test = await request(app.getHttpServer())
      .post('/auth/sign-up')
      .send({ email: 'qwerty@mail.ru', password: '11111' })
      .expect(201);

    expect(test.clientError).toBeFalsy();
  });

  it('Return tokens after refresh (error)/ refresh', async () => {
    const test = await request(app.getHttpServer())
      .post('/auth/refresh')
      .expect(400);

    expect(test.clientError).toBeTruthy();
    expect(
      test.text.includes('"message":["token must be a string"]'),
    ).toBeTruthy();
  });

  it('Return tokens after refresh/ refresh', async () => {
    const test = await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({ token: 'some token' })
      .expect(201);

    expect(test.clientError).toBeFalsy();
    expect(test.serverError).toBeFalsy();
  });

  afterAll(async () => {
    await app.close();
  });
});
