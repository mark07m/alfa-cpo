import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PasswordResetToken, PasswordResetTokenDocument } from '@/database/schemas/password-reset-token.schema';
import { User, UserDocument } from '@/database/schemas/user.schema';
import { UsersService } from '@/users/users.service';
import * as crypto from 'crypto';

@Injectable()
export class PasswordResetService {
  constructor(
    @InjectModel(PasswordResetToken.name)
    private passwordResetTokenModel: Model<PasswordResetTokenDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private usersService: UsersService,
  ) {}

  async generateResetToken(email: string, ipAddress?: string): Promise<string> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException('Пользователь с таким email не найден');
    }

    // Отзываем все предыдущие токены для этого пользователя
    await this.passwordResetTokenModel.updateMany(
      { userId: user._id, isUsed: false },
      { isUsed: true, usedAt: new Date() }
    );

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 час

    await this.passwordResetTokenModel.create({
      userId: user._id,
      token,
      expiresAt,
      ipAddress,
    });

    return token;
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const resetToken = await this.passwordResetTokenModel
      .findOne({ token, isUsed: false })
      .populate('userId')
      .exec();

    if (!resetToken || resetToken.expiresAt < new Date()) {
      throw new BadRequestException('Недействительный или истекший токен');
    }

    // Обновляем пароль пользователя
    await this.usersService.update(resetToken.userId._id.toString(), {
      password: newPassword,
    });

    // Помечаем токен как использованный
    await this.passwordResetTokenModel.updateOne(
      { token },
      { isUsed: true, usedAt: new Date() }
    );
  }

  async cleanupExpiredTokens(): Promise<void> {
    await this.passwordResetTokenModel.deleteMany({
      $or: [
        { expiresAt: { $lt: new Date() } },
        { isUsed: true }
      ]
    });
  }
}
