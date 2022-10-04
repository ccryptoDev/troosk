import {
  Controller,
  Post,
  Body,
  Get,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { StartapplicationService } from './startapplication.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SetMetadata } from '@nestjs/common';
import { config } from 'dotenv';
import {
  OtpCreadentialsDto,
  StartApplication,
} from './dto/startApplication.dto';
import { VerifyDto } from './dto/verify.dto';
config();

export const Roles = (...roles: string[]) => SetMetadata('role', roles);

@ApiTags('StartApplication')
@Controller('startapplication')
export class StartapplicationController {
  constructor(
    private readonly startapplicationService: StartapplicationService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Start Application' })
  async create(@Body() startapplication: StartApplication) {
    return await this.startapplicationService.create(startapplication);
  }

  @Post('loan/:loanId/id-verification')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'ID Card Verified. Enum value from the list: pass, fail, warning' })
  async idCardVerificationUpdate(
    @Param('loanId') loanId: string,
    @Body() verificationDTO: VerifyDto
  ) {
    return this.startapplicationService.idCardVerificationUpdate(loanId, verificationDTO);
  }

  @Post('idCardVerified/:loanId/:isVerified')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[DEPRECATED] ID Card Verified' })
  async idCardVerified(
    @Param('loanId') loanId: string,
    @Param('isVerified') isVerified: string,
  ) {
    return this.startapplicationService.idCardVerified(loanId, isVerified);
  }

  @Get('customerDetails/:loanId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Customer Details' })
  async getCustomerDetails(@Param('loanId') loanId: string) {
    return this.startapplicationService.getCustomerDetails(loanId);
  }

  @Get('deniedApplication/:loanId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancelled Applications' })
  async deniedApplication(@Param('loanId') loanId: string) {
    return this.startapplicationService.deniedApplication(loanId);
  }

  @Get('/sendsmsotp/:loanId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get mobile OTP' })
  async getMobileOtp(@Param('loanId') loanId: string) {
    return this.startapplicationService.getMobileOtp(loanId);
  }

  @Get('/sendotpmail/:loanId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get email OTP' })
  async senOtpMail(@Param('loanId') loanId: string) {
    return this.startapplicationService.sendOtpMail(loanId);
  }

  @Post('/verify_otp/:loanId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'otp verification for user login' })
  async otp(
    @Param('loanId') loanId: string,
    @Body() otpCreadentialsDto: OtpCreadentialsDto,
  ) {
    return this.startapplicationService.otpVerification(
      loanId,
      otpCreadentialsDto,
    );
  }

  // TODO remove on prod
  @Get('/loans/:loanId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Loan' })
  async loan(@Param('loanId') loanId: string) {
    return this.startapplicationService.getLoan(loanId);
  }

  // TODO remove on prod
  @Get('/loans/:loanId/logs')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Loan' })
  async loanLogs(@Param('loanId') loanId: string) {
    return this.startapplicationService.getLoanLogs(loanId);
  }

  // TODO remove on prod
  @Get('/flush-customer/:id_number')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Flush Customer' })
  async flushCustomer(@Param('id_number') idCardNumber: string) {
    return this.startapplicationService.flushCustomer(idCardNumber);
  }

  // TODO remove on prod
  @Get('/loans/customers/:id_number')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Flush Customer' })
  async getLoanID(@Param('id_number') idCardNumber: string) {
    return this.startapplicationService.getLoanId(idCardNumber);
  }
}
