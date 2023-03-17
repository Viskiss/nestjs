import { Injectable, BadRequestException } from '@nestjs/common';
import { User } from './user.entity';
import { BcryptService } from '../../services/bcrypt/bcrypt.service';
import { CreateUserDto } from '../auth/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto, UpdateUserPasswordDto } from './user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly bcryptService: BcryptService,
  ) {}

  async findAllUsers() {
    return this.userRepository.find();
  }

  async findUserById(id: number) {
    const user = this.userRepository.findOneBy({ id });
    return user;
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

    if (email === user.email || fullName === user.fullName) {
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

  async deleteUser(id: number) {
    const deleteResult = this.userRepository.delete(id);

    if ((await deleteResult).affected === 0) {
      throw new BadRequestException({
        message: 'Unable delete user',
      });
    }

    return true;
  }
}
