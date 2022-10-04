import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs-extra';
import * as xml2js from 'xml2js';
import * as https from 'https';
import * as moment from 'moment';
import axios, { AxiosResponse } from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerRepository } from '../../../repository/customer.repository';
import { CreditPullRepository } from '../../../repository/creditPull.repository';
import { CreditPull, Vendors } from '../../../entities/creditPull.entity';
import { CustomerEntity } from '../../../entities/customer.entity';

type TransUnionCredentials = {
  certificate: Record<string, unknown>;
  processingEnvironment: string;
  industryCode: string;
  memberCode: string;
  password: string;
  prefixCode: string;
  url: string;
  version: string;
};

enum Pull {
  HardPull = 'hardPull',
  SoftPull = 'softPull',
}

@Injectable()
export class TransunionService {
  constructor(
    @InjectRepository(CustomerRepository)
    private readonly customerRepository: CustomerRepository,
    @InjectRepository(CreditPullRepository)
    private readonly creditPullRepository: CreditPullRepository,
    private readonly configService: ConfigService,
  ) {}
  buildRequestDataObj(
    credentials: TransUnionCredentials,
    customer: CustomerEntity,
  ) {
    const [streetNumber, streetName] = customer.addressLine1.split(' ');
    const subjectRecord: any = {
      indicative: {
        name: {
          person: {
            first: customer.firstName,
            middle: customer.middleName,
            last: customer.lastName,
          },
        },
        address: {
          status: 'current',
          street: {
            number: streetNumber,
            name: streetName,
          },
          location: {
            city: customer.city,
            state: customer.state,
            zipCode: customer.zipCode,
          },
        },
      },
      // TODO: remove after codes added to default request
      addOnProduct: [
        {
          code: '00WR3',
          scoreModelProduct: 'true',
        },
        {
          code: '00WE6',
          scoreModelProduct: 'true',
        },
        {
          code: '06800',
          scoreModelProduct: 'true',
        },
        {
          code: '00A9P',
          scoreModelProduct: 'true',
        },
        {
          code: '00U29',
          scoreModelProduct: 'true',
        },
        {
          code: '00W16',
          scoreModelProduct: 'true',
        },
        {
          code: '00N05',
          scoreModelProduct: 'true',
        },
      ],
    };

    const ssn = customer.socialSecurityNumber
      ? customer.socialSecurityNumber.replace(/[^0-9]/g, '')
      : null;
    if (ssn)
      subjectRecord.indicative.socialSecurity = {
        number: String(ssn).padStart(9, '0'),
      };

    const dateOfBirth = customer.birthday
      ? moment(customer.birthday, 'YYYY-MMMM-DD').format('YYYY-MM-DD')
      : null;
    if (dateOfBirth) subjectRecord.indicative.dateOfBirth = dateOfBirth;

    return {
      document: 'request',
      version: credentials.version,
      transactionControl: {
        userRefNumber: customer.id,
        subscriber: {
          industryCode: credentials.industryCode,
          inquirySubscriberPrefixCode: credentials.prefixCode,
          memberCode: credentials.memberCode,
          password: credentials.password,
        },
        options: {
          contractualRelationship: 'individual',
          country: 'us',
          language: 'en',
          pointOfSaleIndicator: 'none',
          processingEnvironment: credentials.processingEnvironment,
        },
      },
      product: {
        code: this.configService.get<string>('productCode'),
        subject: { number: '1', subjectRecord },
        responseInstructions: { returnErrorText: 'true', document: null },
        permissiblePurpose: { code: 'IN', inquiryECOADesignator: 'individual' },
      },
    };
  }

  getCredentials(hardPull: boolean): TransUnionCredentials {
    return {
      certificate: this.configService.get<Record<string, unknown>>(
        'certificate',
      ),
      processingEnvironment: this.configService.get<string>(
        'processingEnvironment',
      ),
      industryCode: this.configService.get<string>('industryCode'),
      memberCode: hardPull
        ? this.configService.get<string>('memberCodeHardPull')
        : this.configService.get<string>('memberCode'),
      password: this.configService.get<string>('password'),
      prefixCode: this.configService.get<string>('prefixCode'),
      url: this.configService.get<string>('url'),
      version: this.configService.get<string>('version'),
    };
  }

  async getTUReport(loanId: string) {
    const creditPullTU = await this.creditPullRepository.findOne({
      where: {
        loan_id: loanId,
        vendor: Vendors.transunion,
      },
      select: ['file'],
      order: {
        created_at: 'DESC',
      },
    });

    return this.buildTransUnions(JSON.parse(creditPullTU.file)?.creditBureau);
  }

