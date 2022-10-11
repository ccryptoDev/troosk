import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Flags, Loan, StatusFlags, Verify } from '../../entities/loan.entity';
import { LoanRepository } from '../../repository/loan.repository';
import {
  OtpCreadentialsDto,
  StartApplication,
} from './dto/startApplication.dto';
import { UserRepository } from '../../repository/users.repository';
import { UserConsentRepository } from '../../repository/userConsent.repository';
import { CustomerRepository } from '../../repository/customer.repository';
import { UserEntity } from '../../entities/users.entity';
import { CustomerEntity } from '../../entities/customer.entity';
import * as bcrypt from 'bcrypt';
import { MailService } from '../../mail/mail.service';
import { InjectSendGrid, SendGridService } from '@ntegral/nestjs-sendgrid';
import { MoreThan } from 'typeorm';
import { MaillogRepository } from '../../repository/maillog.repository';
import { InjectTwilio, TwilioClient } from 'nestjs-twilio';
import { Responses } from '../../common/responses';
import { LastScreenModel } from '../../common/last-screen.model';
import { LogService } from '../../common/log.service';
import * as moment from 'moment';
import {
  CustomerHistoryRepository,
} from '../../repository/customer-history.repository';

@Injectable()
export class StartapplicationService {
  constructor(
    @InjectTwilio() private readonly client: TwilioClient,
    @InjectRepository(UserConsentRepository)
    private readonly userConsentRepository: UserConsentRepository,
    @InjectRepository(LoanRepository)
    private readonly loanRepository: LoanRepository,
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(CustomerRepository)
    private readonly customerRepository: CustomerRepository,
    @InjectRepository(CustomerHistoryRepository)
    private readonly customerHistoryRepository: CustomerHistoryRepository,
    @InjectSendGrid() private readonly sendGridclient: SendGridService,
    private readonly mailService: MailService,
    @InjectRepository(MaillogRepository)
    private readonly maillogRepository: MaillogRepository,
    private readonly logService: LogService,
  ) {}

  async create(startapplication: StartApplication) {
    const userEntity = new UserEntity();

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash('welcome', salt);
    userEntity.salt = salt;
    userEntity.password = hashPassword;

    let customerEntity = await this.customerRepository.findOne({
      where: { identificationNumber: startapplication.identificationNumber },
    });

    if (customerEntity) {
      const activeLoan = await this.loanRepository.findOne({
        where: { id: customerEntity.loan_id, active_flag: Flags.Y },
      });
      if (activeLoan)
        await this.logService.addLogs(
          activeLoan.id,
          'Applicant has a current installment loan with Troosk',
        );

      const loansLast7Days = await this.loanRepository.find({
        where: {
          id: customerEntity.loan_id,
          active_flag: Flags.N,
          createdAt: MoreThan(moment().subtract(7, 'd')),
        },
      });
      if (loansLast7Days.length >= 5) {
        await this.logService.addLogs(
          loansLast7Days[0]?.id,
          `${loansLast7Days.length} cancelled or voided applications received from this applicant within the last 7 days`,
        );
      }
    }

    if (customerEntity === undefined) {
      customerEntity = new CustomerEntity();
    }

    if (startapplication.firstName.trim().length === 0) {
      return Responses.validationError('firstName should not be empty');
    } else {
      userEntity.firstName = startapplication.firstName;
      customerEntity.firstName = startapplication.firstName;
    }

    if (startapplication.lastName.trim().length === 0) {
      return Responses.validationError('lastName should not be empty');
    } else {
      userEntity.lastName = startapplication.lastName;
      customerEntity.lastName = startapplication.lastName;
    }

    customerEntity.middleName = startapplication.middleName;

    if (
      startapplication.month.trim().length === 0 &&
      startapplication.day.trim().length === 0 &&
      startapplication.year.trim().length === 0
    ) {
      return Responses.validationError('birthday should not be empty');
    } else {
      customerEntity.birthday =
        startapplication.year +
        '-' +
        startapplication.month +
        '-' +
        startapplication.day;
    }

    customerEntity.addressLine1 = startapplication.addressLine1;
    customerEntity.streetNumber = startapplication.streetNumber;
    customerEntity.streetAddress = startapplication.streetName;

    customerEntity.unit = startapplication.unitNumber;

    if (startapplication.city.trim().length === 0) {
      return Responses.validationError('City should not be empty');
    } else {
      customerEntity.city = startapplication.city;
    }

    if (startapplication.state.trim().length === 0) {
      return Responses.validationError('State should not be empty');
    } else {
      customerEntity.state = startapplication.state;
    }

    if (startapplication.zipCode.trim().length === 0) {
      return Responses.validationError('ZipCode should not be empty');
    } else {
      customerEntity.zipCode = startapplication.zipCode;
    }

    try {
      const getUserID: any = await this.userRepository.find({
        select: ['id'],
        where: {
          identificationNumber: startapplication.identificationNumber,
          role: 2,
        },
      });
      let userID;
      if (getUserID.length === 0) {
        userEntity.identificationNumber = startapplication.identificationNumber;
        userEntity.role = 2;
        userID = await this.userRepository.save(userEntity);
      } else {
        userID = getUserID[0];
      }

      customerEntity.user_id = userID.id;

      const loan = new Loan();

      loan.user_id = userID.id;
      loan.kiosk_id = startapplication.kioskId;
      loan.kiosk_state = startapplication.kioskState;

      const loanDetails = await this.loanRepository.save(loan);

      customerEntity.loan_id = loanDetails.id;
      customerEntity.identificationNumber =
        startapplication.identificationNumber;
      customerEntity = await this.customerRepository.save(customerEntity);
      loanDetails.customer_id = customerEntity.id;
      await this.loanRepository.save(loanDetails);

      return {
        statusCode: HttpStatus.OK,
        Loan_ID: loanDetails.id,
      };
    } catch (error) {
      return Responses.fatalError(error);
    }
  }

