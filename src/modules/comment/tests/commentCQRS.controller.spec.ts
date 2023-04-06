import { ExecutionContext, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CommandBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';

import { AccessGuard } from '../../../common/authGuard';

import CommentsController from '../comment.controller';

describe('commentCQRS controller test', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        CommandBus,
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn((entity) => entity),
            CreateCommentHandler: jest.fn((entity) => entity),
            DeleteCommentHandler: jest.fn((entity) => entity),
            GetCommentsHandler: jest.fn((entity) => entity),
            UpdateCommentHandler: jest.fn((entity) => entity),
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

  it('Return comments (error) / get comments', async () => {
    const test = await request(app.getHttpServer())
      .get('/comments/q')
      .expect(400);

    expect(
      test.text.includes(
        '"message":"Validation failed (numeric string is expected)"',
      ),
    ).toBeTruthy();
    expect(test.clientError).toBeTruthy();
  });

  it('Return comments / get comments', async () => {
    const test = await request(app.getHttpServer())
      .get('/comments/1')
      .expect(200);

    expect(test.clientError).toBeFalsy();
    expect(test.serverError).toBeFalsy();
  });

  it('Return comment after create (error) / post comment', async () => {
    const test = await request(app.getHttpServer())
      .post('/comments/q')
      .send({})
      .expect(400);

    expect(
      test.text.includes(
        '"message":"Validation failed (numeric string is expected)"',
      ),
    ).toBeTruthy();
    expect(test.clientError).toBeTruthy();
  });

  it('Return comment after create (error) / post comment', async () => {
    const test = await request(app.getHttpServer())
      .post('/comments/1')
      .send({ content: '', postId: 1 })
      .expect(400);

    expect(
      test.text.includes(
        '"message":["content should not be empty","postId must be a string"]',
      ),
    ).toBeTruthy();
    expect(test.clientError).toBeTruthy();
  });

  it('Return comment after create / post comment', async () => {
    const test = await request(app.getHttpServer())
      .post('/comments/1')
      .send({ content: 'qwertt', postId: '1' })
      .expect(201);

    expect(test.clientError).toBeFalsy();
  });

  it('Return comment after update (error) / update comment', async () => {
    const test = await request(app.getHttpServer())
      .patch('/comments/1')
      .send({ content: 'qwertyy' })
      .expect(400);

    expect(
      test.text.includes(
        '"message":["commentId should not be empty","commentId must be a string"]',
      ),
    ).toBeTruthy();
    expect(test.clientError).toBeTruthy();
  });

  it('Return comment after update / update comment', async () => {
    const test = await request(app.getHttpServer())
      .patch('/comments/1')
      .send({ content: 'qwertyy', commentId: '1' })
      .expect(200);

    expect(test.clientError).toBeFalsy();
  });

  it('Return true after delete (error) / delete comment', async () => {
    const test = await request(app.getHttpServer())
      .delete('/comments/1')
      .send({ content: 'qwertyy' })
      .expect(400);

    expect(
      test.text.includes(
        '"message":["commentId should not be empty","commentId must be a string"]',
      ),
    ).toBeTruthy();
    expect(test.clientError).toBeTruthy();
  });

  it('Return true after delete / delete comment', async () => {
    const test = await request(app.getHttpServer())
      .delete('/comments/1')
      .send({ commentId: '1' })
      .expect(200);

    expect(test.clientError).toBeFalsy();
  });

  afterAll(async () => {
    await app.close();
  });
});
