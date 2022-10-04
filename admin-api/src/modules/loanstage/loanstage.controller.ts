import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  UpdateUserLoanAmount,
  manualBankAddDto,
} from '../loanstage/dto/update-loanstage.dto';
import { LoanstageService } from './loanstage.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
export const Roles = (...roles: string[]) => SetMetadata('role', roles);
import { SetMetadata } from '@nestjs/common';
import {
  UpdateStageDto,
  createPaymentSchedulerDto,
} from './dto/update-loanstage.dto';

@ApiTags('loanstage')
@Controller('loanstage')
export class LoanstageController {
  constructor(private readonly loanstageService: LoanstageService) {}

  @Get('/:stage')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'GET_ALL' })
  async get(@Param('stage') stage: string) {
    return this.loanstageService.getAllCustomerDetails(stage);
  }

  @Post('Creditcardverif/:loan_id/:isVerified')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'ID Card Verified' })
  async idCardVerified(
    // tslint:disable-next-line:variable-name
    @Param('loan_id') loan_id: string,
    @Param('isVerified') isVerified: string,
  ) {
    return this.loanstageService.creditcardverify(loan_id, isVerified);
  }

  @Get('/:loan_id/:stage')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get pending details' })
  async getdetails(
    @Param('loan_id') id: string,
    @Param('stage') stage: string,
  ) {
    return this.loanstageService.getACustomerDetails(id, stage);
  }

  @Get('/getlogs/:loan_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Logs' })
  async getlogs(@Param('loan_id', ParseUUIDPipe) id: string) {
    return this.loanstageService.getALogs(id);
  }

  @Post('/:loan_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Updated to next stage' })
  async movedToNextStage(
    @Param('loan_id') id: string,
    @Body() updateStageDto: UpdateStageDto,
  ) {
    return this.loanstageService.movedToNextStage(id, updateStageDto);
  }

  @Patch('/editcustomerloanamountdetails/:loan_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Edit loan amount details' })
  async editCustomerLoanAmountDetails(
    @Param('loan_id') id: string,
    @Body() updateUserLoanAmount: UpdateUserLoanAmount,
  ) {
    return this.loanstageService.editCustomerLoanAmountDetails(
      id,
      updateUserLoanAmount,
    );
  }

  @Patch('/PaymentReschedule')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Payment Reschedule ' })
  async paymentRescheduler(
    // tslint:disable-next-line:no-shadowed-variable
    @Body() createPaymentSchedulerDto: createPaymentSchedulerDto,
  ) {
    return this.loanstageService.paymentRescheduler(createPaymentSchedulerDto);
  }

  // TODO: remove after confirmation
  // @Post('/manualbankadd')
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Manual Bank Add' })
  // // tslint:disable-next-line:no-shadowed-variable
  // async manualBankAdd(@Body() manualBankAddDto: manualBankAddDto) {
  //   return this.loanstageService.manualBankAdd(manualBankAddDto);
  // }

  @Get('Document/:loan_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all document files' })
  async getDocument(@Param('loan_id') id: string) {
    return this.loanstageService.getDocument(id);
  }

  @Get('/userDocument/:loan_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all user upload document files' })
  async getUserDocument(@Param('loan_id') id: string) {
    return this.loanstageService.getUserDocument(id);
  }
}
