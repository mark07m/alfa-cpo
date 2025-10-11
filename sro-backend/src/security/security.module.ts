import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SecurityController } from './security.controller';
import { SecurityService } from './security.service';
import { BlockedIp, BlockedIpSchema } from '@/database/schemas/blocked-ip.schema';
import { LoginAttempt, LoginAttemptSchema } from '@/database/schemas/login-attempt.schema';
import { RefreshToken, RefreshTokenSchema } from '@/database/schemas/refresh-token.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BlockedIp.name, schema: BlockedIpSchema },
      { name: LoginAttempt.name, schema: LoginAttemptSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
  ],
  controllers: [SecurityController],
  providers: [SecurityService],
  exports: [SecurityService],
})
export class SecurityModule {}


