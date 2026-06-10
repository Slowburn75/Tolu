import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailService } from './email.service';
import { JwtStrategy } from './jwt.strategy';
import { JwtRefreshStrategy } from './jwt-refresh.strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret-jwt-key-change-in-production',
      signOptions: { expiresIn: process.env.JWT_EXPIRATION || '15m' },
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, EmailService, JwtStrategy, JwtRefreshStrategy],
  exports: [AuthService, EmailService, JwtModule],
})
export class AuthModule {}
