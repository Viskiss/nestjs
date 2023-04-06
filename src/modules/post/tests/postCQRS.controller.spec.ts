import { ExecutionContext, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CommandBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';

import { AccessGuard } from '../../../common/authGuard';

import PostsController from '../post.controller';

describe('postCQRS controller test', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        CommandBus,
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn((entity) => entity),
            CreatePostHandler: jest.fn((entity) => entity),
            DeletePostHandler: jest.fn((entity) => entity),
            GetallPostsHandler: jest.fn((entity) => entity),
            UpdatePostHandler: jest.fn((entity) => entity),
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

  it('Return posts / get posts', async () => {
    const test = await request(app.getHttpServer())
      .get('/posts/getAll')
      .expect(200);

    expect(test.clientError).toBeFalsy();
  });

  it('Return post after create (error) / create post', async () => {
    const test = await request(app.getHttpServer())
      .post('/posts/q')
      .send({ text: 'some text' })
      .expect(400);

    expect(
      test.text.includes(
        '"message":"Validation failed (numeric string is expected)"',
      ),
    ).toBeTruthy();
  });

  it('Return post after create (error) / create post', async () => {
    const test = await request(app.getHttpServer())
      .post('/posts/1')
      .send({ tex: 'some text' })
      .expect(400);

    expect(
      test.text.includes(
        '"message":["text should not be empty","text must be a string"]',
      ),
    ).toBeTruthy();
  });

  it('Return post after create / create post', async () => {
    const test = await request(app.getHttpServer())
      .post('/posts/1')
      .send({ text: 'some text' })
      .expect(201);

    expect(test.clientError).toBeFalsy();
  });

  it('Return post after update (error) / update post', async () => {
    const test = await request(app.getHttpServer())
      .patch('/posts/1')
      .send({ text: 'some text' })
      .expect(400);

    expect(
      test.text.includes(
        '"message":["postId should not be empty","postId must be a string"]',
      ),
    ).toBeTruthy();
  });

  it('Return post after update / update post', async () => {
    const test = await request(app.getHttpServer())
      .patch('/posts/1')
      .send({ text: 'some text', postId: '1' })
      .expect(200);

    expect(test.clientError).toBeFalsy();
  });

  it('Return true after delete (error) / delete post', async () => {
    const test = await request(app.getHttpServer())
      .delete('/posts/1')
      .send({})
      .expect(400);

    expect(
      test.text.includes(
        '"message":["postId should not be empty","postId must be a string"]',
      ),
    ).toBeTruthy();
  });

  it('Return true after delete / delete post', async () => {
    const test = await request(app.getHttpServer())
      .delete('/posts/1')
      .send({ postId: '1' })
      .expect(200);

    expect(test.clientError).toBeFalsy();
  });

  afterAll(async () => {
    await app.close();
  });
});
