import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TShirtService } from './t-shirt.service';
import { TShirtDto } from './dto/t-shirt.dto';

@ApiTags('T-shirt')
@Controller('t-shirt')
export class TShirtController {
  constructor(private readonly tShirtService: TShirtService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get t-shirt params' })
  async getTShirtParams() {
    return this.tShirtService.getTShirtParams();
  }

  @Post(':loanid')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create t-shirt' })
  async createTShirt(
    @Param('loanid') loanId: string,
    @Body() tShirtDto: TShirtDto,
  ) {
    return this.tShirtService.createTShirt(loanId, tShirtDto);
  }
}
