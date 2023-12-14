import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseConstants } from 'src/base/constants';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import hashPassword from 'src/base/encryption/hashPassword';
import handleHttpErrorGeneration from 'src/base/error/handle-http-error-generation';

@Injectable()
export class UserService {
  constructor(
    @Inject(DatabaseConstants.USER_REPOSITORY)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = hashPassword(createUserDto.password);

    try {
      const user = await this.userRepository.save({
        email: createUserDto.email,
        hashedPassword,
      });

      return {
        ...user,
        hashedPassword: undefined,
      };
    } catch (e) {
      throw handleHttpErrorGeneration(e);
    }
  }

  async getOneByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User with the provided email is not found');
    }

    return user;
  }
}
