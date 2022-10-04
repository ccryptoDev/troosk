import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AddConsentDto } from './dto/create-uploadfile.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ConsentMasterEntity } from '../../entities/consentMaster.entity';
import { ConsentMasterRepository } from '../../repository/consentMaster.repository';
import { NotesRepository } from 'src/repository/notes.repository';
import { FaqRepository } from '../../repository/faq.repository';
import { Responses } from '../../common/responses';
import { CustomerRepository } from '../../repository/customer.repository';
import * as moment from 'moment';
import { CommonService } from '../../common/helper-service';
import { generateConsentHtml } from './consents/consent.html';
import { LoanRepository } from '../../repository/loan.repository';
import { LastScreenModel } from '../../common/last-screen.model';
import { UploadUserDocumentRepository } from '../../repository/userdocumentupload.repository';
import { uploadUserDocument } from '../../entities/uploaduserdocument.entity';

@Injectable()
export class UploadfilesService {
  constructor(
    @InjectRepository(UploadUserDocumentRepository)
    private readonly uploadUserDocumentRepository: UploadUserDocumentRepository,
    @InjectRepository(ConsentMasterRepository)
    private readonly consentMasterRepository: ConsentMasterRepository,
    @InjectRepository(NotesRepository)
    private readonly notesRepository: NotesRepository,
    @InjectRepository(FaqRepository)
    private readonly faqRepository: FaqRepository,
    @InjectRepository(CustomerRepository)
    private readonly customerRepository: CustomerRepository,
    @InjectRepository(LoanRepository)
    private readonly loanRepository: LoanRepository,
  ) {}

  async addConsent(country, addConsentDto: AddConsentDto) {
    try {
      const consentData = [];

      for (const consentsDto of addConsentDto.consent) {
        const consent = new ConsentMasterEntity();
        consent.fileName = consentsDto.title;
        consent.name = consentsDto.text;
        consent.country = country;
        consentData.push(consent);
      }
      await this.consentMasterRepository.save(consentData);
      return Responses.success('User Consent Files Successfully added.');
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async getConsentFiles(country) {
    try {
      const getConsentFiles = await this.consentMasterRepository.find({
        where: { country },
        select: ['fileName', 'name'],
      });

      return {
        statusCode: HttpStatus.OK,
        data: getConsentFiles,
      };
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async signConsents(country: string, loanId: string) {
    const commonService = new CommonService();
    try {
      const consents = await this.getConsentFiles(country);

      const costumer = await this.customerRepository.findOne({
        where: { loan_id: loanId },
        select: ['firstName', 'lastName'],
      });
      if (!costumer) return new BadRequestException('Customer was not found');
      const customerName = `${costumer.firstName} ${costumer.lastName}`;
      const date = moment(new Date()).format('MM/DD/YYYY');

      const htmlData = generateConsentHtml(consents.data, customerName, date);
      const fileName = `consents.pdf`;

      await this.loanRepository.update(
        { id: loanId },
        { lastScreen: LastScreenModel.Consents },
      );

      const uploadedConsent = await commonService.convertHTMLToPDF(
        loanId,
        htmlData,
        fileName,
      );

      return Responses.success('Saved', uploadedConsent);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async getConsentsInPdf(loanId: string) {
    try {
      const commonService = new CommonService();
      const res = await commonService.getFileFromS3(`consents-${loanId}.pdf`);
      if (!res?.Body) return new NotFoundException('Consents were not found');

      return Responses.success('Success', {
        fileName: 'Consents document',
        fileData: JSON.stringify(res.Body),
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async addNotes(country, addConsentDto: AddConsentDto) {
    try {
      const consentData = [];
      for (const consentsDto of addConsentDto.consent) {
        const consent = new ConsentMasterEntity();
        consent.fileName = consentsDto.title;
        consent.name = consentsDto.text;
        consent.country = country;
        consentData.push(consent);
      }
      await this.notesRepository.save(consentData);
      return Responses.success('Notes has been Successfully added.');
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async getNotes(country) {
    try {
      const getConsentFiles = await this.notesRepository.find({
        where: { country },
        select: ['fileName', 'name'],
      });
      return {
        statusCode: HttpStatus.OK,
        data: getConsentFiles,
      };
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async addFaq(country, addConsentDto: AddConsentDto) {
    try {
      const consentData = [];
      for (const consentsDto of addConsentDto.consent) {
        const consent = new ConsentMasterEntity();
        consent.fileName = consentsDto.title;
        consent.name = consentsDto.text;
        consent.country = country;
        consentData.push(consent);
      }
      await this.faqRepository.save(consentData);
      return Responses.success('FAQs has been Successfully added.');
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async getFaq(country) {
    try {
      const getConsentFiles = await this.faqRepository.find({
        where: { country },
        select: ['fileName', 'name'],
      });
      return {
        statusCode: HttpStatus.OK,
        data: getConsentFiles,
      };
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async save(files, createUploadDto, exactFileName) {
    try {
      const file = new uploadUserDocument();
      file.orginalfileName = files.originalfileName;
      file.fileName = files.filename;
      file.loan_id = createUploadDto.loan_id;
      file.type = createUploadDto.type;
      file.exactFileName = exactFileName;
      await this.uploadUserDocumentRepository.save(file);
      return {
        statusCode: HttpStatus.OK,
        data: 'Files will be uploaded successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
