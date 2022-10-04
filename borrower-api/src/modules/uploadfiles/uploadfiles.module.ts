import { Module } from '@nestjs/common';
import { UploadfilesService } from './uploadfiles.service';
import { UploadfilesController } from './uploadfiles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsentMasterRepository } from '../../repository/consentMaster.repository';
import { NotesRepository } from 'src/repository/notes.repository';
import { FaqRepository } from '../../repository/faq.repository';
import { CustomerRepository } from '../../repository/customer.repository';
import { LoanRepository } from '../../repository/loan.repository';
import { UploadUserDocumentRepository } from '../../repository/userdocumentupload.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ConsentMasterRepository,
      NotesRepository,
      FaqRepository,
      CustomerRepository,
      UploadUserDocumentRepository,
      LoanRepository,
    ]),
  ],
  controllers: [UploadfilesController],
  providers: [UploadfilesService],
})
export class UploadfilesModule {}
