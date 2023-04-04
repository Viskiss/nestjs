import { CommandBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import {
  CreatePostHandler,
  DeletePostHandler,
  GetAllPostsHandler,
  UpdatePostHandler,
} from '../eventHandlers';

import PostsController from '../post.controller';

import { UsersService } from '../../../modules/users/users.service';
import { BcryptService } from '../../../services/bcrypt/bcrypt.service';

import Post from '../../../db/entities/post.entity';
import User from '../../../db/entities/user.entity';

import { fakeUser, repositoryMockFactory } from '../../../../test/fake.testDb';

describe('comentsCQRS handlers test', () => {
  let createPost: CreatePostHandler;
  let updatePost: UpdatePostHandler;
  let getPosts: GetAllPostsHandler;
  let deletePost: DeletePostHandler;
  let postRepository;
  let userService: UsersService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [],
      controllers: [PostsController],
      providers: [
        CommandBus,
        CreatePostHandler,
        UpdatePostHandler,
        DeletePostHandler,
        GetAllPostsHandler,
        UsersService,
        BcryptService,
        {
          provide: getRepositoryToken(Post),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();
    postRepository = module.get(getRepositoryToken(Post));

    userService = module.get(UsersService);

    deletePost = module.get(DeletePostHandler);
    createPost = module.get(CreatePostHandler);
    updatePost = module.get(UpdatePostHandler);
    getPosts = module.get(GetAllPostsHandler);

    await module.init();
  });

  it('Return post after create (error) / create post', async () => {
    jest.spyOn(userService, 'findUserById').mockResolvedValue(undefined);

    const test = createPost.execute({
      text: 'some text',
      author: 1,
    });

    expect(test).rejects.toThrow('User not found');
  });

  it('Return post after create (error) / create post', async () => {
    jest.spyOn(userService, 'findUserById').mockResolvedValue(fakeUser);
    jest.spyOn(postRepository, 'create').mockImplementation(() => undefined);

    const test = createPost.execute({
      text: 'some text',
      author: 1,
    });

    expect(test).rejects.toThrow('Unable create post');
  });

  it('Return post after create / create post', async () => {
    jest.spyOn(userService, 'findUserById').mockResolvedValue(fakeUser);
    jest
      .spyOn(postRepository, 'create')
      .mockResolvedValue({ text: 'some text', author: 1 } as unknown as Post);

    const test = await createPost.execute({
      text: 'some text',
      author: 1,
    });

    expect(test.text).toBe('some text');
  });

  it('Return true after delete (error) / delete post', async () => {
    jest.spyOn(postRepository, 'findOneBy').mockResolvedValue(undefined);

    const test = deletePost.execute({
      postId: 1,
      userId: 1,
    });

    expect(test).rejects.toThrow('Post not found');
  });

  it('Return true after delete (error) / delete post', async () => {
    jest
      .spyOn(postRepository, 'findOneBy')
      .mockResolvedValue({ userId: 2 } as Post);

    const test = deletePost.execute({
      postId: 1,
      userId: 1,
    });

    expect(test).rejects.toThrow('You can only delete your post');
  });

  it('Return true after delete (error) / delete post', async () => {
    jest
      .spyOn(postRepository, 'findOneBy')
      .mockResolvedValue({ userId: 1 } as Post);
    jest.spyOn(postRepository, 'delete').mockResolvedValue({ affected: 0 });

    const test = deletePost.execute({
      postId: 1,
      userId: 1,
    });

    expect(test).rejects.toThrow('Unable delete post');
  });

  it('Return true after delete / delete post', async () => {
    jest
      .spyOn(postRepository, 'findOneBy')
      .mockResolvedValue({ userId: 1 } as Post);
    jest.spyOn(postRepository, 'delete').mockResolvedValue({ affected: 1 });

    const test = await deletePost.execute({
      postId: 1,
      userId: 1,
    });

    expect(test).toBeTruthy();
  });

  it('Return posts (error) / get posts', async () => {
    jest.spyOn(postRepository, 'find').mockImplementation(undefined);

    const test = getPosts.execute();

    expect(test).rejects.toThrow('Unable get all posts');
  });

  it('Return posts / get posts', async () => {
    jest.spyOn(postRepository, 'find').mockImplementation(() => [] as Post[]);

    const test = await getPosts.execute();

    expect(test).toStrictEqual([]);
  });

  it('Return post after update (error) / update post', async () => {
    jest.spyOn(userService, 'findUserById').mockResolvedValue(undefined);

    const test = updatePost.execute({
      body: { text: 'some text', postId: 1 },
      author: 1,
    });

    expect(test).rejects.toThrow('User not found');
  });

  it('Return post after update (error) / update post', async () => {
    jest.spyOn(userService, 'findUserById').mockResolvedValue(fakeUser);
    jest.spyOn(postRepository, 'findOneBy').mockResolvedValue(undefined);

    const test = updatePost.execute({
      body: { text: 'some text', postId: 1 },
      author: 1,
    });

    expect(test).rejects.toThrow('Post not found');
  });

  it('Return post after update (error) / update post', async () => {
    jest.spyOn(userService, 'findUserById').mockResolvedValue(fakeUser);
    jest
      .spyOn(postRepository, 'findOneBy')
      .mockResolvedValue({ userId: 2 } as Post);

    const test = updatePost.execute({
      body: { text: 'some text', postId: 1 },
      author: 1,
    });

    expect(test).rejects.toThrow('You can only update your post');
  });

  it('Return post after update (error) / update post', async () => {
    jest.spyOn(userService, 'findUserById').mockResolvedValue(fakeUser);
    jest
      .spyOn(postRepository, 'findOneBy')
      .mockResolvedValue({ userId: 1, text: 'some text' } as Post);

    const test = updatePost.execute({
      body: { text: 'some text', postId: 1 },
      author: 1,
    });

    expect(test).rejects.toThrow('Need new text for update');
  });

  it('Return post after update / update post', async () => {
    jest.spyOn(userService, 'findUserById').mockResolvedValue(fakeUser);
    jest
      .spyOn(postRepository, 'findOneBy')
      .mockResolvedValue({ userId: 1, text: 'some text' } as Post);

    const test = await updatePost.execute({
      body: { text: 'some text 1', postId: 1 },
      author: 1,
    });

    expect(test.text).toBe('some text 1');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await module.close();
  });
});
