import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginAttempt, LoginAttemptDocument } from '@/database/schemas/login-attempt.schema';

@Injectable()
export class LoginLoggerService {
  constructor(
    @InjectModel(LoginAttempt.name)
    private loginAttemptModel: Model<LoginAttemptDocument>,
  ) {}

  async logLoginAttempt(
    email: string | undefined,
    ipAddress: string,
    userAgent: string | undefined,
    status: 'success' | 'failed' | 'blocked',
    userId?: string,
    failureReason?: string,
    location?: string,
  ): Promise<void> {
    await this.loginAttemptModel.create({
      email,
      ipAddress,
      userAgent,
      status,
      userId: userId ? userId as any : undefined,
      failureReason,
      location,
    });
  }

  async getFailedAttemptsCount(ipAddress: string, email?: string, timeWindowMinutes: number = 15): Promise<number> {
    const timeWindow = new Date();
    timeWindow.setMinutes(timeWindow.getMinutes() - timeWindowMinutes);

    const query: any = {
      ipAddress,
      status: 'failed',
      createdAt: { $gte: timeWindow },
    };

    if (email) {
      query.email = email;
    }

    return this.loginAttemptModel.countDocuments(query);
  }

  async isIpBlocked(ipAddress: string, maxAttempts: number = 5): Promise<boolean> {
    const failedAttempts = await this.getFailedAttemptsCount(ipAddress);
    return failedAttempts >= maxAttempts;
  }

  async cleanupOldAttempts(daysToKeep: number = 30): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    await this.loginAttemptModel.deleteMany({
      createdAt: { $lt: cutoffDate }
    });
  }
}
