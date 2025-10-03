import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompensationFundController } from './compensation-fund.controller';
import { CompensationFundService } from './compensation-fund.service';
import { CompensationFund, CompensationFundSchema } from '@/database/schemas/compensation-fund.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CompensationFund.name, schema: CompensationFundSchema },
    ]),
  ],
  controllers: [CompensationFundController],
  providers: [CompensationFundService],
  exports: [CompensationFundService],
})
export class CompensationFundModule {}
