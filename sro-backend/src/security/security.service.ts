import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlockedIp, BlockedIpDocument } from '@/database/schemas/blocked-ip.schema';
import { LoginAttempt, LoginAttemptDocument } from '@/database/schemas/login-attempt.schema';
import { RefreshToken, RefreshTokenDocument } from '@/database/schemas/refresh-token.schema';

@Injectable()
export class SecurityService {
  constructor(
    @InjectModel(BlockedIp.name) private blockedIpModel: Model<BlockedIpDocument>,
    @InjectModel(LoginAttempt.name) private loginAttemptModel: Model<LoginAttemptDocument>,
    @InjectModel(RefreshToken.name) private refreshTokenModel: Model<RefreshTokenDocument>,
  ) {}

  async getEvents(params: { page?: number; limit?: number; type?: string; userId?: string; dateFrom?: string; dateTo?: string; }) {
    const { page = 1, limit = 50, type, userId, dateFrom, dateTo } = params;
    const query: any = {};
    if (type) {
      if (type === 'failed_login') query.status = 'failed';
      if (type === 'login') query.status = 'success';
      if (type === 'blocked') query.status = 'blocked';
    }
    if (userId) query.userId = userId;
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) (query.createdAt as any).$gte = new Date(dateFrom);
      if (dateTo) (query.createdAt as any).$lte = new Date(dateTo);
    }
    const [data, total] = await Promise.all([
      this.loginAttemptModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      this.loginAttemptModel.countDocuments(query),
    ]);
    return {
      data: data.map((e: any) => ({
        id: e._id,
        type: e.status === 'failed' ? 'failed_login' : e.status === 'success' ? 'login' : 'blocked',
        userId: e.userId || null,
        userEmail: e.email || '',
        ipAddress: e.ipAddress,
        userAgent: e.userAgent || '',
        timestamp: e.createdAt,
        details: e.failureReason || '',
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getStats(period: 'day' | 'week' | 'month' = 'week') {
    const now = new Date();
    let days = 7;
    if (period === 'day') days = 1;
    if (period === 'month') days = 30;
    const from = new Date(now);
    from.setDate(from.getDate() - days);

    const daily = await this.loginAttemptModel.aggregate([
      { $match: { createdAt: { $gte: from } } },
      { $group: { _id: { date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } } }, count: { $sum: 1 } } },
      { $sort: { '_id.date': 1 as 1 } },
    ] as any);
    const totalEvents = await this.loginAttemptModel.countDocuments({ createdAt: { $gte: from } });
    const topIPs = await this.loginAttemptModel.aggregate([
      { $match: { createdAt: { $gte: from } } },
      { $group: { _id: '$ipAddress', count: { $sum: 1 } } },
      { $sort: { count: -1 as -1 } },
      { $limit: 5 },
    ] as any);
    const topUsers = await this.loginAttemptModel.aggregate([
      { $match: { createdAt: { $gte: from } } },
      { $group: { _id: '$email', count: { $sum: 1 } } },
      { $sort: { count: -1 as -1 } },
      { $limit: 5 },
    ] as any);
    const eventsByTypeAgg = await this.loginAttemptModel.aggregate([
      { $match: { createdAt: { $gte: from } } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ] as any);
    const eventsByType: Record<string, number> = {};
    for (const row of eventsByTypeAgg) eventsByType[row._id] = row.count;

    return {
      totalEvents,
      eventsByType,
      eventsByDay: daily.map((d: any) => ({ date: d._id.date, count: d.count })),
      topIPs: topIPs.map((t: any) => ({ ip: t._id, count: t.count })),
      topUsers: topUsers.map((t: any) => ({ user: t._id || 'unknown', count: t.count })),
    };
  }

  async getEventsForExport(filters?: { type?: string; userId?: string; dateFrom?: string; dateTo?: string; }) {
    const query: any = {};
    if (filters?.type) {
      if (filters.type === 'failed_login') query.status = 'failed';
      if (filters.type === 'login') query.status = 'success';
      if (filters.type === 'blocked') query.status = 'blocked';
    }
    if (filters?.userId) query.userId = filters.userId;
    if (filters?.dateFrom || filters?.dateTo) {
      query.createdAt = {};
      if (filters.dateFrom) (query.createdAt as any).$gte = new Date(filters.dateFrom);
      if (filters.dateTo) (query.createdAt as any).$lte = new Date(filters.dateTo);
    }
    const data = await this.loginAttemptModel.find(query).sort({ createdAt: -1 }).lean();
    return data.map((e: any) => ({
      timestamp: e.createdAt,
      status: e.status,
      email: e.email || '',
      userId: e.userId || '',
      ipAddress: e.ipAddress,
      userAgent: e.userAgent || '',
      failureReason: e.failureReason || '',
    }));
  }

  async blockIp(ipAddress: string, reason?: string, createdBy?: string, expiresAt?: Date) {
    await this.blockedIpModel.findOneAndUpdate(
      { ipAddress },
      { ipAddress, reason, createdBy: createdBy as any, expiresAt },
      { upsert: true, new: true }
    );
    return { ipAddress };
  }

  async unblockIp(ipAddress: string) {
    await this.blockedIpModel.deleteOne({ ipAddress });
    return { ipAddress };
  }

  async getBlockedIps() {
    const list = await this.blockedIpModel.find().sort({ createdAt: -1 }).lean();
    return list.map((b: any) => ({
      ipAddress: b.ipAddress,
      reason: b.reason,
      createdAt: b.createdAt,
      expiresAt: b.expiresAt,
    }));
  }

  async getActiveSessions() {
    const sessions = await this.refreshTokenModel.find({ isRevoked: false, expiresAt: { $gte: new Date() } }).select('userId ipAddress userAgent createdAt').lean();
    return sessions.map((s: any) => ({
      userId: s.userId,
      ipAddress: s.ipAddress || 'unknown',
      userAgent: s.userAgent || '',
      createdAt: s.createdAt,
    }));
  }

  async resetFailedAttempts(userId: string) {
    await this.loginAttemptModel.deleteMany({ userId, status: 'failed' });
  }

  async terminateSessions(userId: string) {
    await this.refreshTokenModel.updateMany({ userId, isRevoked: false }, { isRevoked: true, revokedAt: new Date() });
  }
}