  buildTransUnions(creditReport: any) {
    if (!creditReport.product?.subject?.subjectRecord) {
      throw new BadRequestException(
        'Could not build transUnions, subjectRecord property is invalid',
      );
    }
    const { subjectRecord } = creditReport.product.subject;

    const transUnions = {
      OFAC06800:
        subjectRecord.addOnProduct.find(item => item.code === '06800')
          ?.ofacNameScreen?.searchStatus === 'potentialHit',
      creditUsageAT20: 0,
      monthSince90DayRateS062: 999,
      numberOfBankruptciesPBN003: Number(
        subjectRecord.addOnProduct
          ?.find(item => item.code === '00WE6')
          ?.scoreModel?.characteristic?.find(char => char.id === 'PBN003')
          ?.value || 0,
      ),
      numberOfDelinquenciesG061: 0,
      numberOfNonMedicalCollectionsS073B:
        Number(
          subjectRecord.addOnProduct?.find(item => item.code === '00WR3')
            ?.scoreModel?.characteristic?.value,
        ) || 0,
      numberOfPublicRecordsS059: 0,
      numberOfInquiriesG098: 0,
      scoreFICO:
        Number(
          subjectRecord.addOnProduct?.find(item => item.code === '00A9P')
            ?.scoreModel?.score?.results,
        ) || 0,
      DTI:
        Number(
          subjectRecord.addOnProduct?.find(item => item.code === '00U29')
            ?.scoreModel?.score?.results,
        ) || 0,
      grossIncome:
        Number(
          subjectRecord.addOnProduct
            ?.find(item => item.code === '00W16')
            ?.scoreModel?.characteristic?.find(char => char.id === 'HIGHEND')
            ?.value,
        ) || 0,
    };

    subjectRecord.addOnProduct
      ?.find(item => item.code === '00N05')
      ?.scoreModel?.characteristic?.map(char => {
        switch (char.id) {
          case 'AT20':
            transUnions.creditUsageAT20 = Number(char.value) || 0;
            break;
          case 'S062':
            transUnions.monthSince90DayRateS062 = Number(char.value) || 999;
            break;
          case 'G061':
            transUnions.numberOfDelinquenciesG061 = Number(char.value) || 0;
            break;
          case 'S059':
            transUnions.numberOfPublicRecordsS059 = Number(char.value) || 0;
            break;
          case 'G098':
            transUnions.numberOfInquiriesG098 = Number(char.value) || 0;
            break;
          default:
            break;
        }
      });

    return transUnions;
  }

  async runCreditReport(hardPull: boolean, loanId) {
    const customerEntity = await this.customerRepository.findOne({
      where: { loan_id: loanId },
    });

    if (customerEntity === undefined) {
      throw new BadRequestException(
        'There is no customer associated with following loan',
      );
    }

    let transUnionResponse: any;
    // todo hardcode credentials to fix staging error
    const credentials = {
      certificate: {
        password: 'secure123',
      },
      processingEnvironment: 'standardTest',
      industryCode: 'F',
      memberCode: '5532031',
      password: 'PSWD',
      prefixCode: '1703',
      url: 'https://netaccess-test.transunion.com/',
      version: '2.21',
    };
    const requestData = this.buildRequestDataObj(credentials, customerEntity);
    const builder = new xml2js.Builder();
    const xmlData = builder
      .buildObject(requestData)
      .replace(/\n|\r|\s/g, '')
      .replace('\ufeff', '')
      .replace(
        '<?xmlversion="1.0"encoding="UTF-8"standalone="yes"?><root>',
        '<?xml version="1.0" encoding="UTF-8"?><creditBureau xmlns="http://www.transunion.com/namespace" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.transunion.com/namespace">',
      )
      .replace('</root>', '</creditBureau>');

    const parser = new xml2js.Parser({
      ignoreAttrs: false,
      mergeAttrs: true,
      charkey: '_',
      explicitArray: false,
    });

    const httpsAgent = new https.Agent({
      cert: fs.readFileSync(process.env.TU_CERT, 'utf8'),
      key: fs.readFileSync(process.env.TU_KEY, 'utf8'),
      passphrase: credentials.certificate.password as string,
      rejectUnauthorized: false,
    });

    try {
      const response: AxiosResponse = await axios.post(
        this.configService.get<string>('url'),
        xmlData,
        {
          httpsAgent,
          headers: { 'Content-Type': 'text/xml', Accept: 'text/xml' },
        },
      );

      let data = response?.data;

      if (data) {
        // todo remove after UAT
        this.savePull(loanId, data, xmlData, false, Vendors.test);

        data = data.replace('\ufeff/g', '');
        transUnionResponse = await parser.parseStringPromise(data);
      }

      if (!response.data || response.status !== HttpStatus.OK) {
        return new NotFoundException('Transunions were not found');
      }
    } catch (e) {
      throw new InternalServerErrorException(e);
    }

    const transUnionError = transUnionResponse?.creditBureau?.product?.error;
    if (transUnionError)
      throw new InternalServerErrorException(transUnionError?.description);

    await this.savePull(loanId, transUnionResponse, requestData);

    return transUnionResponse;
  }

  private async savePull(
    loanId,
    transUnionResponse,
    requestData,
    hardPull = false,
    vendor = Vendors.transunion,
  ) {
    const pull = hardPull ? Pull.HardPull : Pull.SoftPull;
    const creditPull = new CreditPull();
    creditPull.loan_id = loanId;
    creditPull.vendor = vendor;
    creditPull.last_response = pull; // todo fix
    creditPull.file = transUnionResponse;
    creditPull.last_send_information = JSON.stringify(requestData);
    await creditPull.save();
  }
}
