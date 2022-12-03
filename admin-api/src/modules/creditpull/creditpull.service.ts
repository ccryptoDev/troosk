import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateCreditpullDto } from './dto/create-creditpull.dto';
import { CustomerRepository } from '../../repository/customer.repository';
import { InjectRepository } from '@nestjs/typeorm';
// import { CreditscoreApi } from 'creditscoreapi-mortgage/CreditscoreApi';
import { CreditPullRepository } from '../../repository/creditPull.repository';
import { CreditPull } from '../../entities/creditPull.entity';
import { getManager } from 'typeorm';
import { config } from 'dotenv';
import { use } from 'passport';
import e from 'express';
config();

@Injectable()
export class CreditpullService {
  constructor(
    @InjectRepository(CustomerRepository)
    private readonly customerRepository: CustomerRepository,
    @InjectRepository(CreditPullRepository)
    private readonly creditPullRepository: CreditPullRepository,
  ) {}

  async getFiles(id) {
    try {
      const creditPull = await this.creditPullRepository.findOne({
        where: { loan_id: id, vendor: 'T', last_response: 'softPull' },
        select: ['file'],
      });

      let data = null;
      if (creditPull)
        data = JSON.stringify(JSON.parse(creditPull.file), null, ' ');

      return { statusCode: HttpStatus.OK, data };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
