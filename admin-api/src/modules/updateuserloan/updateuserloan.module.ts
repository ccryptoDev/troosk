import { Module } from '@nestjs/common';
import { UpdateuserloanService } from './updateuserloan.service';
import { UpdateuserloanController } from './updateuserloan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerRepository } from '../../repository/customer.repository';
import { UserRepository } from '../../repository/users.repository';
import { LoanRepository } from 'src/repository/loan.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CustomerRepository,
      UserRepository,
      LoanRepository,
    ]),
  ],
  controllers: [UpdateuserloanController],
  providers: [UpdateuserloanService],
})
export class UpdateuserloanModule {}
