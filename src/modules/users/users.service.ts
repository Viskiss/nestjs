import {
  Injectable,
  BadRequestException,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import User from '../../db/entities/user.entity';
import { CreateUserDto } from '../auth/auth.dto';
import { UpdateUserDto, UpdateUserPasswordDto } from './users.dto';

import { BcryptService } from '../../services/bcrypt/bcrypt.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly bcryptService: BcryptService,
  ) {}

  async findAllUsers() {
    try {
      return this.userRepository.find();
    } catch (error) {
      throw new HttpException(
        'INTERNAL_SERVER_ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findUserById(id: number) {
    try {
      return this.userRepository.findOneBy({ id });
    } catch (error) {
      throw new HttpException(
        'INTERNAL_SERVER_ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findUserByEmail(email: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();

    return user;
  }

  async createUser(body: CreateUserDto) {
    const { email, password, fullName } = body;

    const newUser = new User();

    newUser.email = email.trim().toLowerCase();
    newUser.password = await this.bcryptService.hash(password);

    newUser.fullName = fullName;

    await this.userRepository.save(newUser);

    delete newUser.password;

    return newUser;
  }

  async updateUser(data: UpdateUserDto, id: number) {
    const { email, fullName } = data;

    if (!email && !fullName) {
      throw new BadRequestException({
        message: 'Nothing to update',
      });
    }
    const user = await this.userRepository.findOneBy({ id });

    if (email === user.email && fullName === user.fullName) {
      throw new BadRequestException({
        message: 'Update needs a new value',
      });
    } else {
      user.fullName = fullName || user.fullName;
      user.email = email || user.email;
      await this.userRepository.save(user);
    }

    delete user.password;

    return user;
  }

  async updateUserPassword(data: UpdateUserPasswordDto, id: number) {
    const { password, newPassword } = data;

    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException({
        message: 'User not found',
      });
    }

    const userWithPassword = await this.findUserByEmail(user.email);

    const passwordCompared = await this.bcryptService.compare(
      password,
      userWithPassword.password,
    );

    if (!passwordCompared) {
      throw new BadRequestException({
        message: 'Your password is invalid',
      });
    }

    if (password === newPassword) {
      throw new BadRequestException({
        message: 'Password and new password must be different',
      });
    } else {
      const hashNewPassword = await this.bcryptService.hash(newPassword);

      user.password = hashNewPassword;
    }

    await this.userRepository.save(user);

    return user;
  }

  async uploadUserAvatar(id: number, data: { avatar: string }) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException({
        message: 'User not found',
      });
    }

    user.avatar = data.avatar;

    await this.userRepository.save(user);

    return true;
  }

  async deleteUser(id: number) {
    const deleteResult = await this.userRepository.delete(id);

    if (deleteResult.affected === 0) {
      throw new BadRequestException({
        message: 'Unable delete user',
      });
    }

    return true;
  }
}
