import { Injectable,InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUploadDto } from './dto/create-upload.dto';
import { FilesRepository } from '../../repository/files.repository';
import { FilesEntity } from '../../entities/files.entity';
import {LoanRepository} from '../../repository/loan.repository';
import { getManager } from 'typeorm';

export enum Flags {
  Y = 'Y'
}

@Injectable()
export class UploadsService {
  constructor(
    @InjectRepository(FilesRepository) private readonly filesRepository: FilesRepository,
    @InjectRepository(LoanRepository) private readonly loanRepository: LoanRepository,
  ){

  }

  async getDocuments(id){
    const entityManager = getManager();
    try{
      let data = {}        
      data['files'] = await entityManager.query(`select originalname,filename, "documentType" from tblfiles where link_id = '${id}' and delete_flag='N'`)
      data["userConsentDoc"] = await entityManager.query(`select ucon.id,ucon."loanId",ucon."filePath",ucon."fileKey",conm.name from tbluserconsent ucon join tblconsentmaster conm on conm."fileKey" = ucon."fileKey"
                where "loanId" = '${id}'`)
                data['initialnote'] = await entityManager.query(`select 
                t."createdAt" as createdAt,
                t.ref_no as ref_no, 
                t2."firstName" as firstName,
                t2."lastName" as lastName,
                t2."streetAddress" ,t2.unit ,t2.city ,t2.state,t2."zipCode"
                from tblloan t join tblcustomer t2 on t2.user_id=t.user_id where t.id = '${id}' `)
      return { "statusCode": 200, "data": data}
    }catch(error){
      console.log(error)
          return {"statusCode": 500, "message": [new InternalServerErrorException(error)['response']['name']], "error": "Bad Request"};
      }
  }

  async save(files,createUploadDto: CreateUploadDto) {    
    let filedata = [];
    for (let i = 0; i < files.length; i++) {      
      let file:FilesEntity = new FilesEntity();
      file.originalname = files[i].originalname;
      file.filename = files[i].filename;
      file.services = 'borrower/upload';
      file.documentType = createUploadDto.documentTypes[i];
      file.link_id = createUploadDto.loan_id;
      filedata.push(file)
    }
    try{
      await this.filesRepository.save(filedata);
      await this.loanRepository.update({id: createUploadDto.loan_id}, { active_flag: Flags.Y });
      return { "statusCode": 200, "Loan_ID": createUploadDto.loan_id}

    } catch (error) {
      console.log(error)
      return { "statusCode": 500, "message": [new InternalServerErrorException(error)['response']['name']], "error": "Bad Request" };
    }
  }
}
