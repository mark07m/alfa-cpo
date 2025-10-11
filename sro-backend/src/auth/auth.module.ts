import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import jwtConfig from '@/config/jwt.config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersModule } from '@/users/users.module';
import { RefreshTokenService } from './refresh-token.service';
import { PasswordResetService } from './password-reset.service';
import { LoginLoggerService } from './login-logger.service';
import { RefreshToken, RefreshTokenSchema } from '@/database/schemas/refresh-token.schema';
import { PasswordResetToken, PasswordResetTokenSchema } from '@/database/schemas/password-reset-token.schema';
import { LoginAttempt, LoginAttemptSchema } from '@/database/schemas/login-attempt.schema';
import { BlockedIp, BlockedIpSchema } from '@/database/schemas/blocked-ip.schema';
import { User, UserSchema } from '@/database/schemas/user.schema';

@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: configService.get<string>('jwt.expiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: RefreshToken.name, schema: RefreshTokenSchema },
      { name: PasswordResetToken.name, schema: PasswordResetTokenSchema },
      { name: LoginAttempt.name, schema: LoginAttemptSchema },
      { name: BlockedIp.name, schema: BlockedIpSchema },
      { name: User.name, schema: UserSchema },
    ]),
    UsersModule,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    LocalStrategy,
    RefreshTokenService,
    PasswordResetService,
    LoginLoggerService,
  ],
  controllers: [AuthController],
  exports: [AuthService, RefreshTokenService, PasswordResetService, LoginLoggerService],
})
export class AuthModule {}
