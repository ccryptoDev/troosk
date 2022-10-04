import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoanContractService } from './loan-contract.service';

@ApiTags('Loan-contract-page')
@Controller('loan-contract-page')
export class LoanContractController {
  constructor(private readonly loanContractService: LoanContractService) {}

  @Get('/:loanId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get loan contract' })
  async getLoanContract(@Param('loanId') loanId: string) {
    return this.loanContractService.getLoanContract(loanId);
  }

  @Post('signLoanContract/:loanId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign loan contract' })
  async signLoanContract(@Param('loanId') loanId: string) {
    return this.loanContractService.signLoanContract(loanId);
  }

  @Get('upload-agreement-in-pdf/:loanId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Upload loan in pdf' })
  async uploadLoanContractInPdf(@Param('loanId') loanId: string) {
    return this.loanContractService.uploadLoanContractInPdf(loanId);
  }

  @Get('get-agreement-in-pdf/:loanId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get loan in pdf' })
  async getLoanContractInPdf(@Param('loanId') loanId: string) {
    return this.loanContractService.getLoanContractInPdf(loanId);
  }

  @Get('get-agreement-in-html/:loanId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get loan in html' })
  async getLoanContractInHtml(@Param('loanId') loanId: string) {
    return this.loanContractService.getLoanContractInHTML(loanId);
  }
}
