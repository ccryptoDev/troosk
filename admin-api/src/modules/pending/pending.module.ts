import { ConsentMasterRepository } from './../../repository/consentMaster.repository';
import { Module } from '@nestjs/common';
import { PendingService } from './pending.service';
import { PendingController } from './pending.controller';
// import { UserBankAccountRepository } from '../../repository/userBankAccounts.repository';
import { UserRepository } from '../../repository/users.repository';
import { CommentsRepository } from '../../repository/comments.repository';
import { LogRepository } from '../../repository/log.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailService } from '../../mail/mail.service';
import { PaymentscheduleRepository } from '../../repository/paymentschedule.repository';
import { LoanRepository } from '../../repository/loan.repository';
import { UploadUserDocumentRepository } from '../../repository/userdocumentupload.repository';
import { userConsentRepository } from '../../repository/userConsent.repository';
import { NotesRepository } from 'src/repository/notes.repository';
import { MaillogRepository } from 'src/repository/maillog.repository';
import { CustomerRepository } from '../../repository/customer.repository';

@Module({
  controllers: [PendingController],
  imports: [
    TypeOrmModule.forFeature([
      MaillogRepository,
      // TODO: remove after confirmation
      // UserBankAccountRepository,
      UserRepository,
      CommentsRepository,
      LogRepository,
      PaymentscheduleRepository,
      CustomerRepository,
      LoanRepository,
      UploadUserDocumentRepository,
      userConsentRepository,
      ConsentMasterRepository,
      NotesRepository,
    ]),
  ],
  exports: [PendingService],
  providers: [PendingService, MailService],
})
export class PendingModule {}
