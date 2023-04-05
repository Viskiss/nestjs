import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import {
  ExecutionContext,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';

import { AuthService } from '../auth.service';

import { AuthController } from '../auth.controller';

import { RefreshGuard } from '../../../common/authGuard';

describe('auth controller test', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: {
            signIn: () => {
              return true;
            },
            signUp: () => {
              return true;
            },
            refresh: () => {
              return true;
            },
          },
        },
      ],
      controllers: [AuthController],
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
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
      }),
    );
    await app.init();
  });

  it(`/POST validation error sign-in`, async () => {
    const test = await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send({
        email: '',
        password: '',
      })
      .expect(400);

    expect(test.clientError).toBe(true);
    expect(
      test.text.includes(
        '"message":["Email is too short","email must be an email","Password length min 5, max 20"]',
      ),
    ).toBe(true);
  });

  it(`/POST error exist field sign-in`, async () => {
    const test = await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send({
        existField: 122,
        email: 'qwerty@mail.ru',
        password: '11111',
      })
      .expect(400);

    expect(test.clientError).toBe(true);
    expect(test.text.includes('property existField should not exist')).toBe(
      true,
    );
  });

  it(`/POST sign-in`, async () => {
    const test = await request(app.getHttpServer())
      .post('/auth/sign-in')
      .send({
        email: 'qwerty@mail.ru',
        password: '11111',
      })
      .expect(201);

    expect(test.clientError).toBeFalsy();
  });

  it(`/POST error sign-up`, async () => {
    const test = await request(app.getHttpServer())
      .post('/auth/sign-up')
      .send({
        email: '',
        password: '',
      })
      .expect(400);

    expect(test.clientError).toBe(true);
    expect(
      test.text.includes(
        '"message":["Email is too short","email must be an email","Password length min 5, max 20"]',
      ),
    ).toBe(true);
  });

  it(`/POST sign-up`, async () => {
    const test = await request(app.getHttpServer())
      .post('/auth/sign-up')
      .send({
        email: 'qqwwwee@mail.ru',
        password: '11111',
      })
      .expect(201);

    expect(test.clientError).toBeFalsy();
  });

  it(`/POST error refresh`, async () => {
    await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({
        token: '',
      })
      .expect(201);
  });

  afterAll(async () => {
    await app.close();
  });
});
