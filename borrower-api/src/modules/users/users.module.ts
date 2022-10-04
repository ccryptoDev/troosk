import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserRepository } from '../../repository/users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { jwtConfig } from '../../configs/configs.constants';
import { JwtStrategy } from '../../strategies/jwt.strategy';

import { RolesGuard } from '../../guards/roles.guard';
import { TokenRepository } from 'src/repository/token.repository';
import { OtpRepository } from 'src/repository/otp.repository';
import { MailModule } from '../../mail/mail.module';
import { LoanRepository } from '../../repository/loan.repository';

@Module({
  controllers: [UsersController],
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      TokenRepository,
      OtpRepository,
      LoanRepository,
    ]),
    PassportModule,
    JwtModule.register({
      secret: jwtConfig.secret,
      signOptions: {
        expiresIn: jwtConfig.expiresIn,
      },
    }),
    MailModule,
  ],
  exports: [UsersService],
  providers: [UsersService, JwtStrategy, RolesGuard],
})
export class UsersModule {}