  async getCustomerDetails(loanId: string) {
    try {
      const customerDetails = await this.customerRepository.findOne({
        where: { loan_id: loanId },
        select: [
          'identificationNumber',
          'firstName',
          'middleName',
          'lastName',
          'streetAddress',
          'addressLine1',
          'city',
          'unit',
          'zipCode',
          'state',
          'birthday',
        ],
      });

      await this.loanRepository.update(
        { id: loanId },
        { lastScreen: LastScreenModel.CustomerDetails },
      );

      return {
        statusCode: HttpStatus.OK,
        data: customerDetails,
      };
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async idCardVerified(loanId: string, isVerified) {
    try {
      if (isVerified === 'true') {
        await this.loanRepository.update(
          { id: loanId },
          { idCard_Verified: Flags.Y },
        );
        return {
          statusCode: 200,
          data: 'Your Identity Card is Successfully Verified!',
        };
      } else {
        this.logService.addLogs(
          loanId,
          'Applicant does not confirm info on ID / Driver’s license',
        );
        return {
          statusCode: 200,
          message: 'Your Identity Card is not Verified!',
        };
      }
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async idCardVerificationUpdate(loanId: string, verificationData) {
    if (
      undefined === await this.loanRepository.findOne({where: {id: loanId}})
  ) {
      throw new NotFoundException('There is no loan with id ' + loanId);
    }

    try {
        const { isVerified } = verificationData;

        await this.loanRepository.update(
          { id: loanId },
          { idCard_Verified: isVerified !== Verify.fail ? Flags.Y : Flags.N,
            verificationStatus: isVerified,
            lastScreen: LastScreenModel.IDVerification
          },
        );

        this.logService.addLogs(
          loanId,
          `Applicant ${isVerified} on ID / Driver’s license verification`,
        );

        return Responses.success('Application updated.')
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async getMobileOtp(loanId: string) {
    try {
      const otp = StartapplicationService.generateOTP();

      const updatedCustomerLoan = await this.loanRepository.update(
        { id: loanId },
        {
          mobileotp: otp.code,
          mobileotpExpiry: otp.timeout,
          lastScreen: 'verifyPhone',
        },
      );
      if (!updatedCustomerLoan.affected)
        return Responses.validationError('Loan was not updated');

      const customer = await this.customerRepository.findOne({
        where: { loan_id: loanId },
        select: ['phone'],
      });
      if (!customer) return Responses.validationError('Customer was not found');

      await this.sendSMS(otp.code, customer.phone);
      return Responses.success('OTP sent to Mobile Number');
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async sendOtpMail(loanId: string) {
    try {
      const otp = StartapplicationService.generateOTP();
      const updatedCustomerLoan = await this.loanRepository.update(
        { id: loanId },
        {
          emailotp: otp.code,
          mailotpExpiry: otp.timeout,
          lastScreen: 'verifyPhone',
        },
      );
      if (!updatedCustomerLoan.affected)
        return Responses.validationError('Customer was not updated');

      const customer = await this.customerRepository.findOne({
        where: { loan_id: loanId },
        select: ['email'],
      });
      if (!customer)
        return Responses.validationError('There is no customer with this id');

      await this.mailService.sendOtp(customer.email, otp.code);
      return Responses.success('OTP sent to Email');
    } catch (error) {
      return Responses.fatalError(error);
    }
  }

  async otpVerification(
    loanId: string,
    otpCreadentialsDto: OtpCreadentialsDto,
  ) {
    try {
      const { emailotp, mobileotp } = otpCreadentialsDto;
      const time = Math.floor(new Date().getTime() / 1000);

      const customerLoan = await this.loanRepository.findOne({
        where: { id: loanId },
      });
      if (!customerLoan) return Responses.validationError('Loan was not found');

      let mobileOtpVerified = true;
      let emailOtpVerified = true;

      if (customerLoan.emailotp !== Number(emailotp)) {
        emailOtpVerified = false;
      }

      if (customerLoan.mobileotp !== Number(mobileotp)) {
        mobileOtpVerified = false;
      }

      if (!customerLoan.mobileotpExpiry || !customerLoan.mailotpExpiry) {
        if (!customerLoan.mobileotpExpiry) {
          await this.logService.addLogs(
            loanId,
            'Phone OTP times out — i.e., a correct OTP is not entered within 180 seconds',
          );
        }
        if (!customerLoan.mailotpExpiry) {
          await this.logService.addLogs(
            loanId,
            'Email OTP times out — i.e., a correct OTP is not entered within 180 seconds',
          );
        }

        return {
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          message: 'OTP Expired!',
          error: 'Bad Request',
        };
      }

      const updatedCustomerLoan = await this.loanRepository.update(
        { id: loanId },
        {
          mailotpExpiry: time,
          mobileotpExpiry: time,
          phoneVerified: Flags.Y,
          lastScreen: 'verifyPhone',
        },
      );
      if (!updatedCustomerLoan.affected)
        return Responses.validationError('Loan was not updated');

      if (emailOtpVerified && mobileOtpVerified) {
        return {
          statusCode: HttpStatus.OK,
          message: 'OTP Verified Successfully!',
        };
      } else {
        const loan = await this.loanRepository.findOne({
          where: { id: loanId },
          select: ['mobile_otp_attempts', 'email_otp_attempts'],
        });
        if (!loan) return Responses.validationError('Loan was not found');

        if (!mobileOtpVerified) {
          const loanMobileOtpAttemptsUpdated = await this.loanRepository.update(
            { id: loanId },
            { mobile_otp_attempts: loan.mobile_otp_attempts - 1 },
          );
          if (!loanMobileOtpAttemptsUpdated.affected)
            return Responses.validationError(
              'mobile_otp_attempts was not updated',
            );
        }
        if (!emailOtpVerified) {
          const loanEmailOtpAttemptsUpdated = await this.loanRepository.update(
            { id: loanId },
            { email_otp_attempts: loan.email_otp_attempts - 1 },
          );
          if (!loanEmailOtpAttemptsUpdated.affected)
            return Responses.validationError(
              'email_otp_attempts was not updated',
            );
        }

        const loanUpdated = await this.loanRepository.findOne({
          where: { id: loanId },
          select: ['mobile_otp_attempts', 'email_otp_attempts'],
        });

        if (loanUpdated.mobile_otp_attempts && loanUpdated.email_otp_attempts) {
          return {
            statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            message: 'Invalid OTP!',
            mobileOtpAttemptsLeft: loanUpdated.mobile_otp_attempts,
            emailOtpAttemptsLeft: loanUpdated.email_otp_attempts,
            error: 'Bad Request',
          };
        } else {
          if (!loanUpdated.mobile_otp_attempts) {
            await this.logService.addLogs(
              loanId,
              'Phone OTP fails 3 or more times',
            );
          }
          if (!loanUpdated.mobile_otp_attempts) {
            await this.logService.addLogs(
              loanId,
              'Email OTP fails 3 or more times',
            );
          }

          return {
            statusCode: HttpStatus.FORBIDDEN,
            message: 'You have exceeded number of attempts',
            error: 'Forbidden',
          };
        }
      }
    } catch (e) {
      return Responses.fatalError(e);
    }
  }

  async deniedApplication(loanId) {
    try {
      await this.loanRepository.update(
        { id: loanId },
        { status_flag: StatusFlags.cancelled },
      );
      return {
        statusCode: 200,
        data: 'You Application is to be cancelled.',
      };
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async sendSMS(otp, phone) {
    try {
      return this.client.messages.create({
        body: `Your OTP for verification ${otp} .Expires in 5 minutes`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
      });
    } catch (e) {
      Responses.fatalError(e);
    }
  }

  async getLoan(loanId) {
    return this.loanRepository.findOne({ id: loanId });
  }

  async getLoanLogs(loanId) {
    return this.logService.getLogs(loanId);
  }

  async flushCustomer(idCardNumber) {
    const customer = await this.customerRepository.findOne({
      identificationNumber: idCardNumber,
    });

    if (customer) {
      const customerObject = { ...customer };
      const customerId = customer.id;
      delete customerObject.ref_no;
      delete customerObject.id;
      delete customerObject.createdAt;
      delete customerObject.updatedAt;

      const history = this.customerHistoryRepository.create({
        ...customerObject,
        customer_id: customerId,
      });

      if (history) {
        history.save();
      }

      await customer.remove();
    } else {
      throw new NotFoundException(
        null,
        'There is no customer with such ID card number',
      );
    }

    return Responses.success();
  }

  async getLoanId(idCardNumber) {
    return this.customerRepository.findOne({
      where: {
        identificationNumber: idCardNumber,
      },
      select: ['loan_id'],
    });
  }

  private static generateOTP(): { code: number; timeout: number } {
    const expirationTimeout = 5 * 60; // 5 minutes in seconds
    return {
      code: Math.floor(1000 + Math.random() * 9000),
      timeout: Math.floor(new Date().getTime() / 1000) + expirationTimeout,
    };
  }
}
