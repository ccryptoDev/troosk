import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  CreateUploadDto,
  DeleteUploadFileDto,
  AddConsentDto,
} from './dto/create-uploadfile.dto';
import { uploadUserDocument } from '../../entities/uploaduserdocument.entity';
import { UploadUserDocumentRepository } from '../../repository/userdocumentupload.repository';
import { LoanRepository } from '../../repository/loan.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager } from 'typeorm';
import { StatusFlags } from '../../entities/loan.entity';
import { PaymentscheduleRepository } from '../../repository/paymentschedule.repository';
import { PaymentScheduleEntity } from '../../entities/paymentschedule.entity';
import { LogRepository } from '../../repository/log.repository';
import { LogEntity } from '../../entities/log.entity';
import { Flags } from 'src/entities/loan.entity';
import { UserRepository } from '../../repository/users.repository';
import { InjectSendGrid, SendGridService } from '@ntegral/nestjs-sendgrid';
import { MailService } from '../../mail/mail.service';
import { ConsentMasterEntity } from '../../entities/consentMaster.entity';
import { ConsentMasterRepository } from '../../repository/consentMaster.repository';
import { NotesRepository } from 'src/repository/notes.repository';
import { NotesEntity } from 'src/entities/notes.entity';
@Injectable()
export class UploadfilesService {
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
    @InjectSendGrid()
    private readonly client: SendGridService,
    @InjectRepository(ConsentMasterRepository)
    private readonly consentMasterRepository: ConsentMasterRepository,
    @InjectRepository(NotesRepository)
    private readonly notesRepository: NotesRepository,
  ) {}

  async save(files, createUploadDto: CreateUploadDto, exactFileName) {
    try {
      const file = new uploadUserDocument();
      file.orginalfileName = files.originalfileName;
      file.fileName = files.filename;
      file.loan_id = createUploadDto.loan_id;
      file.type = createUploadDto.type;
      file.exactFileName = exactFileName;
      await this.uploadUserDocumentRepository.save(file);
      return { statusCode: 200, data: 'Files will be uploaded successfully' };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getDocument(id) {
    const entityManager = getManager();
    let data: any = {};
    try {
      const rawdata = await entityManager.query(
        `select u."filePath", c."name" ,c."fileName" from "tbluserconsent" u,"tblconsentmaster" c
        where c."fileKey" = u."fileKey" and u."loanId" ='${id}';`,
      );
      data = rawdata;
      return { statusCode: 200, data };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async getUserDocument(id) {
    const entityManager = getManager();
    let data: any = {};
    try {
      const rawdata = await entityManager.query(
        `select "orginalfileName","fileName","type" from tbluseruploaddocument where loan_id = '${id}'`,
      );
      data = rawdata;
      return { statusCode: 200, data };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  // TODO remove if not required
  async pendingStage(createPaymentSchedulerDto) {
    const entityManager = getManager();

    await this.loanRepository.update(
      { id: createPaymentSchedulerDto.loan_id },
      { active_flag: Flags.Y, status_flag: StatusFlags.pending },
    );
    await this.loanRepository.update(
      { id: createPaymentSchedulerDto.loan_id },
      { lastScreen: 'completed' },
    );
    const customerData = await entityManager.query(
      `select * from tblcustomer where loan_id = '${createPaymentSchedulerDto.loan_id}'`,
    );
    const logRawData = await entityManager.query(
      `select user_id from tblloan where id = '${createPaymentSchedulerDto.loan_id}'`,
    );
    const paymentScheduleData = await this.createPaymentSchedule(
      customerData[0].loanAmount,
      customerData[0].apr,
      customerData[0].loanTerm,
      customerData[0].createdAt,
      createPaymentSchedulerDto.loan_id,
    );
    const paymentScheduleCheck = await this.paymentscheduleRepository.find({
      where: {
        loan_id: createPaymentSchedulerDto.loan_id,
      },
    });
    if (paymentScheduleCheck.length === 0) {
      const paymentScheduleArray = [];
      for (let i = 0; i < paymentScheduleData.length; i++) {
        const paymentSchedule = new PaymentScheduleEntity();
        paymentSchedule.loan_id = createPaymentSchedulerDto.loan_id;
        paymentSchedule.unpaidPrincipal =
          paymentScheduleData[i].unpaidPrincipal;
        paymentSchedule.principal = paymentScheduleData[i].principal;
        paymentSchedule.interest = paymentScheduleData[i].interest;
        paymentSchedule.fees = paymentScheduleData[i].fees;
        paymentSchedule.amount = paymentScheduleData[i].amount;
        paymentSchedule.scheduleDate = paymentScheduleData[i].scheduleDate;
        paymentScheduleArray.push(paymentSchedule);
      }
      // const pendingMail = new MailService(this.client); TODO remove
      // pendingMail.mail(createPaymentSchedulerDto.loan_id, 'Pending');
      await this.paymentscheduleRepository.save(paymentScheduleArray);
      await this.userRepository.update(
        { id: logRawData[0].user_id },
        { role: 2, active_flag: Flags.Y },
      );
      const log = new LogEntity();
      log.loan_id = createPaymentSchedulerDto.loan_id;
      log.user_id = logRawData[0].user_id;
      log.module = 'Admin: Payment Scheduler';
      // log.message = 'payment schedule create for this user';
      await this.logRepository.save(log);

      return {
        statusCode: 200,
        data: 'Payment Scheduler will be created successfully',
      };
    }
  }

  // create Payment Schedule
  async createPaymentSchedule(amount, apr, term, createdAt, loanid) {
    const paymentScheduler = [];
    const date = new Date(createdAt);

    let principal = Number(amount);
    const interest = Number(apr) / 100 / 12;
    const payments = Number(term);
    const x = Math.pow(1 + interest, payments);
    let monthly: any = (principal * x * interest) / (x - 1);
    if (
      !isNaN(monthly) &&
      monthly !== Number.POSITIVE_INFINITY &&
      monthly !== Number.NEGATIVE_INFINITY
    ) {
      monthly = Math.round(monthly);
      for (let i = 0; i < payments; i++) {
        const inter = Math.round((principal * Number(apr)) / 1200);
        const pri = Math.round(monthly - inter);
        paymentScheduler.push({
          loan_id: loanid,
          unpaidPrincipal: principal,
          principal: pri,
          interest: inter,
          fees: 0,
          amount: monthly,
          scheduleDate: (() => {
            return new Date(
              new Date(createdAt).setMonth(
                new Date(createdAt).getMonth() + (i + 1),
              ),
            )
              .toISOString()
              .substring(0, 10);
          })(),
        });
        principal = Math.round(principal - pri);
      }
    }
    return paymentScheduler;
  }

  // *  Payment Schedule Api
  async getPaymentSchedule(id) {
    const entityManager = getManager();
    let data: any = {};
    try {
      const rawdata = await entityManager.query(
        `select "unpaidPrincipal","principal","interest","fees","amount","scheduleDate" from tblpaymentschedule where loan_id = '${id}'`,
      );
      data = rawdata;
      return { statusCode: 200, data };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async deleteUploadFile(loan_id, deleteUploadFileDto: DeleteUploadFileDto) {
    try {
      await this.uploadUserDocumentRepository.delete({
        loan_id,
        fileName: deleteUploadFileDto.fileName,
        type: deleteUploadFileDto.type,
      });
      return {
        statusCode: 200,
        message: ['success'],
        data: 'User upload files deleted successfully',
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }
  async addConsent(country, addConsentDto: AddConsentDto) {
    const entityManager = getManager();
    try {
      const consentData = [];
      for (let i = 0; i < addConsentDto.consent.length; i++) {
        const consent = new ConsentMasterEntity();
        consent.fileName = addConsentDto.consent[i].title;
        consent.name = addConsentDto.consent[i].text;
        consent.country = country;
        consentData.push(consent);
      }
      await this.consentMasterRepository.save(consentData);
      return {
        statusCode: 200,
        data: 'User Consent Files Successfully added.',
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async addNotes(country, addConsentDto: AddConsentDto) {
    const entityManager = getManager();
    try {
      const consentData = [];
      for (let i = 0; i < addConsentDto.consent.length; i++) {
        const consent = new NotesEntity();
        consent.fileName = addConsentDto.consent[i].title;
        consent.name = addConsentDto.consent[i].text;
        consent.country = country;
        consentData.push(consent);
      }
      await this.notesRepository.save(consentData);
      return {
        statusCode: 200,
        data: 'Notes has been Successfully added.',
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getConsentFiles(country) {
    try {
      const getConsentFiles = await getManager()
        .query(`select t."fileName" ,t."name" from tblconsentmaster t where t.country = '${country}'
      `);
      return {
        statusCode: 200,
        data: getConsentFiles,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getNotes(country) {
    try {
      const getConsentFiles = await getManager()
        .query(`select t."fileName", t."name" from tblnotes t where t.country = '${country}'
      `);
      return {
        statusCode: 200,
        data: getConsentFiles,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
