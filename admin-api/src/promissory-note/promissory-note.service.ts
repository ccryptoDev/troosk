import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { userConsentRepository as UserConsentRepository } from '../repository/userConsent.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager } from 'typeorm';
import { LoanRepository } from '../repository/loan.repository';
import { CreatePromissoryNoteDto } from '../promissory-note/dto/promissory-note.dto';
import { commonService } from '../common/helper-service';
import { userConsentEnity } from '../entities/userConsent.entity';
import { LogRepository } from '../repository/log.repository';
import { StatusFlags } from '../entities/loan.entity';

@Injectable()
export class PromissoryNoteService {
  constructor(
    @InjectRepository(UserConsentRepository)
    private readonly userConsentRepository: UserConsentRepository,
    @InjectRepository(LoanRepository)
    private readonly loanRepository: LoanRepository,
    @InjectRepository(LogRepository)
    private readonly logRepository: LogRepository,
  ) {}
  async getPromissoryNote(loan_id) {
    const entityManager = getManager();
    try {
      const getUserID = await entityManager.query(
        `SELECT user_id FROM tblloan where id = '${loan_id}'`,
      );
      const getUserDetails = await entityManager.query(
        `SELECT * FROM tblcustomer where user_id = '${getUserID[0].user_id}'`,
      );
      const promissoryNote = new SignningPromissoryNote(getUserDetails[0]);
      const html = promissoryNote.getHtml();
      return {
        statusCode: 200,
        data: html,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }

  async savePromissoryNote(
    loanid,
    createPromissoryNoteDto: CreatePromissoryNoteDto,
  ) {
    const entityManager = getManager();
    try {
      const currentDate = new Date();
      await this.loanRepository.update(
        { id: loanid },
        {
          signature: createPromissoryNoteDto.signature,
          date: currentDate,
        },
      );
      const getUserDetails = await entityManager.query(
        `select * from tblcustomer where loan_id = '${loanid}'`,
      );
      const pn = new SignningPromissoryNote(getUserDetails[0]);
      const htmlData = pn.getHtmlWithSign(createPromissoryNoteDto.signature);
      const cs = new commonService(this.logRepository);
      const fileName = 'PromissoryNote.pdf';
      const promissoryNote = await cs.convertHTMLToPDF(
        loanid,
        htmlData,
        fileName,
      );
      const consentEntity = new userConsentEnity();
      if (
        Object.keys(promissoryNote).length > 0 &&
        promissoryNote.Location !== undefined
      ) {
        consentEntity.loanId = loanid;
        consentEntity.fileKey = 105;
        consentEntity.filePath = promissoryNote.key;
      }
      await this.userConsentRepository.save(consentEntity);
      await this.loanRepository.update(
        { id: loanid },
        { lastScreen: 'completed', status_flag: StatusFlags.fundingcontract },
      );
      return {
        statusCode: 200,
        data: promissoryNote,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }
}
export class SignningPromissoryNote {
  data: any = {};
  constructor(data) {
    this.data = data;
  }
  getHtml() {
    this.data;
    const htmlData = `<h1>${this.data.firstName + ' ' + this.data.lastName}</h1>
    <p>${this.data.email}<p>
    <p>${this.data.createdAt.toISOString()}</p>
    <img id="sign" src = "{({signature})}">
    `;
    return htmlData;
  }
  getHtmlWithSign(signature) {
    let htmlData = this.getHtml();
    htmlData = htmlData.replace('{({signature})}', signature);
    return htmlData;
  }
}
