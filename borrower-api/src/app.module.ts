import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/database/typeorm.config';

import { UploadsModule } from './modules/uploads/uploads.module';
import { OverviewModule } from './modules/overview/overview.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';

import { MailModule } from './mail/mail.module';
import { FilesModule } from './modules/files/files.module';
import { InitialNoteModule } from './modules/initial-note/initial-note.module';
import { LoanContractModule } from './modules/loan-contract-page/loan-contract.module';
import { StartapplicationModule } from './modules/startapplication/startapplication.module';
import { ConfigModule } from '@nestjs/config';
import { TwilioModule } from 'nestjs-twilio';
import { twilioDetails } from './configs/configs.constants';
import { UpdateuserloanModule } from './modules/updateuserloan/updateuserloan.module';
import { UploadfilesModule } from './modules/uploadfiles/uploadfiles.module';
import { FinicityModule } from './modules/finicity/finicity.module';
import { OfferModule } from './modules/offer/offer.module';
import { TShirtModule } from './modules/t-shirt/t-shirt.module';
import { UsersModule } from './modules/users/users.module';
import { PaymentScheduleModule } from './modules/payment-schedule/payment-schedule.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    UploadsModule,
    OverviewModule,
    MailModule,
    FilesModule,
    InitialNoteModule,
    LoanContractModule,
    StartapplicationModule,
    UpdateuserloanModule,
    UploadfilesModule,
    ConfigModule.forRoot({
      isGlobal: true, // no need to import into other modules
    }),
    TwilioModule.forRoot({
      accountSid: twilioDetails.AccountSid,
      authToken: twilioDetails.AuthToken,
    }),
    FinicityModule,
    OfferModule,
    TShirtModule,
    UsersModule,
    PaymentScheduleModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
