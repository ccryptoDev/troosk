import {
  Controller,
  Get,
  HttpStatus,
  HttpCode,
  ParseUUIDPipe,
  Param,
  Post,
  Body,
} from '@nestjs/common';
import { RealIP } from 'nestjs-real-ip';

import { PendingService } from './pending.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SetMetadata } from '@nestjs/common';
import { addcommentsDto } from './dto/add-comments.dto';
import { Logs, LogInLogsDto } from './dto/add-log.dto';
export const Roles = (...roles: string[]) => SetMetadata('role', roles);

@ApiTags('Pending')
@Controller('pending')
export class PendingController {
  constructor(private readonly pendingService: PendingService) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'GET_ALL' })
  async get() {
    return this.pendingService.get();
  }

  @Get('/:loanId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get pending details' })
  async getdetails(@Param('loanId') loanId: string) {
    return this.pendingService.getdetails(loanId);
  }

  @Get('/denied/:loanId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set Denied' })
  async setdenied(@Param('loanId') loanId: string) {
    return this.pendingService.setdenied(loanId);
  }

  @Get('/approved/:loanId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set Approved' })
  async setapproved(@Param('loanId') loanId: string, @RealIP() ip: string) {
    return this.pendingService.setapproved(loanId, ip);
  }

  @Get('/invite/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set Approved' })
  async invite(@Param('id', ParseUUIDPipe) id: string) {
    return this.pendingService.invite(id);
  }

  @Post('/addcomments')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '' })
  // tslint:disable-next-line:no-shadowed-variable
  async addcomments(@Body() addcommentsDto: addcommentsDto) {
    return this.pendingService.addcomments(addcommentsDto);
  }

  @Get('/getcomments/:loanId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '' })
  async getcomments(@Param('loanId') loanId: string) {
    return this.pendingService.getcomments(loanId);
  }

  @Post('/addlogs')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '' })
  async logs(@Body() logs: Logs) {
    return this.pendingService.logs(logs);
  }
  @Post('/addloginlogs')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Adding logIn Logs' })
  async addLoginLog(@Body() logInLogsDto: LogInLogsDto, @RealIP() ip: string) {
    return this.pendingService.addLoginLog(logInLogsDto, ip);
  }

  @Get('/getPaymentSchedule/:loanId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '' })
  async getPaymentScheduleDetails(@Param('loanId') loanId: string) {
    return this.pendingService.getPaymentScheduleDetails(loanId);
  }
}
