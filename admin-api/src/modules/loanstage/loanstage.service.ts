import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EntityManager, getManager } from 'typeorm';
import { LoanRepository } from '../../repository/loan.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { commonService } from '../../common/helper-service';
import { LogRepository } from '../../repository/log.repository';
import { UploadUserDocumentRepository } from '../../repository/userdocumentupload.repository';
import { PaymentscheduleRepository } from '../../repository/paymentschedule.repository';
import { InjectSendGrid, SendGridService } from '@ntegral/nestjs-sendgrid';
import { UploadfilesService } from '../uploadfiles/uploadfiles.service';
import {
  UpdateUserLoanAmount,
  createPaymentSchedulerDto,
  manualBankAddDto,
} from '../loanstage/dto/update-loanstage.dto';
import { CustomerRepository } from '../../repository/customer.repository';
import { PaymentScheduleEntity } from '../../entities/paymentschedule.entity';
import { PaymentcalculationService } from '../../paymentcalculation/paymentcalculation.service';
import { UserRepository } from 'src/repository/users.repository';
import { LogEntity } from 'src/entities/log.entity';
// import { UserBankAccountRepository } from 'src/repository/userBankAccounts.repository';
// import { UserBankAccount } from '../../entities/userBankAccount.entity';
import { ConsentMasterRepository } from 'src/repository/consentMaster.repository';
import { Flags, Loan, StatusFlags } from 'src/entities/loan.entity';
import { NotesRepository } from 'src/repository/notes.repository';
import { Responses } from '../../common/responses';

