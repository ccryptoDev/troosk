import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { AddBankDto } from './dto/add-bank.dto';

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('/:loanId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get bank account details' })
  async getBankAccounts(@Param('loanId') loanId: string) {
    return this.paymentService.getBankAccounts(loanId);
  }

  @Delete('/:loanId/:refNo')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete bank account' })
  async removeBankAccount(
    @Param('loanId') loanId: string,
    @Param('refNo') refNo: string,
  ) {
    return this.paymentService.removeBankAccount(loanId, refNo);
  }

  @Patch('/:loanId/:refNo')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Select bank account' })
  async selectBankAccount(
    @Param('loanId') loanId: string,
    @Param('refNo') refNo: string,
  ) {
    return this.paymentService.selectBankAccount(loanId, refNo);
  }

  @Post('/:loanId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add bank account manually' })
  async addBankAccount(
    @Param('loanId') loanId: string,
    @Body() addBankDto: AddBankDto,
  ) {
    return this.paymentService.addBankAccount(loanId, addBankDto);
  }
}
