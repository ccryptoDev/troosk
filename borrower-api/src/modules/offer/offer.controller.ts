import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OfferService } from './offer.service';

@ApiTags('Offer')
@Controller('offer')
export class OfferController {
  constructor(private readonly offerService: OfferService) {}

  @Get('/:loanId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Offer' })
  async getOffer(@Param('loanId') loanId: string) {
    return this.offerService.getOffer(loanId);
  }

  @Get('/disbursement/:loanId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Loan Disbursement Methods' })
  async getLoanDisbursement(@Param('loanId') loanId: string) {
    return this.offerService.getLoanDisbursement(loanId);
  }

  @Get('/payment-method/:loanId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Loan Payment Methods' })
  async getLoanPayment(@Param('loanId') loanId: string) {
    return this.offerService.getLoanPayment(loanId);
  }
}
