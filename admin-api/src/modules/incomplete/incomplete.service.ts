import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { getManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentscheduleRepository } from '../../repository/paymentschedule.repository';
import { LogRepository } from '../../repository/log.repository';
import { LoanRepository } from '../../repository/loan.repository';
import { UploadUserDocumentRepository } from '../../repository/userdocumentupload.repository';
import { UploadfilesService } from '../uploadfiles/uploadfiles.service';
import { InjectSendGrid, SendGridService } from '@ntegral/nestjs-sendgrid';
import { UserRepository } from 'src/repository/users.repository';
import { ConsentMasterRepository } from '../../repository/consentMaster.repository';
import { NotesRepository } from 'src/repository/notes.repository';

@Injectable()
export class IncompleteService {
  constructor(
    @InjectRepository(UploadUserDocumentRepository)
    private readonly uploadUserDocumentRepository: UploadUserDocumentRepository,
    @InjectRepository(LoanRepository)
    private readonly loanRepository: LoanRepository,
    @InjectRepository(PaymentscheduleRepository)
    private readonly paymentscheduleRepository: PaymentscheduleRepository,
    @InjectRepository(LogRepository)
    private readonly logRepository: LogRepository,
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectSendGrid() private readonly client: SendGridService,
    @InjectRepository(ConsentMasterRepository)
    private readonly consentMasterRepository: ConsentMasterRepository,
    @InjectRepository(NotesRepository)
    private readonly notesRepository: NotesRepository,
  ) {}
  async get() {
    const entityManager = getManager();
    try {
      const rawData = await entityManager.query(`select t.id as loan_id, t.ref_no as loan_ref, t2.email as email, t2.ref_no as user_ref, t2."firstName" as firstName, t2."lastName" as lastName
            from tblloan t join tbluser t2 on t2.id = t.user_id where t.delete_flag = 'N' and t.active_flag = 'N' and t.status_flag = 'waiting' order by t."createdAt" desc `);
      return { statusCode: 200, data: rawData };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async getdetails(id) {
    const entityManager = getManager();
    const viewDocument = new UploadfilesService(
      this.uploadUserDocumentRepository,
      this.loanRepository,
      this.paymentscheduleRepository,
      this.logRepository,
      this.userRepository,
      this.client,
      this.consentMasterRepository,
      this.notesRepository,
    );
    try {
      const rawData = await entityManager.query(
        `select count(*) as count from tblloan where delete_flag = 'N' and active_flag = 'N' and status_flag = 'waiting' and ` +
          "id = '" +
          id +
          "'",
      );
      if (rawData[0]['count'] > 0) {
        const data = {};
        // data['answers'] = await entityManager.query(
        //   "select t.answer as answer, t2.question as question from tblanswer t join tblquestion t2 on t2.id= t.question_id where loan_id = '" +
        //     id +
        //     "'",
        // );

        // data['answers'] = [];
        data['from_details'] = await entityManager.query(
          "select t.*, t2.ref_no as user_ref from tblcustomer t join tbluser t2  on t2.id = t.user_id where t.loan_id = '" +
            id +
            "'",
        );
        // if (data['from_details'][0]['isCoApplicant']) {
        //   data['CoApplicant'] = await entityManager.query(
        //     "select * from tblcoapplication where id = '" +
        //       data['from_details'][0]['coapplican_id'] +
        //       "'",
        //   );
        // } else {
        //   data['CoApplicant'] = [];
        // }
        // data['files'] = await entityManager.query(
        //   "select originalname,filename from tblfiles where link_id = '" +
        //     id +
        //     "'",
        // );
        // data['paymentScheduleDetails'] = await entityManager.query(
        //   `select * from tblpaymentschedule where loan_id = '${id}'  order by "scheduleDate" asc`,
        // );
        data['document'] = await (await viewDocument.getDocument(id)).data;
        data['userDocument'] = await (await viewDocument.getUserDocument(id))
          .data;
        return { statusCode: 200, data };
      } else {
        return {
          statusCode: 500,
          message: ['This Loan Id Not Exists'],
          error: 'Bad Request',
        };
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
