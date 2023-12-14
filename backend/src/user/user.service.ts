import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseConstants } from 'src/base/constants';
import { Repository } from 'typeorm';
import { AppUser } from './entities/user.entity';
import hashPassword from 'src/base/encryption/hashPassword';
import handleHttpErrorGeneration from 'src/base/error/handle-http-error-generation';

@Injectable()
export class UserService {
  constructor(
    @Inject(DatabaseConstants.USER_REPOSITORY)
    private userRepository: Repository<AppUser>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = hashPassword(createUserDto.password);

    try {
      return await this.userRepository.save({
        email: createUserDto.email,
        hashedPassword,
      });
    } catch (e) {
      throw handleHttpErrorGeneration(e);
    }
  }
}
