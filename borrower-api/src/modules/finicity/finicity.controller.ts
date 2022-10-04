import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FinicityService } from './finicity.service';

@ApiTags('Finicity')
@Controller('finicity')
export class FinicityController {
  constructor(private readonly finicityService: FinicityService) {}

  @Get('/link/:loanId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Connecting Bank using Finicity Link' })
  async bankConnect(@Param('loanId') id: string) {
    return this.finicityService.bankLink(id);
  }

  @Get('/bank-accounts/:loanId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Bank Accounts Data from Finicity ' })
  async accounts(@Param('loanId') id: string) {
    return this.finicityService.bankAccounts(id);
  }

  @Post('/web-hook/:loanId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Save bank accounts data from Finicity' })
  async finicityWebHook(@Param('loanId') loanId: string) {
    return this.finicityService.finicityWebHook(loanId);
  }
}
