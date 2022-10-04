import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserRepository } from '../../repository/users.repository';
import { OTPRepository } from '../../repository/otp.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { jwtConfig } from '../../configs/configs.constants';
import { JwtStrategy } from '../../strategies/jwt.strategy';

import { RolesGuard } from '../../guards/roles.guard';
import { MailModule } from '../../mail/mail.module';
import { MailService } from '../../mail/mail.service';
import { RolesService } from '../roles/roles.service';
import { PortalRepository } from '../../repository/portal.repository';
import { PagesRepository } from '../../repository/page.repository';
import { PagetabsRepository } from '../../repository/pagetab.repository';
import { RolesRepository } from '../../repository/roles.repository';
import { RolesmasterRepository } from '../../repository/roleMaster.repository';
import { TokenRepository } from '../../repository/token.repository';
import { MaillogRepository } from 'src/repository/maillog.repository';
import { LoanRepository } from '../../repository/loan.repository';

@Module({
  controllers: [UsersController],
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      OTPRepository,
      RolesRepository,
      PortalRepository,
      PagesRepository,
      PagetabsRepository,
      RolesmasterRepository,
      TokenRepository,
      MaillogRepository,
      LoanRepository,
    ]),
    PassportModule,
    MailModule,
    JwtModule.register({
      secret: jwtConfig.secret,
      signOptions: {
        expiresIn: jwtConfig.expiresIn,
      },
    }),
  ],
  exports: [UsersService],
  providers: [UsersService, JwtStrategy, RolesGuard, MailService, RolesService],
})
export class UsersModule {}
