import {
  Controller,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Req,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { PaymentManagementService } from './payment-management.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/guards/roles.guard';
import { MakePaymentDTO } from './dto/make-payment.dto';
export const Roles = (...roles: string[]) => SetMetadata('role', roles);

@ApiBearerAuth()
@Roles('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('payment-management')
@Controller('payment-management')
export class PaymentManagementController {
  constructor(
    private readonly paymentManagementService: PaymentManagementService,
  ) {}

  @Post('/makePayOff/:loan_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Make Payment' })
  async makePayment(@Param('loan_id') loanId: string, @Req() req) {
    return this.paymentManagementService.makePayOffPayment(loanId, req);
  }

  @Post('/makePayment/:loan_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Make Payment' })
  async makeCustomPayment(
    @Param('loan_id') loanId: string,
    @Body() makePaymentDTO: MakePaymentDTO,
    @Req() req,
  ) {
    return this.paymentManagementService.makePayment(
      loanId,
      makePaymentDTO,
      req,
    );
  }
}
