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
        where: { loan_id: id },
        select: ['file'],
      });
      return { statusCode: HttpStatus.OK, data: creditPull.file };
    } catch (error) {
      return {
        statusCode: 500,
        message: [new InternalServerErrorException(error)['response']['name']],
        error: 'Bad Request',
      };
    }
  }
}
