import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CompensationFund, CompensationFundDocument, CompensationFundHistory } from '@/database/schemas/compensation-fund.schema';
import { UpdateCompensationFundDto } from './dto/update-compensation-fund.dto';
import { AddHistoryEntryDto } from './dto/add-history-entry.dto';
import { HistoryQueryDto } from './dto/history-query.dto';

@Injectable()
export class CompensationFundService {
  constructor(
    @InjectModel(CompensationFund.name) private compensationFundModel: Model<CompensationFundDocument>,
  ) {}

  async getFundInfo(): Promise<CompensationFund> {
    let fund = await this.compensationFundModel.findOne().exec();
    
    if (!fund) {
      // Создаем начальную запись фонда, если её нет
      fund = new this.compensationFundModel({
        amount: 0,
        currency: 'RUB',
        lastUpdated: new Date(),
        bankDetails: {
          bankName: '',
          accountNumber: '',
          bik: '',
          correspondentAccount: '',
          inn: '',
          kpp: '',
        },
        history: [],
        createdBy: new Types.ObjectId(), // Временный ID, будет заменен при первом обновлении
        updatedBy: new Types.ObjectId(),
      });
      
      await fund.save();
    }

    return fund;
  }

  async updateFundInfo(updateCompensationFundDto: UpdateCompensationFundDto, userId: string): Promise<CompensationFund> {
    const fund = await this.getFundInfo();
    
    const updateData: any = {
      ...updateCompensationFundDto,
      lastUpdated: new Date(),
      updatedBy: new Types.ObjectId(userId),
    };

    // Если обновляется сумма, добавляем запись в историю
    if (updateCompensationFundDto.amount !== undefined && updateCompensationFundDto.amount !== fund.amount) {
      const operation = updateCompensationFundDto.amount > fund.amount ? 'increase' : 'decrease';
      const changeAmount = Math.abs(updateCompensationFundDto.amount - fund.amount);
      
      const historyEntry: CompensationFundHistory = {
        date: new Date(),
        operation,
        amount: changeAmount,
        description: updateCompensationFundDto.description || `Изменение суммы фонда с ${fund.amount} до ${updateCompensationFundDto.amount}`,
      };

      updateData.$push = { history: historyEntry };
    }

    const updatedFund = await this.compensationFundModel
      .findByIdAndUpdate((fund as any)._id, updateData, { new: true })
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .exec();

    if (!updatedFund) {
      throw new NotFoundException('Информация о компенсационном фонде не найдена');
    }

    return updatedFund;
  }

  async getHistory(query: HistoryQueryDto) {
    const {
      startDate,
      endDate,
      operation,
      page = 1,
      limit = 10,
    } = query;

    const fund = await this.getFundInfo();
    
    let history = [...fund.history];

    // Фильтрация по дате
    if (startDate) {
      const start = new Date(startDate);
      history = history.filter(entry => entry.date >= start);
    }

    if (endDate) {
      const end = new Date(endDate);
      history = history.filter(entry => entry.date <= end);
    }

    // Фильтрация по операции
    if (operation) {
      history = history.filter(entry => entry.operation === operation);
    }

    // Сортировка по дате (новые сначала)
    history.sort((a, b) => b.date.getTime() - a.date.getTime());

    // Пагинация
    const skip = (page - 1) * limit;
    const paginatedHistory = history.slice(skip, skip + limit);

    return {
      data: paginatedHistory,
      pagination: {
        page,
        limit,
        total: history.length,
        totalPages: Math.ceil(history.length / limit),
      },
    };
  }

  async addHistoryEntry(addHistoryEntryDto: AddHistoryEntryDto, userId: string): Promise<CompensationFund> {
    const fund = await this.getFundInfo();

    const historyEntry: CompensationFundHistory = {
      date: new Date(addHistoryEntryDto.date),
      operation: addHistoryEntryDto.operation,
      amount: addHistoryEntryDto.amount,
      description: addHistoryEntryDto.description,
      documentUrl: addHistoryEntryDto.documentUrl,
    };

    // Обновляем сумму фонда в зависимости от операции
    let newAmount = fund.amount;
    switch (addHistoryEntryDto.operation) {
      case 'increase':
        newAmount += addHistoryEntryDto.amount;
        break;
      case 'decrease':
        newAmount -= addHistoryEntryDto.amount;
        if (newAmount < 0) {
          throw new BadRequestException('Сумма фонда не может быть отрицательной');
        }
        break;
      case 'transfer':
        // Для transfer не изменяем общую сумму, только добавляем запись
        break;
    }

    const updateData: any = {
      amount: newAmount,
      lastUpdated: new Date(),
      updatedBy: new Types.ObjectId(userId),
      $push: { history: historyEntry },
    };

    const updatedFund = await this.compensationFundModel
      .findByIdAndUpdate((fund as any)._id, updateData, { new: true })
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .exec();

    if (!updatedFund) {
      throw new NotFoundException('Информация о компенсационном фонде не найдена');
    }

    return updatedFund;
  }

  async getFundStatistics() {
    const fund = await this.getFundInfo();
    
    const totalIncrease = fund.history
      .filter(entry => entry.operation === 'increase')
      .reduce((sum, entry) => sum + entry.amount, 0);

    const totalDecrease = fund.history
      .filter(entry => entry.operation === 'decrease')
      .reduce((sum, entry) => sum + entry.amount, 0);

    const totalTransfers = fund.history
      .filter(entry => entry.operation === 'transfer')
      .reduce((sum, entry) => sum + entry.amount, 0);

    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    const lastMonthEntries = fund.history.filter(entry => entry.date >= lastMonth);
    const lastMonthIncrease = lastMonthEntries
      .filter(entry => entry.operation === 'increase')
      .reduce((sum, entry) => sum + entry.amount, 0);
    const lastMonthDecrease = lastMonthEntries
      .filter(entry => entry.operation === 'decrease')
      .reduce((sum, entry) => sum + entry.amount, 0);

    return {
      currentAmount: fund.amount,
      currency: fund.currency,
      lastUpdated: fund.lastUpdated,
      totalIncrease,
      totalDecrease,
      totalTransfers,
      lastMonthIncrease,
      lastMonthDecrease,
      totalOperations: fund.history.length,
      lastMonthOperations: lastMonthEntries.length,
    };
  }

  async getRecentHistory(limit: number = 5): Promise<CompensationFundHistory[]> {
    const fund = await this.getFundInfo();
    
    return fund.history
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, limit);
  }
}
