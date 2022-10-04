import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Any, getManager } from 'typeorm';
import { CustomerRepository } from '../../repository/customer.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserName } from '../review/dto/update-review.dto';
import * as bcrypt from 'bcrypt';
import { UploadfilesService } from '../../modules/uploadfiles/uploadfiles.service';
import { PaymentcalculationService } from '../../paymentcalculation/paymentcalculation.service';
import { LogRepository } from '../../repository/log.repository';
import { LoanRepository } from '../../repository/loan.repository';
import { UploadUserDocumentRepository } from '../../repository/userdocumentupload.repository';
import { PaymentscheduleRepository } from '../../repository/paymentschedule.repository';
import { InjectSendGrid, SendGridService } from '@ntegral/nestjs-sendgrid';
import { LogEntity } from '../../entities/log.entity';
import { groupBy } from 'rxjs/operators';
import { commonService } from '../../common/helper-service';
import { UserRepository } from 'src/repository/users.repository';
import { ConsentMasterRepository } from 'src/repository/consentMaster.repository';
import { NotesRepository } from 'src/repository/notes.repository';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(CustomerRepository)
    private readonly customerRepository: CustomerRepository,
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
  async getDetails(id) {
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
        `select count(*) as count , "lastScreen", "active_flag", "status_flag" from tblloan where delete_flag = 'N' and
         id = '${id}' group by "lastScreen", "active_flag", "status_flag"`,
      );
      if (rawData[0]['count'] > 0) {
        const data = {};
        if (
          rawData[0]['active_flag'] === 'N' &&
          rawData[0]['status_flag'] === 'waiting'
        ) {
          data['from_details'] = await entityManager.query(
            "select t.*, t2.ref_no as user_ref from tblcustomer t join tbluser t2  on t2.id = t.user_id where t.loan_id = '" +
              id +
              "'",
          );
          data['document'] = await (await viewDocument.getDocument(id)).data;
          data['userDocument'] = await (await viewDocument.getUserDocument(id))
            .data;
        }
        data['lastScreen'] = rawData[0].lastScreen;
        return { statusCode: 200, data };
      } else {
        return { statusCode: 403, data: [], message: "Don't have permission" };
      }
    } catch (e) {
      return new InternalServerErrorException(e);
    }
  }

  async updateUserDetails(id, updateUserName: UpdateUserName, ip) {
    try {
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(updateUserName.password, salt);
      const entityManager = getManager();
      const logRawData = await entityManager.query(
        `select user_id from tblloan where id = '${id}'`,
      );
      function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/;
        return re.test(String(email).toLowerCase());
      }
      if (!validateEmail(updateUserName.email)) {
        return {
          statusCode: 400,
          message: 'Please provide a valid email address',
          error: 'Bad Request',
        };
      }
      await this.customerRepository.update(
        { loan_id: id },
        {
          firstName: updateUserName.firstName,
          middleName: updateUserName.middleName,
          lastName: updateUserName.lastName,
          phone: updateUserName.phoneno,
          email: updateUserName.email,
          streetAddress: updateUserName.streetAddress,
          city: updateUserName.city,
          unit: updateUserName.unit,
        },
      );
      await this.userRepository.update(
        { id: logRawData[0].user_id },
        {
          password: hashPassword,
          salt,
        },
      );
      await this.loanRepository.update({ id }, { lastScreen: 'loan' });
      const cs = new commonService(this.logRepository);
      cs.addLogs(id, 'Update Customer Details ' + ' ' + ip);
      return { statusCode: 200, data: 'User data saved sucessfully' };
    } catch (error) {
      const errorMessage = error.name + '   ' + error.message;
      const cs = new commonService(this.logRepository);
      cs.errorLogs(id, 'Update Customer Details ' + ' ' + ip, errorMessage);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async selectLoan(id, ip) {
    try {
      await this.loanRepository.update({ id }, { lastScreen: 'bank' });
      const cs = new commonService(this.logRepository);
      cs.addLogs(id, 'Update Loan Details ' + ' ' + ip);
      return { statusCode: 200 };
    } catch (error) {
      const errorMessage = error.name + '   ' + error.message;
      const cs = new commonService(this.logRepository);
      cs.errorLogs(id, 'Update Customer Details ' + ' ' + ip, errorMessage);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async bankManual(id, ip) {
    try {
      this.loanRepository.update({ id }, { lastScreen: 'document' });
      const cs = new commonService(this.logRepository);
      cs.addLogs(id, 'Update Bank Details ' + ' ' + ip);
      return { statusCode: 200 };
    } catch (error) {
      const errorMessage = error.name + '   ' + error.message;
      const cs = new commonService(this.logRepository);
      cs.errorLogs(id, 'Update Bank Details ' + ' ' + ip, errorMessage);
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }
}
