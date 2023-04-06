/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/ban-types */
import User from '../../db/entities/user.entity';
import { Repository } from 'typeorm';

export type MockType<T> = {
  [P in keyof T]: jest.Mock<{}>;
};
//@ts-ignore
export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    find: jest.fn((entity) => entity),
    findOne: jest.fn((entity) => entity),
    findOneBy: jest.fn((entity) => entity),
    findAndCount: jest.fn((entity) => entity),
    create: jest.fn((entity) => entity),
    save: jest.fn((entity) => entity),
    update: jest.fn((entity) => entity),
    delete: jest.fn((entity) => entity),
    createQueryBuilder: jest.fn(() => ({
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockReturnValue({} as User),
    })),
  }),
);

export const fakeUser = {
  id: 1,
  email: '1@mail.ru',
  password: '$2a$10$ujcELjzFJuKQdZ8ad6rdxus32l4SUqU21oBqgbTSeMTCARmOuNeEe',
  fullName: null,
  avatar: null,
};

export const fakeUser2 = {
  id: 1,
  email: '1@mail.ru',
  password: '$2a$10$ujcELjzFJuKQdZ8ad6rdxus32l4SUqU21oBqgbTSeMTCARmOuNeEe',
  fullName: null,
  avatar: null,
};
