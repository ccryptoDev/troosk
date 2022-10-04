import { Injectable } from '@nestjs/common';
import { Gender, Size, TShirtDto } from './dto/t-shirt.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LoanRepository } from '../../repository/loan.repository';
import { Responses } from '../../common/responses';

@Injectable()
export class TShirtService {
  constructor(
    @InjectRepository(LoanRepository)
    private readonly loanRepository: LoanRepository,
  ) {}

  async getTShirtParams() {
    return {
      gender: Object.values(Gender),
      sizes: Object.values(Size),
    };
  }

  async createTShirt(loanId: string, tShirtDto: TShirtDto) {
    try {
      const response = await this.loanRepository.update(
        { id: loanId },
        { ...tShirtDto },
      );
      if (!response.affected) return { message: 'LoanId not found' };

      return Responses.success('T-shirt created');
    } catch (e) {
      return Responses.fatalError(e);
    }
  }
}
