import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ReviewService } from './review.service';
import { RealIP } from 'nestjs-real-ip';
import { ApiTags } from '@nestjs/swagger';
import {
  UpdateUserName,
  selectLoan as SelectLoan,
} from '../review/dto/update-review.dto';

@ApiTags('Review')
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('/:loanId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get pending details' })
  async getDetails(@Param('loanId') loanId: string) {
    return this.reviewService.getDetails(loanId);
  }

  @Patch('/edituserDetails/:loanId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Edit User Details' })
  async updateUserDetails(
    @Param('loanId') loanId: string,
    @Body() updateUserName: UpdateUserName,
    @RealIP() ip: string,
  ) {
    return this.reviewService.updateUserDetails(loanId, updateUserName, ip);
  }

  @Post('selectLoan')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '' })
  async selectLoan(@Body() selectLoan: SelectLoan, @RealIP() ip: string) {
    return this.reviewService.selectLoan(selectLoan.loan_id, ip);
  }

  @Post('bankManual')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '' })
  async bankManual(@Body() selectLoan: SelectLoan, @RealIP() ip: string) {
    return this.reviewService.bankManual(selectLoan.loan_id, ip);
  }
}
