import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { userRepository } from 'src/constants';
import User from 'src/db/entities/User';
import { UpdateUserType } from 'src/types/userTypes';
import { Repository } from 'typeorm';
import { BcryptService } from '../bcrypt/bcrypt.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(userRepository)
    private readonly bcryptService: BcryptService,
    private readonly userRepository: Repository<User>,
  ) {}

  async findAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOneUser(id: number): Promise<User> {
    const user = this.userRepository.findOneBy({ id });
    return user;
  }

  async createUser(body: User): Promise<User> {
    const { email, password, fullName } = body;
    const newUser = new User();

    let emailUser = null;
    const dubleEmail = this.userRepository.findOne({ where: { email } });

    if (dubleEmail) {
      throw new HttpException(
        'User with this email is registered',
        HttpStatus.METHOD_NOT_ALLOWED,
      );
    } else {
      emailUser = email;
    }

    newUser.email = emailUser.trim().toLowerCase();
    newUser.password = await this.bcryptService.hash(password);
    newUser.fullName = fullName;

    await this.userRepository.save(newUser);

    return newUser;
  }

  async updateUser(data: UpdateUserType): Promise<User> {
    const { email, fullName, id } = data;
    const userId = +id;
    const currentUser = await this.userRepository.findOneBy({ id: userId });

    currentUser.fullName = fullName || currentUser.fullName;
    currentUser.email = email || currentUser.email;

    return currentUser;
  }
}
