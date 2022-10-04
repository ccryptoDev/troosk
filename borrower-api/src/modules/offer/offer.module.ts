import { Module } from '@nestjs/common';
import { OfferController } from './offer.controller';
import { OfferService } from './offer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerRepository } from '../../repository/customer.repository';
import { LoanRepository } from '../../repository/loan.repository';
import { UserBankAccountRepository } from '../../repository/user-bank-account.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CustomerRepository,
      UserBankAccountRepository,
      LoanRepository,
    ]),
  ],
  controllers: [OfferController],
  providers: [OfferService],
})
export class OfferModule {}
