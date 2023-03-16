import { UpdateUserPasswordType } from './user.types';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { User } from './user.entity';
import { UpdateUserType } from 'src/modules/user/user.types';
import { DeleteResult, Repository } from 'typeorm';
import { BcryptService } from '../bcrypt/bcrypt.service';
import { CreateUserDto } from '../auth/auth.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly bcryptService: BcryptService,
  ) {}

  async findAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findUserById(id: number): Promise<User> {
    const user = this.userRepository.findOneBy({ id });
    return user;
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = this.userRepository.findOneBy({ email });
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

  async updateUser(data: UpdateUserType): Promise<User> {
    const { email, fullName, id } = data;
    const userId = +id;
    const currentUser = await this.userRepository.findOneBy({ id: userId });

    currentUser.fullName = fullName || currentUser.fullName;
    currentUser.email = email || currentUser.email;

    await this.userRepository.save(currentUser);

    return currentUser;
  }

  async updateUserPassword(data: UpdateUserPasswordType) {
    const { password, newPassword, id } = data;
    const userId = +id;
    const currentUser = await this.userRepository.findOneBy({ id: userId });
    const isMatchPassword = await this.bcryptService.compare(
      password,
      newPassword,
    );
    if (!isMatchPassword) {
      throw new BadRequestException('Password not valid');
    }

    const hashNewPassword = await this.bcryptService.hash(newPassword);

    currentUser.password = hashNewPassword;

    await this.userRepository.save(currentUser);

    return currentUser;
  }

  async deleteUser(id: string): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }
}
