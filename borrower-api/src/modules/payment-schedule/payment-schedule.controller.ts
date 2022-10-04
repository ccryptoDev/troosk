import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaymentScheduleService } from './payment-schedule.service';

@ApiTags('payment-schedule')
@Controller('payment-schedule')
export class PaymentScheduleController {
  constructor(
    private readonly paymentScheduleService: PaymentScheduleService,
  ) {}

  @Get('/:loanId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get payment Schedule' })
  async getPaymentSchedule(@Param('loanId') loanId: string) {
    return this.paymentScheduleService.getPaymentSchedule(loanId);
  }

  @Get('/create/:loanId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create payment Schedule' })
  async createPaymentSchedule(@Param('loanId') loanId: string) {
    return this.paymentScheduleService.createPaymentSchedule(loanId);
  }
}