@Injectable()
export class LoanstageService {
  constructor(
    @InjectRepository(LoanRepository)
    private readonly loanRepository: LoanRepository,
    @InjectRepository(LogRepository)
    private readonly logRepository: LogRepository,
    @InjectRepository(UploadUserDocumentRepository)
    private readonly uploadUserDocumentRepository: UploadUserDocumentRepository,
    @InjectRepository(PaymentscheduleRepository)
    private readonly paymentscheduleRepository: PaymentscheduleRepository,
    @InjectRepository(CustomerRepository)
    private readonly customerRepository: CustomerRepository,
    // TODO: remove after confirmation
    // @InjectRepository(UserBankAccountRepository)
    // private readonly userBankAccountRepository: UserBankAccountRepository,
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectSendGrid() private readonly client: SendGridService,
    @InjectRepository(ConsentMasterRepository)
    private readonly consentMasterRepository: ConsentMasterRepository,
    @InjectRepository(NotesRepository)
    private readonly notesRepository: NotesRepository,
  ) {}
  async getAllCustomerDetails(stage) {
    const entityManager = getManager();
    try {
      let customerDetails = '';
      if (stage === 'waiting') {
        customerDetails = await entityManager.query(`select t.id as loan_id, t.user_id as user_id, t.ref_no as loan_ref, t2.email as email, t."createdAt" , t2.ref_no as user_ref, t2."firstName" as firstName, t2."lastName" as lastName
      from tblloan t join tbluser t2 on t2.id = t.user_id where t.delete_flag = 'N' and t.status_flag = '${stage}' order by t."createdAt" desc `);
      } else {
        customerDetails = await entityManager.query(`select t.id as loan_id, t.user_id as user_id, t.ref_no as loan_ref, t2.email as email, t."createdAt" , t2.ref_no as user_ref, t2."firstName" as firstName, t2."lastName" as lastName
      from tblloan t join tbluser t2 on t2.id = t.user_id where t.delete_flag = 'N' and t.status_flag = '${stage}' order by t."createdAt" desc `);
      }

      return { statusCode: 200, data: customerDetails };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  // Get A Particular Customer Details
  async getACustomerDetails(id, stage) {
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
    const entityManager = getManager();
    try {
      const loan = await this.loanRepository.findOne({
        where: {
          delete_flag: Flags.N,
          status_flag: stage,
        },
      });

      if (loan) {
        const customer = await this.customerRepository.findOne({
          where: { loan_id: id },
        });
        const user = await this.userRepository.findOne({
          where: { id: customer.user_id },
        });
        const data = {
          stage,
          from_details: [
            {
              ...loan,
              ...user,
              ...customer,
              user_ref: user.ref_no,
              loanAmount: loan.actualLoanAmount,
            },
          ],
        };

        if (data['from_details'][0]['isCoApplicant']) {
          data['CoApplicant'] = await entityManager.query(
            "select * from tblcoapplication where id = '" +
              data['from_details'][0]['coapplican_id'] +
              "'",
          );
        } else {
          data['CoApplicant'] = [];
        }

        data['files'] = await entityManager.query(
          "select originalname, filename from tblfiles where link_id = '" +
            id +
            "'",
        );
        data['paymentScheduleDetails'] = await entityManager.query(
          `select * from tblpaymentschedule where loan_id = '${id}'  order by "scheduleDate" asc`,
        );
        data['document'] = await (await viewDocument.getDocument(id)).data;
        data['userDocument'] = await (await viewDocument.getUserDocument(id))
          .data;

        return Responses.success(null, data);
      } else {
        throw new NotFoundException('This Loan Id Not Exists');
      }
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new InternalServerErrorException(e);
    }
  }

  async getALogs(id) {
    const entityManager = getManager();
    try {
      const logData = await entityManager.query(
        `select CONCAT ('LOG_',t.id) as id, t.module as module, concat(t2.email,' - ',INITCAP(t2."role"::text)) as user, t."createdAt" as createdAt from tbllog t join tbluser t2 on t2.id = t.user_id  where t.loan_id = '${id}' order by t."createdAt" desc;`,
      );
      // console.log(rawData)
      return { statusCode: 200, data: logData };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async tshirtDetails(loan_id, tshirtDto) {
    try {
      const size = new Loan();
      (size.size = tshirtDto.size), (size.gender = tshirtDto.gender);
      await this.loanRepository.update({ id: loan_id }, size);
      return {
        statusCode: 200,
        data: 'yooHH..!!! U won the legacy',
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async movedToNextStage(id, nextStage) {
    try {
      await this.loanRepository.update(
        { id },
        { status_flag: nextStage.stage },
      );
      return { statusCode: 200, data: 'Loan Details Updated succesfully ' };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async editCustomerLoanAmountDetails(
    id,
    updateUserLoanAmount: UpdateUserLoanAmount,
  ) {
    const entityManager = getManager();
    try {
      const paymentDetails = await entityManager.query(
        `SELECT * FROM tblpaymentschedule where loan_id ='${id}' order by "scheduleDate" ASC`,
      );
      const currentDate = new Date();
      if (paymentDetails[0].scheduleDate < currentDate) {
        return {
          statusCode: 400,
          message: "First payment schedule is started. So you can't reschedule",
          error: 'Bad Request',
        };
      }
      const ps = new PaymentcalculationService();
      const getRealAPR = ps.findPaymentAmountWithOrigination(
        updateUserLoanAmount.loanAmount,
        updateUserLoanAmount.apr,
        updateUserLoanAmount.duration,
        updateUserLoanAmount.orginationFee,
      );
      //  TODO double check we need this
      // await this.customerRepository.update(
      //   { loan_id: id },
      //   {
      //     loanAmount: updateUserLoanAmount.loanAmount,
      //     apr: updateUserLoanAmount.apr,
      //     loanTerm: updateUserLoanAmount.duration,
      //     orginationFees: updateUserLoanAmount.orginationFee,
      //     newAPR: getRealAPR.realAPR,
      //   }, `
      // );
      const paymentFrequency = await entityManager.query(
        `SELECT "payFrequency" FROM tblcustomer where loan_id = '${id}'`,
      );
      const PaymentReschedule = {};
      PaymentReschedule['loan_id'] = id;
      PaymentReschedule['paymentFrequency'] = paymentFrequency[0].payFrequency;
      PaymentReschedule['date'] = paymentDetails[0].scheduleDate;
      await this.paymentRescheduler(PaymentReschedule);
      return { statusCode: 200, data: 'Update user loan details successfully' };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // tslint:disable-next-line:no-shadowed-variable
  async paymentRescheduler(createPaymentSchedulerDto) {
    const entityManager = getManager();
    try {
      const customerData = await entityManager.query(
        `select * from tblcustomer where loan_id = '${createPaymentSchedulerDto.loan_id}'`,
      );
      const getLoanStatus = await entityManager.query(
        `select "status_flag" from tblloan where id = '${createPaymentSchedulerDto.loan_id}'`,
      );
      if (
        getLoanStatus[0].status_flag === 'performingcontract' ||
        getLoanStatus[0].status_flag === 'approved'
      ) {
        return {
          statusCode: 400,
          message: 'you cant"t do payment reschedule at this satge',
          error: 'Bad Request',
        };
      }
      const futureDate = new Date(createPaymentSchedulerDto.date);
      const currentDate = new Date();
      if (currentDate > futureDate) {
        return {
          statusCode: 400,
          message: 'your date should be greater than today date',
          error: 'Bad Request',
        };
      }
      const pc = new PaymentcalculationService();
      const getPaymentReschedulerData = pc.createPaymentReScheduler(
        customerData[0].loanAmount,
        customerData[0].apr,
        customerData[0].loanTerm,
        futureDate,
        createPaymentSchedulerDto.paymentFrequency,
        createPaymentSchedulerDto.loan_id,
      );
      const getPaymentScheduleData = await this.paymentscheduleRepository.find({
        loan_id: createPaymentSchedulerDto.loan_id,
      });
      if (getPaymentScheduleData.length > 1) {
        const paymentScheduleArray = [];
        for (let i = 0; i < getPaymentReschedulerData.length; i++) {
          const paymentschedule = new PaymentScheduleEntity();
          paymentschedule.loan_id = createPaymentSchedulerDto.loan_id;
          paymentschedule.unpaidPrincipal =
            getPaymentReschedulerData[i].unpaidPrincipal;
          paymentschedule.principal = getPaymentReschedulerData[i].principal;
          paymentschedule.interest = getPaymentReschedulerData[i].interest;
          paymentschedule.fees = getPaymentReschedulerData[i].fees;
          paymentschedule.amount = getPaymentReschedulerData[i].amount;
          paymentschedule.scheduleDate =
            getPaymentReschedulerData[i].scheduleDate;
          paymentScheduleArray.push(paymentschedule);
        }
        await this.paymentscheduleRepository.delete({
          loan_id: createPaymentSchedulerDto.loan_id,
        });
        await this.paymentscheduleRepository.save(paymentScheduleArray);
        await this.customerRepository.update(
          { loan_id: createPaymentSchedulerDto.loan_id },
          {
            // payFrequency: createPaymentSchedulerDto.paymentFrequency,
          },
        );
      }
      return {
        statusCode: 200,
        data: 'Payment Rescheduler Data updated Successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // TODO: remove after confirmation
  // tslint:disable-next-line:no-shadowed-variable
  // async manualBankAdd(manualBankAddDto: manualBankAddDto) {
  //   try {
  //     const userBankAccount = new UserBankAccount();
  //     userBankAccount.bankName = manualBankAddDto.bankName;
  //     userBankAccount.holderName = manualBankAddDto.holderName;
  //     userBankAccount.routingNumber = manualBankAddDto.routingNumber;
  //     userBankAccount.accountNumber = manualBankAddDto.accountNumber;
  //     userBankAccount.user_id = manualBankAddDto.user_id;
  //
  //     await this.userBankAccountRepository.save(userBankAccount);
  //     return {
  //       statusCode: 200,
  //       data: 'User Bank account details  will be added successfully',
  //     };
  //   } catch (error) {
  //     return {
  //       statusCode: 500,
  //       message: [new InternalServerErrorException(error)['response']['name']],
  //       error: 'Bad Request',
  //     };
  //   }
  // }

  async creditcardverify(loan_id, isVerified) {
    try {
      if (isVerified === 'true') {
        await this.loanRepository.update(
          {
            id: loan_id,
          },
          {
            creditcard_Verified: Flags.Y,
          },
        );
        return {
          statusCode: 200,
          message: 'Your Credit Card has been succesfully verified...!!!',
        };
      } else {
        return {
          statuscode: 200,
          message: 'Your Credit Card was not verified..!!!',
        };
      }
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
}
