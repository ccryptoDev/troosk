import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { FinicityMockService } from '../pre-bureau/finicity-mock.service';
import { PreBureauService } from '../pre-bureau/pre-bureau.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerRepository } from '../../../repository/customer.repository';
import { LoanRepository } from '../../../repository/loan.repository';
import { CreditPullRepository } from '../../../repository/creditPull.repository';
import { TransunionService } from '../transunion/transunion.service';
import { ConfigModule } from '@nestjs/config';
import transUnionConfig from '../transunion/transunion.config';
import productConfig from '../product/product.config';
import { LogService } from '../../../common/log.service';
import { LogRepository } from '../../../repository/log.repository';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [transUnionConfig, productConfig] }),
    TypeOrmModule.forFeature([
      CustomerRepository,
      LoanRepository,
      CreditPullRepository,
      LogRepository,
    ]),
  ],
  providers: [
    ProductService,
    PreBureauService,
    FinicityMockService,
    TransunionService,
    LogService,
  ],
  exports: [ProductService, TransunionService],
})
export class ProductModule {}
