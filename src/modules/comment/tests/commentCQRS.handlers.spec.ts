import { CommandBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import {
  CreateCommentHandler,
  UpdateCommentHandler,
  DeleteCommentHandler,
  GetCommentsHandler,
} from '../eventHandlers';

import CommentsController from '../comment.controller';

import { CommentsModule } from '../comment.module';

import Comment from '../../../db/entities/comment.entity';

import { repositoryMockFactory } from '../../../common/testing/fake.testDb';

describe('commentCQRS handlers test', () => {
  let createComment: CreateCommentHandler;
  let updateComment: UpdateCommentHandler;
  let getComments: GetCommentsHandler;
  let deleteComment: DeleteCommentHandler;
  let commentsRepository;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        CommentsModule,
        CommandBus,
        DeleteCommentHandler,
        UpdateCommentHandler,
        CreateCommentHandler,
        GetCommentsHandler,
        {
          provide: getRepositoryToken(Comment),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();
    commentsRepository = module.get(getRepositoryToken(Comment));

    deleteComment = module.get(DeleteCommentHandler);
    createComment = module.get(CreateCommentHandler);
    updateComment = module.get(UpdateCommentHandler);
    getComments = module.get(GetCommentsHandler);

    await module.init();
  });

  it('Return comment after create (error) / create comment', async () => {
    jest
      .spyOn(commentsRepository, 'create')
      .mockImplementation(() => undefined);

    const test = createComment.execute({
      data: { content: 'qqqqq', postId: 1 },
      author: 1,
    });

    expect(test).rejects.toThrow('Unable create new comment');
  });

  it('Return comment after create / create comment', async () => {
    jest
      .spyOn(commentsRepository, 'create')
      .mockResolvedValue({ content: '', userId: 1, postId: 1 } as never);

    const test = await createComment.execute({
      data: { content: 'qqqqq', postId: 1 },
      author: 1,
    });

    expect(test).toHaveProperty('content');
    expect(test).toHaveProperty('postId');
    expect(test).toHaveProperty('userId');
  });

  it('Return true after delete (error) / delete comment', async () => {
    jest.spyOn(commentsRepository, 'findOneBy').mockResolvedValue(undefined);

    const test = deleteComment.execute({
      data: { commentId: 1 },
      author: 1,
    });

    expect(test).rejects.toThrow('Comment not found');
  });

  it('Return true after delete (error) / delete comment', async () => {
    jest
      .spyOn(commentsRepository, 'findOneBy')
      .mockResolvedValue({} as Comment);

    const test = deleteComment.execute({
      data: { commentId: 1 },
      author: 1,
    });

    expect(test).rejects.toThrow('You can only delete your comment');
  });

  it('Return true after delete (error) / delete comment', async () => {
    jest
      .spyOn(commentsRepository, 'findOneBy')
      .mockResolvedValue({ userId: 1 } as Comment);
    jest
      .spyOn(commentsRepository, 'delete')
      .mockResolvedValue({ affected: 0, raw: 0 });

    const test = deleteComment.execute({
      data: { commentId: 1 },
      author: 1,
    });

    expect(test).rejects.toThrow('Unable delete post');
  });

  it('Return true after delete / delete comment', async () => {
    jest
      .spyOn(commentsRepository, 'findOneBy')
      .mockResolvedValue({ userId: 1 } as Comment);
    jest
      .spyOn(commentsRepository, 'delete')
      .mockResolvedValue({ affected: 1, raw: 0 });

    const test = await deleteComment.execute({
      data: { commentId: 1 },
      author: 1,
    });

    expect(test).toBeTruthy();
  });

  it('Return comments (error) / get comments', async () => {
    jest
      .spyOn(commentsRepository, 'createQueryBuilder')
      .mockImplementation(() => ({
        where: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(undefined),
      }));

    const test = getComments.execute({
      author: 1,
    });

    expect(test).rejects.toThrow('Unable get comments');
  });

  it('Return comments / get comments', async () => {
    jest
      .spyOn(commentsRepository, 'createQueryBuilder')
      .mockImplementation(() => ({
        where: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([] as Comment[]),
      }));

    const test = await getComments.execute({
      author: 1,
    });

    expect(test).toStrictEqual([] as Comment[]);
  });

  it('Return comment after update (error) / update comment', async () => {
    jest.spyOn(commentsRepository, 'findOneBy').mockResolvedValue(undefined);

    const test = updateComment.execute({
      author: 1,
      data: { content: 'some content', commentId: 1 },
    });

    expect(test).rejects.toThrow('Comment not found');
  });

  it('Return comment after update / update comment', async () => {
    jest
      .spyOn(commentsRepository, 'findOneBy')
      .mockResolvedValue({} as Comment);

    const test = await updateComment.execute({
      author: 1,
      data: { content: 'some content', commentId: 1 },
    });

    expect(test).toHaveProperty('content');
    expect(test.content).toBe('some content');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await module.close();
  });
});
