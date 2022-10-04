import { Module } from '@nestjs/common';
import { IncompleteService } from './incomplete.service';
import { IncompleteController } from './incomplete.controller';
import { LogRepository } from '../../repository/log.repository';
import { LoanRepository } from '../../repository/loan.repository';
import { UploadUserDocumentRepository } from '../../repository/userdocumentupload.repository';
import { PaymentscheduleRepository } from '../../repository/paymentschedule.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/repository/users.repository';
import { ConsentMasterRepository } from '../../repository/consentMaster.repository';
import { NotesRepository } from 'src/repository/notes.repository';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      LogRepository,
      PaymentscheduleRepository,
      LoanRepository,
      UploadUserDocumentRepository,
      UserRepository,
      ConsentMasterRepository,
      NotesRepository,
    ]),
  ],
  controllers: [IncompleteController],
  providers: [IncompleteService],
})
export class IncompleteModule {}
