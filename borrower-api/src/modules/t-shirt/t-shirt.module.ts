import { Module } from '@nestjs/common';
import { TShirtController } from './t-shirt.controller';
import { TShirtService } from './t-shirt.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoanRepository } from '../../repository/loan.repository';

@Module({
  imports: [TypeOrmModule.forFeature([LoanRepository])],
  controllers: [TShirtController],
  providers: [TShirtService],
})
export class TShirtModule {}
