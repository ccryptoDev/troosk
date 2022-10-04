import {
  Controller,
  Body,
  Patch,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UpdateuserloanService } from './updateuserloan.service';
import {
  UpdateUserLoanAmount,
  UpdateCustomerDetails,
} from './dto/update-updateuserloan.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../../guards/roles.guard';
import { SetMetadata } from '@nestjs/common';
export const Roles = (...roles: string[]) => SetMetadata('role', roles);

@ApiTags('Update User Loan')
// @ApiBearerAuth()
// @Roles('admin')
// @UseGuards(AuthGuard('jwt'), RolesGuard)
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
    @Body() updateCustomerDetails: UpdateCustomerDetails,
  ) {
    return this.updateuserloanService.editCustomerDetails(
      loanId,
      updateCustomerDetails,
    );
  }
}
