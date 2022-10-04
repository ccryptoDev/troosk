import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RepayService } from './repay.service';
import { ACHDetailsDto } from './dto/a-c-h-details.dto';
import { UpdateUserCityDto } from '../customer/dto/user-info.dto';
import { ACHTokenPaymentDto } from './dto/a-c-h-token-payment.dto';
import { ACHSchedulePaymentDto } from './dto/a-c-h-schedule-payment.dto';
import { AchDisbursementDto } from './dto/ach-disbursement.dto';
import { CardTokenPaymentDto } from './dto/card-token-payment.dto';
import { CardDetailsDto } from './dto/card-details.dto';

@ApiTags('Repay')
@Controller('repay')
export class RepayController {
  constructor(private repayService: RepayService) {}

  @Post('/payment-methods/ach')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Add ACH payment method' })
  async addACH(@Body() achDetails: ACHDetailsDto) {
    return this.repayService.addACHAccount(achDetails);
  }

  @Post('/payment-methods/card')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Add ACH payment method' })
  async addCard(@Body() cardDetails: CardDetailsDto) {
    return this.repayService.addCard(cardDetails);
  }

  @Get('/payment-methods/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get payment methods for the customer' })
  async editUserCity(@Param('id', ParseUUIDPipe) id: string) {
    return this.repayService.getPaymentMethods(id);
  }

  @Post('payments/ach')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Make a payment using ACH token' })
  async ACHPayment(@Body() payment: ACHTokenPaymentDto) {
    return this.repayService.makePayment(payment);
  }

  @Post('payments/card')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Make a payment using Card token' })
  async cardPayment(@Body() payment: CardTokenPaymentDto) {
    return this.repayService.makePayment(payment);
  }

  @Post('payments/schedule')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Schedule payments using ACH' })
  async paymentSchedule(@Body() payment: ACHSchedulePaymentDto) {
    return this.repayService.makeSchedulePayment(payment);
  }

  @Post('payments/ach-disbursement')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'ACH disbursement' })
  async tokenDisbursement(@Body() payment: AchDisbursementDto) {
    return this.repayService.paymentDisbursement(payment);
  }
}
