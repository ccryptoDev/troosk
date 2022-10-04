import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { getManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LoanRepository } from '../../repository/loan.repository';
import { Flags, StatusFlags } from '../../entities/loan.entity';
import { CustomerRepository } from '../../repository/customer.repository';
import moment from 'moment';
import { BankAccountsRepository } from '../../repository/bankAccount.repository';
import { HttpService } from '@nestjs/axios';
import { TransactionRepository } from '../../repository/transaction.repository';
import { method } from '../../entities/transaction.entity';
import { BalanceStatementRepository } from '../../repository/balance-statement.repository';
import { BalanceStatement } from '../../entities/balanceStatement.entity';
import { Responses } from '../../common/responses';

@Injectable()
export class ApprovedService {
  constructor(
    @InjectRepository(LoanRepository) private loanRepository: LoanRepository,
    @InjectRepository(CustomerRepository)
    private customerRepository: CustomerRepository,
    @InjectRepository(BankAccountsRepository)
    private bankAccountRepository: BankAccountsRepository,
    @InjectRepository(TransactionRepository)
    private transactionRepository: TransactionRepository,
    @InjectRepository(BalanceStatementRepository)
    private balanceStatementRepository: BalanceStatementRepository,
    private httpService: HttpService,
  ) {}

  async get() {
    const entityManager = getManager();
    try {
      const rawData = await entityManager.query(`select t.id as loan_id, t.user_id as user_id, t.ref_no as loan_ref, t2.email as email, t2.ref_no as user_ref, t2."firstName" as firstName, t2."lastName" as lastName
            from tblloan t join tbluser t2 on t2.id = t.user_id where t.delete_flag = 'N' and t.active_flag = 'Y' and t.status_flag = 'approved' order by t."createdAt" desc `);

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
    try {
      const rawData = await entityManager.query(
        `select count(*) as count from tblloan where delete_flag = 'N' and active_flag = 'Y' and status_flag = 'approved' and ` +
          "id = '" +
          id +
          "'",
      );
      if (rawData[0]['count'] > 0) {
        const data = {};
        // data['answers'] = await entityManager.query("select t.answer as answer, t2.question as question from tblanswer t join tblquestion t2 on t2.id= t.question_id where loan_id = '"+id+"'")
        data['from_details'] = await entityManager.query(
          "select t.*, t2.ref_no as user_ref from tblcustomer t join tbluser t2  on t2.id = t.user_id where t.loan_id = '" +
            id +
            "'",
        );
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
          "select originalname,filename from tblfiles where link_id = '" +
            id +
            "'",
        );
        data['paymentScheduleDetails'] = await entityManager.query(
          `select * from tblpaymentschedule where loan_id = '${id}'  order by "scheduleDate" asc`,
        );
        return { statusCode: 200, data };
      } else {
        return {
          statusCode: 500,
          message: ['This Loan Id Not Exists'],
          error: 'Bad Request',
        };
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async getlogs(id) {
    const entityManager = getManager();
    try {
      const rawData = await entityManager.query(
        `select CONCAT ('LOG_',t.id) as id, t.module as module, concat(t2.email,' - ',INITCAP(t2."role"::text)) as user, t."createdAt" as createdAt from tbllog t join tbluser t2 on t2.id = t.user_id  where t.loan_id = '${id}' order by t."createdAt" desc;`,
      );
      return { statusCode: HttpStatus.OK, data: rawData };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async setActive(id) {
    try {
      const loanDetails = await this.loanRepository.findOne({
        where: {
          delete_flag: Flags.N,
          active_flag: Flags.Y,
          status_flag: StatusFlags.approved,
          id,
        },
      });

      if (loanDetails) {
        // Get Cutsomer details
        const customerData = await this.customerRepository.findOne({
          where: { id: loanDetails.customer_id },
        });

        if (!customerData) {
          return Responses.validationError('This Loan Id Not Exists');
        }

        // TODO doublecheck this still a requirment
        // const cDate = moment().valueOf();
        // const nextPayDate = moment(customerData.nextPaymentDate).valueOf();
        // const twoDays = 86400 * 1000 * 2;
        //
        // if (nextPayDate - cDate <= twoDays) {
        //   return Responses.validationError(
        //     'Payment date is within 2 days of current date',
        //   );
        // }

        const date = new Date(); // TODO set from amortization

        // Get bank account -> checking
        const bankAc = await this.bankAccountRepository.findOne({
          where: { loan_id: id, default: 'Y' },
        });

        if (!bankAc) {
          return Responses.validationError('No Default Bank Account Selected');
        }

        date.setDate(date.getDate() + 1);

        const amount = loanDetails.actualLoanAmount;

        const payload = {
          amount,
          convenience_amount: 0,
          check_type: 'PERSONAL',
          account_number: bankAc.accountNumber.toString(),
          transit_number: bankAc.routingNumber.toString(),
          account_type: 'CHECKING',
          sec_code: 'PPD',
          name_on_check: customerData.fullName,
          customer_id: 'LON_' + loanDetails.ref_no,
          phone_number: customerData.phone,
          email: customerData.email,
          force_duplicate: true,
          invoice_duplicate: true,
        };

        // Disperse the amount with REPAY
        let response;
        try {
          response = await this.httpService
            .post(
              `${process.env.REPAY_ENDPOINT}transactions/ach/credit`,
              payload,
              {
                headers: {
                  'rg-api-secure-token': process.env.REPAY_SECURE_TOKEN,
                  'rg-api-user': process.env.REPAY_USERNAME,
                },
              },
            )
            .toPromise();
        } catch (err) {
          return Responses.validationError(err.response.data.message);
        }

        const data = response.data;

        // Save transaction
        const inserted = await this.transactionRepository.insert({
          loan_id: id,
          amount: data.amount || data.auth_amount,
          status: data.status || data.result_text,
          date: moment().format(moment.HTML5_FMT.DATE),
          repayPaymentType: data.trans_type_id,
          transactionId: data.transaction_id,
          merchantId: data.merchant_id,
          merchantName: data.merchant_name,
          secCode: data.sec_code || null,
          links: data.links,
          effectiveDate: data.effective_date || null,
          accountMethod: method.ACH,
          account_id: bankAc.id,
          payStatus: 'Settled',
          repay_data: data,
        });

        const bs = new BalanceStatement();
        bs.credit = Number(loanDetails.actualLoanAmount);
        bs.balance = Number(loanDetails.actualLoanAmount);
        bs.loan_id = id;
        bs.user_id = loanDetails.user_id;
        bs.transaction = `Advance of credit limit`;
        bs.transaction_id = inserted.raw[0].id;
        bs.transaction_type = 'Disbursement';
        bs.unpaid_principal = Number(loanDetails.actualLoanAmount);
        bs.date = new Date();
        bs.type = 'Disbursement';
        bs.processed_date = moment().format(moment.HTML5_FMT.DATE);
        await this.balanceStatementRepository.save(bs);

        await this.loanRepository.update(
          { id },
          { status_flag: StatusFlags.active },
        );

        return {
          statusCode: HttpStatus.OK,
          data,
        };
      } else {
        return Responses.validationError('This Loan Id Not Exists');
      }
    } catch (error) {
      return Responses.fatalError(error);
    }
  }
}
