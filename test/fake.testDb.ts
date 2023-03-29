import User from 'src/db/entities/user.entity';

const users = [
  {
    id: 1,
    email: '1@mail.ru',
    password: '$2a$10$ujcELjzFJuKQdZ8ad6rdxus32l4SUqU21oBqgbTSeMTCARmOuNeEe',
    fullName: null,
    avatar: null,
  },
  {
    id: 2,
    email: '2@mail.ru',
    password: '$2a$10$ujcELjzFJuKQdZ8ad6rdxus32l4SUqU21oBqgbTSeMTCARmOuNeEe',
    fullName: null,
    avatar: null,
  },
  {
    id: 3,
    email: '3@mail.ru',
    password: '$2a$10$ujcELjzFJuKQdZ8ad6rdxus32l4SUqU21oBqgbTSeMTCARmOuNeEe',
    fullName: null,
    avatar: null,
  },
];

/* eslint-disable @typescript-eslint/no-empty-function */
export class UserRepositoryFake {
  public delete(): Promise<boolean> {
    return;
  }
  public async save(): Promise<void> {}
  public async find(): Promise<User[]> {
    return users as User[];
  }
  public async findOneBy(): Promise<User> {
    return {
      id: 1,
      email: '1@mail.ru',
      password: '$2a$10$ujcELjzFJuKQdZ8ad6rdxus32l4SUqU21oBqgbTSeMTCARmOuNeEe',
      fullName: null,
      avatar: null,
    };
  }
}
