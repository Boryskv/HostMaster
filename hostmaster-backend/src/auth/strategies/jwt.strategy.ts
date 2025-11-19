import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'hostmaster-secret-key-2024',
    });
  }

  async validate(payload: any) {
    console.log('JWT Payload:', payload);
    const user = await this.usersService.findById(payload.sub);
    console.log('User found:', user ? user.email : 'NOT FOUND');
    if (!user) {
      return null;
    }
    const { password, ...result } = user;
    return result;
  }
}
