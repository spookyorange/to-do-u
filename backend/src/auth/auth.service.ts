import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import comparePasswords from 'src/base/encryption/comparePasswords';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string): Promise<any> {
    const user = await this.userService.getOneByEmail(email);
    if (!comparePasswords(password, user.hashedPassword)) {
      throw new UnauthorizedException();
    }
    const payload = { email: user.email, id: user.id };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
