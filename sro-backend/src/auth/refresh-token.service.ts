import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RefreshToken, RefreshTokenDocument } from '@/database/schemas/refresh-token.schema';
import { User } from '@/database/schemas/user.schema';
import * as crypto from 'crypto';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshTokenDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async generateRefreshToken(user: User, ipAddress?: string, userAgent?: string): Promise<string> {
    const token = crypto.randomBytes(64).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 дней

    await this.refreshTokenModel.create({
      userId: user._id,
      token,
      expiresAt,
      ipAddress,
      userAgent,
    });

    return token;
  }

  async validateRefreshToken(token: string): Promise<User | null> {
    const refreshToken = await this.refreshTokenModel
      .findOne({ token, isRevoked: false })
      .populate('userId')
      .exec();

    if (!refreshToken || refreshToken.expiresAt < new Date()) {
      return null;
    }

    return refreshToken.userId as unknown as User;
  }

  async revokeRefreshToken(token: string): Promise<void> {
    await this.refreshTokenModel.updateOne(
      { token },
      { isRevoked: true, revokedAt: new Date() }
    );
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.refreshTokenModel.updateMany(
      { userId, isRevoked: false },
      { isRevoked: true, revokedAt: new Date() }
    );
  }

  async cleanupExpiredTokens(): Promise<void> {
    await this.refreshTokenModel.deleteMany({
      $or: [
        { expiresAt: { $lt: new Date() } },
        { isRevoked: true }
      ]
    });
  }
}
