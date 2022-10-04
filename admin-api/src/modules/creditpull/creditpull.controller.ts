import {
  Controller,
  Get,
  Param,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Body,
} from '@nestjs/common';
import { CreditpullService } from './creditpull.service';
import { CreateCreditpullDto } from './dto/create-creditpull.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('creditpull')
@Controller('creditpull')
export class CreditpullController {
  constructor(private readonly creditpullService: CreditpullService) {}

  @Get('/creditpull/getFiles/:loan_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get files' })
  async getFiles(@Param('loan_id') id: string) {
    return this.creditpullService.getFiles(id);
  }
}
