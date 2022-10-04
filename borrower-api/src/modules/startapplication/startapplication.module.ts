import { Module } from '@nestjs/common';
import { StartapplicationService } from './startapplication.service';
import { StartapplicationController } from './startapplication.controller';
import { LoanRepository } from '../../repository/loan.repository';
import { UserRepository } from '../../repository/users.repository';
import { CustomerRepository } from '../../repository/customer.repository';
import { UserConsentRepository } from '../../repository/userConsent.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortalRepository } from '../../repository/portal.repository';
import { PagesRepository } from '../../repository/page.repository';
import { PagetabsRepository } from '../../repository/pagetab.repository';
import { OtpRepository } from 'src/repository/otp.repository';
import { MailService } from '../../mail/mail.service';
import { MaillogRepository } from '../../repository/maillog.repository';
import { LogService } from '../../common/log.service';
import { LogRepository } from '../../repository/log.repository';
import { CustomerHistoryRepository } from '../../repository/customer-history.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      LoanRepository,
      CustomerRepository,
      CustomerHistoryRepository,
      UserConsentRepository,
      PortalRepository,
      PagesRepository,
      PagetabsRepository,
      OtpRepository,
      MaillogRepository,
      LogRepository,
    ]),
  ],
  controllers: [StartapplicationController],
  exports: [StartapplicationService],
  providers: [StartapplicationService, MailService, LogService],
})
export class StartapplicationModule {}
