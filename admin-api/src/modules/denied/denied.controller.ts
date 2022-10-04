import {
  Controller,
  Get,
  HttpStatus,
  HttpCode,
  UseGuards,
  ParseUUIDPipe,
  Param,
} from '@nestjs/common';
import { DeniedService } from './denied.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../../guards/roles.guard';
import { SetMetadata } from '@nestjs/common';
export const Roles = (...roles: string[]) => SetMetadata('role', roles);

@ApiTags('Denied')
@ApiBearerAuth()
@Roles('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('denied')
export class DeniedController {
  constructor(private readonly deniedService: DeniedService) {}
  @Get('')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'GET_ALL' })
  async get() {
    return this.deniedService.get();
  }

  @Get('/:loanId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get pending details' })
  async getdetails(@Param('loanId') loanId: string) {
    return this.deniedService.getdetails(loanId);
  }

  @Get('/pending/:loanId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set pending' })
  async setpending(@Param('loanId') loanId: string) {
    return this.deniedService.setpending(loanId);
  }

  @Get('/delete/:loanId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set delete' })
  async setdelete(@Param('loanId') loanId: string) {
    return this.deniedService.setdelete(loanId);
  }
}
