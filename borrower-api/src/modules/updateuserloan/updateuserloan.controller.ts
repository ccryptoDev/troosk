import {
  Controller,
  Body,
  Patch,
  Param,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { UpdateuserloanService } from './updateuserloan.service';
import { UpdateUserLoanAmount } from './dto/updateUserloan.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateCustomerDetailsDto } from './dto/updateCustomerDetails.dto';
import { UpdateDisbursementAccountIdDto } from './dto/updateDisbursementAccountId.dto';
import { UpdatePaymentAccountIdDto } from './dto/updatePaymentAccountId.dto';
import { CustomerAddressDto } from './dto/customer-address.dto';
import { FinicityIdDto } from './dto/finicity-id.dto';

@ApiTags('Update User Loan')
@Controller('updateuserloan')
export class UpdateuserloanController {
  constructor(private readonly updateuserloanService: UpdateuserloanService) {}

  @Patch('/edituserloanamountdetails/:loanId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Edit loan amount details' })
  async editUserLoanAmountDetails(
    @Param('loanId') loanId: string,
    @Body() updateUserLoanAmount: UpdateUserLoanAmount,
  ) {
    return this.updateuserloanService.editUserLoanAmountDetails(
      loanId,
      updateUserLoanAmount,
    );
  }

  @Patch('/editCustomerdetails/:loanId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Edit loan amount details' })
  async editCustomerDetails(
    @Param('loanId') loanId: string,
    @Body() updateCustomerDetails: UpdateCustomerDetailsDto,
  ) {
    return this.updateuserloanService.editCustomerDetails(
      loanId,
      updateCustomerDetails,
    );
  }

  @Patch('/test/EditCustomerNameAndAddress/:loanId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Edit loan amount details' })
  async editCustomerNameAndAddress(
    @Param('loanId') loanId: string,
    @Body() updateCustomerDetails: CustomerAddressDto,
  ) {
    return this.updateuserloanService.editCustomerNameAndAddress(
      loanId,
      updateCustomerDetails,
    );
  }

  @Put('/editDisbursementAccountId/:loanId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Edit disbursement account id' })
  async editDisbursementAccountId(
    @Param('loanId') loanId: string,
    @Body() disbursementAccountIdDto: UpdateDisbursementAccountIdDto,
  ) {
    return this.updateuserloanService.editDisbursementAccountId(
      loanId,
      disbursementAccountIdDto,
    );
  }

  @Put('/editPaymentAccountId/:loanId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Edit disbursement account id' })
  async editPaymentAccountId(
    @Param('loanId') loanId: string,
    @Body() paymentAccountIdDto: UpdatePaymentAccountIdDto,
  ) {
    return this.updateuserloanService.editPaymentAccountId(
      loanId,
      paymentAccountIdDto,
    );
  }

  // TODO remove after uat
  @Put('/:loanId/finicity')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Edit disbursement account id' })
  async setFinicityId(
    @Param('loanId') loanId: string,
    @Body() finicityData: FinicityIdDto,
  ) {
    return this.updateuserloanService.setFinicityId(
      loanId,
      finicityData,
    );
  }
}
